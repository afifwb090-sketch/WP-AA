import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { EventsView } from './components/EventsView';
import { BudgetView } from './components/BudgetView';
import { ChecklistView } from './components/ChecklistView';
import { GuestsView } from './components/GuestsView';
import { VendorsView } from './components/VendorsView';
import { RundownView } from './components/RundownView';
import { DocumentsView } from './components/DocumentsView';
import { PaymentTrackingView } from './components/PaymentTrackingView';
import { AdminPanel } from './components/AdminPanel';
import { GasDocsModal } from './components/GasDocsModal';
import { NewProjectModal } from './components/NewProjectModal';
import { apiService } from './services/apiService';
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
} from './types';

export function App() {
  // Navigation & Filter States
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sideFilter, setSideFilter] = useState<'ALL' | 'WANITA' | 'PRIA'>('ALL');
  
  // Modals
  const [isGasDocsOpen, setIsGasDocsOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  // Core Data States
  const [currentUser, setCurrentUser] = useState<User>(apiService.getCurrentUser());
  const [projects, setProjects] = useState<WeddingProject[]>(apiService.getProjects());
  const [activeProject, setActiveProject] = useState<WeddingProject>(
    apiService.getProjectById(apiService.getActiveProjectId()) || projects[0]
  );

  // Project Dependent Data
  const [events, setEvents] = useState<EventSide[]>([]);
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [rundowns, setRundowns] = useState<RundownItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Load and refresh all state from apiService
  const refreshData = () => {
    const projs = apiService.getProjects();
    setProjects(projs);
    const activeId = apiService.getActiveProjectId();
    const proj = projs.find(p => p.wedding_id === activeId) || projs[0];
    setActiveProject(proj);

    const evs = apiService.getEventsByWedding(proj.wedding_id);
    setEvents(evs);

    setBudgets(apiService.getBudgets(proj.wedding_id));
    setTasks(apiService.getTasks(proj.wedding_id));
    setGuests(apiService.getGuests(proj.wedding_id));
    setVendors(apiService.getVendors());
    setBookings(apiService.getBookings(proj.wedding_id));
    setRundowns(apiService.getRundowns(proj.wedding_id));
    setDocuments(apiService.getDocuments(proj.wedding_id));
    setAllUsers(apiService.getUsers());
    setCurrentUser(apiService.getCurrentUser());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Split event data between Wanita & Pria
  const eventWanita = events.find(e => e.side_type === 'WANITA');
  const eventPria = events.find(e => e.side_type === 'PRIA');

  const budgetsWanita = budgets.filter(b => b.event_id === eventWanita?.event_id);
  const budgetsPria = budgets.filter(b => b.event_id === eventPria?.event_id);

  const tasksWanita = tasks.filter(t => t.event_id === eventWanita?.event_id);
  const tasksPria = tasks.filter(t => t.event_id === eventPria?.event_id);

  const guestsWanita = guests.filter(g => g.event_id === eventWanita?.event_id);
  const guestsPria = guests.filter(g => g.event_id === eventPria?.event_id);

  const bookingsWanita = bookings.filter(b => b.event_id === eventWanita?.event_id);
  const bookingsPria = bookings.filter(b => b.event_id === eventPria?.event_id);

  const rundownsWanita = rundowns.filter(r => r.event_id === eventWanita?.event_id);
  const rundownsPria = rundowns.filter(r => r.event_id === eventPria?.event_id);

  // Handlers
  const handleProjectChange = (proj: WeddingProject) => {
    apiService.setActiveProjectId(proj.wedding_id);
    setActiveProject(proj);
    refreshData();
  };

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
    // If admin is selected and user clicked admin panel
    if (user.role === 'admin' && currentTab === 'dashboard') {
      // keep on dashboard or let user choose
    }
  };

  const handleProjectCreated = (newProj: WeddingProject) => {
    handleProjectChange(newProj);
  };

  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const totalTasksCount = tasks.length;
  const pendingGuestsCount = guests.filter(g => g.RSVP_status === 'Belum Konfirmasi').length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col selection:bg-[#EEDEC3] selection:text-[#3A2E1A]">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
        activeProject={activeProject}
        projects={projects}
        onProjectChange={handleProjectChange}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onOpenGasDocs={() => setIsGasDocsOpen(true)}
        selectedSideFilter={sideFilter}
        onSideFilterChange={setSideFilter}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        
        {/* Sidebar Nav */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          userRole={currentUser.role}
          completedTasksCount={completedTasksCount}
          totalTasksCount={totalTasksCount}
          pendingGuestsCount={pendingGuestsCount}
        />

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {currentTab === 'dashboard' && (
            <DashboardView
              project={activeProject}
              eventWanita={eventWanita}
              eventPria={eventPria}
              budgetsWanita={budgetsWanita}
              budgetsPria={budgetsPria}
              tasksWanita={tasksWanita}
              tasksPria={tasksPria}
              guestsWanita={guestsWanita}
              guestsPria={guestsPria}
              bookings={bookings}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'events' && (
            <EventsView
              project={activeProject}
              eventWanita={eventWanita}
              eventPria={eventPria}
              onEventUpdated={refreshData}
              onNavigate={(tab) => setCurrentTab(tab)}
              onFilterSide={(side) => setSideFilter(side)}
            />
          )}

          {currentTab === 'budget' && (
            <BudgetView
              project={activeProject}
              eventWanita={eventWanita}
              eventPria={eventPria}
              budgetsWanita={budgetsWanita}
              budgetsPria={budgetsPria}
              onBudgetUpdated={refreshData}
              activeSideFilter={sideFilter}
              onFilterChange={setSideFilter}
            />
          )}

          {currentTab === 'checklist' && (
            <ChecklistView
              project={activeProject}
              eventWanita={eventWanita}
              eventPria={eventPria}
              tasksWanita={tasksWanita}
              tasksPria={tasksPria}
              onTasksUpdated={refreshData}
              activeSideFilter={sideFilter}
              onFilterChange={setSideFilter}
            />
          )}

          {currentTab === 'guests' && (
            <GuestsView
              project={activeProject}
              eventWanita={eventWanita}
              eventPria={eventPria}
              guestsWanita={guestsWanita}
              guestsPria={guestsPria}
              onGuestsUpdated={refreshData}
              activeSideFilter={sideFilter}
              onFilterChange={setSideFilter}
            />
          )}

          {currentTab === 'vendors' && (
            <VendorsView
              project={activeProject}
              eventWanita={eventWanita}
              eventPria={eventPria}
              vendors={vendors}
              bookingsWanita={bookingsWanita}
              bookingsPria={bookingsPria}
              onVendorsUpdated={refreshData}
              activeSideFilter={sideFilter}
              onFilterChange={setSideFilter}
            />
          )}

          {currentTab === 'rundown' && (
            <RundownView
              project={activeProject}
              eventWanita={eventWanita}
              eventPria={eventPria}
              rundownsWanita={rundownsWanita}
              rundownsPria={rundownsPria}
              onRundownsUpdated={refreshData}
              activeSideFilter={sideFilter}
              onFilterChange={setSideFilter}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentsView
              project={activeProject}
              eventWanita={eventWanita}
              eventPria={eventPria}
              documents={documents}
              onDocumentsUpdated={refreshData}
              currentUser={currentUser.nama}
            />
          )}

          {currentTab === 'payments' && (
            <PaymentTrackingView
              project={activeProject}
              eventWanita={eventWanita}
              eventPria={eventPria}
              budgetsWanita={budgetsWanita}
              budgetsPria={budgetsPria}
              onPaymentUpdated={refreshData}
              activeSideFilter={sideFilter}
              onFilterChange={setSideFilter}
            />
          )}

          {currentTab === 'admin' && (
            <AdminPanel
              projects={projects}
              allEvents={apiService.getEvents()}
              users={allUsers}
              onSelectProject={(proj) => {
                handleProjectChange(proj);
                setCurrentTab('dashboard');
              }}
              onOpenNewProject={() => setIsNewProjectOpen(true)}
            />
          )}

        </main>
      </div>

      {/* Global Modals */}
      <GasDocsModal
        isOpen={isGasDocsOpen}
        onClose={() => setIsGasDocsOpen(false)}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

    </div>
  );
}

export default App;
