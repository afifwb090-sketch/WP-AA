import React, { useState } from 'react';
import { 
  Receipt, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  TrendingDown, 
  ArrowUpRight,
  Filter,
  Layers,
  Edit3
} from 'lucide-react';
import { BudgetItem, EventSide, SideType, WeddingProject } from '../types';
import { formatRupiah, formatShortRupiah, formatDateIndo } from '../utils/formatters';
import { apiService } from '../services/apiService';

interface PaymentTrackingViewProps {
  project: WeddingProject;
  eventWanita?: EventSide;
  eventPria?: EventSide;
  budgetsWanita: BudgetItem[];
  budgetsPria: BudgetItem[];
  onPaymentUpdated: () => void;
  activeSideFilter: 'ALL' | 'WANITA' | 'PRIA';
  onFilterChange: (side: 'ALL' | 'WANITA' | 'PRIA') => void;
}

export const PaymentTrackingView: React.FC<PaymentTrackingViewProps> = ({
  project,
  eventWanita,
  eventPria,
  budgetsWanita,
  budgetsPria,
  onPaymentUpdated,
  activeSideFilter,
  onFilterChange
}) => {
  // Calculations Wanita
  const tagihanWanita = budgetsWanita.reduce((acc, curr) => acc + (curr.real_cost || curr.estimasi || 0), 0);
  const terbayarWanita = budgetsWanita.reduce((acc, curr) => acc + (curr.amount_paid || (curr.payment_status === 'Lunas' ? curr.real_cost : 0)), 0);
  const sisaWanita = Math.max(0, tagihanWanita - terbayarWanita);

  // Calculations Pria
  const tagihanPria = budgetsPria.reduce((acc, curr) => acc + (curr.real_cost || curr.estimasi || 0), 0);
  const terbayarPria = budgetsPria.reduce((acc, curr) => acc + (curr.amount_paid || (curr.payment_status === 'Lunas' ? curr.real_cost : 0)), 0);
  const sisaPria = Math.max(0, tagihanPria - terbayarPria);

  // Filter list
  let displayPayments: (BudgetItem & { side: SideType })[] = [];
  if (activeSideFilter === 'ALL' || activeSideFilter === 'WANITA') {
    displayPayments.push(...budgetsWanita.map(b => ({ ...b, side: 'WANITA' as SideType })));
  }
  if (activeSideFilter === 'ALL' || activeSideFilter === 'PRIA') {
    displayPayments.push(...budgetsPria.map(b => ({ ...b, side: 'PRIA' as SideType })));
  }

  const handleQuickMarkPaid = (item: BudgetItem) => {
    apiService.updateBudget(item.budget_id, {
      payment_status: 'Lunas',
      amount_paid: item.real_cost || item.estimasi,
      payment_date: new Date().toISOString().split('T')[0]
    });
    onPaymentUpdated();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900 tracking-tight">
            Financial &amp; Payment Tracking
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Monitoring total tagihan, pembayaran DP / lunas, serta deadline sisa pembayaran terpisah untuk <strong>Payment Wanita</strong> dan <strong>Payment Pria</strong>.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2 FINANCIAL BLOCKS: PAYMENT WANITA & PAYMENT PRIA */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PAYMENT BLOK WANITA */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-[#FFF9F8] to-[#FAF1EF] border border-rose-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
              Payment Acara Wanita
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {budgetsWanita.length} Tagihan Terdaftar
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline border-b border-rose-100 pb-2">
              <span className="text-xs text-stone-600">Total Tagihan Acara Wanita:</span>
              <span className="text-lg font-bold text-stone-900">{formatRupiah(tagihanWanita)}</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-rose-100 pb-2">
              <span className="text-xs text-emerald-700 font-medium">Pembayaran Masuk / DP:</span>
              <span className="text-lg font-bold text-emerald-800">{formatRupiah(terbayarWanita)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs text-rose-700 font-bold uppercase">Sisa Tagihan Tertunggak:</span>
              <span className="text-xl font-bold font-serif-luxury text-rose-700">{formatRupiah(sisaWanita)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="flex justify-between text-[11px] text-stone-500 mb-1">
              <span>Pelunasan Tagihan</span>
              <span>{tagihanWanita > 0 ? Math.round((terbayarWanita / tagihanWanita) * 100) : 0}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div 
                className="h-full bg-rose-500" 
                style={{ width: `${tagihanWanita > 0 ? (terbayarWanita / tagihanWanita) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* PAYMENT BLOK PRIA */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-[#F8FBFF] to-[#EFF5FC] border border-blue-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              Payment Acara Pria
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {budgetsPria.length} Tagihan Terdaftar
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline border-b border-blue-100 pb-2">
              <span className="text-xs text-stone-600">Total Tagihan Acara Pria:</span>
              <span className="text-lg font-bold text-stone-900">{formatRupiah(tagihanPria)}</span>
            </div>

            <div className="flex justify-between items-baseline border-b border-blue-100 pb-2">
              <span className="text-xs text-emerald-700 font-medium">Pembayaran Masuk / DP:</span>
              <span className="text-lg font-bold text-emerald-800">{formatRupiah(terbayarPria)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs text-blue-700 font-bold uppercase">Sisa Tagihan Tertunggak:</span>
              <span className="text-xl font-bold font-serif-luxury text-blue-700">{formatRupiah(sisaPria)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="flex justify-between text-[11px] text-stone-500 mb-1">
              <span>Pelunasan Tagihan</span>
              <span>{tagihanPria > 0 ? Math.round((terbayarPria / tagihanPria) * 100) : 0}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${tagihanPria > 0 ? (terbayarPria / tagihanPria) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs">
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => onFilterChange('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSideFilter === 'ALL' ? 'bg-[#B88E4B] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua Tagihan ({budgetsWanita.length + budgetsPria.length})
          </button>
          <button
            onClick={() => onFilterChange('WANITA')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSideFilter === 'WANITA' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tagihan Pihak Wanita ({budgetsWanita.length})
          </button>
          <button
            onClick={() => onFilterChange('PRIA')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSideFilter === 'PRIA' ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tagihan Pihak Pria ({budgetsPria.length})
          </button>
        </div>

        <span className="text-xs text-stone-500">
          Total: <strong>{displayPayments.length} tagihan</strong>
        </span>
      </div>

      {/* Payment Details Table */}
      <div className="rounded-2xl bg-white border border-[#EEDEC3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF7F2] text-stone-500 font-bold uppercase text-[10px] tracking-wider border-b border-[#EEDEC3]">
              <tr>
                <th className="py-3 px-4">Sisi Acara</th>
                <th className="py-3 px-4">Item &amp; Vendor</th>
                <th className="py-3 px-4 text-right">Total Tagihan</th>
                <th className="py-3 px-4 text-right">Sudah Dibayar</th>
                <th className="py-3 px-4 text-right">Sisa Tagihan</th>
                <th className="py-3 px-4 text-center">Status Pembayaran</th>
                <th className="py-3 px-4 text-center">Tgl Bayar Terakhir</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayPayments.map(item => {
                const isWanita = item.side === 'WANITA';
                const total = item.real_cost || item.estimasi;
                const paid = item.amount_paid || (item.payment_status === 'Lunas' ? total : 0);
                const sisa = Math.max(0, total - paid);

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
                      <div className="text-[10px] text-stone-500 font-medium">Vendor: {item.vendor || '-'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-stone-900 whitespace-nowrap">
                      {formatRupiah(total)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700 whitespace-nowrap">
                      {formatRupiah(paid)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-rose-700 whitespace-nowrap">
                      {formatRupiah(sisa)}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        item.payment_status === 'Lunas'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.payment_status === 'DP / Terbayar Sebagian'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {item.payment_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center text-stone-500 whitespace-nowrap">
                      {item.payment_date ? formatDateIndo(item.payment_date) : '-'}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {item.payment_status !== 'Lunas' && (
                        <button
                          onClick={() => handleQuickMarkPaid(item)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-semibold transition-colors"
                        >
                          Tandai Lunas
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
