import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Wallet, 
  Users, 
  Store, 
  ArrowUpRight, 
  TrendingUp, 
  AlertCircle,
  Sparkles,
  Heart,
  ChevronRight,
  ListTodo,
  ExternalLink
} from 'lucide-react';
import { 
  WeddingProject, 
  EventSide, 
  BudgetItem, 
  ChecklistTask, 
  Guest, 
  VendorBooking 
} from '../types';
import { 
  formatRupiah, 
  formatShortRupiah, 
  formatDateIndo, 
  calculateDaysRemaining 
} from '../utils/formatters';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  project: WeddingProject;
  eventWanita?: EventSide;
  eventPria?: EventSide;
  budgetsWanita: BudgetItem[];
  budgetsPria: BudgetItem[];
  tasksWanita: ChecklistTask[];
  tasksPria: ChecklistTask[];
  guestsWanita: Guest[];
  guestsPria: Guest[];
  bookings: VendorBooking[];
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  eventWanita,
  eventPria,
  budgetsWanita,
  budgetsPria,
  tasksWanita,
  tasksPria,
  guestsWanita,
  guestsPria,
  bookings,
  onNavigate
}) => {
  // Calculations for Wanita
  const countdownWanita = calculateDaysRemaining(eventWanita?.tanggal_acara || '');
  const totalTasksWanita = tasksWanita.length;
  const completedTasksWanita = tasksWanita.filter(t => t.status === 'Completed').length;
  const progressWanita = totalTasksWanita > 0 ? Math.round((completedTasksWanita / totalTasksWanita) * 100) : 0;
  const budgetWanitaEst = eventWanita?.budget_total || 0;
  const budgetWanitaReal = budgetsWanita.reduce((acc, curr) => acc + (curr.real_cost || curr.estimasi || 0), 0);
  const budgetWanitaPaid = budgetsWanita.reduce((acc, curr) => acc + (curr.amount_paid || (curr.payment_status === 'Lunas' ? curr.real_cost : 0)), 0);
  const guestsWanitaCount = guestsWanita.reduce((acc, curr) => acc + curr.jumlah_orang, 0);

  // Calculations for Pria
  const countdownPria = calculateDaysRemaining(eventPria?.tanggal_acara || '');
  const totalTasksPria = tasksPria.length;
  const completedTasksPria = tasksPria.filter(t => t.status === 'Completed').length;
  const progressPria = totalTasksPria > 0 ? Math.round((completedTasksPria / totalTasksPria) * 100) : 0;
  const budgetPriaEst = eventPria?.budget_total || 0;
  const budgetPriaReal = budgetsPria.reduce((acc, curr) => acc + (curr.real_cost || curr.estimasi || 0), 0);
  const budgetPriaPaid = budgetsPria.reduce((acc, curr) => acc + (curr.amount_paid || (curr.payment_status === 'Lunas' ? curr.real_cost : 0)), 0);
  const guestsPriaCount = guestsPria.reduce((acc, curr) => acc + curr.jumlah_orang, 0);

  // Combined totals
  const totalAllTasks = totalTasksWanita + totalTasksPria;
  const totalCompletedTasks = completedTasksWanita + completedTasksPria;
  const overallProgress = totalAllTasks > 0 ? Math.round((totalCompletedTasks / totalAllTasks) * 100) : 0;
  const totalBudgetCombined = budgetWanitaEst + budgetPriaEst;
  const totalRealSpentCombined = budgetWanitaReal + budgetPriaReal;
  const totalGuestsCombined = guestsWanitaCount + guestsPriaCount;

  // Active vendors
  const activeVendorsCount = bookings.filter(b => b.status === 'Booked' || b.status === 'Completed').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FAF0DE] via-[#FDFBF7] to-[#F5EBE1] border border-[#DFC69C] p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#CCA86E]/40 text-[#9B7337] text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
              Dual-Event Wedding Preparation System
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#3A2E1A] tracking-tight">
              {project.nama_pasangan_pria} &amp; {project.nama_pasangan_wanita}
            </h1>
            <p className="text-xs sm:text-sm text-[#6C5E4E] max-w-2xl font-light">
              Konsep: <span className="font-medium text-stone-800">{project.konsep_pernikahan}</span>. Mengelola 2 acara pernikahan independen (Pihak Mempelai Wanita &amp; Pihak Mempelai Pria) dalam satu kendali terpusat.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => onNavigate('events')}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#CCA86E] text-[#9B7337] hover:bg-[#FAF7F2] font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-[#B88E4B]" />
              Detail 2 Acara
            </button>
            <button
              onClick={() => onNavigate('budget')}
              className="px-4 py-2.5 rounded-xl bg-[#B88E4B] hover:bg-[#9B7337] text-white font-semibold text-xs transition-all shadow-md shadow-[#B88E4B]/20 flex items-center gap-1.5"
            >
              <Wallet className="w-4 h-4" />
              Kelola Dual Budget
            </button>
          </div>
        </div>

        {/* Subtle decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-[#EEDEC3]/30 blur-2xl pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 2. DUAL COUNTDOWN CARDS (Core Requirement) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#B88E4B]" />
            <h2 className="text-lg sm:text-xl font-bold font-serif-luxury text-[#3A2E1A]">
              Dual Countdown Acara Pernikahan
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            2 Tanggal Berbeda &bull; 2 Lokasi Berbeda
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* COUNTDOWN 1: ACARA PIHAK WANITA */}
          <div className="relative rounded-2xl bg-gradient-to-br from-white via-[#FFF9F8] to-[#FDF4F3] border border-rose-200/70 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100/80 text-rose-800 text-[11px] font-bold tracking-wide uppercase">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Acara Pihak Mempelai Wanita
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-2">
                  {eventWanita?.nama_acara || 'Akad & Resepsi Pihak Wanita'}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl sm:text-4xl font-serif-luxury font-bold text-rose-700">
                  {countdownWanita.days}
                </div>
                <div className="text-[11px] font-medium text-rose-600 uppercase tracking-wider">
                  Hari Lagi
                </div>
              </div>
            </div>

            {/* Countdown Banner Text */}
            <div className="mt-3 p-3 rounded-xl bg-white/80 border border-rose-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-900">
                "{countdownWanita.days} Hari Menuju Acara Pernikahan Pihak Wanita"
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                {eventWanita?.jam_acara || '08:00 - 14:00 WIB'}
              </span>
            </div>

            {/* Event Details: Date & Location */}
            <div className="mt-4 space-y-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-semibold text-stone-900">
                  {formatDateIndo(eventWanita?.tanggal_acara || '')}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">
                  {eventWanita?.lokasi_acara || 'Gedung / Ballroom Belum Dipilih'}
                </span>
              </div>
            </div>

            {/* Progress Preparation Bar */}
            <div className="mt-5 pt-4 border-t border-rose-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-stone-600">Progress Persiapan Acara Wanita:</span>
                <span className="font-bold text-rose-700">{progressWanita}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-rose-100/70 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-500"
                  style={{ width: `${progressWanita}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                <span>Task Selesai: <strong>{completedTasksWanita}/{totalTasksWanita}</strong></span>
                <span>Tamu: <strong>{guestsWanitaCount} orang</strong></span>
                <span>Budget: <strong>{formatShortRupiah(budgetWanitaReal)}</strong></span>
              </div>
            </div>
          </div>

          {/* COUNTDOWN 2: ACARA PIHAK PRIA */}
          <div className="relative rounded-2xl bg-gradient-to-br from-white via-[#F8FBFF] to-[#F2F6FC] border border-blue-200/70 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100/80 text-blue-800 text-[11px] font-bold tracking-wide uppercase">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Acara Pihak Mempelai Pria
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-2">
                  {eventPria?.nama_acara || 'Ngunduh Mantu & Resepsi Pihak Pria'}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl sm:text-4xl font-serif-luxury font-bold text-blue-700">
                  {countdownPria.days}
                </div>
                <div className="text-[11px] font-medium text-blue-600 uppercase tracking-wider">
                  Hari Lagi
                </div>
              </div>
            </div>

            {/* Countdown Banner Text */}
            <div className="mt-3 p-3 rounded-xl bg-white/80 border border-blue-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-900">
                "{countdownPria.days} Hari Menuju Acara Pernikahan Pihak Pria"
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                {eventPria?.jam_acara || '11:00 - 16:00 WIB'}
              </span>
            </div>

            {/* Event Details: Date & Location */}
            <div className="mt-4 space-y-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-semibold text-stone-900">
                  {formatDateIndo(eventPria?.tanggal_acara || '')}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">
                  {eventPria?.lokasi_acara || 'Gedung / Ballroom Belum Dipilih'}
                </span>
              </div>
            </div>

            {/* Progress Preparation Bar */}
            <div className="mt-5 pt-4 border-t border-blue-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-stone-600">Progress Persiapan Acara Pria:</span>
                <span className="font-bold text-blue-700">{progressPria}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-blue-100/70 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${progressPria}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                <span>Task Selesai: <strong>{completedTasksPria}/{totalTasksPria}</strong></span>
                <span>Tamu: <strong>{guestsPriaCount} orang</strong></span>
                <span>Budget: <strong>{formatShortRupiah(budgetPriaReal)}</strong></span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 SUMMARY STAT CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Total Progress
            </span>
            <div className="p-2 rounded-xl bg-[#FAF0DE] text-[#9B7337]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
            {overallProgress}%
          </div>
          <p className="text-[11px] text-stone-500">
            Persiapan kedua sisi acara
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Total Task Selesai
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
            {totalCompletedTasks} <span className="text-sm font-sans font-normal text-stone-400">/ {totalAllTasks}</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Checklist milestone tuntas
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Total Budget
            </span>
            <div className="p-2 rounded-xl bg-[#FAF0DE] text-[#9B7337]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
            {formatShortRupiah(totalBudgetCombined)}
          </div>
          <p className="text-[11px] text-stone-500">
            Terpakai: {formatShortRupiah(totalRealSpentCombined)}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Vendor Aktif
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
            {activeVendorsCount} <span className="text-sm font-sans font-normal text-stone-400">Vendor</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Terkontrak &amp; terkonfirmasi
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* COMPARATIVE OVERVIEW: BUDGET & PREPARATION (WANITA VS PRIA) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Side-by-Side Comparison */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-stone-900">
                Komparasi Persiapan: Pihak Wanita vs Pihak Pria
              </h3>
              <p className="text-xs text-stone-500">
                Perbandingan alokasi anggaran, status pembayaran, dan kesiapan tamu
              </p>
            </div>
            <button
              onClick={() => onNavigate('budget')}
              className="text-xs font-semibold text-[#9B7337] hover:underline flex items-center gap-1"
            >
              Lihat Rincian <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Budget Comparison Bars */}
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-rose-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Budget Acara Pihak Wanita: {formatRupiah(budgetWanitaEst)}
                </span>
                <span className="text-stone-600">
                  Terpakai: {formatRupiah(budgetWanitaReal)} ({budgetWanitaEst > 0 ? Math.round((budgetWanitaReal/budgetWanitaEst)*100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden flex">
                <div 
                  className="bg-rose-500 h-full"
                  style={{ width: `${Math.min(100, budgetWanitaEst > 0 ? (budgetWanitaReal/budgetWanitaEst)*100 : 0)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 mt-1">
                <span>Sudah Dibayar: <strong>{formatRupiah(budgetWanitaPaid)}</strong></span>
                <span>Sisa Budget: <strong>{formatRupiah(Math.max(0, budgetWanitaEst - budgetWanitaReal))}</strong></span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-blue-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Budget Acara Pihak Pria: {formatRupiah(budgetPriaEst)}
                </span>
                <span className="text-stone-600">
                  Terpakai: {formatRupiah(budgetPriaReal)} ({budgetPriaEst > 0 ? Math.round((budgetPriaReal/budgetPriaEst)*100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden flex">
                <div 
                  className="bg-blue-500 h-full"
                  style={{ width: `${Math.min(100, budgetPriaEst > 0 ? (budgetPriaReal/budgetPriaEst)*100 : 0)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-stone-500 mt-1">
                <span>Sudah Dibayar: <strong>{formatRupiah(budgetPriaPaid)}</strong></span>
                <span>Sisa Budget: <strong>{formatRupiah(Math.max(0, budgetPriaEst - budgetPriaReal))}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Comparison Metrics Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                  <th className="py-2">Parameter</th>
                  <th className="py-2 text-rose-800">Acara Pihak Wanita</th>
                  <th className="py-2 text-blue-800">Acara Pihak Pria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr>
                  <td className="py-2.5 font-medium">Tanggal Acara</td>
                  <td className="py-2.5 font-semibold text-rose-900">{formatDateIndo(eventWanita?.tanggal_acara || '')}</td>
                  <td className="py-2.5 font-semibold text-blue-900">{formatDateIndo(eventPria?.tanggal_acara || '')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Lokasi Venue</td>
                  <td className="py-2.5">{eventWanita?.lokasi_acara || '-'}</td>
                  <td className="py-2.5">{eventPria?.lokasi_acara || '-'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Target Undangan Tamu</td>
                  <td className="py-2.5 font-semibold">{eventWanita?.jumlah_tamu || 0} Tamu ({guestsWanitaCount} Tercatat)</td>
                  <td className="py-2.5 font-semibold">{eventPria?.jumlah_tamu || 0} Tamu ({guestsPriaCount} Tercatat)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Checklist Selesai</td>
                  <td className="py-2.5 font-semibold text-emerald-700">{completedTasksWanita} dari {totalTasksWanita} task ({progressWanita}%)</td>
                  <td className="py-2.5 font-semibold text-emerald-700">{completedTasksPria} dari {totalTasksPria} task ({progressPria}%)</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Right 1 Col: Immediate Upcoming Tasks */}
        <div className="p-6 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
              <h3 className="font-serif-luxury font-bold text-stone-900 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-[#B88E4B]" />
                Checklist Mendesak
              </h3>
              <button
                onClick={() => onNavigate('checklist')}
                className="text-xs font-semibold text-[#9B7337] hover:underline"
              >
                Semua
              </button>
            </div>

            <div className="space-y-2.5">
              {[...tasksWanita, ...tasksPria]
                .filter(t => t.status !== 'Completed')
                .slice(0, 5)
                .map(task => {
                  const isWanita = task.event_id === eventWanita?.event_id;
                  return (
                    <div 
                      key={task.task_id}
                      className="p-2.5 rounded-xl border border-stone-100 hover:border-[#CCA86E]/50 bg-[#FAF7F2]/40 text-xs transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-stone-800 line-clamp-1">
                          {task.task_name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                          isWanita ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isWanita ? 'Wanita' : 'Pria'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                        <span>Deadline: {formatDateIndo(task.deadline)}</span>
                        <span className={`font-semibold ${
                          task.priority === 'High' ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <button
              onClick={() => onNavigate('checklist')}
              className="w-full py-2.5 rounded-xl bg-[#FAF0DE] hover:bg-[#F3ECE0] text-[#7A5729] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              Lihat Milestone Persiapan &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
