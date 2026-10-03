import {
  User,
  WeddingProject,
  EventSide,
  BudgetItem,
  ChecklistTask,
  Guest,
  Vendor,
  VendorBooking,
  RundownItem,
  DocumentItem
} from '../types';

// Akun bawaan hanya sebagai penanda peran (role). Ubah/hapus sesuai kebutuhan.
export const initialUsers: User[] = [
  {
    user_id: 'user-admin-01',
    nama: 'Admin',
    email: 'admin@example.com',
    role: 'admin',
    role_display: 'Admin Wedding Organizer',
    created_at: '2026-01-01'
  },
  {
    user_id: 'user-client-01',
    nama: 'Client',
    email: 'client@example.com',
    role: 'client',
    role_display: 'Pasangan Pengantin (Client)',
    created_at: '2026-01-01'
  },
  {
    user_id: 'user-family-01',
    nama: 'Family',
    email: 'family@example.com',
    role: 'family',
    role_display: 'Family Member',
    created_at: '2026-01-01'
  },
  {
    user_id: 'user-vendor-01',
    nama: 'Vendor',
    email: 'vendor@example.com',
    role: 'vendor',
    role_display: 'Vendor Partner',
    created_at: '2026-01-01'
  }
];

// Semua data lain dimulai kosong — isi manual lewat aplikasi.
export const initialProjects: WeddingProject[] = [];
export const initialEvents: EventSide[] = [];
export const initialBudgets: BudgetItem[] = [];
export const initialTasks: ChecklistTask[] = [];
export const initialGuests: Guest[] = [];
export const initialVendors: Vendor[] = [];
export const initialBookings: VendorBooking[] = [];
export const initialRundowns: RundownItem[] = [];
export const initialDocuments: DocumentItem[] = [];
