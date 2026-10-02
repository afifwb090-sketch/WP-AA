import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Wallet, 
  CheckSquare, 
  Users, 
  Store, 
  Clock, 
  FolderLock, 
  Receipt, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab = 
  | 'dashboard'
  | 'events'
  | 'budget'
  | 'checklist'
  | 'guests'
  | 'vendors'
  | 'rundown'
  | 'documents'
  | 'payments'
  | 'admin';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userRole: UserRole;
  completedTasksCount: number;
  totalTasksCount: number;
  pendingGuestsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  userRole,
  completedTasksCount,
  totalTasksCount,
  pendingGuestsCount
}) => {
  const menuItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    roles?: UserRole[];
    accent?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'events',
      label: 'Wedding Events (2 Sisi)',
      icon: CalendarDays,
      badge: 'Wanita & Pria'
    },
    {
      id: 'budget',
      label: 'Dual Budget Management',
      icon: Wallet
    },
    {
      id: 'checklist',
      label: 'Checklist Persiapan',
      icon: CheckSquare,
      badge: `${completedTasksCount}/${totalTasksCount}`
    },
    {
      id: 'guests',
      label: 'Guest & RSVP',
      icon: Users,
      badge: pendingGuestsCount > 0 ? `${pendingGuestsCount} rsvp` : undefined
    },
    {
      id: 'vendors',
      label: 'Vendor & Booking',
      icon: Store
    },
    {
      id: 'rundown',
      label: 'Timeline & Rundown H',
      icon: Clock
    },
    {
      id: 'documents',
      label: 'Dokumen & Google Drive',
      icon: FolderLock
    },
    {
      id: 'payments',
      label: 'Payment Tracking',
      icon: Receipt
    },
    {
      id: 'admin',
      label: 'Admin WO Panel',
      icon: ShieldCheck,
      badge: 'WO Only'
    }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white/70 lg:bg-[#FFFDF9]/90 border-r border-[#EEDEC3] p-4 lg:min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#9B7337]">
          Navigasi Modul
        </div>

        <nav className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FAF0DE] to-[#F7EFE1] text-[#7A5729] font-bold shadow-xs border border-[#DFC69C]/60'
                    : 'text-stone-600 hover:bg-[#FAF7F2] hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#B88E4B]' : 'text-stone-400 group-hover:text-stone-600'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-[#B88E4B] text-white'
                      : 'bg-stone-100 text-stone-600 group-hover:bg-[#EEDEC3] group-hover:text-stone-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mini Banner at bottom */}
      <div className="mt-6 pt-4 border-t border-[#EEDEC3] text-center hidden lg:block">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F7EFE1] border border-[#DFC69C]/40 text-left">
          <div className="text-[11px] font-bold text-[#674E28] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Dual-Event Synchronized
          </div>
          <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">
            Acara Wanita &amp; Acara Pria dikelola mandiri dalam 1 wedding project.
          </p>
        </div>
      </div>
    </aside>
  );
};
