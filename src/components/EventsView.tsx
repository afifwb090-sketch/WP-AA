import React, { useState } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  Wallet, 
  Edit3, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles,
  Heart,
  ChevronRight,
  ListTodo,
  Store
} from 'lucide-react';
import { EventSide, SideType, WeddingProject } from '../types';
import { formatRupiah, formatDateIndo, calculateDaysRemaining } from '../utils/formatters';
import { apiService } from '../services/apiService';
import { NavTab } from './Sidebar';

interface EventsViewProps {
  project: WeddingProject;
  eventWanita?: EventSide;
  eventPria?: EventSide;
  onEventUpdated: () => void;
  onNavigate: (tab: NavTab) => void;
  onFilterSide: (side: 'ALL' | 'WANITA' | 'PRIA') => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  project,
  eventWanita,
  eventPria,
  onEventUpdated,
  onNavigate,
  onFilterSide
}) => {
  const [editingEvent, setEditingEvent] = useState<EventSide | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<EventSide>>({});

  const handleStartEdit = (event: EventSide) => {
    setEditingEvent(event);
    setEditFormData({
      nama_acara: event.nama_acara,
      tanggal_acara: event.tanggal_acara,
      jam_acara: event.jam_acara,
      lokasi_acara: event.lokasi_acara,
      jumlah_tamu: event.jumlah_tamu,
      budget_total: event.budget_total,
      theme_color: event.theme_color || '',
      description: event.description || '',
      venue_address: event.venue_address || ''
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    apiService.updateEvent(editingEvent.event_id, editFormData);
    setEditingEvent(null);
    onEventUpdated();
  };

  const renderEventCard = (event?: EventSide, side: SideType = 'WANITA') => {
    if (!event) return null;
    const isWanita = side === 'WANITA';
    const countdown = calculateDaysRemaining(event.tanggal_acara);

    return (
      <div className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all shadow-sm ${
        isWanita 
          ? 'bg-gradient-to-br from-white via-[#FFF9F8] to-[#FCF1EF] border-rose-200' 
          : 'bg-gradient-to-br from-white via-[#F8FBFF] to-[#EFF5FC] border-blue-200'
      }`}>
        
        <div>
          {/* Header Badge */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isWanita 
                ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              Acara Pihak Mempelai {isWanita ? 'Wanita (Bride Side)' : 'Pria (Groom Side)'}
            </span>

            <button
              onClick={() => handleStartEdit(event)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-stone-500" />
              Edit Acara
            </button>
          </div>

          {/* Event Title */}
          <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-stone-900 tracking-tight">
            {event.nama_acara}
          </h2>

          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
            {event.description || (isWanita ? 'Rangkaian prosesi adat akad & resepsi pihak mempelai wanita.' : 'Prosesi adat ngunduh mantu & resepsi keluarga pihak pria.')}
          </p>

          {/* Countdown Pill */}
          <div className={`mt-4 p-3.5 rounded-2xl border flex items-center justify-between ${
            isWanita ? 'bg-rose-50/80 border-rose-100 text-rose-900' : 'bg-blue-50/80 border-blue-100 text-blue-900'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${isWanita ? 'text-rose-600' : 'text-blue-600'}`} />
              <span className="text-xs font-bold">
                {countdown.statusText}
              </span>
            </div>
            <span className="text-xs font-medium">
              {event.jam_acara}
            </span>
          </div>

          {/* Info Details List */}
          <div className="mt-6 space-y-3.5 text-xs text-stone-700">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${isWanita ? 'bg-rose-100/70 text-rose-700' : 'bg-blue-100/70 text-blue-700'}`}>
                <CalendarDays className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 uppercase font-semibold">Tanggal Acara</div>
                <div className="text-stone-900 font-semibold text-sm">{formatDateIndo(event.tanggal_acara)}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${isWanita ? 'bg-rose-100/70 text-rose-700' : 'bg-blue-100/70 text-blue-700'}`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400 uppercase font-semibold">Lokasi Venue &amp; Alamat</div>
                <div className="text-stone-900 font-semibold">{event.lokasi_acara}</div>
                {event.venue_address && (
                  <div className="text-[11px] text-stone-500 mt-0.5">{event.venue_address}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${isWanita ? 'bg-rose-100/70 text-rose-700' : 'bg-blue-100/70 text-blue-700'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 uppercase font-semibold">Target Undangan</div>
                  <div className="text-stone-900 font-semibold">{event.jumlah_tamu} Tamu Undangan</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${isWanita ? 'bg-rose-100/70 text-rose-700' : 'bg-blue-100/70 text-blue-700'}`}>
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 uppercase font-semibold">Alokasi Anggaran</div>
                  <div className="text-stone-900 font-semibold">{formatRupiah(event.budget_total)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons to View Specific Modules */}
        <div className="mt-8 pt-5 border-t border-stone-200/60 grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              onFilterSide(side);
              onNavigate('budget');
            }}
            className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#B88E4B] text-stone-700 hover:text-[#9B7337] text-xs font-semibold text-center transition-all flex flex-col items-center gap-1"
          >
            <Wallet className="w-3.5 h-3.5 text-[#B88E4B]" />
            Budget {isWanita ? 'Wanita' : 'Pria'}
          </button>

          <button
            onClick={() => {
              onFilterSide(side);
              onNavigate('checklist');
            }}
            className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#B88E4B] text-stone-700 hover:text-[#9B7337] text-xs font-semibold text-center transition-all flex flex-col items-center gap-1"
          >
            <ListTodo className="w-3.5 h-3.5 text-[#B88E4B]" />
            Checklist
          </button>

          <button
            onClick={() => {
              onFilterSide(side);
              onNavigate('rundown');
            }}
            className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#B88E4B] text-stone-700 hover:text-[#9B7337] text-xs font-semibold text-center transition-all flex flex-col items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5 text-[#B88E4B]" />
            Rundown H
          </button>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900 tracking-tight">
            Wedding Event Management (Dual-Side)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Konsep utama sistem ini adalah memisahkan persiapan <strong>Acara Pihak Mempelai Wanita</strong> dan <strong>Acara Pihak Mempelai Pria</strong> dengan tanggal, lokasi, rundown, dan anggaran berbeda.
          </p>
        </div>
      </div>

      {/* Grid of the 2 Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {renderEventCard(eventWanita, 'WANITA')}
        {renderEventCard(eventPria, 'PRIA')}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF9] border border-[#CCA86E]/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEDEC3] bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#B88E4B]" />
                <h3 className="font-bold font-serif-luxury text-[#4A3B2C] text-lg">
                  Edit Acara: {editingEvent.side_type === 'WANITA' ? 'Pihak Wanita' : 'Pihak Pria'}
                </h3>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Acara *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.nama_acara || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, nama_acara: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Tanggal Acara *
                  </label>
                  <input
                    type="date"
                    required
                    value={editFormData.tanggal_acara || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, tanggal_acara: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Jam Acara (WIB)
                  </label>
                  <input
                    type="text"
                    placeholder="08:00 - 14:00 WIB"
                    value={editFormData.jam_acara || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, jam_acara: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Gedung / Tempat Venue *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama gedung atau ballroom"
                  value={editFormData.lokasi_acara || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, lokasi_acara: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Alamat Lengkap Venue
                </label>
                <input
                  type="text"
                  placeholder="Jl. Raya Kompleks, Kota..."
                  value={editFormData.venue_address || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, venue_address: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Target Tamu Undangan
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.jumlah_tamu || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, jumlah_tamu: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Alokasi Budget (Rp)
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={editFormData.budget_total || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, budget_total: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Deskripsi Acara
                </label>
                <textarea
                  rows={2}
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#B88E4B] hover:bg-[#9B7337] text-white shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
