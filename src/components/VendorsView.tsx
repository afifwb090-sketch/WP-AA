import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Trash2, 
  Edit3, 
  Star, 
  Phone, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Tag, 
  X,
  Layers,
  Search
} from 'lucide-react';
import { 
  Vendor, 
  VendorCategory, 
  VendorBooking, 
  BookingStatus, 
  EventSide, 
  SideType, 
  WeddingProject 
} from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { apiService } from '../services/apiService';

interface VendorsViewProps {
  project: WeddingProject;
  eventWanita?: EventSide;
  eventPria?: EventSide;
  vendors: Vendor[];
  bookingsWanita: VendorBooking[];
  bookingsPria: VendorBooking[];
  onVendorsUpdated: () => void;
  activeSideFilter: 'ALL' | 'WANITA' | 'PRIA';
  onFilterChange: (side: 'ALL' | 'WANITA' | 'PRIA') => void;
}

const VENDOR_CATEGORIES: VendorCategory[] = [
  'Wedding Organizer',
  'Venue',
  'Catering',
  'Decoration',
  'Photographer',
  'Videographer',
  'Makeup Artist',
  'Fashion',
  'Entertainment',
  'Invitation',
  'Souvenir',
  'Other'
];

export const VendorsView: React.FC<VendorsViewProps> = ({
  project,
  eventWanita,
  eventPria,
  vendors,
  bookingsWanita,
  bookingsPria,
  onVendorsUpdated,
  activeSideFilter,
  onFilterChange
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'catalog'>('bookings');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [selectedVendorForBooking, setSelectedVendorForBooking] = useState<Vendor | null>(null);

  // Booking Form State
  const [bookingFormData, setBookingFormData] = useState<{
    event_id: string;
    vendor_id: string;
    nama_vendor: string;
    kategori: VendorCategory;
    tanggal_booking: string;
    harga: number;
    status: BookingStatus;
    notes: string;
  }>({
    event_id: eventWanita?.event_id || '',
    vendor_id: '',
    nama_vendor: '',
    kategori: 'Catering',
    tanggal_booking: new Date().toISOString().split('T')[0],
    harga: 20000000,
    status: 'Booked',
    notes: ''
  });

  // Vendor Catalog Form State
  const [vendorFormData, setVendorFormData] = useState<Partial<Vendor>>({
    nama_vendor: '',
    kategori: 'Decoration',
    kontak: '',
    alamat: '',
    harga: 'Mulai Rp 20.000.000',
    harga_numeric: 20000000,
    portfolio: '',
    rating: 4.9,
    instagram: '',
    verified: true
  });

  // Filtered Bookings
  let displayBookings: (VendorBooking & { side: SideType })[] = [];
  if (activeSideFilter === 'ALL' || activeSideFilter === 'WANITA') {
    displayBookings.push(...bookingsWanita.map(b => ({ ...b, side: 'WANITA' as SideType })));
  }
  if (activeSideFilter === 'ALL' || activeSideFilter === 'PRIA') {
    displayBookings.push(...bookingsPria.map(b => ({ ...b, side: 'PRIA' as SideType })));
  }

  // Filtered Catalog
  let displayVendors = vendors;
  if (selectedCategory !== 'ALL') {
    displayVendors = displayVendors.filter(v => v.kategori === selectedCategory);
  }
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    displayVendors = displayVendors.filter(v => 
      v.nama_vendor.toLowerCase().includes(term) ||
      v.alamat.toLowerCase().includes(term) ||
      v.kategori.toLowerCase().includes(term)
    );
  }

  const handleOpenBookingModal = (vendor?: Vendor) => {
    const v = vendor || vendors[0];
    setSelectedVendorForBooking(v);
    setBookingFormData({
      event_id: activeSideFilter === 'PRIA' ? eventPria?.event_id || '' : eventWanita?.event_id || '',
      vendor_id: v.vendor_id,
      nama_vendor: v.nama_vendor,
      kategori: v.kategori,
      tanggal_booking: new Date().toISOString().split('T')[0],
      harga: v.harga_numeric || 15000000,
      status: 'Booked',
      notes: ''
    });
    setIsBookingModalOpen(true);
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingFormData.vendor_id) return;

    apiService.createBooking({
      ...bookingFormData,
      wedding_id: project.wedding_id
    });
    setIsBookingModalOpen(false);
    onVendorsUpdated();
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm('Batalkan & hapus booking vendor ini?')) {
      apiService.deleteBooking(bookingId);
      onVendorsUpdated();
    }
  };

  const handleSaveNewVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorFormData.nama_vendor) return;

    apiService.createVendor(vendorFormData as any);
    setIsVendorModalOpen(false);
    onVendorsUpdated();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900 tracking-tight">
            Vendor Directory &amp; Cross-Event Booking
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pilih vendor terbaik dan atur penempatan vendor pada <strong>Acara Wanita</strong> atau <strong>Acara Pria</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVendorModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#CCA86E] text-[#9B7337] hover:bg-[#FAF7F2] text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Master Vendor
          </button>

          <button
            onClick={() => handleOpenBookingModal()}
            className="px-4 py-2 rounded-xl bg-[#B88E4B] hover:bg-[#9B7337] text-white text-xs font-semibold shadow-md shadow-[#B88E4B]/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Booking Vendor ke Acara
          </button>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex border-b border-[#EEDEC3] gap-4">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'border-[#B88E4B] text-[#9B7337]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Daftar Booking Acara ({bookingsWanita.length + bookingsPria.length})
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'border-[#B88E4B] text-[#9B7337]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Store className="w-4 h-4" />
          Katalog Master Vendor ({vendors.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BOOKING PER EVENT */}
      {/* ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          
          {/* Side Filter */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs">
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-stone-200 text-xs">
              <button
                onClick={() => onFilterChange('ALL')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeSideFilter === 'ALL' ? 'bg-[#B88E4B] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua Acara ({bookingsWanita.length + bookingsPria.length})
              </button>
              <button
                onClick={() => onFilterChange('WANITA')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeSideFilter === 'WANITA' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Dipakai di Acara Wanita ({bookingsWanita.length})
              </button>
              <button
                onClick={() => onFilterChange('PRIA')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeSideFilter === 'PRIA' ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Dipakai di Acara Pria ({bookingsPria.length})
              </button>
            </div>

            <span className="text-xs text-stone-500">
              Total Kontrak: <strong>{displayBookings.length} vendor</strong>
            </span>
          </div>

          {/* Bookings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayBookings.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-[#EEDEC3] text-stone-400 text-xs">
                Belum ada vendor yang di-booking untuk filter ini.
              </div>
            ) : (
              displayBookings.map(b => {
                const isWanita = b.side === 'WANITA';
                return (
                  <div
                    key={b.booking_id}
                    className="p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs hover:border-[#CCA86E] transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isWanita ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isWanita ? 'Acara Pihak Wanita' : 'Acara Pihak Pria'}
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          b.status === 'Booked' || b.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-stone-900 text-base mt-2 line-clamp-1">
                        {b.nama_vendor}
                      </h3>
                      <div className="text-xs font-semibold text-[#9B7337]">
                        {b.kategori}
                      </div>

                      {b.notes && (
                        <p className="text-xs text-stone-500 mt-2 font-light line-clamp-2">
                          {b.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                      <div className="flex justify-between text-stone-600">
                        <span>Biaya Kontrak:</span>
                        <strong className="text-stone-900">{formatRupiah(b.harga)}</strong>
                      </div>
                      <div className="flex justify-between text-stone-500 text-[11px]">
                        <span>Tgl Booking:</span>
                        <span>{formatDateIndo(b.tanggal_booking)}</span>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleDeleteBooking(b.booking_id)}
                          className="text-[11px] text-red-600 hover:text-red-800 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Batalkan Booking
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VENDOR CATALOG MASTER */}
      {/* ========================================================================= */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          
          {/* Search & Category toolbar */}
          <div className="p-4 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari vendor berdasarkan nama, kategori, kota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <span className="text-xs text-stone-500">
                Tersedia: <strong>{displayVendors.length} vendor terverifikasi</strong>
              </span>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-full whitespace-nowrap ${
                  selectedCategory === 'ALL' ? 'bg-stone-900 text-white font-semibold' : 'bg-stone-100 text-stone-600'
                }`}
              >
                Semua Kategori
              </button>
              {VENDOR_CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap ${
                    selectedCategory === c ? 'bg-[#B88E4B] text-white font-semibold' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayVendors.map(vendor => (
              <div
                key={vendor.vendor_id}
                className="p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs hover:border-[#CCA86E] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0DE] text-[#9B7337] text-[10px] font-bold uppercase tracking-wider">
                      {vendor.kategori}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {vendor.rating}
                    </div>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base mt-2">
                    {vendor.nama_vendor}
                  </h3>

                  <div className="space-y-1 mt-3 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="line-clamp-1">{vendor.alamat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{vendor.kontak}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Harga Paket:</span>
                    <span className="font-bold text-stone-900">{vendor.harga}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenBookingModal(vendor)}
                      className="w-full py-2 rounded-xl bg-[#B88E4B] hover:bg-[#9B7337] text-white text-xs font-semibold shadow-xs text-center transition-colors"
                    >
                      Booking Vendor
                    </button>
                    <a
                      href={vendor.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
                    >
                      Portfolio <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BOOK VENDOR TO EVENT */}
      {/* ========================================================================= */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF9] border border-[#CCA86E]/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEDEC3] bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#B88E4B]" />
                <h3 className="font-bold font-serif-luxury text-[#4A3B2C] text-lg">
                  Booking Vendor ke Sisi Acara
                </h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pilih Vendor *
                </label>
                <select
                  value={bookingFormData.vendor_id}
                  onChange={(e) => {
                    const sel = vendors.find(v => v.vendor_id === e.target.value);
                    if (sel) {
                      setBookingFormData({
                        ...bookingFormData,
                        vendor_id: sel.vendor_id,
                        nama_vendor: sel.nama_vendor,
                        kategori: sel.kategori,
                        harga: sel.harga_numeric || 15000000
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                >
                  {vendors.map(v => (
                    <option key={v.vendor_id} value={v.vendor_id}>
                      {v.nama_vendor} ({v.kategori})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Dipakai Pada Acara *
                </label>
                <select
                  value={bookingFormData.event_id}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, event_id: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                >
                  <option value={eventWanita?.event_id}>
                    Acara Pihak Mempelai Wanita - {eventWanita?.nama_acara}
                  </option>
                  <option value={eventPria?.event_id}>
                    Acara Pihak Mempelai Pria - {eventPria?.nama_acara}
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Harga Kontrak Disepakati (Rp) *
                  </label>
                  <input
                    type="number"
                    step="500000"
                    required
                    value={bookingFormData.harga}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, harga: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Status Booking
                  </label>
                  <select
                    value={bookingFormData.status}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, status: e.target.value as BookingStatus })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Booked">Booked (Terkontrak)</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tanggal Booking
                </label>
                <input
                  type="date"
                  value={bookingFormData.tanggal_booking}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, tanggal_booking: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Catatan Booking / Ruang Lingkup
                </label>
                <textarea
                  rows={2}
                  placeholder="Jumlah pax, rincian seragam, jam stand-by..."
                  value={bookingFormData.notes}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#B88E4B] hover:bg-[#9B7337] text-white shadow-xs"
                >
                  Simpan Booking
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD MASTER VENDOR */}
      {/* ========================================================================= */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF9] border border-[#CCA86E]/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEDEC3] bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#B88E4B]" />
                <h3 className="font-bold font-serif-luxury text-[#4A3B2C] text-lg">
                  Tambah Master Vendor Baru
                </h3>
              </div>
              <button
                onClick={() => setIsVendorModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewVendor} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Vendor / Brand *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sanggar Busana Adat Nusantara"
                  value={vendorFormData.nama_vendor || ''}
                  onChange={(e) => setVendorFormData({ ...vendorFormData, nama_vendor: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={vendorFormData.kategori}
                    onChange={(e) => setVendorFormData({ ...vendorFormData, kategori: e.target.value as VendorCategory })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    {VENDOR_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Kontak WhatsApp / Telp
                  </label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={vendorFormData.kontak || ''}
                    onChange={(e) => setVendorFormData({ ...vendorFormData, kontak: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Alamat / Studio
                </label>
                <input
                  type="text"
                  placeholder="Jl. Wijaya No. 10, Jakarta Selatan"
                  value={vendorFormData.alamat || ''}
                  onChange={(e) => setVendorFormData({ ...vendorFormData, alamat: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Display Harga Mulai Dari
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Mulai Rp 15.000.000"
                    value={vendorFormData.harga || ''}
                    onChange={(e) => setVendorFormData({ ...vendorFormData, harga: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Rating (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={vendorFormData.rating || 4.9}
                    onChange={(e) => setVendorFormData({ ...vendorFormData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Link Portfolio / Website
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={vendorFormData.portfolio || ''}
                  onChange={(e) => setVendorFormData({ ...vendorFormData, portfolio: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsVendorModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#B88E4B] hover:bg-[#9B7337] text-white shadow-xs"
                >
                  Simpan Vendor
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
