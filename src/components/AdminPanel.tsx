import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Calendar, 
  TrendingUp, 
  Users, 
  Store, 
  DollarSign, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Building2,
  Crown
} from 'lucide-react';
import { WeddingProject, EventSide, User } from '../types';
import { formatRupiah, formatShortRupiah, formatDateIndo } from '../utils/formatters';

interface AdminPanelProps {
  projects: WeddingProject[];
  allEvents: EventSide[];
  users: User[];
  onSelectProject: (project: WeddingProject) => void;
  onOpenNewProject: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects,
  allEvents,
  users,
  onSelectProject,
  onOpenNewProject
}) => {
  // Statistics
  const activeProjectsCount = projects.filter(p => p.status_project === 'Active').length;
  const clientsCount = users.filter(u => u.role === 'client').length;
  const totalEventsCount = allEvents.length;
  
  // Total managed budget
  const totalManagedBudget = allEvents.reduce((acc, curr) => acc + (curr.budget_total || 0), 0);
  const estimatedWoRevenue = Math.round(totalManagedBudget * 0.08); // 8% WO service fee

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#B88E4B]" />
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900 tracking-tight">
              Admin Wedding Organizer Control Panel
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Dashboard supervisi Wedding Organizer: monitoring seluruh wedding project, klien, dan kalkulasi estimasi revenue jasa.
          </p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B88E4B] hover:bg-[#9B7337] text-white text-xs font-semibold shadow-md shadow-[#B88E4B]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Klien Wedding Baru
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Total Wedding Projects
          </span>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
            {projects.length} <span className="text-sm font-sans font-normal text-stone-400">Proyek</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            {activeProjectsCount} Proyek Aktif Berjalan
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Total Acara Dikelola
          </span>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
            {totalEventsCount} <span className="text-sm font-sans font-normal text-stone-400">Acara</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Sisi Wanita &amp; Pria
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Nilai Anggaran Proyek
          </span>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
            {formatShortRupiah(totalManagedBudget)}
          </div>
          <p className="text-[11px] text-stone-500">
            Total budget pasangan
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Estimasi Fee WO
          </span>
          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#9B7337]">
            {formatShortRupiah(estimatedWoRevenue)}
          </div>
          <p className="text-[11px] text-stone-500">
            Revenue jasa WO (~8%)
          </p>
        </div>

      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-serif-luxury text-stone-900">
          Daftar Seluruh Wedding Project
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map(proj => {
            const projectEvents = allEvents.filter(e => e.wedding_id === proj.wedding_id);
            const evWanita = projectEvents.find(e => e.side_type === 'WANITA');
            const evPria = projectEvents.find(e => e.side_type === 'PRIA');
            const totalBudget = projectEvents.reduce((acc, curr) => acc + curr.budget_total, 0);

            return (
              <div
                key={proj.wedding_id}
                className="p-6 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs hover:border-[#CCA86E] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      proj.status_project === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {proj.status_project}
                    </span>

                    <span className="text-[11px] text-stone-400">
                      Mulai: {formatDateIndo(proj.tanggal_mulai_project)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-serif-luxury text-stone-900 mt-2">
                    {proj.nama_pasangan_pria} &amp; {proj.nama_pasangan_wanita}
                  </h3>

                  <p className="text-xs text-stone-500 mt-0.5">
                    Konsep: <strong>{proj.konsep_pernikahan}</strong>
                  </p>

                  {/* 2 Sisi Acara Ringkasan */}
                  <div className="mt-4 p-3 rounded-xl bg-[#FAF7F2] border border-[#EEDEC3]/60 space-y-1.5 text-xs text-stone-700">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-rose-800">Acara Pihak Wanita:</span>
                      <span>{formatDateIndo(evWanita?.tanggal_acara || '')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-800">Acara Pihak Pria:</span>
                      <span>{formatDateIndo(evPria?.tanggal_acara || '')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                      <span className="text-stone-500">Total Budget 2 Acara:</span>
                      <strong className="text-stone-900">{formatRupiah(totalBudget)}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onSelectProject(proj)}
                    className="w-full py-2.5 rounded-xl bg-[#FAF0DE] hover:bg-[#F3ECE0] text-[#7A5729] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    Buka Detail Proyek Ini &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Clients & Team */}
      <div className="p-6 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-4">
        <h2 className="text-base font-bold font-serif-luxury text-stone-900">
          Database Klien &amp; Anggota Terdaftar
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF7F2] text-stone-400 font-bold uppercase text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-4">Nama User</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Role Akses</th>
                <th className="py-2.5 px-4">Kontak Telp</th>
                <th className="py-2.5 px-4">Tanggal Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {users.map(u => (
                <tr key={u.user_id}>
                  <td className="py-3 px-4 font-semibold text-stone-900 flex items-center gap-2">
                    <img 
                      src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                      alt="" 
                      className="w-6 h-6 rounded-full object-cover" 
                    />
                    {u.nama}
                  </td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 font-semibold text-stone-700">
                      {u.role_display || u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">{u.phone || '-'}</td>
                  <td className="py-3 px-4 text-stone-400">{formatDateIndo(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
