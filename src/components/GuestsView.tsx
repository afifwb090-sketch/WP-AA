import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Phone, 
  Share2, 
  Filter, 
  X,
  MessageCircle,
  Hash
} from 'lucide-react';
import { Guest, GuestCategory, RSVPStatus, EventSide, SideType, WeddingProject } from '../types';
import { apiService } from '../services/apiService';

interface GuestsViewProps {
  project: WeddingProject;
  eventWanita?: EventSide;
  eventPria?: EventSide;
  guestsWanita: Guest[];
  guestsPria: Guest[];
  onGuestsUpdated: () => void;
  activeSideFilter: 'ALL' | 'WANITA' | 'PRIA';
  onFilterChange: (side: 'ALL' | 'WANITA' | 'PRIA') => void;
}

const CATEGORIES: GuestCategory[] = [
  'VIP',
  'Keluarga',
  'Teman Kantor',
  'Sahabat',
  'Tetangga',
  'Lainnya'
];

export const GuestsView: React.FC<GuestsViewProps> = ({
  project,
  eventWanita,
  eventPria,
  guestsWanita,
  guestsPria,
  onGuestsUpdated,
  activeSideFilter,
  onFilterChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRsvp, setSelectedRsvp] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [formData, setFormData] = useState<{
    event_id: string;
    nama_tamu: string;
    kategori: GuestCategory;
    nomor_hp: string;
    jumlah_orang: number;
    RSVP_status: RSVPStatus;
    table_number: string;
    notes: string;
  }>({
    event_id: eventWanita?.event_id || '',
    nama_tamu: '',
    kategori: 'Keluarga',
    nomor_hp: '',
    jumlah_orang: 2,
    RSVP_status: 'Belum Konfirmasi',
    table_number: '',
    notes: ''
  });

  // Calculate statistics for Wanita
  const totalGuestsWanita = guestsWanita.reduce((acc, curr) => acc + curr.jumlah_orang, 0);
  const hadirWanita = guestsWanita.filter(g => g.RSVP_status === 'Hadir').reduce((acc, curr) => acc + curr.jumlah_orang, 0);
  const belumWanita = guestsWanita.filter(g => g.RSVP_status === 'Belum Konfirmasi').reduce((acc, curr) => acc + curr.jumlah_orang, 0);
  const tidakHadirWanita = guestsWanita.filter(g => g.RSVP_status === 'Tidak Hadir').reduce((acc, curr) => acc + curr.jumlah_orang, 0);

  // Calculate statistics for Pria
  const totalGuestsPria = guestsPria.reduce((acc, curr) => acc + curr.jumlah_orang, 0);
  const hadirPria = guestsPria.filter(g => g.RSVP_status === 'Hadir').reduce((acc, curr) => acc + curr.jumlah_orang, 0);
  const belumPria = guestsPria.filter(g => g.RSVP_status === 'Belum Konfirmasi').reduce((acc, curr) => acc + curr.jumlah_orang, 0);
  const tidakHadirPria = guestsPria.filter(g => g.RSVP_status === 'Tidak Hadir').reduce((acc, curr) => acc + curr.jumlah_orang, 0);

  // Combine or filter lists
  let displayGuests: (Guest & { side: SideType })[] = [];
  if (activeSideFilter === 'ALL' || activeSideFilter === 'WANITA') {
    displayGuests.push(...guestsWanita.map(g => ({ ...g, side: 'WANITA' as SideType })));
  }
  if (activeSideFilter === 'ALL' || activeSideFilter === 'PRIA') {
    displayGuests.push(...guestsPria.map(g => ({ ...g, side: 'PRIA' as SideType })));
  }

  // Filter by category
  if (selectedCategory !== 'ALL') {
    displayGuests = displayGuests.filter(g => g.kategori === selectedCategory);
  }

  // Filter by RSVP
  if (selectedRsvp !== 'ALL') {
    displayGuests = displayGuests.filter(g => g.RSVP_status === selectedRsvp);
  }

  // Search filter
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    displayGuests = displayGuests.filter(g => 
      g.nama_tamu.toLowerCase().includes(term) || 
      g.nomor_hp.toLowerCase().includes(term) ||
      (g.table_number && g.table_number.toLowerCase().includes(term))
    );
  }

  const handleOpenAddModal = (side?: SideType) => {
    setEditingGuest(null);
    const targetEventId = side === 'PRIA' ? eventPria?.event_id : eventWanita?.event_id;
    setFormData({
      event_id: targetEventId || eventWanita?.event_id || '',
      nama_tamu: '',
      kategori: 'Keluarga',
      nomor_hp: '',
      jumlah_orang: 2,
      RSVP_status: 'Belum Konfirmasi',
      table_number: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      event_id: guest.event_id,
      nama_tamu: guest.nama_tamu,
      kategori: guest.kategori,
      nomor_hp: guest.nomor_hp,
      jumlah_orang: guest.jumlah_orang,
      RSVP_status: guest.RSVP_status,
      table_number: guest.table_number || '',
      notes: guest.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleQuickRsvp = (guestId: string, status: RSVPStatus) => {
    apiService.updateGuest(guestId, { RSVP_status: status });
    onGuestsUpdated();
  };

  const handleDeleteGuest = (guestId: string) => {
    if (confirm('Hapus tamu undangan ini?')) {
      apiService.deleteGuest(guestId);
      onGuestsUpdated();
    }
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_tamu) return;

    if (editingGuest) {
      apiService.updateGuest(editingGuest.guest_id, formData);
    } else {
      apiService.createGuest({
        ...formData,
        wedding_id: project.wedding_id
      });
    }
    setIsModalOpen(false);
    onGuestsUpdated();
  };

  const getWaLink = (guest: Guest) => {
    const cleanPhone = guest.nomor_hp.replace(/\D/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(`Halo ${guest.nama_tamu},\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan ${project.nama_pasangan_pria} & ${project.nama_pasangan_wanita}.\n\nMohon konfirmasi kehadiran Anda. Terima kasih!`);
    return `https://wa.me/${phone}?text=${msg}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900 tracking-tight">
            Guest Management &amp; RSVP Tracking
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Kelola daftar tamu, nomor meja, kategori, dan konfirmasi kehadiran terpisah per sisi acara.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal(activeSideFilter === 'PRIA' ? 'PRIA' : 'WANITA')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B88E4B] hover:bg-[#9B7337] text-white text-xs font-semibold shadow-md shadow-[#B88E4B]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Tamu Undangan
        </button>
      </div>

      {/* ========================================================================= */}
      {/* DUAL GUEST STATS DASHBOARD (Wanita & Pria) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* STATS ACARA WANITA */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-white to-[#FFF9F8] border border-rose-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
              Tamu Acara Mempelai Wanita
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Target: {eventWanita?.jumlah_tamu || 0} pax
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-white border border-rose-100">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Total</span>
              <div className="text-lg sm:text-xl font-bold text-stone-900">{totalGuestsWanita}</div>
              <span className="text-[10px] text-stone-400">Pax</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Hadir</span>
              <div className="text-lg sm:text-xl font-bold text-emerald-800">{hadirWanita}</div>
              <span className="text-[10px] text-emerald-600">Pax</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
              <span className="text-[10px] text-amber-700 font-bold uppercase block">Belum</span>
              <div className="text-lg sm:text-xl font-bold text-amber-800">{belumWanita}</div>
              <span className="text-[10px] text-amber-600">Pax</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-100/70 border border-stone-200">
              <span className="text-[10px] text-stone-500 font-bold uppercase block">Tidak</span>
              <div className="text-lg sm:text-xl font-bold text-stone-600">{tidakHadirWanita}</div>
              <span className="text-[10px] text-stone-400">Pax</span>
            </div>
          </div>
        </div>

        {/* STATS ACARA PRIA */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-white to-[#F8FBFF] border border-blue-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
              Tamu Acara Mempelai Pria
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Target: {eventPria?.jumlah_tamu || 0} pax
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-white border border-blue-100">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Total</span>
              <div className="text-lg sm:text-xl font-bold text-stone-900">{totalGuestsPria}</div>
              <span className="text-[10px] text-stone-400">Pax</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Hadir</span>
              <div className="text-lg sm:text-xl font-bold text-emerald-800">{hadirPria}</div>
              <span className="text-[10px] text-emerald-600">Pax</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
              <span className="text-[10px] text-amber-700 font-bold uppercase block">Belum</span>
              <div className="text-lg sm:text-xl font-bold text-amber-800">{belumPria}</div>
              <span className="text-[10px] text-amber-600">Pax</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-100/70 border border-stone-200">
              <span className="text-[10px] text-stone-500 font-bold uppercase block">Tidak</span>
              <div className="text-lg sm:text-xl font-bold text-stone-600">{tidakHadirPria}</div>
              <span className="text-[10px] text-stone-400">Pax</span>
            </div>
          </div>
        </div>

      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Side Filter */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => onFilterChange('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSideFilter === 'ALL' ? 'bg-[#B88E4B] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua Tamu
            </button>
            <button
              onClick={() => onFilterChange('WANITA')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSideFilter === 'WANITA' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tamu Wanita ({guestsWanita.length})
            </button>
            <button
              onClick={() => onFilterChange('PRIA')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSideFilter === 'PRIA' ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tamu Pria ({guestsPria.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama tamu, no hp, atau nomor meja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#B88E4B]"
            />
          </div>

        </div>

        {/* Secondary Category and RSVP filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 text-xs">
          <span className="text-stone-400 font-semibold text-[11px] uppercase tracking-wider">Kategori:</span>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-lg ${
              selectedCategory === 'ALL' ? 'bg-stone-900 text-white font-semibold' : 'bg-stone-100 text-stone-600'
            }`}
          >
            Semua
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg ${
                selectedCategory === cat ? 'bg-[#B88E4B] text-white font-semibold' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {cat}
            </button>
          ))}

          <span className="ml-2 text-stone-400 font-semibold text-[11px] uppercase tracking-wider">RSVP:</span>
          {['ALL', 'Hadir', 'Belum Konfirmasi', 'Tidak Hadir'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedRsvp(status)}
              className={`px-2.5 py-1 rounded-lg ${
                selectedRsvp === status ? 'bg-[#3A2E1A] text-white font-semibold' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {status === 'ALL' ? 'Semua RSVP' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table */}
      <div className="rounded-2xl bg-white border border-[#EEDEC3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase text-[10px] tracking-wider border-b border-[#EEDEC3]">
              <tr>
                <th className="py-3 px-4">Sisi Acara</th>
                <th className="py-3 px-4">Nama Tamu &amp; Kategori</th>
                <th className="py-3 px-4">Kontak (HP)</th>
                <th className="py-3 px-4 text-center">Jumlah Pax</th>
                <th className="py-3 px-4 text-center">Meja</th>
                <th className="py-3 px-4 text-center">Status RSVP</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    Tidak ditemukan data tamu undangan.
                  </td>
                </tr>
              ) : (
                displayGuests.map(guest => {
                  const isWanita = guest.side === 'WANITA';
                  return (
                    <tr key={guest.guest_id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isWanita ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isWanita ? 'Wanita' : 'Pria'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{guest.nama_tamu}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-medium">
                            {guest.kategori}
                          </span>
                          {guest.notes && <span className="text-[10px] text-stone-400 line-clamp-1">{guest.notes}</span>}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{guest.nomor_hp || '-'}</span>
                          {guest.nomor_hp && (
                            <a
                              href={getWaLink(guest)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              title="Kirim Undangan WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-stone-800 whitespace-nowrap">
                        {guest.jumlah_orang} Orang
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {guest.table_number ? (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[11px] font-semibold">
                            {guest.table_number}
                          </span>
                        ) : (
                          <span className="text-stone-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex rounded-lg border border-stone-200 overflow-hidden shadow-2xs">
                          <button
                            onClick={() => handleQuickRsvp(guest.guest_id, 'Hadir')}
                            className={`px-2 py-1 text-[10px] font-semibold transition-colors ${
                              guest.RSVP_status === 'Hadir' ? 'bg-emerald-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'
                            }`}
                            title="Tandai Hadir"
                          >
                            Hadir
                          </button>
                          <button
                            onClick={() => handleQuickRsvp(guest.guest_id, 'Belum Konfirmasi')}
                            className={`px-2 py-1 text-[10px] font-semibold transition-colors border-x border-stone-200 ${
                              guest.RSVP_status === 'Belum Konfirmasi' ? 'bg-amber-500 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'
                            }`}
                            title="Tandai Belum Konfirmasi"
                          >
                            Belum
                          </button>
                          <button
                            onClick={() => handleQuickRsvp(guest.guest_id, 'Tidak Hadir')}
                            className={`px-2 py-1 text-[10px] font-semibold transition-colors ${
                              guest.RSVP_status === 'Tidak Hadir' ? 'bg-stone-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'
                            }`}
                            title="Tandai Tidak Hadir"
                          >
                            Tidak
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(guest)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                            title="Edit Data Tamu"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGuest(guest.guest_id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                            title="Hapus Tamu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF9] border border-[#CCA86E]/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEDEC3] bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B88E4B]" />
                <h3 className="font-bold font-serif-luxury text-[#4A3B2C] text-lg">
                  {editingGuest ? 'Edit Data Tamu' : 'Tambah Tamu Undangan Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pihak Acara Undangan *
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

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Tamu Undangan / Instansi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Prof. Dr. Hari Nugroho & Istri"
                  value={formData.nama_tamu}
                  onChange={(e) => setFormData({ ...formData, nama_tamu: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Kategori Tamu *
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as GuestCategory })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.nomor_hp}
                    onChange={(e) => setFormData({ ...formData, nomor_hp: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Jumlah Orang (Pax) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.jumlah_orang}
                    onChange={(e) => setFormData({ ...formData, jumlah_orang: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nomor Meja
                  </label>
                  <input
                    type="text"
                    placeholder="VIP-01, FAM-02"
                    value={formData.table_number}
                    onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Status RSVP
                  </label>
                  <select
                    value={formData.RSVP_status}
                    onChange={(e) => setFormData({ ...formData, RSVP_status: e.target.value as RSVPStatus })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    <option value="Belum Konfirmasi">Belum Konfirmasi</option>
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Kebutuhan kursi roda, vegetarian, relasi khusus..."
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
                  Simpan Tamu
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
