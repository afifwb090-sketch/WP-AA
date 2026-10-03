import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Crown, 
  Users, 
  UserCheck, 
  ChevronDown, 
  Plus, 
  Database, 
  Sparkles,
  Menu,
  X,
  Calendar,
  Layers
} from 'lucide-react';
import { User, WeddingProject, UserRole, SideType } from '../types';
import { apiService, SyncStatus } from '../services/apiService';

interface NavbarProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  activeProject: WeddingProject;
  projects: WeddingProject[];
  onProjectChange: (project: WeddingProject) => void;
  onOpenNewProject: () => void;
  onOpenGasDocs: () => void;
  selectedSideFilter: 'ALL' | 'WANITA' | 'PRIA';
  onSideFilterChange: (filter: 'ALL' | 'WANITA' | 'PRIA') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUserChange,
  activeProject,
  projects,
  onProjectChange,
  onOpenNewProject,
  onOpenGasDocs,
  selectedSideFilter,
  onSideFilterChange
}) => {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sync, setSync] = useState<SyncStatus>(apiService.getSyncStatus());
  useEffect(() => apiService.subscribeSync(setSync), []);

  const roles: { role: UserRole; title: string; badge: string; desc: string }[] = [
    { role: 'admin', title: 'Admin Wedding Organizer', badge: 'WO Admin', desc: 'Akses penuh seluruh project & vendor' },
    { role: 'client', title: 'Client / Pasangan Pengantin', badge: 'Pasangan', desc: 'Mengatur 2 acara, budget & checklist' },
    { role: 'family', title: 'Family Member (Keluarga)', badge: 'Keluarga', desc: 'Melihat info acara & bantu checklist' },
    { role: 'vendor', title: 'Vendor Partner', badge: 'Vendor', desc: 'Lihat project terkait & update progres' }
  ];

  const handleRoleSelect = (role: UserRole) => {
    const updated = apiService.switchRole(role);
    onUserChange(updated);
    setShowRoleDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EEDEC3] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B88E4B] via-[#CCA86E] to-[#EEDEC3] flex items-center justify-center text-white shadow-md shadow-[#B88E4B]/20">
              <Heart className="w-5 h-5 fill-white stroke-none" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-luxury text-lg sm:text-xl font-bold tracking-tight text-[#3A2E1A]">
                  Eternal Knot
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[#B88E4B]/15 text-[#9B7337] border border-[#CCA86E]/30">
                  Dual-Event
                </span>
              </div>
              <p className="text-[11px] text-[#7A6A58] hidden sm:block">
                Wedding Planner Management System
              </p>
            </div>
          </div>

          {/* Active Project Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs rounded-xl bg-white border border-[#DFC69C] hover:border-[#B88E4B] shadow-xs transition-all text-left"
            >
              <div className="hidden sm:block">
                <span className="text-[10px] text-[#9B7337] block uppercase font-bold tracking-wide">
                  Project Aktif
                </span>
                <span className="font-semibold text-stone-800 line-clamp-1 max-w-[140px] sm:max-w-[200px]">
                  {activeProject.nama_pasangan_pria} & {activeProject.nama_pasangan_wanita}
                </span>
              </div>
              <div className="sm:hidden font-semibold text-stone-800 text-xs">
                {activeProject.nama_pasangan_pria.split(' ')[0]} & {activeProject.nama_pasangan_wanita.split(' ')[0]}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            </button>

            {showProjectDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#EEDEC3] py-2 z-50 animate-scale-in">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Pilih Wedding Project
                </div>
                {projects.map(proj => (
                  <button
                    key={proj.wedding_id}
                    onClick={() => {
                      onProjectChange(proj);
                      setShowProjectDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                      proj.wedding_id === activeProject.wedding_id ? 'bg-[#FAF7F2] font-bold text-[#9B7337]' : 'text-stone-700'
                    }`}
                  >
                    <div>
                      <div>{proj.nama_pasangan_pria} & {proj.nama_pasangan_wanita}</div>
                      <div className="text-[10px] text-stone-400 font-normal">{proj.konsep_pernikahan}</div>
                    </div>
                    {proj.wedding_id === activeProject.wedding_id && (
                      <span className="w-2 h-2 rounded-full bg-[#B88E4B]" />
                    )}
                  </button>
                ))}

                <div className="border-t border-stone-100 mt-2 pt-2 px-2">
                  <button
                    onClick={() => {
                      setShowProjectDropdown(false);
                      onOpenNewProject();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#FAF7F2] hover:bg-[#F3ECE0] text-[#9B7337] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Buat Project Baru
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Dual-Event Filter Toggle */}
          <div className="hidden md:flex items-center bg-[#F3ECE0]/70 p-1 rounded-xl border border-[#DFC69C]/50 text-xs">
            <button
              onClick={() => onSideFilterChange('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedSideFilter === 'ALL'
                  ? 'bg-white text-[#9B7337] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua Acara
            </button>
            <button
              onClick={() => onSideFilterChange('WANITA')}
              className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                selectedSideFilter === 'WANITA'
                  ? 'bg-white text-rose-700 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Acara Pihak Wanita
            </button>
            <button
              onClick={() => onSideFilterChange('PRIA')}
              className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                selectedSideFilter === 'PRIA'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Acara Pihak Pria
            </button>
          </div>

          {/* Right Actions: GAS Docs & Role Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Google Apps Script / Sheet Button */}
            <button
              onClick={onOpenGasDocs}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#CCA86E] text-[#9B7337] hover:bg-[#FAF7F2] shadow-xs transition-all"
              title="Lihat Google Apps Script API & Database Google Sheets"
            >
              <Database className="w-3.5 h-3.5 text-[#B88E4B]" />
              <span className="hidden lg:inline">Backend & Sheets</span>
              {sync.state !== 'off' && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    sync.state === 'error' ? 'bg-red-500' : sync.state === 'syncing' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
                  }`}
                  title={sync.state === 'error' ? `Gagal sinkron: ${sync.error || ''}` : sync.state === 'syncing' ? 'Menyinkronkan...' : `Tersinkron${sync.pending ? ` (${sync.pending} tertunda)` : ''}`}
                />
              )}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#EEDEC3] shadow-xs transition-all"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.nama}
                  className="w-7 h-7 rounded-full object-cover border border-[#CCA86E]"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">
                    Role Login
                  </div>
                  <div className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    {currentUser.role_display || currentUser.role}
                    <ChevronDown className="w-3 h-3 text-stone-400" />
                  </div>
                </div>
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-[#EEDEC3] py-2 z-50">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B7337]">
                      Simulasi Hak Akses (Role Based)
                    </p>
                    <p className="text-xs font-semibold text-stone-800 mt-0.5">
                      {currentUser.nama}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {currentUser.email}
                    </p>
                  </div>

                  <div className="py-1">
                    {roles.map(r => (
                      <button
                        key={r.role}
                        onClick={() => handleRoleSelect(r.role)}
                        className={`w-full text-left px-4 py-2 text-xs flex items-start gap-2.5 hover:bg-[#FAF7F2] transition-colors ${
                          currentUser.role === r.role ? 'bg-[#FAF7F2] text-[#9B7337] font-bold' : 'text-stone-700'
                        }`}
                      >
                        <UserCheck className={`w-4 h-4 mt-0.5 shrink-0 ${currentUser.role === r.role ? 'text-[#B88E4B]' : 'text-stone-400'}`} />
                        <div>
                          <div className="font-semibold">{r.title}</div>
                          <div className="text-[10px] text-stone-500 font-normal">{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Quick Dual Filter Bar */}
        <div className="md:hidden py-2 border-t border-[#EEDEC3]/60 flex items-center justify-between text-xs overflow-x-auto gap-2">
          <span className="text-[11px] font-semibold text-stone-500 shrink-0">Filter:</span>
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => onSideFilterChange('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                selectedSideFilter === 'ALL' ? 'bg-[#B88E4B] text-white font-bold' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              Semua Acara
            </button>
            <button
              onClick={() => onSideFilterChange('WANITA')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                selectedSideFilter === 'WANITA' ? 'bg-rose-600 text-white font-bold' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              Pihak Wanita
            </button>
            <button
              onClick={() => onSideFilterChange('PRIA')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                selectedSideFilter === 'PRIA' ? 'bg-blue-600 text-white font-bold' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              Pihak Pria
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
