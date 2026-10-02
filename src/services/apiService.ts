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
  DocumentItem,
  GasConfig,
  UserRole
} from '../types';
import {
  initialUsers,
  initialProjects,
  initialEvents,
  initialBudgets,
  initialTasks,
  initialGuests,
  initialVendors,
  initialBookings,
  initialRundowns,
  initialDocuments
} from '../data/seedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'wp_current_user',
  ACTIVE_PROJECT: 'wp_active_project_id',
  ACTIVE_SIDE: 'wp_active_side_filter',
  USERS: 'wp_users',
  PROJECTS: 'wp_projects',
  EVENTS: 'wp_events',
  BUDGETS: 'wp_budgets',
  TASKS: 'wp_tasks',
  GUESTS: 'wp_guests',
  VENDORS: 'wp_vendors',
  BOOKINGS: 'wp_bookings',
  RUNDOWNS: 'wp_rundowns',
  DOCUMENTS: 'wp_documents',
  GAS_CONFIG: 'wp_gas_config'
};

class ApiService {
  private gasConfig: GasConfig = {
    webAppUrl: '',
    enabled: false
  };

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(initialEvents));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUDGETS)) {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(initialBudgets));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GUESTS)) {
      localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(initialGuests));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VENDORS)) {
      localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(initialVendors));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initialBookings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RUNDOWNS)) {
      localStorage.setItem(STORAGE_KEYS.RUNDOWNS, JSON.stringify(initialRundowns));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(initialDocuments));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to client role
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(initialUsers[1]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, 'wedding-001');
    }
    const savedConfig = localStorage.getItem(STORAGE_KEYS.GAS_CONFIG);
    if (savedConfig) {
      try {
        this.gasConfig = JSON.parse(savedConfig);
      } catch {
        // ignore
      }
    }
  }

  // --- GAS CONFIGURATION ---
  getGasConfig(): GasConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.GAS_CONFIG);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return this.gasConfig;
      }
    }
    return this.gasConfig;
  }

  setGasConfig(config: GasConfig) {
    this.gasConfig = config;
    localStorage.setItem(STORAGE_KEYS.GAS_CONFIG, JSON.stringify(config));
  }

  // --- AUTHENTICATION & USER MANAGEMENT ---
  getCurrentUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return initialUsers[1];
      }
    }
    return initialUsers[1];
  }

  setCurrentUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  switchRole(role: UserRole): User {
    const users = this.getUsers();
    let user = users.find(u => u.role === role);
    if (!user) {
      user = {
        user_id: `user-${role}-${Date.now()}`,
        nama: `Pengguna ${role.toUpperCase()}`,
        email: `${role}@example.com`,
        role: role,
        role_display: role.toUpperCase(),
        created_at: new Date().toISOString()
      };
      users.push(user);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    this.setCurrentUser(user);
    return user;
  }

  loginWithEmail(email: string, role?: UserRole): User {
    const users = this.getUsers();
    let existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      existing = {
        user_id: `user-${Date.now()}`,
        nama: email.split('@')[0],
        email: email,
        role: role || 'client',
        role_display: (role || 'client').toUpperCase(),
        created_at: new Date().toISOString(),
        assigned_wedding_id: 'wedding-001'
      };
      users.push(existing);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    this.setCurrentUser(existing);
    return existing;
  }

  // --- PROJECTS ---
  getActiveProjectId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT) || 'wedding-001';
  }

  setActiveProjectId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, id);
  }

  getProjects(): WeddingProject[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  }

  getProjectById(weddingId: string): WeddingProject | undefined {
    return this.getProjects().find(p => p.wedding_id === weddingId);
  }

  createProject(data: Partial<WeddingProject>): WeddingProject {
    const projects = this.getProjects();
    const newProject: WeddingProject = {
      wedding_id: `wedding-${Date.now()}`,
      nama_pasangan_pria: data.nama_pasangan_pria || 'Mempelai Pria',
      nama_pasangan_wanita: data.nama_pasangan_wanita || 'Mempelai Wanita',
      tanggal_mulai_project: data.tanggal_mulai_project || new Date().toISOString().split('T')[0],
      status_project: data.status_project || 'Planning',
      konsep_pernikahan: data.konsep_pernikahan || 'Modern Elegance',
      created_at: new Date().toISOString(),
      wedding_organizer: data.wedding_organizer || 'Royal Harmony WO',
      cover_image: data.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
      notes: data.notes || ''
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    // Also auto-create 2 event sides: WANITA & PRIA
    const events = this.getEvents();
    const eventWanita: EventSide = {
      event_id: `event-wanita-${Date.now()}`,
      wedding_id: newProject.wedding_id,
      side_type: 'WANITA',
      nama_acara: `Akad & Resepsi Pihak ${newProject.nama_pasangan_wanita}`,
      tanggal_acara: '2027-02-14',
      jam_acara: '08:00 - 14:00 WIB',
      lokasi_acara: 'Grand Ballroom Jakarta',
      jumlah_tamu: 500,
      budget_total: 150000000,
      status: 'Planning'
    };
    const eventPria: EventSide = {
      event_id: `event-pria-${Date.now() + 1}`,
      wedding_id: newProject.wedding_id,
      side_type: 'PRIA',
      nama_acara: `Ngunduh Mantu Pihak ${newProject.nama_pasangan_pria}`,
      tanggal_acara: '2027-02-21',
      jam_acara: '11:00 - 15:00 WIB',
      lokasi_acara: 'Hotel Grand Sahid Jaya Jakarta',
      jumlah_tamu: 600,
      budget_total: 180000000,
      status: 'Planning'
    };
    events.push(eventWanita, eventPria);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));

    this.setActiveProjectId(newProject.wedding_id);
    return newProject;
  }

  updateProject(weddingId: string, updates: Partial<WeddingProject>): WeddingProject | null {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.wedding_id === weddingId);
    if (idx === -1) return null;
    projects[idx] = { ...projects[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return projects[idx];
  }

  // --- EVENTS ---
  getEvents(): EventSide[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  }

  getEventsByWedding(weddingId: string): EventSide[] {
    return this.getEvents().filter(e => e.wedding_id === weddingId);
  }

  updateEvent(eventId: string, updates: Partial<EventSide>): EventSide | null {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.event_id === eventId);
    if (idx === -1) return null;
    events[idx] = { ...events[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return events[idx];
  }

  // --- BUDGETS ---
  getBudgets(weddingId?: string, eventId?: string): BudgetItem[] {
    let list: BudgetItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS) || '[]');
    if (weddingId) {
      list = list.filter(b => b.wedding_id === weddingId);
    }
    if (eventId) {
      list = list.filter(b => b.event_id === eventId);
    }
    return list;
  }

  createBudget(item: Omit<BudgetItem, 'budget_id'>): BudgetItem {
    const list = this.getBudgets();
    const newItem: BudgetItem = {
      ...item,
      budget_id: `b-${Date.now()}`
    };
    list.push(newItem);
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(list));
    return newItem;
  }

  updateBudget(budgetId: string, updates: Partial<BudgetItem>): BudgetItem | null {
    const list = this.getBudgets();
    const idx = list.findIndex(b => b.budget_id === budgetId);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(list));
    return list[idx];
  }

  deleteBudget(budgetId: string): boolean {
    let list = this.getBudgets();
    const prevLen = list.length;
    list = list.filter(b => b.budget_id !== budgetId);
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(list));
    return list.length < prevLen;
  }

  // --- TASKS / CHECKLIST ---
  getTasks(weddingId?: string, eventId?: string): ChecklistTask[] {
    let list: ChecklistTask[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    if (weddingId) {
      list = list.filter(t => t.wedding_id === weddingId);
    }
    if (eventId) {
      list = list.filter(t => t.event_id === eventId);
    }
    return list;
  }

  createTask(item: Omit<ChecklistTask, 'task_id'>): ChecklistTask {
    const list = this.getTasks();
    const newTask: ChecklistTask = {
      ...item,
      task_id: `task-${Date.now()}`
    };
    list.push(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(list));
    return newTask;
  }

  updateTask(taskId: string, updates: Partial<ChecklistTask>): ChecklistTask | null {
    const list = this.getTasks();
    const idx = list.findIndex(t => t.task_id === taskId);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(list));
    return list[idx];
  }

  toggleTaskStatus(taskId: string): ChecklistTask | null {
    const list = this.getTasks();
    const idx = list.findIndex(t => t.task_id === taskId);
    if (idx === -1) return null;
    const current = list[idx];
    const newStatus = current.status === 'Completed' ? 'Pending' : 'Completed';
    list[idx] = {
      ...current,
      status: newStatus,
      completed_at: newStatus === 'Completed' ? new Date().toISOString() : undefined
    };
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(list));
    return list[idx];
  }

  deleteTask(taskId: string): boolean {
    let list = this.getTasks();
    const prevLen = list.length;
    list = list.filter(t => t.task_id !== taskId);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(list));
    return list.length < prevLen;
  }

  // --- GUESTS ---
  getGuests(weddingId?: string, eventId?: string): Guest[] {
    let list: Guest[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.GUESTS) || '[]');
    if (weddingId) {
      list = list.filter(g => g.wedding_id === weddingId);
    }
    if (eventId) {
      list = list.filter(g => g.event_id === eventId);
    }
    return list;
  }

  createGuest(guest: Omit<Guest, 'guest_id'>): Guest {
    const list = this.getGuests();
    const newGuest: Guest = {
      ...guest,
      guest_id: `g-${Date.now()}`
    };
    list.push(newGuest);
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(list));
    return newGuest;
  }

  updateGuest(guestId: string, updates: Partial<Guest>): Guest | null {
    const list = this.getGuests();
    const idx = list.findIndex(g => g.guest_id === guestId);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(list));
    return list[idx];
  }

  deleteGuest(guestId: string): boolean {
    let list = this.getGuests();
    const prevLen = list.length;
    list = list.filter(g => g.guest_id !== guestId);
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(list));
    return list.length < prevLen;
  }

  // --- VENDORS ---
  getVendors(): Vendor[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VENDORS) || '[]');
  }

  createVendor(vendor: Omit<Vendor, 'vendor_id'>): Vendor {
    const list = this.getVendors();
    const newVendor: Vendor = {
      ...vendor,
      vendor_id: `v-${Date.now()}`
    };
    list.push(newVendor);
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(list));
    return newVendor;
  }

  updateVendor(vendorId: string, updates: Partial<Vendor>): Vendor | null {
    const list = this.getVendors();
    const idx = list.findIndex(v => v.vendor_id === vendorId);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(list));
    return list[idx];
  }

  deleteVendor(vendorId: string): boolean {
    let list = this.getVendors();
    const prev = list.length;
    list = list.filter(v => v.vendor_id !== vendorId);
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(list));
    return list.length < prev;
  }

  // --- BOOKINGS ---
  getBookings(weddingId?: string, eventId?: string): VendorBooking[] {
    let list: VendorBooking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    if (weddingId) {
      list = list.filter(b => b.wedding_id === weddingId);
    }
    if (eventId) {
      list = list.filter(b => b.event_id === eventId);
    }
    return list;
  }

  createBooking(booking: Omit<VendorBooking, 'booking_id'>): VendorBooking {
    const list = this.getBookings();
    const newBooking: VendorBooking = {
      ...booking,
      booking_id: `book-${Date.now()}`
    };
    list.push(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    return newBooking;
  }

  updateBooking(bookingId: string, updates: Partial<VendorBooking>): VendorBooking | null {
    const list = this.getBookings();
    const idx = list.findIndex(b => b.booking_id === bookingId);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    return list[idx];
  }

  deleteBooking(bookingId: string): boolean {
    let list = this.getBookings();
    const prev = list.length;
    list = list.filter(b => b.booking_id !== bookingId);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    return list.length < prev;
  }

  // --- RUNDOWNS ---
  getRundowns(weddingId?: string, eventId?: string): RundownItem[] {
    let list: RundownItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RUNDOWNS) || '[]');
    if (weddingId) {
      list = list.filter(r => r.wedding_id === weddingId);
    }
    if (eventId) {
      list = list.filter(r => r.event_id === eventId);
    }
    return list.sort((a, b) => a.waktu.localeCompare(b.waktu));
  }

  createRundown(item: Omit<RundownItem, 'rundown_id'>): RundownItem {
    const list = this.getRundowns();
    const newItem: RundownItem = {
      ...item,
      rundown_id: `rd-${Date.now()}`
    };
    list.push(newItem);
    localStorage.setItem(STORAGE_KEYS.RUNDOWNS, JSON.stringify(list));
    return newItem;
  }

  updateRundown(rundownId: string, updates: Partial<RundownItem>): RundownItem | null {
    const list = this.getRundowns();
    const idx = list.findIndex(r => r.rundown_id === rundownId);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.RUNDOWNS, JSON.stringify(list));
    return list[idx];
  }

  deleteRundown(rundownId: string): boolean {
    let list = this.getRundowns();
    const prev = list.length;
    list = list.filter(r => r.rundown_id !== rundownId);
    localStorage.setItem(STORAGE_KEYS.RUNDOWNS, JSON.stringify(list));
    return list.length < prev;
  }

  // --- DOCUMENTS ---
  getDocuments(weddingId?: string): DocumentItem[] {
    let list: DocumentItem[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS) || '[]');
    if (weddingId) {
      list = list.filter(d => d.wedding_id === weddingId);
    }
    return list;
  }

  createDocument(doc: Omit<DocumentItem, 'doc_id'>): DocumentItem {
    const list = this.getDocuments();
    const newDoc: DocumentItem = {
      ...doc,
      doc_id: `doc-${Date.now()}`
    };
    list.push(newDoc);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(list));
    return newDoc;
  }

  deleteDocument(docId: string): boolean {
    let list = this.getDocuments();
    const prev = list.length;
    list = list.filter(d => d.doc_id !== docId);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(list));
    return list.length < prev;
  }

  // --- RESET & EXPORT / IMPORT ---
  resetToSeedData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(initialEvents));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(initialBudgets));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(initialGuests));
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(initialVendors));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initialBookings));
    localStorage.setItem(STORAGE_KEYS.RUNDOWNS, JSON.stringify(initialRundowns));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(initialDocuments));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(initialUsers[1]));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, 'wedding-001');
  }

  exportDatabaseJson(): string {
    const backup = {
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      users: this.getUsers(),
      projects: this.getProjects(),
      events: this.getEvents(),
      budgets: this.getBudgets(),
      tasks: this.getTasks(),
      guests: this.getGuests(),
      vendors: this.getVendors(),
      bookings: this.getBookings(),
      rundowns: this.getRundowns(),
      documents: this.getDocuments()
    };
    return JSON.stringify(backup, null, 2);
  }

  importDatabaseJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.projects) localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
      if (data.events) localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(data.events));
      if (data.budgets) localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(data.budgets));
      if (data.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
      if (data.guests) localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(data.guests));
      if (data.vendors) localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(data.vendors));
      if (data.bookings) localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(data.bookings));
      if (data.rundowns) localStorage.setItem(STORAGE_KEYS.RUNDOWNS, JSON.stringify(data.rundowns));
      if (data.documents) localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(data.documents));
      return true;
    } catch {
      return false;
    }
  }

  // Live test connection to Google Apps Script
  async testGasConnection(url: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await fetch(`${url}?endpoint=test`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();
      return {
        success: data.success || true,
        message: data.message || 'Koneksi ke Google Apps Script berhasil!',
        data: data
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal menghubungi Google Apps Script: ${err.message || 'CORS / URL tidak valid'}`
      };
    }
  }
}

export const apiService = new ApiService();
