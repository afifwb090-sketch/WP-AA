import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  X,
  CreditCard,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { 
  BudgetItem, 
  BudgetCategory, 
  PaymentStatus, 
  EventSide, 
  SideType, 
  WeddingProject 
} from '../types';
import { formatRupiah, formatShortRupiah, formatDateIndo } from '../utils/formatters';
import { apiService } from '../services/apiService';

interface BudgetViewProps {
  project: WeddingProject;
  eventWanita?: EventSide;
  eventPria?: EventSide;
  budgetsWanita: BudgetItem[];
  budgetsPria: BudgetItem[];
  onBudgetUpdated: () => void;
  activeSideFilter: 'ALL' | 'WANITA' | 'PRIA';
  onFilterChange: (side: 'ALL' | 'WANITA' | 'PRIA') => void;
}

const CATEGORIES: BudgetCategory[] = [
  'Venue',
  'Catering',
  'Dekorasi',
  'Makeup',
  'Busana',
  'Dokumentasi',
  'Entertainment',
  'Undangan',
  'Souvenir',
  'Transportasi',
  'Lainnya'
];

export const BudgetView: React.FC<BudgetViewProps> = ({
  project,
  eventWanita,
  eventPria,
  budgetsWanita,
  budgetsPria,
  onBudgetUpdated,
  activeSideFilter,
  onFilterChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    event_id: string;
    kategori: BudgetCategory;
    item: string;
    vendor: string;
    estimasi: number;
    real_cost: number;
    payment_status: PaymentStatus;
    payment_date: string;
    amount_paid: number;
    notes: string;
  }>({
    event_id: eventWanita?.event_id || '',
    kategori: 'Catering',
    item: '',
    vendor: '',
    estimasi: 10000000,
    real_cost: 10000000,
    payment_status: 'Belum Bayar',
    payment_date: '',
    amount_paid: 0,
    notes: ''
  });

  // Calculations for Wanita
  const budgetWanitaAllocated = eventWanita?.budget_total || 0;
  const budgetWanitaReal = budgetsWanita.reduce((acc, curr) => acc + (curr.real_cost || curr.estimasi || 0), 0);
  const budgetWanitaRemaining = budgetWanitaAllocated - budgetWanitaReal;
  const isOverbudgetWanita = budgetWanitaReal > budgetWanitaAllocated;
  const budgetWanitaPaid = budgetsWanita.reduce((acc, curr) => acc + (curr.amount_paid || (curr.payment_status === 'Lunas' ? curr.real_cost : 0)), 0);

  // Calculations for Pria
  const budgetPriaAllocated = eventPria?.budget_total || 0;
  const budgetPriaReal = budgetsPria.reduce((acc, curr) => acc + (curr.real_cost || curr.estimasi || 0), 0);
  const budgetPriaRemaining = budgetPriaAllocated - budgetPriaReal;
  const isOverbudgetPria = budgetPriaReal > budgetPriaAllocated;
  const budgetPriaPaid = budgetsPria.reduce((acc, curr) => acc + (curr.amount_paid || (curr.payment_status === 'Lunas' ? curr.real_cost : 0)), 0);

  // Determine current list to display
  let displayList: (BudgetItem & { side: SideType })[] = [];
  if (activeSideFilter === 'ALL' || activeSideFilter === 'WANITA') {
    displayList.push(...budgetsWanita.map(b => ({ ...b, side: 'WANITA' as SideType })));
  }
  if (activeSideFilter === 'ALL' || activeSideFilter === 'PRIA') {
    displayList.push(...budgetsPria.map(b => ({ ...b, side: 'PRIA' as SideType })));
  }

  // Filter by category
  if (selectedCategory !== 'ALL') {
    displayList = displayList.filter(b => b.kategori === selectedCategory);
  }

  const handleOpenAddModal = (side?: SideType) => {
    setEditingItem(null);
    const targetEventId = side === 'PRIA' ? eventPria?.event_id : eventWanita?.event_id;
    setFormData({
      event_id: targetEventId || eventWanita?.event_id || '',
      kategori: 'Catering',
      item: '',
      vendor: '',
      estimasi: 10000000,
      real_cost: 10000000,
      payment_status: 'Belum Bayar',
      payment_date: '',
      amount_paid: 0,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: BudgetItem) => {
    setEditingItem(item);
    setFormData({
      event_id: item.event_id,
      kategori: item.kategori,
      item: item.item,
      vendor: item.vendor,
      estimasi: item.estimasi,
      real_cost: item.real_cost,
      payment_status: item.payment_status,
      payment_date: item.payment_date || '',
      amount_paid: item.amount_paid || 0,
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteItem = (budgetId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus item anggaran ini?')) {
      apiService.deleteBudget(budgetId);
      onBudgetUpdated();
    }
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item) {
      alert('Nama item pengeluaran wajib diisi.');
      return;
    }

    if (editingItem) {
      apiService.updateBudget(editingItem.budget_id, formData);
    } else {
      apiService.createBudget({
        ...formData,
        wedding_id: project.wedding_id
      });
    }
    setIsModalOpen(false);
    onBudgetUpdated();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900 tracking-tight">
            Dual Budget Management (Anggaran 2 Pihak)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pengelolaan anggaran terpisah antara Acara Pihak Mempelai Wanita dan Acara Pihak Mempelai Pria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAddModal(activeSideFilter === 'PRIA' ? 'PRIA' : 'WANITA')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B88E4B] hover:bg-[#9B7337] text-white text-xs font-semibold shadow-md shadow-[#B88E4B]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Item Budget
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DUAL BUDGET OVERVIEW CARDS (Wanita & Pria) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: BUDGET ACARA PIHAK WANITA */}
        <div className={`p-6 rounded-3xl border transition-all ${
          isOverbudgetWanita 
            ? 'bg-rose-50/60 border-rose-300' 
            : 'bg-gradient-to-br from-white via-[#FFF9F8] to-[#FAF2F0] border-rose-200'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                Acara Pihak Mempelai Wanita
              </span>
              <h2 className="text-lg font-bold font-serif-luxury text-stone-900 mt-2">
                Total Budget Wanita
              </h2>
            </div>
            {isOverbudgetWanita && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200 animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5" />
                OVERBUDGET!
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-y border-rose-100 py-3 text-center">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase">Alokasi Plafon</span>
              <div className="text-sm sm:text-base font-bold text-stone-900 mt-0.5">
                {formatRupiah(budgetWanitaAllocated)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase">Terpakai</span>
              <div className={`text-sm sm:text-base font-bold mt-0.5 ${isOverbudgetWanita ? 'text-red-600' : 'text-rose-800'}`}>
                {formatRupiah(budgetWanitaReal)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase">Sisa Budget</span>
              <div className={`text-sm sm:text-base font-bold mt-0.5 ${budgetWanitaRemaining < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                {formatRupiah(budgetWanitaRemaining)}
              </div>
            </div>
          </div>

          {/* Progress & Paid tracking */}
          <div className="mt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Realisasi Pengeluaran ({budgetWanitaAllocated > 0 ? Math.round((budgetWanitaReal/budgetWanitaAllocated)*100) : 0}%)</span>
              <span>Terbayar: <strong>{formatRupiah(budgetWanitaPaid)}</strong></span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
              <div 
                className={`h-full rounded-full ${isOverbudgetWanita ? 'bg-red-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, budgetWanitaAllocated > 0 ? (budgetWanitaReal/budgetWanitaAllocated)*100 : 0)}%` }}
              />
            </div>
          </div>
        </div>

        {/* CARD 2: BUDGET ACARA PIHAK PRIA */}
        <div className={`p-6 rounded-3xl border transition-all ${
          isOverbudgetPria 
            ? 'bg-red-50/60 border-red-300' 
            : 'bg-gradient-to-br from-white via-[#F8FBFF] to-[#EFF5FC] border-blue-200'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                Acara Pihak Mempelai Pria
              </span>
              <h2 className="text-lg font-bold font-serif-luxury text-stone-900 mt-2">
                Total Budget Pria
              </h2>
            </div>
            {isOverbudgetPria && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200 animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5" />
                OVERBUDGET!
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-y border-blue-100 py-3 text-center">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase">Alokasi Plafon</span>
              <div className="text-sm sm:text-base font-bold text-stone-900 mt-0.5">
                {formatRupiah(budgetPriaAllocated)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase">Terpakai</span>
              <div className={`text-sm sm:text-base font-bold mt-0.5 ${isOverbudgetPria ? 'text-red-600' : 'text-blue-800'}`}>
                {formatRupiah(budgetPriaReal)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase">Sisa Budget</span>
              <div className={`text-sm sm:text-base font-bold mt-0.5 ${budgetPriaRemaining < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                {formatRupiah(budgetPriaRemaining)}
              </div>
            </div>
          </div>

          {/* Progress & Paid tracking */}
          <div className="mt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Realisasi Pengeluaran ({budgetPriaAllocated > 0 ? Math.round((budgetPriaReal/budgetPriaAllocated)*100) : 0}%)</span>
              <span>Terbayar: <strong>{formatRupiah(budgetPriaPaid)}</strong></span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
              <div 
                className={`h-full rounded-full ${isOverbudgetPria ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(100, budgetPriaAllocated > 0 ? (budgetPriaReal/budgetPriaAllocated)*100 : 0)}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FILTER & CATEGORY CHIPS */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Side Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => onFilterChange('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSideFilter === 'ALL' ? 'bg-[#B88E4B] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua Acara ({budgetsWanita.length + budgetsPria.length})
            </button>
            <button
              onClick={() => onFilterChange('WANITA')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                activeSideFilter === 'WANITA' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Acara Wanita ({budgetsWanita.length})
            </button>
            <button
              onClick={() => onFilterChange('PRIA')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                activeSideFilter === 'PRIA' ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Acara Pria ({budgetsPria.length})
            </button>
          </div>

          <div className="text-xs text-stone-500">
            Total Item: <strong>{displayList.length} pengeluaran</strong>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-stone-900 text-white font-semibold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua Kategori
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#B88E4B] text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BUDGET TABLE */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-white border border-[#EEDEC3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase text-[10px] tracking-wider border-b border-[#EEDEC3]">
              <tr>
                <th className="py-3 px-4">Sisi Acara</th>
                <th className="py-3 px-4">Kategori &amp; Item</th>
                <th className="py-3 px-4">Vendor Terkait</th>
                <th className="py-3 px-4 text-right">Estimasi</th>
                <th className="py-3 px-4 text-right">Real Cost</th>
                <th className="py-3 px-4 text-center">Status Pembayaran</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    Belum ada data anggaran untuk filter ini.
                  </td>
                </tr>
              ) : (
                displayList.map(item => {
                  const isWanita = item.side === 'WANITA';
                  return (
                    <tr key={item.budget_id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isWanita ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isWanita ? 'Wanita' : 'Pria'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{item.item}</div>
                        <div className="text-[10px] text-[#9B7337] font-medium">{item.kategori}</div>
                        {item.notes && <div className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{item.notes}</div>}
                      </td>

                      <td className="py-3.5 px-4 text-stone-700 whitespace-nowrap">
                        {item.vendor || '-'}
                      </td>

                      <td className="py-3.5 px-4 text-right font-medium text-stone-500 whitespace-nowrap">
                        {formatRupiah(item.estimasi)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-stone-900 whitespace-nowrap">
                        {formatRupiah(item.real_cost)}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          item.payment_status === 'Lunas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.payment_status === 'DP / Terbayar Sebagian'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {item.payment_status === 'Lunas' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {item.payment_status === 'DP / Terbayar Sebagian' && <Clock className="w-3 h-3 text-amber-600" />}
                          {item.payment_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                            title="Edit Item"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.budget_id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Item"
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

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT BUDGET ITEM */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF9] border border-[#CCA86E]/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEDEC3] bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#B88E4B]" />
                <h3 className="font-bold font-serif-luxury text-[#4A3B2C] text-lg">
                  {editingItem ? 'Edit Item Budget' : 'Tambah Item Budget Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="p-6 space-y-4 text-xs">
              
              {/* Event Side Selector */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Alokasi Acara Pihak *
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
                    Kategori *
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as BudgetCategory })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nama Vendor Terkait
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kinarya Catering"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Item Pengeluaran *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Paket Buffet 600 Pax + 5 Stall"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Estimasi Anggaran (Rp) *
                  </label>
                  <input
                    type="number"
                    step="100000"
                    required
                    value={formData.estimasi}
                    onChange={(e) => setFormData({ ...formData, estimasi: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Realisasi Biaya / Real Cost (Rp) *
                  </label>
                  <input
                    type="number"
                    step="100000"
                    required
                    value={formData.real_cost}
                    onChange={(e) => setFormData({ ...formData, real_cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Status Pembayaran
                  </label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as PaymentStatus })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    <option value="Belum Bayar">Belum Bayar</option>
                    <option value="DP / Terbayar Sebagian">DP / Terbayar Sebagian</option>
                    <option value="Lunas">Lunas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Jumlah Sudah Dibayar (Rp)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={formData.amount_paid}
                    onChange={(e) => setFormData({ ...formData, amount_paid: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tanggal Bayar Terakhir
                </label>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Catatan / Keterangan
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan spesifikasi atau termin bayar..."
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
                  Simpan Item Budget
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
