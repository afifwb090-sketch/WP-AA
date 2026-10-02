export type UserRole = 'admin' | 'client' | 'family' | 'vendor';

export type SideType = 'WANITA' | 'PRIA';

export interface User {
  user_id: string;
  nama: string;
  email: string;
  role: UserRole;
  role_display?: string;
  phone?: string;
  created_at: string;
  avatar_url?: string;
  assigned_wedding_id?: string;
}

export interface WeddingProject {
  wedding_id: string;
  nama_pasangan_pria: string;
  nama_pasangan_wanita: string;
  tanggal_mulai_project: string;
  status_project: 'Active' | 'Planning' | 'Completed' | 'Archived';
  konsep_pernikahan: string;
  created_at: string;
  cover_image?: string;
  wedding_organizer?: string;
  notes?: string;
}

export interface EventSide {
  event_id: string;
  wedding_id: string;
  side_type: SideType;
  nama_acara: string;
  tanggal_acara: string;
  jam_acara: string;
  lokasi_acara: string;
  jumlah_tamu: number;
  budget_total: number;
  status: 'Planning' | 'Vendor Sourcing' | 'Ready' | 'Completed';
  venue_address?: string;
  theme_color?: string;
  description?: string;
}

export type BudgetCategory = 
  | 'Venue'
  | 'Catering'
  | 'Dekorasi'
  | 'Makeup'
  | 'Busana'
  | 'Dokumentasi'
  | 'Entertainment'
  | 'Undangan'
  | 'Souvenir'
  | 'Transportasi'
  | 'Lainnya';

export type PaymentStatus = 'Belum Bayar' | 'DP / Terbayar Sebagian' | 'Lunas';

export interface BudgetItem {
  budget_id: string;
  event_id: string;
  wedding_id: string;
  kategori: BudgetCategory;
  item: string;
  vendor: string;
  estimasi: number;
  real_cost: number;
  payment_status: PaymentStatus;
  payment_date?: string;
  amount_paid?: number;
  notes?: string;
}

export type TimelinePhase = 
  | '12_months'
  | '6_months'
  | '3_months'
  | '1_month'
  | '1_week'
  | 'day_h';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'On Progress' | 'Completed';

export interface ChecklistTask {
  task_id: string;
  event_id: string;
  wedding_id: string;
  task_name: string;
  category: string;
  timeline_phase: TimelinePhase;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_to?: string;
  reminder_notes?: string;
  completed_at?: string;
}

export type GuestCategory = 'VIP' | 'Keluarga' | 'Teman Kantor' | 'Sahabat' | 'Tetangga' | 'Lainnya';
export type RSVPStatus = 'Hadir' | 'Tidak Hadir' | 'Belum Konfirmasi';

export interface Guest {
  guest_id: string;
  event_id: string;
  wedding_id: string;
  nama_tamu: string;
  kategori: GuestCategory;
  nomor_hp: string;
  jumlah_orang: number;
  RSVP_status: RSVPStatus;
  table_number?: string;
  notes?: string;
}

export type VendorCategory = 
  | 'Wedding Organizer'
  | 'Venue'
  | 'Catering'
  | 'Decoration'
  | 'Photographer'
  | 'Videographer'
  | 'Makeup Artist'
  | 'Fashion'
  | 'Entertainment'
  | 'Invitation'
  | 'Souvenir'
  | 'Other';

export interface Vendor {
  vendor_id: string;
  nama_vendor: string;
  kategori: VendorCategory;
  kontak: string;
  alamat: string;
  harga: string;
  harga_numeric: number;
  portfolio: string;
  rating: number;
  instagram?: string;
  verified?: boolean;
}

export type BookingStatus = 'Planning' | 'Negotiation' | 'Booked' | 'Completed';

export interface VendorBooking {
  booking_id: string;
  event_id: string;
  wedding_id: string;
  vendor_id: string;
  nama_vendor: string;
  kategori: VendorCategory;
  tanggal_booking: string;
  harga: number;
  status: BookingStatus;
  notes?: string;
}

export interface RundownItem {
  rundown_id: string;
  event_id: string;
  wedding_id: string;
  waktu: string;
  kegiatan: string;
  lokasi: string;
  pic: string;
  status: 'Upcoming' | 'Ongoing' | 'Done';
  notes?: string;
}

export type DocumentType = 
  | 'Kontrak Vendor'
  | 'Invoice'
  | 'Bukti Pembayaran'
  | 'Dokumen Administrasi'
  | 'Proposal';

export interface DocumentItem {
  doc_id: string;
  wedding_id: string;
  event_id?: string;
  judul: string;
  tipe: DocumentType;
  file_name: string;
  file_size: string;
  drive_link: string;
  upload_date: string;
  uploaded_by: string;
}

export interface GasConfig {
  webAppUrl: string;
  enabled: boolean;
  sheetId?: string;
  lastSynced?: string;
}
