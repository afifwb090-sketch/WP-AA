import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Code2, 
  Database, 
  Cloud, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Download
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_SOURCE } from '../backend/googleAppsScriptCode';
import { apiService } from '../services/apiService';

interface GasDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSynced?: () => void;
}

export const GasDocsModal: React.FC<GasDocsModalProps> = ({ isOpen, onClose, onSynced }) => {
  const [activeTab, setActiveTab] = useState<'script' | 'sheets' | 'api' | 'cloudflare' | 'testing'>('script');
  const [copied, setCopied] = useState(false);
  const [webAppUrl, setWebAppUrl] = useState(apiService.getGasConfig().webAppUrl);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: ''
  });

  if (!isOpen) return null;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SOURCE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveGasUrl = async () => {
    apiService.setGasConfig({
      webAppUrl: webAppUrl.trim(),
      enabled: !!webAppUrl.trim()
    });

    if (webAppUrl.trim()) {
      setTestResult({ status: 'testing', message: 'Menguji koneksi ke Google Apps Script...' });
      const res = await apiService.testGasConnection(webAppUrl.trim());
      if (!res.success) {
        setTestResult({ status: 'error', message: res.message });
        return;
      }
      setTestResult({ status: 'testing', message: 'Koneksi berhasil. Menggabungkan data lokal dengan Google Sheet...' });
      const merged = await apiService.connectAndMerge();
      if (merged.success) {
        setTestResult({ status: 'success', message: merged.message });
        onSynced?.();
      } else {
        setTestResult({ status: 'error', message: merged.message });
      }
    } else {
      setTestResult({ status: 'idle', message: 'Menggunakan mode Local Storage Storage.' });
    }
  };

  const handleDownloadBackup = () => {
    const json = apiService.exportDatabaseJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding_planner_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDF9] border border-[#CCA86E]/40 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEDEC3] bg-gradient-to-r from-[#FAF7F2] to-[#F7EFE1]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#B88E4B]/15 text-[#9B7337]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif-luxury text-[#4A3B2C]">
                Google Apps Script & Cloudflare Deployment Center
              </h2>
              <p className="text-xs text-[#7A6A58]">
                Dokumentasi arsitektur database Google Sheet, script backend, REST API, & deployment
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#7A6A58] hover:text-[#2D2A26] rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EEDEC3] bg-[#FAF7F2] px-6 gap-2 overflow-x-auto">
          {[
            { id: 'script', label: '1. Google Apps Script Code (.gs)', icon: Code2 },
            { id: 'sheets', label: '2. Struktur Database Google Sheet', icon: Database },
            { id: 'api', label: '3. REST API Docs', icon: FileText },
            { id: 'cloudflare', label: '4. Cloudflare Pages Deployment', icon: Cloud },
            { id: 'testing', label: '5. Testing Checklist', icon: CheckCircle2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-[#B88E4B] text-[#9B7337] bg-white rounded-t-lg shadow-xs'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-[#3A332C]">
          
          {/* TAB 1: SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-6">
              <div className="bg-[#FAF6EE] p-4 rounded-xl border border-[#DFC69C]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[#674E28] flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#B88E4B]" />
                    Backend Script Siap Pakai (Google Apps Script)
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Script ini menangani endpoint REST API (GET, POST, PUT, DELETE) serta upload file dokumen ke Google Drive.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#B88E4B] hover:bg-[#9B7337] text-white transition-all shadow-xs"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Tersalin ke Clipboard!' : 'Salin Kode Script'}
                  </button>
                </div>
              </div>

              {/* Live Web App URL Connection */}
              <div className="p-4 rounded-xl bg-white border border-[#EEDEC3] shadow-xs space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A6A58]">
                  Hubungkan URL Google Apps Script Web App (Opsional)
                </label>
                <p className="text-xs text-stone-500">
                  Masukkan URL Web App yang sama di setiap perangkat agar data tersinkron lewat Google Sheet (otomatis tiap 20 detik dan saat tab dibuka lagi). Pastikan kode Apps Script terbaru sudah ditempel dan di-deploy sebagai versi baru. Bila kosong, data hanya tersimpan di browser ini.
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={webAppUrl}
                    onChange={(e) => setWebAppUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                  <button
                    onClick={handleSaveGasUrl}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#3A332C] hover:bg-black text-white transition-colors"
                  >
                    Simpan & Uji
                  </button>
                </div>

                {testResult.status !== 'idle' && (
                  <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    testResult.status === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : testResult.status === 'testing'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {testResult.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {testResult.status === 'error' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    {testResult.message}
                  </div>
                )}
              </div>

              {/* Code Preview */}
              <div className="relative">
                <div className="text-xs font-mono text-stone-400 mb-1 flex justify-between items-center">
                  <span>File: Code.gs (Google Apps Script)</span>
                  <span>{GOOGLE_APPS_SCRIPT_SOURCE.split('\n').length} baris kode</span>
                </div>
                <pre className="p-4 bg-[#1E1E24] text-[#E0E0E0] rounded-xl text-xs font-mono overflow-x-auto max-h-[360px] border border-stone-800 shadow-inner leading-relaxed">
                  {GOOGLE_APPS_SCRIPT_SOURCE}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: SHEETS STRUCTURE */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EEDEC3]">
                <h3 className="font-bold text-[#4A3B2C] text-sm">
                  Struktur Database Google Sheet (10 Tabel Terintegrasi)
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Database menggunakan 1 file Google Spreadsheet dengan 10 lembar sheet terpisah untuk menjamin data modular dan terisolasi per sisi acara.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="font-bold text-xs text-[#9B7337]">1. SHEET: USERS</span>
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">Autentikasi & Role</span>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1 font-mono">
                    <li>user_id (PK)</li>
                    <li>nama</li>
                    <li>email</li>
                    <li>role (Admin WO / Client / Family / Vendor)</li>
                    <li>role_display</li>
                    <li>phone</li>
                    <li>avatar_url</li>
                    <li>assigned_wedding_id</li>
                    <li>created_at</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="font-bold text-xs text-[#9B7337]">2. SHEET: WEDDING_PROJECT</span>
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">Proyek Pernikahan</span>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1 font-mono">
                    <li>wedding_id (PK)</li>
                    <li>nama_pasangan_pria</li>
                    <li>nama_pasangan_wanita</li>
                    <li>tanggal_mulai_project</li>
                    <li>status_project (Active / Planning / Completed)</li>
                    <li>konsep_pernikahan</li>
                    <li>wedding_organizer</li>
                    <li>cover_image</li>
                    <li>created_at</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-[#CCA86E]/40 bg-[#FAF7F2] shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EEDEC3]">
                    <span className="font-bold text-xs text-[#9B7337]">3. SHEET: EVENT_SIDE (Kunci Pemisah)</span>
                    <span className="text-[10px] bg-[#B88E4B]/20 text-[#674E28] font-bold px-2 py-0.5 rounded">Core Dual-Event</span>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1 font-mono">
                    <li>event_id (PK)</li>
                    <li>wedding_id (FK)</li>
                    <li className="font-bold text-[#9B7337]">side_type (WANITA / PRIA)</li>
                    <li>nama_acara</li>
                    <li>tanggal_acara</li>
                    <li>jam_acara</li>
                    <li>lokasi_acara</li>
                    <li>jumlah_tamu</li>
                    <li>budget_total</li>
                    <li>status</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="font-bold text-xs text-[#9B7337]">4. SHEET: BUDGET</span>
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">Dual Budget Tracking</span>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1 font-mono">
                    <li>budget_id (PK)</li>
                    <li>event_id (FK - Memisahkan Wanita/Pria)</li>
                    <li>wedding_id (FK)</li>
                    <li>kategori (Venue, Catering, Dekor, MUA, dll)</li>
                    <li>item</li>
                    <li>vendor</li>
                    <li>estimasi</li>
                    <li>real_cost</li>
                    <li>payment_status (Belum / DP / Lunas)</li>
                    <li>payment_date</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="font-bold text-xs text-[#9B7337]">5. SHEET: TASKS (Checklist)</span>
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">Milestone Preparation</span>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1 font-mono">
                    <li>task_id (PK)</li>
                    <li>event_id (FK) & wedding_id (FK)</li>
                    <li>task_name</li>
                    <li>category</li>
                    <li>timeline_phase (12 bln, 6 bln, 1 bln, Hari H)</li>
                    <li>deadline</li>
                    <li>priority (High / Medium / Low)</li>
                    <li>status (Pending / On Progress / Completed)</li>
                    <li>assigned_to</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="font-bold text-xs text-[#9B7337]">6. SHEET: GUESTS</span>
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">Tamu Pihak Wanita & Pria</span>
                  </div>
                  <ul className="text-xs text-stone-600 space-y-1 font-mono">
                    <li>guest_id (PK)</li>
                    <li>event_id (FK) & wedding_id (FK)</li>
                    <li>nama_tamu</li>
                    <li>kategori (VIP, Keluarga, Teman Kantor, dll)</li>
                    <li>nomor_hp</li>
                    <li>jumlah_orang</li>
                    <li>RSVP_status (Hadir / Tidak / Belum)</li>
                    <li>table_number</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="font-bold text-xs text-[#9B7337]">7 & 8. VENDORS & BOOKINGS</span>
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">Master & Booking Relasi</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Menyimpan profil master vendor (kontak, rating, portfolio) serta tabel relasi booking yang menghubungkan vendor tertentu ke acara Wanita, acara Pria, atau keduanya.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="font-bold text-xs text-[#9B7337]">9 & 10. RUNDOWN & DOCUMENTS</span>
                    <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">Hari H & Google Drive</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Jadwal detail per jam hari H dengan PIC, dan arsip dokumen (kontrak vendor, invoice, bukti bayar) yang langsung tersimpan di Google Drive.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: REST API */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EEDEC3]">
                <h3 className="font-bold text-[#4A3B2C] text-sm">
                  REST API Endpoints & Request/Response Specification
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Format respons standar API selalu mengembalikan JSON: <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px] font-mono">{"{ success: true, data: {...}, error: null }"}</code>
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">GET</span>
                    <span className="text-stone-700">?endpoint=wedding&wedding_id=xxx</span>
                  </div>
                  <p className="font-sans text-stone-500 text-[11px]">Mengambil data proyek pernikahan aktif dan statusnya.</p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">GET</span>
                    <span className="text-stone-700">?endpoint=events&wedding_id=xxx</span>
                  </div>
                  <p className="font-sans text-stone-500 text-[11px]">Mengambil kedua sisi acara (WANITA & PRIA), countdown, dan lokasi.</p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">GET</span>
                    <span className="text-stone-700">?endpoint=budget&wedding_id=xxx&event_id=yyy</span>
                  </div>
                  <p className="font-sans text-stone-500 text-[11px]">Mengambil daftar rincian budget terfilter berdasarkan pihak acara.</p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">POST</span>
                    <span className="text-stone-700">Payload: {`{ action: "create", endpoint: "budget", data: {...} }`}</span>
                  </div>
                  <p className="font-sans text-stone-500 text-[11px]">Menambahkan item pengeluaran/anggaran baru pada acara yang dipilih.</p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">POST</span>
                    <span className="text-stone-700">Payload: {`{ action: "update", endpoint: "tasks", id: "task-01", data: {...} }`}</span>
                  </div>
                  <p className="font-sans text-stone-500 text-[11px]">Mengupdate status checklist pekerjaan atau prioritas.</p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">POST</span>
                    <span className="text-stone-700">Payload: {`{ action: "upload_drive", data: { base64_data: "...", file_name: "..." } }`}</span>
                  </div>
                  <p className="font-sans text-stone-500 text-[11px]">Mengunggah file PDF / Bukti Bayar ke Google Drive folder Wedding.</p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: CLOUDFLARE DEPLOYMENT */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EEDEC3]">
                <h3 className="font-bold text-[#4A3B2C] text-sm">
                  Panduan Deployment ke Cloudflare Pages (Gratis & Sangat Cepat)
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Aplikasi ini dibangun menggunakan Vite + React + Tailwind CSS yang dapat langsung di-deploy ke Cloudflare Pages secara gratis dengan SSL otomatis dan CDN global.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <h4 className="font-bold text-xs text-[#9B7337] mb-1">Langkah 1: Hubungkan Git Repository</h4>
                  <p className="text-xs text-stone-600">
                    Push project ini ke repository GitHub atau GitLab Anda.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <h4 className="font-bold text-xs text-[#9B7337] mb-1">Langkah 2: Konfigurasi di Cloudflare Pages Dashboard</h4>
                  <p className="text-xs text-stone-600 mb-2">
                    Masuk ke Cloudflare Dashboard &gt; Workers &amp; Pages &gt; Create application &gt; Pages &gt; Connect to Git.
                  </p>
                  <div className="bg-stone-50 p-3 rounded-lg font-mono text-xs space-y-1 border border-stone-200">
                    <div><span className="text-stone-500">Framework preset:</span> <strong>Vite</strong></div>
                    <div><span className="text-stone-500">Build command:</span> <strong>npm run build</strong></div>
                    <div><span className="text-stone-500">Build output directory:</span> <strong>dist</strong></div>
                    <div><span className="text-stone-500">Node version (opsional):</span> <strong>20</strong></div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <h4 className="font-bold text-xs text-[#9B7337] mb-1">Langkah 3: Konfigurasi SPA Routing</h4>
                  <p className="text-xs text-stone-600">
                    Cloudflare Pages otomatis melayani file <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">index.html</code> untuk Single Page Application (SPA). Tidak memerlukan server backend Node.js karena backend ditangani oleh Google Apps Script!
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                  <strong>Hasil:</strong> Anda mendapatkan URL custom seperti <code className="font-mono bg-white px-1.5 py-0.5 rounded">wedding-planner-system.pages.dev</code> dengan HTTPS gratis dan 0 server cost!
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TESTING CHECKLIST */}
          {activeTab === 'testing' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EEDEC3] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#4A3B2C] text-sm">
                    Production Testing Checklist
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Daftar verifikasi pengujian fitur sebelum diserahkan ke klien/kandidat pengantin.
                  </p>
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#CCA86E] text-[#9B7337] hover:bg-[#FAF7F2]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Data JSON
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Dual-Event Countdown Sync', desc: 'Memastikan hitung mundur hari, tanggal, dan lokasi berbeda secara akurat antara Pihak Wanita dan Pria.' },
                  { title: 'Dual Budget Calculation & Overbudget Alert', desc: 'Kalkulasi terpisah total anggaran, realisasi biaya, sisa budget, serta indikator peringatan jika overbudget.' },
                  { title: 'Checklist Task Filtering & Milestone', desc: 'Pemilahan checklist berdasarkan waktu (12 bulan, 6 bulan, 1 bulan, Hari H) dan status selesai.' },
                  { title: 'Guest Management & RSVP Counters', desc: 'Pencatatan tamu undangan per pihak, status RSVP (Hadir/Tidak/Belum), serta nomor meja VIP/Keluarga.' },
                  { title: 'Vendor Directory & Cross-Event Booking', desc: 'Pemesanan vendor dapat ditetapkan khusus untuk Acara Wanita saja, Acara Pria saja, atau Keduanya.' },
                  { title: 'Hour-by-hour Rundown Coordination', desc: 'Jadwal hari H terstruktur dengan penanggung jawab (PIC) dan status eksekusi.' },
                  { title: 'Document & Invoice Storage', desc: 'Simulasi penyimpanan Google Drive untuk kontrak vendor, invoice, dan dokumen nikah KUA.' },
                  { title: 'Multi-Role Authorization', desc: 'Hak akses yang tepat untuk Admin WO, Client Pasangan, Anggota Keluarga, dan Mitra Vendor.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-stone-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-stone-800">{item.title}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#EEDEC3] bg-[#FAF7F2] flex items-center justify-between">
          <span className="text-xs text-[#7A6A58]">
            Wedding Planner Management System v1.0.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#3A332C] hover:bg-black text-white transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
