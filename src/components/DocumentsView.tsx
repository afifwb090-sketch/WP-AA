import React, { useState } from 'react';
import { 
  FolderLock, 
  Upload, 
  Trash2, 
  FileText, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  Cloud, 
  X,
  FileCheck,
  Search,
  Plus
} from 'lucide-react';
import { DocumentItem, DocumentType, WeddingProject, EventSide } from '../types';
import { apiService } from '../services/apiService';
import { formatDateIndo } from '../utils/formatters';

interface DocumentsViewProps {
  project: WeddingProject;
  eventWanita?: EventSide;
  eventPria?: EventSide;
  documents: DocumentItem[];
  onDocumentsUpdated: () => void;
  currentUser: string;
}

const DOC_TYPES: DocumentType[] = [
  'Kontrak Vendor',
  'Invoice',
  'Bukti Pembayaran',
  'Dokumen Administrasi',
  'Proposal'
];

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  project,
  eventWanita,
  eventPria,
  documents,
  onDocumentsUpdated,
  currentUser
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<{
    judul: string;
    tipe: DocumentType;
    event_id: string;
    file_name: string;
    file_size: string;
    drive_link: string;
  }>({
    judul: '',
    tipe: 'Kontrak Vendor',
    event_id: '',
    file_name: '',
    file_size: '2.5 MB',
    drive_link: 'https://drive.google.com'
  });

  let displayDocs = documents;
  if (selectedType !== 'ALL') {
    displayDocs = displayDocs.filter(d => d.tipe === selectedType);
  }
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    displayDocs = displayDocs.filter(d => 
      d.judul.toLowerCase().includes(term) ||
      d.file_name.toLowerCase().includes(term) ||
      d.uploaded_by.toLowerCase().includes(term)
    );
  }

  const handleDelete = (docId: string) => {
    if (confirm('Hapus dokumen ini dari arsip?')) {
      apiService.deleteDocument(docId);
      onDocumentsUpdated();
    }
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul) return;

    apiService.createDocument({
      wedding_id: project.wedding_id,
      event_id: formData.event_id || undefined,
      judul: formData.judul,
      tipe: formData.tipe,
      file_name: formData.file_name || `${formData.judul.replace(/\s+/g, '_')}.pdf`,
      file_size: formData.file_size || '1.8 MB',
      drive_link: formData.drive_link || 'https://drive.google.com',
      upload_date: new Date().toISOString().split('T')[0],
      uploaded_by: currentUser || 'User'
    });

    setIsModalOpen(false);
    onDocumentsUpdated();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900 tracking-tight">
            Document Management (Google Drive Storage)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Arsip terpusat seluruh kontrak vendor, invoice tagihan, bukti transfer pembayaran, dan dokumen resmi KUA.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              judul: '',
              tipe: 'Kontrak Vendor',
              event_id: '',
              file_name: '',
              file_size: '2.4 MB',
              drive_link: 'https://drive.google.com'
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B88E4B] hover:bg-[#9B7337] text-white text-xs font-semibold shadow-md shadow-[#B88E4B]/20 transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          Upload Dokumen Baru
        </button>
      </div>

      {/* Google Drive Status Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF0DE] via-[#FDFBF7] to-[#F5EBE1] border border-[#DFC69C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white shadow-xs text-blue-600">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
              Google Drive Cloud Storage Connected
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Folder: <code className="font-mono bg-white/70 px-1.5 py-0.5 rounded text-[11px]">Wedding_Planner_Uploads / {project.nama_pasangan_pria}_{project.nama_pasangan_wanita}</code>
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-stone-500 shrink-0">
          Total: {documents.length} Berkas Tersimpan
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari judul dokumen, nama file, atau uploader..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#B88E4B]"
            />
          </div>

          <span className="text-xs text-stone-500">
            Ditemukan: <strong>{displayDocs.length} dokumen</strong>
          </span>
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              selectedType === 'ALL' ? 'bg-stone-900 text-white font-semibold' : 'bg-stone-100 text-stone-600'
            }`}
          >
            Semua Tipe
          </button>
          {DOC_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedType === t ? 'bg-[#B88E4B] text-white font-semibold' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {displayDocs.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs">
            Belum ada dokumen yang sesuai dengan filter.
          </div>
        ) : (
          displayDocs.map(doc => {
            return (
              <div
                key={doc.doc_id}
                className="p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs hover:border-[#CCA86E] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#9B7337] border border-[#DFC69C]/50 text-[10px] font-bold uppercase tracking-wider">
                      {doc.tipe}
                    </span>

                    <button
                      onClick={() => handleDelete(doc.doc_id)}
                      className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                      title="Hapus Dokumen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-start gap-3 mt-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm line-clamp-2">
                        {doc.judul}
                      </h3>
                      <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                        {doc.file_name} ({doc.file_size})
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2.5 text-xs text-stone-500">
                  <div className="flex justify-between text-[11px]">
                    <span>Diunggah: {formatDateIndo(doc.upload_date)}</span>
                    <span>Oleh: <strong className="text-stone-700">{doc.uploaded_by}</strong></span>
                  </div>

                  <a
                    href={doc.drive_link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-[#FAF0DE] hover:bg-[#F3ECE0] text-[#7A5729] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#B88E4B]" />
                    Buka di Google Drive
                  </a>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Upload Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF9] border border-[#CCA86E]/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEDEC3] bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#B88E4B]" />
                <h3 className="font-bold font-serif-luxury text-[#4A3B2C] text-lg">
                  Upload Dokumen ke Google Drive
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Judul Dokumen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kontrak Catering Kinarya (Lengkap)"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Tipe Dokumen *
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={(e) => setFormData({ ...formData, tipe: e.target.value as DocumentType })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    {DOC_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Terkait Acara
                  </label>
                  <select
                    value={formData.event_id}
                    onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    <option value="">Kedua Sisi Acara / Umum</option>
                    <option value={eventWanita?.event_id}>Acara Pihak Wanita</option>
                    <option value={eventPria?.event_id}>Acara Pihak Pria</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pilih File (PDF, DOCX, JPG, PNG)
                </label>
                <div className="border-2 border-dashed border-[#DFC69C] rounded-xl p-4 text-center bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-[#B88E4B] mx-auto mb-1" />
                  <p className="font-semibold text-stone-700">Klik untuk upload file</p>
                  <p className="text-[10px] text-stone-400">File langsung disinkronkan ke Google Drive</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setFormData({
                          ...formData,
                          file_name: file.name,
                          file_size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                        });
                      }
                    }}
                  />
                </div>
                {formData.file_name && (
                  <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    File terpilih: {formData.file_name} ({formData.file_size})
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Google Drive URL (Opsional / Generated)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={formData.drive_link}
                  onChange={(e) => setFormData({ ...formData, drive_link: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#B88E4B] hover:bg-[#9B7337] text-white shadow-xs"
                >
                  Simpan &amp; Arsipkan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
