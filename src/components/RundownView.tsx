import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  MapPin, 
  Printer, 
  X,
  FileText
} from 'lucide-react';
import { RundownItem, EventSide, SideType, WeddingProject } from '../types';
import { apiService } from '../services/apiService';
import { formatDateIndo } from '../utils/formatters';

interface RundownViewProps {
  project: WeddingProject;
  eventWanita?: EventSide;
  eventPria?: EventSide;
  rundownsWanita: RundownItem[];
  rundownsPria: RundownItem[];
  onRundownsUpdated: () => void;
  activeSideFilter: 'ALL' | 'WANITA' | 'PRIA';
  onFilterChange: (side: 'ALL' | 'WANITA' | 'PRIA') => void;
}

export const RundownView: React.FC<RundownViewProps> = ({
  project,
  eventWanita,
  eventPria,
  rundownsWanita,
  rundownsPria,
  onRundownsUpdated,
  activeSideFilter,
  onFilterChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RundownItem | null>(null);

  const [formData, setFormData] = useState<{
    event_id: string;
    waktu: string;
    kegiatan: string;
    lokasi: string;
    pic: string;
    status: 'Upcoming' | 'Ongoing' | 'Done';
    notes: string;
  }>({
    event_id: eventWanita?.event_id || '',
    waktu: '08:00 - 09:00',
    kegiatan: '',
    lokasi: '',
    pic: '',
    status: 'Upcoming',
    notes: ''
  });

  // Decide current active side for single rundown view if filter is 'ALL'
  const currentViewSide: SideType = activeSideFilter === 'PRIA' ? 'PRIA' : 'WANITA';
  const currentEvent = currentViewSide === 'WANITA' ? eventWanita : eventPria;
  const currentRundowns = currentViewSide === 'WANITA' ? rundownsWanita : rundownsPria;

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      event_id: currentEvent?.event_id || '',
      waktu: '09:00 - 10:00',
      kegiatan: '',
      lokasi: currentEvent?.lokasi_acara || '',
      pic: 'Tim WO',
      status: 'Upcoming',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: RundownItem) => {
    setEditingItem(item);
    setFormData({
      event_id: item.event_id,
      waktu: item.waktu,
      kegiatan: item.kegiatan,
      lokasi: item.lokasi,
      pic: item.pic,
      status: item.status,
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteItem = (rundownId: string) => {
    if (confirm('Hapus sesi acara pada rundown ini?')) {
      apiService.deleteRundown(rundownId);
      onRundownsUpdated();
    }
  };

  const handleToggleStatus = (item: RundownItem) => {
    const nextStatus = item.status === 'Upcoming' ? 'Ongoing' : item.status === 'Ongoing' ? 'Done' : 'Upcoming';
    apiService.updateRundown(item.rundown_id, { status: nextStatus });
    onRundownsUpdated();
  };

  const handleSaveRundown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kegiatan) return;

    if (editingItem) {
      apiService.updateRundown(editingItem.rundown_id, formData);
    } else {
      apiService.createRundown({
        ...formData,
        wedding_id: project.wedding_id
      });
    }
    setIsModalOpen(false);
    onRundownsUpdated();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900 tracking-tight">
            Timeline / Rundown Hari H Acara
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Susunan jadwal waktu per jam dan penanggung jawab (PIC) untuk <strong>Acara Wanita</strong> &amp; <strong>Acara Pria</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            Cetak Rundown
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#B88E4B] hover:bg-[#9B7337] text-white text-xs font-semibold shadow-md shadow-[#B88E4B]/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Tambah Sesi Rundown
          </button>
        </div>
      </div>

      {/* Side Switcher Tab Bar */}
      <div className="flex items-center gap-3 border-b border-[#EEDEC3] pb-2">
        <button
          onClick={() => onFilterChange('WANITA')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            currentViewSide === 'WANITA'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Rundown Acara Wanita ({rundownsWanita.length} Sesi)
        </button>

        <button
          onClick={() => onFilterChange('PRIA')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            currentViewSide === 'PRIA'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Rundown Acara Pria ({rundownsPria.length} Sesi)
        </button>
      </div>

      {/* Active Event Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        currentViewSide === 'WANITA' ? 'bg-rose-50/70 border-rose-200' : 'bg-blue-50/70 border-blue-200'
      }`}>
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${currentViewSide === 'WANITA' ? 'text-rose-800' : 'text-blue-800'}`}>
            Acara Aktif: {currentViewSide === 'WANITA' ? 'Pihak Wanita (Akad & Resepsi)' : 'Pihak Pria (Ngunduh Mantu)'}
          </span>
          <h2 className="text-base font-bold text-stone-900 mt-0.5">
            {currentEvent?.nama_acara}
          </h2>
          <div className="flex items-center gap-4 text-xs text-stone-600 mt-1">
            <span>Tanggal: <strong>{formatDateIndo(currentEvent?.tanggal_acara || '')}</strong></span>
            <span>Venue: <strong>{currentEvent?.lokasi_acara}</strong></span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-stone-500">Total Durasi Rundown:</span>
          <div className="text-sm font-bold text-stone-800">
            {currentEvent?.jam_acara}
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#DFC69C]">
        {currentRundowns.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs">
            Belum ada susunan acara untuk pihak ini. Klik tombol "Tambah Sesi Rundown" di atas.
          </div>
        ) : (
          currentRundowns.map((item, index) => {
            const isDone = item.status === 'Done';
            const isOngoing = item.status === 'Ongoing';

            return (
              <div key={item.rundown_id} className="relative group">
                {/* Timeline Dot */}
                <div className={`absolute -left-6 sm:-left-8 top-3 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-600 border-white text-white shadow-xs'
                    : isOngoing
                    ? 'bg-amber-500 border-white text-white animate-pulse'
                    : 'bg-white border-[#B88E4B] text-[#9B7337]'
                }`}>
                  {index + 1}
                </div>

                {/* Timeline Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs hover:border-[#CCA86E] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-lg bg-[#FAF7F2] text-[#9B7337] border border-[#DFC69C]/50 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {item.waktu}
                      </span>

                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase transition-colors ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : isOngoing
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        title="Klik untuk ubah status kegiatan"
                      >
                        {item.status}
                      </button>
                    </div>

                    <h3 className={`text-base font-bold ${isDone ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                      {item.kegiatan}
                    </h3>

                    {item.notes && (
                      <p className="text-xs text-stone-500 font-light">
                        {item.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        Lokasi: <strong>{item.lokasi || '-'}</strong>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#B88E4B]" />
                        PIC: <strong className="text-stone-800">{item.pic || '-'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                      title="Edit Sesi"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.rundown_id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                      title="Hapus Sesi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF9] border border-[#CCA86E]/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEDEC3] bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B88E4B]" />
                <h3 className="font-bold font-serif-luxury text-[#4A3B2C] text-lg">
                  {editingItem ? 'Edit Sesi Rundown' : 'Tambah Sesi Rundown Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRundown} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pihak Acara *
                </label>
                <select
                  value={formData.event_id}
                  onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                >
                  <option value={eventWanita?.event_id}>
                    Acara Pihak Wanita - {eventWanita?.nama_acara}
                  </option>
                  <option value={eventPria?.event_id}>
                    Acara Pihak Pria - {eventPria?.nama_acara}
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Jam / Waktu (WIB) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 08:00 - 09:30"
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Status Eksekusi
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    <option value="Upcoming">Upcoming (Akan Datang)</option>
                    <option value="Ongoing">Ongoing (Sedang Berlangsung)</option>
                    <option value="Done">Done (Selesai)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Kegiatan / Agenda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Prosesi Ijab Kabul & Penyerahan Mahar"
                  value={formData.kegiatan}
                  onChange={(e) => setFormData({ ...formData, kegiatan: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Lokasi / Titik Acara
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Meja Akad Panggung Utama"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Penanggung Jawab (PIC) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pak Bambang & Rina WO"
                    value={formData.pic}
                    onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Catatan Teknis / Perlengkapan
                </label>
                <textarea
                  rows={2}
                  placeholder="Sound system, mic wireless, teks ijab, properti adat..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  Simpan Sesi
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
