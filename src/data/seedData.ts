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

export const initialUsers: User[] = [
  {
    user_id: 'user-admin-01',
    nama: 'Rina Suryani, S.Sn.',
    email: 'admin@royalharmony.id',
    role: 'admin',
    role_display: 'Admin Wedding Organizer',
    phone: '0812-8899-7711',
    created_at: '2026-01-10',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    user_id: 'user-client-01',
    nama: 'Andi Pratama & Sinta Maharani',
    email: 'andi.sinta@gmail.com',
    role: 'client',
    role_display: 'Pasangan Pengantin (Client)',
    phone: '0813-2233-4455',
    created_at: '2026-02-01',
    assigned_wedding_id: 'wedding-001',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    user_id: 'user-family-01',
    nama: 'Bambang Sudiro (Paman Sinta)',
    email: 'bambang.family@gmail.com',
    role: 'family',
    role_display: 'Family Member (Pihak Wanita)',
    phone: '0811-9988-7766',
    created_at: '2026-02-15',
    assigned_wedding_id: 'wedding-001',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    user_id: 'user-vendor-01',
    nama: 'Kinarya Catering & Decor',
    email: 'partner@kinaryacatering.com',
    role: 'vendor',
    role_display: 'Vendor Partner',
    phone: '0815-4433-2211',
    created_at: '2026-01-20',
    assigned_wedding_id: 'wedding-001',
    avatar_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialProjects: WeddingProject[] = [
  {
    wedding_id: 'wedding-001',
    nama_pasangan_pria: 'Andi Pratama',
    nama_pasangan_wanita: 'Sinta Maharani',
    tanggal_mulai_project: '2026-02-01',
    status_project: 'Active',
    konsep_pernikahan: 'Modern Javanese Luxury & Romantic Champagne',
    created_at: '2026-02-01',
    wedding_organizer: 'Royal Harmony Wedding Organizer',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
    notes: 'Pernikahan dua keluarga besar dengan adat Jawa klasik dipadu nuansa modern ballroom.'
  },
  {
    wedding_id: 'wedding-002',
    nama_pasangan_pria: 'Dimas Anggara',
    nama_pasangan_wanita: 'Amanda Rawles',
    tanggal_mulai_project: '2026-03-10',
    status_project: 'Planning',
    konsep_pernikahan: 'Whimsical Garden & Minimalist Elegance',
    created_at: '2026-03-10',
    wedding_organizer: 'Royal Harmony Wedding Organizer',
    cover_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80',
    notes: 'Konsep outdoor intimate untuk pihak wanita di Bandung, dan grand dinner untuk pihak pria di Jakarta.'
  }
];

export const initialEvents: EventSide[] = [
  {
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    side_type: 'WANITA',
    nama_acara: 'Akad Nikah & Resepsi Pihak Sinta',
    tanggal_acara: '2027-01-10',
    jam_acara: '08:00 - 14:00 WIB',
    lokasi_acara: 'Sasana Kriya Grand Ballroom, TMII, Jakarta Timur',
    jumlah_tamu: 600,
    budget_total: 175000000,
    status: 'Ready',
    venue_address: 'Kompleks TMII, Jl. Raya Pintu 1 TMII, Jakarta Timur',
    theme_color: 'Champagne Ivory & Soft Rose',
    description: 'Rangkaian prosesi akad nikah adat Jawa dilanjutkan resepsi siang hari untuk keluarga mempelai wanita.'
  },
  {
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    side_type: 'PRIA',
    nama_acara: 'Ngunduh Mantu & Resepsi Pihak Andi',
    tanggal_acara: '2027-01-15',
    jam_acara: '11:00 - 16:00 WIB',
    lokasi_acara: 'Balai Samudera Grand Hall, Kelapa Gading, Jakarta Utara',
    jumlah_tamu: 800,
    budget_total: 220000000,
    status: 'Planning',
    venue_address: 'Jl. Boulevard Barat Raya No. 1, Kelapa Gading, Jakarta Utara',
    theme_color: 'Navy Royal Gold & Classic White',
    description: 'Upacara Ngunduh Mantu keluarga besar pihak pria dengan jamuan makan siang prasmanan nusantara.'
  },
  {
    event_id: 'event-wanita-002',
    wedding_id: 'wedding-002',
    side_type: 'WANITA',
    nama_acara: 'Garden Wedding & High Tea Pihak Amanda',
    tanggal_acara: '2027-04-18',
    jam_acara: '15:30 - 20:00 WIB',
    lokasi_acara: 'Gedong Putih, Lembang, Bandung',
    jumlah_tamu: 350,
    budget_total: 150000000,
    status: 'Planning',
    venue_address: 'Jl. Villa Triniti KM 4.7, Lembang, Bandung Barat'
  },
  {
    event_id: 'event-pria-002',
    wedding_id: 'wedding-002',
    side_type: 'PRIA',
    nama_acara: 'Grand Evening Banquet Pihak Dimas',
    tanggal_acara: '2027-04-25',
    jam_acara: '18:30 - 22:00 WIB',
    lokasi_acara: 'The Ritz-Carlton Ballroom, Pacific Place Jakarta',
    jumlah_tamu: 700,
    budget_total: 260000000,
    status: 'Planning',
    venue_address: 'Sudirman Central Business District (SCBD), Jakarta Selatan'
  }
];

export const initialBudgets: BudgetItem[] = [
  // --- ACARA WANITA (Total Est: 175M, Real Cost tracked) ---
  {
    budget_id: 'b-w-01',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    kategori: 'Venue',
    item: 'Sewa Gedung Sasana Kriya Ballroom (6 jam)',
    vendor: 'Sasana Kriya Management',
    estimasi: 45000000,
    real_cost: 45000000,
    payment_status: 'Lunas',
    payment_date: '2026-03-01',
    amount_paid: 45000000,
    notes: 'Termasuk AC, sound system standar, 2 ruang rias VIP'
  },
  {
    budget_id: 'b-w-02',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    kategori: 'Catering',
    item: 'Paket Buffet Premium 600 Porsi + 5 Food Stalls',
    vendor: 'Kinarya Catering',
    estimasi: 55000000,
    real_cost: 58000000,
    payment_status: 'DP / Terbayar Sebagian',
    payment_date: '2026-04-15',
    amount_paid: 30000000,
    notes: 'Penambahan stall kambing guling 2 ekor (+3jt)'
  },
  {
    budget_id: 'b-w-03',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    kategori: 'Dekorasi',
    item: 'Pelaminan Adat Jawa Modifikasi & Gazebo Bunga Asli',
    vendor: 'Griya Palasari Decor',
    estimasi: 28000000,
    real_cost: 27000000,
    payment_status: 'DP / Terbayar Sebagian',
    payment_date: '2026-05-10',
    amount_paid: 15000000,
    notes: 'Termasuk walkway carpet, photobooth 3D & janur kembar mayang'
  },
  {
    budget_id: 'b-w-04',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    kategori: 'Makeup',
    item: 'MUA Pengantin Wanita (Akad + Resepsi) & 2 Ibu',
    vendor: 'Khadijah Azzahra Studio',
    estimasi: 15000000,
    real_cost: 15000000,
    payment_status: 'Lunas',
    payment_date: '2026-03-20',
    amount_paid: 15000000,
    notes: 'MUA utama + paes ageng adat Jawa'
  },
  {
    budget_id: 'b-w-05',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    kategori: 'Busana',
    item: 'Kebaya Akad & Busana Resepsi Pengantin Wanita + Beskap Pria',
    vendor: 'Ansoe Kebaya Atelier',
    estimasi: 12000000,
    real_cost: 11500000,
    payment_status: 'DP / Terbayar Sebagian',
    payment_date: '2026-05-02',
    amount_paid: 6000000,
    notes: 'Sewa perdana motif lurik emas beludru'
  },
  {
    budget_id: 'b-w-06',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    kategori: 'Dokumentasi',
    item: 'Foto & Video Cinematic Akad + Resepsi + Drone',
    vendor: 'The Leonardi Photo & Cinema',
    estimasi: 14000000,
    real_cost: 14000000,
    payment_status: 'Belum Bayar',
    payment_date: '',
    amount_paid: 0,
    notes: 'Termasuk teaser H+3 dan wedding book premium 30x40'
  },
  {
    budget_id: 'b-w-07',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    kategori: 'Undangan',
    item: 'Cetak Hardcover Gold Foil 350 eks + Web E-Invitation',
    vendor: 'Royal Paperie Indonesia',
    estimasi: 4500000,
    real_cost: 4200000,
    payment_status: 'Lunas',
    payment_date: '2026-06-12',
    amount_paid: 4200000,
    notes: 'Sudah selesai proses cetak'
  },
  {
    budget_id: 'b-w-08',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    kategori: 'Souvenir',
    item: 'Custom Aroma Diffuser & Silk Pouch 400 pcs',
    vendor: 'Scent & Co. Favors',
    estimasi: 5500000,
    real_cost: 5200000,
    payment_status: 'Lunas',
    payment_date: '2026-06-18',
    amount_paid: 5200000,
    notes: 'Packing rapi pita champagne'
  },

  // --- ACARA PRIA (Total Est: 220M) ---
  {
    budget_id: 'b-p-01',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    kategori: 'Venue',
    item: 'Sewa Balai Samudera Grand Hall (Full Day)',
    vendor: 'Balai Samudera Management',
    estimasi: 65000000,
    real_cost: 65000000,
    payment_status: 'DP / Terbayar Sebagian',
    payment_date: '2026-03-15',
    amount_paid: 32500000,
    notes: 'DP 50% sudah dibayar, pelunasan H-30'
  },
  {
    budget_id: 'b-p-02',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    kategori: 'Catering',
    item: 'Buffet 800 Porsi + 8 Gubukan Spesial Nusantara',
    vendor: 'Puspa Catering Services',
    estimasi: 80000000,
    real_cost: 82000000,
    payment_status: 'DP / Terbayar Sebagian',
    payment_date: '2026-04-10',
    amount_paid: 40000000,
    notes: 'Menu dendeng balado, sup tom yam, siomay bandung'
  },
  {
    budget_id: 'b-p-03',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    kategori: 'Dekorasi',
    item: 'Dekorasi Ngunduh Mantu Megah Navy Gold 18 Meter',
    vendor: 'Stupa Casavabio Decor',
    estimasi: 35000000,
    real_cost: 35000000,
    payment_status: 'Belum Bayar',
    payment_date: '',
    amount_paid: 0,
    notes: 'Menunggu final approval layout panggung'
  },
  {
    budget_id: 'b-p-04',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    kategori: 'Entertainment',
    item: 'Grand Akustik Orchestra + MC Nasional',
    vendor: 'David Entertainment Group',
    estimasi: 18000000,
    real_cost: 17500000,
    payment_status: 'DP / Terbayar Sebagian',
    payment_date: '2026-05-18',
    amount_paid: 8000000,
    notes: '7 musicians, 2 singers & sound engineer'
  },
  {
    budget_id: 'b-p-05',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    kategori: 'Dokumentasi',
    item: 'Photo, Multi-camera Live Streaming & Photobooth Unlimited',
    vendor: 'Max Pictures & Studio',
    estimasi: 16000000,
    real_cost: 16000000,
    payment_status: 'DP / Terbayar Sebagian',
    payment_date: '2026-05-25',
    amount_paid: 5000000,
    notes: 'Live streaming YouTube private untuk kerabat luar kota'
  },
  {
    budget_id: 'b-p-06',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    kategori: 'Transportasi',
    item: 'Sewa 4 Mobil Alphard & 1 Bus Pariwisata Rombongan Keluarga',
    vendor: 'Blue Bird Luxury Rental',
    estimasi: 9000000,
    real_cost: 8500000,
    payment_status: 'Belum Bayar',
    payment_date: '',
    amount_paid: 0,
    notes: 'Untuk antar-jemput keluarga besar dari hotel ke venue'
  }
];

export const initialTasks: ChecklistTask[] = [
  // --- TASKS ACARA WANITA ---
  {
    task_id: 'task-w-01',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    task_name: 'Tentukan Konsep Akad & Resepsi Pihak Wanita',
    category: 'Konsep',
    timeline_phase: '12_months',
    deadline: '2026-02-28',
    priority: 'High',
    status: 'Completed',
    assigned_to: 'Sinta & Rina WO',
    reminder_notes: 'Disepakati: Adat Jawa modifikasi warna champagne rose'
  },
  {
    task_id: 'task-w-02',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    task_name: 'Booking & Pelunasan DP Venue Sasana Kriya TMII',
    category: 'Venue',
    timeline_phase: '12_months',
    deadline: '2026-03-05',
    priority: 'High',
    status: 'Completed',
    assigned_to: 'Keluarga Sinta',
    reminder_notes: 'Tanggal 10 Januari 2027 telah terkunci'
  },
  {
    task_id: 'task-w-03',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    task_name: 'Food Tasting & Finalisasi Menu Catering Kinarya',
    category: 'Catering',
    timeline_phase: '6_months',
    deadline: '2026-07-15',
    priority: 'High',
    status: 'Completed',
    assigned_to: 'Sinta & Ibu',
    reminder_notes: 'Pilihan sop buntut, lidah lada hitam & es puter kelapa'
  },
  {
    task_id: 'task-w-04',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    task_name: 'Booking Vendor Dekorasi & Review Moodboard 3D',
    category: 'Dekorasi',
    timeline_phase: '6_months',
    deadline: '2026-08-01',
    priority: 'Medium',
    status: 'Completed',
    assigned_to: 'Rina WO',
    reminder_notes: 'Layout panggung disetujui orang tua'
  },
  {
    task_id: 'task-w-05',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    task_name: 'First Fitting Busana Kebaya Akad & Resepsi',
    category: 'Busana',
    timeline_phase: '3_months',
    deadline: '2026-10-10',
    priority: 'High',
    status: 'On Progress',
    assigned_to: 'Sinta & Desainer',
    reminder_notes: 'Jadwal fitting kedua awal November 2026'
  },
  {
    task_id: 'task-w-06',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    task_name: 'Pemberkasan KUA & Surat Numpang Nikah',
    category: 'Administrasi',
    timeline_phase: '3_months',
    deadline: '2026-11-01',
    priority: 'High',
    status: 'On Progress',
    assigned_to: 'Pak Bambang (Family)',
    reminder_notes: 'KUA Makasar Jakarta Timur, surat pengantar RT/RW siap'
  },
  {
    task_id: 'task-w-07',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    task_name: 'Distribusi Undangan Fisik & E-Invitation Pihak Sinta',
    category: 'Undangan',
    timeline_phase: '1_month',
    deadline: '2026-12-10',
    priority: 'High',
    status: 'Pending',
    assigned_to: 'Family Committee',
    reminder_notes: 'Kirim via kurir untuk tamu VIP & WhatsApp blast'
  },
  {
    task_id: 'task-w-08',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    task_name: 'Technical Meeting Seluruh Vendor & Pengelola Venue',
    category: 'Koordinasi',
    timeline_phase: '1_month',
    deadline: '2026-12-20',
    priority: 'High',
    status: 'Pending',
    assigned_to: 'Rina WO & All Vendors',
    reminder_notes: 'Briefing rundown, loading in jam 22.00 H-1'
  },
  {
    task_id: 'task-w-09',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    task_name: 'Gladi Resik & Serah Terima Mahar / Mas Kawin',
    category: 'Hari H',
    timeline_phase: '1_week',
    deadline: '2027-01-08',
    priority: 'High',
    status: 'Pending',
    assigned_to: 'Andi, Sinta & Saksi',
    reminder_notes: 'Cek kelengkapan buku nikah & kotak mahar'
  },

  // --- TASKS ACARA PRIA ---
  {
    task_id: 'task-p-01',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    task_name: 'Booking Balai Samudera Kelapa Gading untuk Acara Pria',
    category: 'Venue',
    timeline_phase: '12_months',
    deadline: '2026-03-15',
    priority: 'High',
    status: 'Completed',
    assigned_to: 'Keluarga Andi',
    reminder_notes: 'Kapasitas s/d 1000 pax'
  },
  {
    task_id: 'task-p-02',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    task_name: 'Pilih Vendor Catering Pihak Pria (Puspa Catering)',
    category: 'Catering',
    timeline_phase: '6_months',
    deadline: '2026-07-20',
    priority: 'High',
    status: 'Completed',
    assigned_to: 'Ibu Andi',
    reminder_notes: 'Menu 800 porsi telah dikonfirmasi'
  },
  {
    task_id: 'task-p-03',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    task_name: 'Pilih Master of Ceremony (MC) & Music Entertainment',
    category: 'Entertainment',
    timeline_phase: '6_months',
    deadline: '2026-08-15',
    priority: 'Medium',
    status: 'Completed',
    assigned_to: 'Andi & Rina WO',
    reminder_notes: 'David Entertainment Group & MC Sonny'
  },
  {
    task_id: 'task-p-04',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    task_name: 'Fitting Jas Groom & Beskap Keluarga Pria',
    category: 'Busana',
    timeline_phase: '3_months',
    deadline: '2026-10-25',
    priority: 'Medium',
    status: 'On Progress',
    assigned_to: 'Andi Pratama',
    reminder_notes: 'Warna Navy Royal & Gold accents'
  },
  {
    task_id: 'task-p-05',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    task_name: 'Pengaturan Transportasi & Penginapan Kerabat Pria',
    category: 'Logistik',
    timeline_phase: '1_month',
    deadline: '2026-12-15',
    priority: 'Medium',
    status: 'Pending',
    assigned_to: 'Keluarga Andi',
    reminder_notes: 'Booking 10 kamar hotel dekat venue'
  },
  {
    task_id: 'task-p-06',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    task_name: 'Final Rundown Upacara Adat Ngunduh Mantu',
    category: 'Rundown',
    timeline_phase: '1_month',
    deadline: '2026-12-28',
    priority: 'High',
    status: 'Pending',
    assigned_to: 'Rina WO & Sesepuh Pria',
    reminder_notes: 'Prosesi boyong temanten jam 11.30 WIB'
  }
];

export const initialGuests: Guest[] = [
  // --- TAMU ACARA WANITA ---
  {
    guest_id: 'g-w-01',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'Prof. Dr. Ir. Hari Nugroho, M.Sc (Rektor)',
    kategori: 'VIP',
    nomor_hp: '0812-1111-2233',
    jumlah_orang: 2,
    RSVP_status: 'Hadir',
    table_number: 'VIP-01',
    notes: 'Dosen pembimbing Sinta'
  },
  {
    guest_id: 'g-w-02',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'Drs. H. Mulyadi & Ibu (Keluarga Besar Solo)',
    kategori: 'Keluarga',
    nomor_hp: '0813-9988-7766',
    jumlah_orang: 4,
    RSVP_status: 'Hadir',
    table_number: 'FAM-01',
    notes: 'Keluarga paman dari pihak Ibu'
  },
  {
    guest_id: 'g-w-03',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'Tim Product & Design Telkomsel',
    kategori: 'Teman Kantor',
    nomor_hp: '0812-4455-6677',
    jumlah_orang: 15,
    RSVP_status: 'Hadir',
    table_number: 'CORP-01',
    notes: 'Rekan kerja sekantor Sinta'
  },
  {
    guest_id: 'g-w-04',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'Natasha Wijaya, S.Kom (Sahabat Kampus)',
    kategori: 'Sahabat',
    nomor_hp: '0818-0909-8877',
    jumlah_orang: 2,
    RSVP_status: 'Hadir',
    table_number: 'BRIDE-01',
    notes: 'Bridesmaid mempelai wanita'
  },
  {
    guest_id: 'g-w-05',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'Bapak RW 05 & Tokoh Masyarakat Kalibata',
    kategori: 'Tetangga',
    nomor_hp: '0857-1234-5678',
    jumlah_orang: 6,
    RSVP_status: 'Belum Konfirmasi',
    table_number: 'COM-02',
    notes: 'Undangan fisik sudah diantar'
  },
  {
    guest_id: 'g-w-06',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'Alumni SMA 8 Jakarta Angkatan 2016',
    kategori: 'Sahabat',
    nomor_hp: '0813-7766-5544',
    jumlah_orang: 12,
    RSVP_status: 'Belum Konfirmasi',
    table_number: 'ALUM-01'
  },

  // --- TAMU ACARA PRIA ---
  {
    guest_id: 'g-p-01',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'Direktur Utama Bank Mandiri & Dewan Direksi',
    kategori: 'VIP',
    nomor_hp: '0811-3322-1100',
    jumlah_orang: 4,
    RSVP_status: 'Hadir',
    table_number: 'VIP-A1',
    notes: 'Pimpinan tempat Ayah Andi bertugas'
  },
  {
    guest_id: 'g-p-02',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'Keluarga Besar Trah Mangkunegaran Semarang',
    kategori: 'Keluarga',
    nomor_hp: '0812-6655-4433',
    jumlah_orang: 20,
    RSVP_status: 'Hadir',
    table_number: 'FAM-GROOM-01',
    notes: 'Rombongan bus dari Semarang'
  },
  {
    guest_id: 'g-p-03',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'Komunitas Sepeda Brompton Jakarta',
    kategori: 'Sahabat',
    nomor_hp: '0817-5544-3322',
    jumlah_orang: 10,
    RSVP_status: 'Belum Konfirmasi',
    table_number: 'HOBBY-01'
  },
  {
    guest_id: 'g-p-04',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'Jajaran Manajemen PT Astra International',
    kategori: 'Teman Kantor',
    nomor_hp: '0812-9900-1122',
    jumlah_orang: 8,
    RSVP_status: 'Hadir',
    table_number: 'CORP-G1',
    notes: 'Kolega kantor Andi'
  },
  {
    guest_id: 'g-p-05',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    nama_tamu: 'dr. Hendra Sp.A & Keluarga (Sahabat Masa Kecil)',
    kategori: 'Sahabat',
    nomor_hp: '0819-0102-0304',
    jumlah_orang: 3,
    RSVP_status: 'Hadir',
    table_number: 'GROOM-02'
  }
];

export const initialVendors: Vendor[] = [
  {
    vendor_id: 'v-001',
    nama_vendor: 'Royal Harmony Wedding Organizer',
    kategori: 'Wedding Organizer',
    kontak: '0812-8899-7711',
    alamat: 'Jl. Wijaya II No. 45, Kebayoran Baru, Jakarta Selatan',
    harga: 'Rp 25.000.000',
    harga_numeric: 25000000,
    portfolio: 'https://royalharmony.id/portfolio',
    rating: 4.9,
    instagram: '@royalharmony_wo',
    verified: true
  },
  {
    vendor_id: 'v-002',
    nama_vendor: 'Sasana Kriya TMII',
    kategori: 'Venue',
    kontak: '021-87792070',
    alamat: 'Taman Mini Indonesia Indah, Jakarta Timur',
    harga: 'Rp 45.000.000',
    harga_numeric: 45000000,
    portfolio: 'https://sasanakriya.id',
    rating: 4.8,
    instagram: '@sasanakriya',
    verified: true
  },
  {
    vendor_id: 'v-003',
    nama_vendor: 'Balai Samudera',
    kategori: 'Venue',
    kontak: '021-45851700',
    alamat: 'Jl. Boulevard Barat Raya No. 1, Kelapa Gading, Jakarta Utara',
    harga: 'Rp 65.000.000',
    harga_numeric: 65000000,
    portfolio: 'https://balaisamudera.com',
    rating: 4.9,
    instagram: '@balaisamudera_official',
    verified: true
  },
  {
    vendor_id: 'v-004',
    nama_vendor: 'Kinarya Catering & Event',
    kategori: 'Catering',
    kontak: '0815-4433-2211',
    alamat: 'Jl. Tebet Barat Dalam Raya No. 88, Jakarta Selatan',
    harga: 'Rp 95.000 / pax',
    harga_numeric: 58000000,
    portfolio: 'https://kinaryacatering.com',
    rating: 4.9,
    instagram: '@kinaryacatering',
    verified: true
  },
  {
    vendor_id: 'v-005',
    nama_vendor: 'Puspa Catering Services',
    kategori: 'Catering',
    kontak: '021-7988383',
    alamat: 'Jl. Pancoran Timur III No. 99, Jakarta Selatan',
    harga: 'Rp 105.000 / pax',
    harga_numeric: 82000000,
    portfolio: 'https://puspacatering.com',
    rating: 4.8,
    instagram: '@puspacatering',
    verified: true
  },
  {
    vendor_id: 'v-006',
    nama_vendor: 'Griya Palasari Decor',
    kategori: 'Decoration',
    kontak: '0811-2345-6789',
    alamat: 'Jl. Gandaria I No. 12, Jakarta Selatan',
    harga: 'Rp 27.000.000',
    harga_numeric: 27000000,
    portfolio: 'https://griyapalasari.com',
    rating: 4.9,
    instagram: '@griyapalasari_decor',
    verified: true
  },
  {
    vendor_id: 'v-007',
    nama_vendor: 'The Leonardi Photo & Cinema',
    kategori: 'Photographer',
    kontak: '0812-7000-8000',
    alamat: 'Jl. Senopati No. 64, Jakarta Selatan',
    harga: 'Rp 14.000.000',
    harga_numeric: 14000000,
    portfolio: 'https://theleonardi.com',
    rating: 5.0,
    instagram: '@theleonardi',
    verified: true
  },
  {
    vendor_id: 'v-008',
    nama_vendor: 'Khadijah Azzahra MUA Studio',
    kategori: 'Makeup Artist',
    kontak: '0813-8877-6655',
    alamat: 'Pondok Indah Plaza II, Jakarta Selatan',
    harga: 'Rp 15.000.000',
    harga_numeric: 15000000,
    portfolio: 'https://khadijahazzahra.id',
    rating: 4.9,
    instagram: '@khadijahazzahra_makeup',
    verified: true
  },
  {
    vendor_id: 'v-009',
    nama_vendor: 'David Entertainment Group',
    kategori: 'Entertainment',
    kontak: '0818-3344-5566',
    alamat: 'Jl. Kemang Raya No. 10B, Jakarta Selatan',
    harga: 'Rp 18.000.000',
    harga_numeric: 18000000,
    portfolio: 'https://davidentertainment.id',
    rating: 4.8,
    instagram: '@davidentertainment_id',
    verified: true
  },
  {
    vendor_id: 'v-010',
    nama_vendor: 'Royal Paperie Indonesia',
    kategori: 'Invitation',
    kontak: '0812-9911-2233',
    alamat: 'Grogol Petamburan, Jakarta Barat',
    harga: 'Rp 12.000 / pcs',
    harga_numeric: 4200000,
    portfolio: 'https://royalpaperie.id',
    rating: 4.7,
    instagram: '@royalpaperie',
    verified: true
  }
];

export const initialBookings: VendorBooking[] = [
  {
    booking_id: 'book-01',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    vendor_id: 'v-002',
    nama_vendor: 'Sasana Kriya TMII',
    kategori: 'Venue',
    tanggal_booking: '2026-03-01',
    harga: 45000000,
    status: 'Booked',
    notes: 'Acara Pihak Wanita - Tanggal 10 Jan 2027'
  },
  {
    booking_id: 'book-02',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    vendor_id: 'v-004',
    nama_vendor: 'Kinarya Catering & Event',
    kategori: 'Catering',
    tanggal_booking: '2026-04-15',
    harga: 58000000,
    status: 'Booked',
    notes: '600 Pax + 5 Stalls'
  },
  {
    booking_id: 'book-03',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    vendor_id: 'v-008',
    nama_vendor: 'Khadijah Azzahra MUA Studio',
    kategori: 'Makeup Artist',
    tanggal_booking: '2026-03-20',
    harga: 15000000,
    status: 'Booked',
    notes: 'Akad + Resepsi Adat Jawa Paes'
  },
  {
    booking_id: 'book-04',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    vendor_id: 'v-003',
    nama_vendor: 'Balai Samudera',
    kategori: 'Venue',
    tanggal_booking: '2026-03-15',
    harga: 65000000,
    status: 'Booked',
    notes: 'Acara Pihak Pria - Tanggal 15 Jan 2027'
  },
  {
    booking_id: 'book-05',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    vendor_id: 'v-005',
    nama_vendor: 'Puspa Catering Services',
    kategori: 'Catering',
    tanggal_booking: '2026-04-10',
    harga: 82000000,
    status: 'Booked',
    notes: '800 Pax Pihak Pria'
  },
  {
    booking_id: 'book-06',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    vendor_id: 'v-009',
    nama_vendor: 'David Entertainment Group',
    kategori: 'Entertainment',
    tanggal_booking: '2026-05-18',
    harga: 17500000,
    status: 'Booked',
    notes: 'Grand Acoustic Ensemble'
  }
];

export const initialRundowns: RundownItem[] = [
  // --- RUNDOWN WANITA (Akad & Resepsi) ---
  {
    rundown_id: 'rd-w-01',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    waktu: '05:00 - 07:30',
    kegiatan: 'Persiapan & Makeup Pengantin serta Kedua Ibu',
    lokasi: 'Ruang Rias VIP Sasana Kriya',
    pic: 'Khadijah Azzahra (MUA) & Tim WO',
    status: 'Upcoming',
    notes: 'Sarapan pengantin disiapkan jam 06.00'
  },
  {
    rundown_id: 'rd-w-02',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    waktu: '07:30 - 08:00',
    kegiatan: 'Penyambutan Rombongan Keluarga Calon Pengantin Pria',
    lokasi: 'Foyer Depan Sasana Kriya',
    pic: 'Pak Bambang (Keluarga) & WO',
    status: 'Upcoming',
    notes: 'Pengalungan bunga ronce melati kepada calon pengantin pria'
  },
  {
    rundown_id: 'rd-w-03',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    waktu: '08:00 - 09:30',
    kegiatan: 'Ijab Kabul & Prosesi Akad Nikah Resmi KUA',
    lokasi: 'Meja Akad Panggung Utama',
    pic: 'Penghulu KUA Makasar & Saksi Nikah',
    status: 'Upcoming',
    notes: 'Khotbah nikah, penyerahan mahar emas 50 gram & buku nikah'
  },
  {
    rundown_id: 'rd-w-04',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    waktu: '09:30 - 10:30',
    kegiatan: 'Upacara Adat Panggih, Balang Suruh & Sungkeman',
    lokasi: 'Panggung Pelaminan',
    pic: 'Pemandu Adat Ibu Hj. Sulastri & WO',
    status: 'Upcoming',
    notes: 'Musik gamelan live pelog barang'
  },
  {
    rundown_id: 'rd-w-05',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    waktu: '11:00 - 13:30',
    kegiatan: 'Resepsi Pernikahan, Ramah Tamah & Foto Keluarga',
    lokasi: 'Grand Ballroom',
    pic: 'MC Sonny & Seluruh Tim WO',
    status: 'Upcoming',
    notes: 'Live acoustic band & pembagian doorprize voucher'
  },
  {
    rundown_id: 'rd-w-06',
    event_id: 'event-wanita-001',
    wedding_id: 'wedding-001',
    waktu: '13:30 - 14:00',
    kegiatan: 'Closing, Foto Bersama Vendor & Pengemasan Kado',
    lokasi: 'Area Ballroom',
    pic: 'PIC Logistik Keluarga & WO',
    status: 'Upcoming',
    notes: 'Serah terima kado & kotak uang ke mobil keluarga'
  },

  // --- RUNDOWN PRIA (Ngunduh Mantu) ---
  {
    rundown_id: 'rd-p-01',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    waktu: '08:00 - 10:00',
    kegiatan: 'Retouch Makeup Pengantin & Busana Ngunduh Mantu',
    lokasi: 'Ruang VIP Balai Samudera',
    pic: 'MUA Team & WO Coordinator',
    status: 'Upcoming',
    notes: 'Pakaian Navy Modern Beludru'
  },
  {
    rundown_id: 'rd-p-02',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    waktu: '11:00 - 11:45',
    kegiatan: 'Kirab Pengantin & Prosesi Boyong Temanten Pria',
    lokasi: 'Aisle Ballroom Balai Samudera',
    pic: 'Cucuk Lampah & Tim WO',
    status: 'Upcoming',
    notes: 'Diringi tarian selamat datang'
  },
  {
    rundown_id: 'rd-p-03',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    waktu: '11:45 - 12:15',
    kegiatan: 'Sambutan Mewakili Keluarga Pria & Doa Bersama',
    lokasi: 'Panggung Utama',
    pic: 'MC & Perwakilan Trah Keluarga',
    status: 'Upcoming',
    notes: 'Sambutan dari perwakilan ayah mempelai pria'
  },
  {
    rundown_id: 'rd-p-04',
    event_id: 'event-pria-001',
    wedding_id: 'wedding-001',
    waktu: '12:15 - 15:30',
    kegiatan: 'Jamuan Makan Siang, Foto VIP & Pertunjukan Musik',
    lokasi: 'Grand Hall Balai Samudera',
    pic: 'David Entertainment & WO Runner',
    status: 'Upcoming',
    notes: '8 gubukan buffet aktif serentak'
  }
];

export const initialDocuments: DocumentItem[] = [
  {
    doc_id: 'doc-001',
    wedding_id: 'wedding-001',
    event_id: 'event-wanita-001',
    judul: 'Kontrak Sewa Venue Sasana Kriya TMII (Signed)',
    tipe: 'Kontrak Vendor',
    file_name: 'Kontrak_SasanaKriya_SintaAndi.pdf',
    file_size: '3.4 MB',
    drive_link: 'https://drive.google.com/file/d/1A2B3C4D_SasanaKriya/view',
    upload_date: '2026-03-02',
    uploaded_by: 'Rina WO'
  },
  {
    doc_id: 'doc-002',
    wedding_id: 'wedding-001',
    event_id: 'event-wanita-001',
    judul: 'Invoice DP 50% Catering Kinarya (600 Pax)',
    tipe: 'Invoice',
    file_name: 'INV-2026-0415-KinaryaCatering.pdf',
    file_size: '1.2 MB',
    drive_link: 'https://drive.google.com/file/d/1A2B3C4D_KinaryaInv/view',
    upload_date: '2026-04-15',
    uploaded_by: 'Kinarya Catering'
  },
  {
    doc_id: 'doc-003',
    wedding_id: 'wedding-001',
    event_id: 'event-wanita-001',
    judul: 'Bukti Transfer Bank Mandiri Pelunasan MUA Khadijah',
    tipe: 'Bukti Pembayaran',
    file_name: 'Transfer_Mandiri_MUA_Khadijah.jpg',
    file_size: '850 KB',
    drive_link: 'https://drive.google.com/file/d/1A2B3C4D_BuktiMUA/view',
    upload_date: '2026-03-20',
    uploaded_by: 'Sinta Maharani'
  },
  {
    doc_id: 'doc-004',
    wedding_id: 'wedding-001',
    event_id: 'event-pria-001',
    judul: 'Kontrak Resmi Balai Samudera Acara Ngunduh Mantu',
    tipe: 'Kontrak Vendor',
    file_name: 'Kontrak_BalaiSamudera_Andi.pdf',
    file_size: '4.8 MB',
    drive_link: 'https://drive.google.com/file/d/1A2B3C4D_BalaiSamudera/view',
    upload_date: '2026-03-16',
    uploaded_by: 'Andi Pratama'
  },
  {
    doc_id: 'doc-005',
    wedding_id: 'wedding-001',
    event_id: 'event-wanita-001',
    judul: 'Surat Numpang Nikah & Pengantar KUA Makasar',
    tipe: 'Dokumen Administrasi',
    file_name: 'SuratPengantar_KUA_Sinta.pdf',
    file_size: '2.1 MB',
    drive_link: 'https://drive.google.com/file/d/1A2B3C4D_KUADocs/view',
    upload_date: '2026-05-12',
    uploaded_by: 'Pak Bambang'
  },
  {
    doc_id: 'doc-006',
    wedding_id: 'wedding-001',
    judul: 'Master Wedding Proposal & Moodboard Visual',
    tipe: 'Proposal',
    file_name: 'Proposal_Wedding_Andi_Sinta_V2.pdf',
    file_size: '18.5 MB',
    drive_link: 'https://drive.google.com/file/d/1A2B3C4D_MasterProposal/view',
    upload_date: '2026-02-10',
    uploaded_by: 'Royal Harmony WO'
  }
];
