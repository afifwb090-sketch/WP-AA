export const GOOGLE_APPS_SCRIPT_SOURCE = `/**
 * WEDDING PLANNER - GOOGLE APPS SCRIPT BACKEND (v2, dengan sinkronisasi)
 * Database: Google Sheets (tiap tab = satu tabel, baris 1 = header)
 *
 * Cara pasang / update:
 * 1. Buka Google Sheet > Extensions > Apps Script, tempel seluruh kode ini ke Code.gs
 * 2. Jalankan fungsi initializeDatabaseSheets() sekali (otomatis membuat tab yang belum ada)
 * 3. Deploy > Manage deployments > Edit (ikon pensil) > Version: New version > Deploy
 *    (kalau deploy pertama kali: Deploy > New deployment > Web app,
 *     Execute as: Me, Who has access: Anyone)
 * 4. URL /exec tetap sama setelah update versi.
 */

var CONFIG = {
  SHEET_PROJECTS: "WEDDING_PROJECT",
  SHEET_EVENTS: "EVENT_SIDE",
  SHEET_BUDGET: "BUDGET",
  SHEET_TASKS: "TASKS",
  SHEET_GUESTS: "GUESTS",
  SHEET_VENDORS: "VENDORS",
  SHEET_BOOKINGS: "VENDOR_BOOKINGS",
  SHEET_RUNDOWN: "RUNDOWN",
  SHEET_DOCS: "DOCUMENTS"
};

// endpoint -> { sheet, idKey, numeric[], boolean[] }
var TABLES = {
  wedding:   { sheet: CONFIG.SHEET_PROJECTS, idKey: "wedding_id", numeric: [], boolean: [] },
  events:    { sheet: CONFIG.SHEET_EVENTS,   idKey: "event_id",   numeric: ["jumlah_tamu", "budget_total"], boolean: [] },
  budget:    { sheet: CONFIG.SHEET_BUDGET,   idKey: "budget_id",  numeric: ["estimasi", "real_cost", "amount_paid"], boolean: [] },
  tasks:     { sheet: CONFIG.SHEET_TASKS,    idKey: "task_id",    numeric: [], boolean: [] },
  guests:    { sheet: CONFIG.SHEET_GUESTS,   idKey: "guest_id",   numeric: ["jumlah_orang"], boolean: [] },
  vendors:   { sheet: CONFIG.SHEET_VENDORS,  idKey: "vendor_id",  numeric: ["harga_numeric", "rating"], boolean: ["verified"] },
  bookings:  { sheet: CONFIG.SHEET_BOOKINGS, idKey: "booking_id", numeric: ["harga"], boolean: [] },
  rundown:   { sheet: CONFIG.SHEET_RUNDOWN,  idKey: "rundown_id", numeric: [], boolean: [] },
  documents: { sheet: CONFIG.SHEET_DOCS,     idKey: "doc_id",     numeric: [], boolean: [] }
};

var SCHEMAS = {
  wedding:   ["wedding_id", "nama_pasangan_pria", "nama_pasangan_wanita", "tanggal_mulai_project", "status_project", "konsep_pernikahan", "wedding_organizer", "cover_image", "notes", "created_at"],
  events:    ["event_id", "wedding_id", "side_type", "nama_acara", "tanggal_acara", "jam_acara", "lokasi_acara", "jumlah_tamu", "budget_total", "status", "venue_address", "theme_color", "description"],
  budget:    ["budget_id", "event_id", "wedding_id", "kategori", "item", "vendor", "estimasi", "real_cost", "payment_status", "payment_date", "amount_paid", "notes"],
  tasks:     ["task_id", "event_id", "wedding_id", "task_name", "category", "timeline_phase", "deadline", "priority", "status", "assigned_to", "reminder_notes", "completed_at"],
  guests:    ["guest_id", "event_id", "wedding_id", "nama_tamu", "kategori", "nomor_hp", "jumlah_orang", "RSVP_status", "table_number", "notes"],
  vendors:   ["vendor_id", "nama_vendor", "kategori", "kontak", "alamat", "harga", "harga_numeric", "portfolio", "rating", "instagram", "verified"],
  bookings:  ["booking_id", "event_id", "wedding_id", "vendor_id", "nama_vendor", "kategori", "tanggal_booking", "harga", "status", "notes"],
  rundown:   ["rundown_id", "event_id", "wedding_id", "waktu", "kegiatan", "lokasi", "pic", "status", "notes"],
  documents: ["doc_id", "wedding_id", "event_id", "judul", "tipe", "file_name", "file_size", "drive_link", "upload_date", "uploaded_by"]
};

// ---------------------------------------------------------------- GET
function doGet(e) {
  try {
    var params = e.parameter || {};
    var endpoint = String(params.endpoint || "").toLowerCase();
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (endpoint === "sync_all") {
      var all = {};
      Object.keys(TABLES).forEach(function (key) {
        all[key] = readTable(ss, key);
      });
      return sendJson(true, all);
    }
    if (TABLES[endpoint]) {
      var rows = readTable(ss, endpoint);
      if (params.wedding_id) rows = rows.filter(function (r) { return r.wedding_id === params.wedding_id; });
      if (params.event_id) rows = rows.filter(function (r) { return r.event_id === params.event_id; });
      return sendJson(true, rows);
    }
    return sendJson(true, {
      status: "API Online",
      version: 2,
      endpoints: Object.keys(TABLES).concat(["sync_all"]),
      serverTime: new Date().toISOString()
    });
  } catch (err) {
    return sendJson(false, null, String(err));
  }
}

// ---------------------------------------------------------------- POST
// Frontend mengirim Content-Type text/plain agar tidak memicu CORS preflight.
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    var payload = JSON.parse((e.postData && e.postData.contents) || "{}");
    var action = payload.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "batch") {
      var ops = payload.ops || [];
      var applied = 0;
      for (var i = 0; i < ops.length; i++) {
        applyOp(ss, ops[i]);
        applied++;
      }
      return sendJson(true, { applied: applied });
    }

    // Kompatibel dengan format lama: create / update / delete
    if (action === "create" || action === "update" || action === "insert") {
      applyOp(ss, { endpoint: payload.endpoint, action: "upsert", data: payload.data });
      return sendJson(true, { message: "OK" });
    }
    if (action === "delete") {
      applyOp(ss, { endpoint: payload.endpoint, action: "delete", id: payload.id || (payload.data || {})[TABLES[payload.endpoint].idKey] });
      return sendJson(true, { message: "OK" });
    }
    return sendJson(false, null, "Aksi tidak dikenali: " + action);
  } catch (err) {
    return sendJson(false, null, String(err));
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function applyOp(ss, op) {
  var key = String(op.endpoint || "").toLowerCase();
  var table = TABLES[key];
  if (!table) throw new Error("Endpoint tidak dikenal: " + key);
  var sheet = getOrCreateSheet(ss, key);

  if (op.action === "upsert") {
    var data = op.data || {};
    var id = data[table.idKey];
    if (!id) throw new Error("ID kosong untuk " + key);
    var rowIndex = findRow(sheet, id);
    writeRow(sheet, rowIndex, data);
  } else if (op.action === "delete") {
    var r = findRow(sheet, op.id);
    if (r > 0) sheet.deleteRow(r);
  } else {
    throw new Error("Operasi tidak dikenal: " + op.action);
  }
}

// ---------------------------------------------------------------- helpers
function getOrCreateSheet(ss, key) {
  var table = TABLES[key];
  var sheet = ss.getSheetByName(table.sheet);
  if (!sheet) sheet = ss.insertSheet(table.sheet);
  if (sheet.getLastRow() === 0) {
    var headers = SCHEMAS[key];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#F3ECE0");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
}

// Mengembalikan nomor baris (1-based) untuk ID, atau -1 bila belum ada
function findRow(sheet, id) {
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function writeRow(sheet, rowIndex, data) {
  var headers = getHeaders(sheet);
  // Kolom baru otomatis ditambahkan bila ada field yang belum punya header
  Object.keys(data).forEach(function (k) {
    if (headers.indexOf(k) === -1) {
      sheet.getRange(1, headers.length + 1).setValue(k).setFontWeight("bold").setBackground("#F3ECE0");
      headers.push(k);
    }
  });
  var row = headers.map(function (h) {
    var v = data[h];
    if (v === undefined || v === null) return "";
    if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
    return String(v);
  });
  if (rowIndex < 0) rowIndex = sheet.getLastRow() + 1;
  var range = sheet.getRange(rowIndex, 1, 1, headers.length);
  range.setNumberFormat("@");   // simpan sebagai teks: tanggal/nomor HP/rumus tidak diubah Sheets
  range.setValues([row]);
}

function readTable(ss, key) {
  var table = TABLES[key];
  var sheet = ss.getSheetByName(table.sheet);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var values = sheet.getDataRange().getValues();
  var headers = values[0].map(function (h) { return String(h).trim(); });
  var tz = ss.getSpreadsheetTimeZone();
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    var has = false;
    for (var j = 0; j < headers.length; j++) {
      var h = headers[j];
      if (!h) continue;
      var v = values[i][j];
      if (v instanceof Date) v = Utilities.formatDate(v, tz, "yyyy-MM-dd");
      if (v === "" || v === null || v === undefined) {
        continue; // field kosong = tidak ada
      }
      has = true;
      if (table.numeric.indexOf(h) !== -1) {
        var n = Number(v);
        obj[h] = isNaN(n) ? 0 : n;
      } else if (table.boolean.indexOf(h) !== -1) {
        obj[h] = String(v).toUpperCase() === "TRUE";
      } else {
        obj[h] = String(v);
      }
    }
    if (has && obj[table.idKey]) {
      table.numeric.forEach(function (f) { if (obj[f] === undefined && SCHEMAS[key].indexOf(f) !== -1 && f !== "amount_paid") obj[f] = 0; });
      out.push(obj);
    }
  }
  return out;
}

function sendJson(success, data, errorMsg) {
  return ContentService.createTextOutput(JSON.stringify({
    success: success,
    data: data,
    error: errorMsg || null,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/** Jalankan sekali dari editor Apps Script untuk membuat semua tab + header. */
function initializeDatabaseSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(TABLES).forEach(function (key) { getOrCreateSheet(ss, key); });
  Logger.log("Semua sheet berhasil dibuat.");
}
`;
