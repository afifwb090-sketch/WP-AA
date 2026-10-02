export const GOOGLE_APPS_SCRIPT_SOURCE = `/**
 * ============================================================================
 * WEDDING PLANNER MANAGEMENT SYSTEM - GOOGLE APPS SCRIPT REST API
 * ============================================================================
 * Backend: Google Apps Script Web App
 * Database: Google Sheets
 * Storage: Google Drive
 * 
 * Deployment Instructions:
 * 1. Buat Google Sheet baru, beri nama "Wedding Planner Database"
 * 2. Buka menu Extensions > Apps Script
 * 3. Salin seluruh kode ini ke dalam file Code.gs
 * 4. Jalankan fungsi "initializeDatabaseSheets()" sekali untuk membuat semua tabel
 * 5. Klik Deploy > New Deployment > Web App
 *    - Execute as: Me (your email)
 *    - Who has access: Anyone (atau Anyone with Google account)
 * 6. Salin Web App URL dan tempel ke pengaturan aplikasi Wedding Planner Frontend.
 * ============================================================================
 */

// Konfigurasi Nama Sheet & Folder Drive
const CONFIG = {
  SHEET_USERS: "USERS",
  SHEET_PROJECTS: "WEDDING_PROJECT",
  SHEET_EVENTS: "EVENT_SIDE",
  SHEET_BUDGET: "BUDGET",
  SHEET_TASKS: "TASKS",
  SHEET_GUESTS: "GUESTS",
  SHEET_VENDORS: "VENDORS",
  SHEET_BOOKINGS: "VENDOR_BOOKINGS",
  SHEET_RUNDOWN: "RUNDOWN",
  SHEET_DOCS: "DOCUMENTS",
  DRIVE_FOLDER_NAME: "Wedding_Planner_Uploads"
};

/**
 * Handle HTTP GET Requests
 * Endpoints:
 * - ?endpoint=users
 * - ?endpoint=wedding&wedding_id=xxx
 * - ?endpoint=events&wedding_id=xxx
 * - ?endpoint=budget&wedding_id=xxx&event_id=xxx
 * - ?endpoint=vendors
 * - ?endpoint=tasks&wedding_id=xxx&event_id=xxx
 * - ?endpoint=guests&wedding_id=xxx&event_id=xxx
 * - ?endpoint=rundown&wedding_id=xxx&event_id=xxx
 * - ?endpoint=documents&wedding_id=xxx
 */
function doGet(e) {
  try {
    const params = e.parameter || {};
    const endpoint = (params.endpoint || "").toLowerCase();
    const wedding_id = params.wedding_id || "";
    const event_id = params.event_id || "";

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    switch (endpoint) {
      case "users":
        return sendJson(true, getSheetDataAsJson(ss.getSheetByName(CONFIG.SHEET_USERS)));

      case "wedding":
        const weddings = getSheetDataAsJson(ss.getSheetByName(CONFIG.SHEET_PROJECTS));
        const filteredWeddings = wedding_id ? weddings.filter(w => w.wedding_id === wedding_id) : weddings;
        return sendJson(true, filteredWeddings);

      case "events":
        const events = getSheetDataAsJson(ss.getSheetByName(CONFIG.SHEET_EVENTS));
        const filteredEvents = wedding_id ? events.filter(ev => ev.wedding_id === wedding_id) : events;
        return sendJson(true, filteredEvents);

      case "budget":
        let budgets = getSheetDataAsJson(ss.getSheetByName(CONFIG.SHEET_BUDGET));
        if (wedding_id) budgets = budgets.filter(b => b.wedding_id === wedding_id);
        if (event_id) budgets = budgets.filter(b => b.event_id === event_id);
        return sendJson(true, budgets);

      case "vendors":
        return sendJson(true, getSheetDataAsJson(ss.getSheetByName(CONFIG.SHEET_VENDORS)));

      case "bookings":
        let bookings = getSheetDataAsJson(ss.getSheetByName(CONFIG.SHEET_BOOKINGS));
        if (wedding_id) bookings = bookings.filter(b => b.wedding_id === wedding_id);
        return sendJson(true, bookings);

      case "tasks":
        let tasks = getSheetDataAsJson(ss.getSheetByName(CONFIG.SHEET_TASKS));
        if (wedding_id) tasks = tasks.filter(t => t.wedding_id === wedding_id);
        if (event_id) tasks = tasks.filter(t => t.event_id === event_id);
        return sendJson(true, tasks);

      case "guests":
        let guests = getSheetDataAsJson(ss.getSheetByName(CONFIG.SHEET_GUESTS));
        if (wedding_id) guests = guests.filter(g => g.wedding_id === wedding_id);
        if (event_id) guests = guests.filter(g => g.event_id === event_id);
        return sendJson(true, guests);

      case "rundown":
        let rundowns = getSheetDataAsJson(ss.getSheetByName(CONFIG.SHEET_RUNDOWN));
        if (wedding_id) rundowns = rundowns.filter(r => r.wedding_id === wedding_id);
        if (event_id) rundowns = rundowns.filter(r => r.event_id === event_id);
        return sendJson(true, rundowns);

      case "documents":
        let docs = getSheetDataAsJson(ss.getSheetByName(CONFIG.SHEET_DOCS));
        if (wedding_id) docs = docs.filter(d => d.wedding_id === wedding_id);
        return sendJson(true, docs);

      default:
        return sendJson(true, {
          status: "API Online",
          message: "Wedding Planner Management System REST API",
          endpoints: ["users", "wedding", "events", "budget", "vendors", "bookings", "tasks", "guests", "rundown", "documents"],
          serverTime: new Date().toISOString()
        });
    }
  } catch (err) {
    return sendJson(false, null, err.toString());
  }
}

/**
 * Handle HTTP POST Requests (Create, Update, Delete & Drive Upload)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    const action = payload.action || e.parameter.action;
    const endpoint = (payload.endpoint || e.parameter.endpoint || "").toLowerCase();
    const data = payload.data || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Security validation
    if (!action || !endpoint) {
      return sendJson(false, null, "Parameter 'action' dan 'endpoint' harus disertakan.");
    }

    // CREATE
    if (action === "create" || action === "insert") {
      const sheet = getSheetByEndpoint(ss, endpoint);
      if (!sheet) return sendJson(false, null, "Sheet tidak ditemukan untuk endpoint: " + endpoint);

      data.created_at = data.created_at || new Date().toISOString();
      const newId = appendRowFromObject(sheet, data);
      return sendJson(true, { id: newId, record: data, message: "Data berhasil disimpan." });
    }

    // UPDATE
    if (action === "update") {
      const sheet = getSheetByEndpoint(ss, endpoint);
      if (!sheet) return sendJson(false, null, "Sheet tidak ditemukan.");
      const idKey = getIdKeyForEndpoint(endpoint);
      const targetId = data[idKey] || payload.id;
      if (!targetId) return sendJson(false, null, "Identifier ID diperlukan untuk update.");

      const success = updateRowById(sheet, idKey, targetId, data);
      if (!success) return sendJson(false, null, "Record dengan ID " + targetId + " tidak ditemukan.");
      return sendJson(true, { id: targetId, message: "Data berhasil diperbarui." });
    }

    // DELETE
    if (action === "delete") {
      const sheet = getSheetByEndpoint(ss, endpoint);
      if (!sheet) return sendJson(false, null, "Sheet tidak ditemukan.");
      const idKey = getIdKeyForEndpoint(endpoint);
      const targetId = data[idKey] || payload.id;
      if (!targetId) return sendJson(false, null, "Identifier ID diperlukan untuk delete.");

      const success = deleteRowById(sheet, idKey, targetId);
      if (!success) return sendJson(false, null, "Record tidak ditemukan untuk dihapus.");
      return sendJson(true, { id: targetId, message: "Data berhasil dihapus." });
    }

    // UPLOAD TO GOOGLE DRIVE
    if (action === "upload_drive") {
      const fileName = data.file_name || "document_" + Date.now();
      const base64Data = data.base64_data;
      const mimeType = data.mime_type || "application/pdf";
      
      const folder = getOrCreateUploadFolder();
      const decodedBytes = Utilities.base64Decode(base64Data);
      const blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      const fileUrl = file.getUrl();
      const docItem = {
        doc_id: "doc-" + Date.now(),
        wedding_id: data.wedding_id,
        event_id: data.event_id || "",
        judul: data.judul || fileName,
        tipe: data.tipe || "Dokumen Administrasi",
        file_name: fileName,
        file_size: data.file_size || "1 MB",
        drive_link: fileUrl,
        upload_date: new Date().toISOString().split("T")[0],
        uploaded_by: data.uploaded_by || "User"
      };

      const sheetDocs = ss.getSheetByName(CONFIG.SHEET_DOCS);
      appendRowFromObject(sheetDocs, docItem);

      return sendJson(true, { doc: docItem, driveUrl: fileUrl, message: "Dokumen berhasil diunggah ke Google Drive." });
    }

    return sendJson(false, null, "Aksi tidak dikenali: " + action);

  } catch (err) {
    return sendJson(false, null, err.toString());
  }
}

// ============================================================================
// DATABASE HELPER FUNCTIONS
// ============================================================================

function getSheetByEndpoint(ss, endpoint) {
  switch (endpoint) {
    case "users": return ss.getSheetByName(CONFIG.SHEET_USERS);
    case "wedding": return ss.getSheetByName(CONFIG.SHEET_PROJECTS);
    case "events": return ss.getSheetByName(CONFIG.SHEET_EVENTS);
    case "budget": return ss.getSheetByName(CONFIG.SHEET_BUDGET);
    case "tasks": return ss.getSheetByName(CONFIG.SHEET_TASKS);
    case "guests": return ss.getSheetByName(CONFIG.SHEET_GUESTS);
    case "vendors": return ss.getSheetByName(CONFIG.SHEET_VENDORS);
    case "bookings": return ss.getSheetByName(CONFIG.SHEET_BOOKINGS);
    case "rundown": return ss.getSheetByName(CONFIG.SHEET_RUNDOWN);
    case "documents": return ss.getSheetByName(CONFIG.SHEET_DOCS);
    default: return null;
  }
}

function getIdKeyForEndpoint(endpoint) {
  switch (endpoint) {
    case "users": return "user_id";
    case "wedding": return "wedding_id";
    case "events": return "event_id";
    case "budget": return "budget_id";
    case "tasks": return "task_id";
    case "guests": return "guest_id";
    case "vendors": return "vendor_id";
    case "bookings": return "booking_id";
    case "rundown": return "rundown_id";
    case "documents": return "doc_id";
    default: return "id";
  }
}

function getSheetDataAsJson(sheet) {
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return [];

  const headers = values[0].map(h => String(h).trim());
  const rows = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const obj = {};
    let hasValue = false;
    for (let j = 0; j < headers.length; j++) {
      const val = row[j];
      obj[headers[j]] = val;
      if (val !== "" && val !== null && val !== undefined) hasValue = true;
    }
    if (hasValue) rows.push(obj);
  }
  return rows;
}

function appendRowFromObject(sheet, dataObj) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = [];
  const idCol = headers[0];
  if (!dataObj[idCol]) {
    dataObj[idCol] = "id-" + Utilities.getUuid().slice(0, 8);
  }

  for (let i = 0; i < headers.length; i++) {
    const key = headers[i];
    row.push(dataObj[key] !== undefined ? dataObj[key] : "");
  }
  sheet.appendRow(row);
  return dataObj[idCol];
}

function updateRowById(sheet, idKey, targetId, updateData) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColIndex = headers.indexOf(idKey);
  if (idColIndex === -1) return false;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idColIndex]) === String(targetId)) {
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j];
        if (updateData[key] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(updateData[key]);
        }
      }
      return true;
    }
  }
  return false;
}

function deleteRowById(sheet, idKey, targetId) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColIndex = headers.indexOf(idKey);
  if (idColIndex === -1) return false;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idColIndex]) === String(targetId)) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

function getOrCreateUploadFolder() {
  const folders = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);
}

function sendJson(success, data, errorMsg) {
  const response = {
    success: success,
    data: data,
    error: errorMsg || null,
    timestamp: new Date().toISOString()
  };
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this function once from Apps Script Editor to bootstrap all tables and headers!
 */
function initializeDatabaseSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const schemas = [
    {
      name: CONFIG.SHEET_USERS,
      headers: ["user_id", "nama", "email", "role", "role_display", "phone", "avatar_url", "assigned_wedding_id", "created_at"]
    },
    {
      name: CONFIG.SHEET_PROJECTS,
      headers: ["wedding_id", "nama_pasangan_pria", "nama_pasangan_wanita", "tanggal_mulai_project", "status_project", "konsep_pernikahan", "wedding_organizer", "cover_image", "notes", "created_at"]
    },
    {
      name: CONFIG.SHEET_EVENTS,
      headers: ["event_id", "wedding_id", "side_type", "nama_acara", "tanggal_acara", "jam_acara", "lokasi_acara", "jumlah_tamu", "budget_total", "status", "venue_address", "theme_color", "description"]
    },
    {
      name: CONFIG.SHEET_BUDGET,
      headers: ["budget_id", "event_id", "wedding_id", "kategori", "item", "vendor", "estimasi", "real_cost", "payment_status", "payment_date", "amount_paid", "notes"]
    },
    {
      name: CONFIG.SHEET_TASKS,
      headers: ["task_id", "event_id", "wedding_id", "task_name", "category", "timeline_phase", "deadline", "priority", "status", "assigned_to", "reminder_notes", "completed_at"]
    },
    {
      name: CONFIG.SHEET_GUESTS,
      headers: ["guest_id", "event_id", "wedding_id", "nama_tamu", "kategori", "nomor_hp", "jumlah_orang", "RSVP_status", "table_number", "notes"]
    },
    {
      name: CONFIG.SHEET_VENDORS,
      headers: ["vendor_id", "nama_vendor", "kategori", "kontak", "alamat", "harga", "harga_numeric", "portfolio", "rating", "instagram", "verified"]
    },
    {
      name: CONFIG.SHEET_BOOKINGS,
      headers: ["booking_id", "event_id", "wedding_id", "vendor_id", "nama_vendor", "kategori", "tanggal_booking", "harga", "status", "notes"]
    },
    {
      name: CONFIG.SHEET_RUNDOWN,
      headers: ["rundown_id", "event_id", "wedding_id", "waktu", "kegiatan", "lokasi", "pic", "status", "notes"]
    },
    {
      name: CONFIG.SHEET_DOCS,
      headers: ["doc_id", "wedding_id", "event_id", "judul", "tipe", "file_name", "file_size", "drive_link", "upload_date", "uploaded_by"]
    }
  ];

  schemas.forEach(schema => {
    let sheet = ss.getSheetByName(schema.name);
    if (!sheet) {
      sheet = ss.insertSheet(schema.name);
    }
    // Set headers
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, schema.headers.length).setValues([schema.headers]);
      sheet.getRange(1, 1, 1, schema.headers.length).setFontWeight("bold").setBackground("#F3ECE0");
      sheet.setFrozenRows(1);
    }
  });

  Logger.log("✅ Semua sheet database Google Sheets berhasil dibuat dan dikonfigurasi.");
}
`;
