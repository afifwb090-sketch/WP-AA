import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  AlertCircle,
  Flag,
  User,
  Filter,
  X,
  Sparkles
} from 'lucide-react';
import { 
  ChecklistTask, 
  TimelinePhase, 
  TaskPriority, 
  TaskStatus, 
  EventSide, 
  SideType, 
  WeddingProject 
} from '../types';
import { formatDateIndo } from '../utils/formatters';
import { apiService } from '../services/apiService';

interface ChecklistViewProps {
  project: WeddingProject;
  eventWanita?: EventSide;
  eventPria?: EventSide;
  tasksWanita: ChecklistTask[];
  tasksPria: ChecklistTask[];
  onTasksUpdated: () => void;
  activeSideFilter: 'ALL' | 'WANITA' | 'PRIA';
  onFilterChange: (side: 'ALL' | 'WANITA' | 'PRIA') => void;
}

const PHASES: { id: TimelinePhase | 'ALL'; label: string; desc: string }[] = [
  { id: 'ALL', label: 'Semua Milestone', desc: 'Seluruh tahap persiapan' },
  { id: '12_months', label: '12 Bulan Sebelum', desc: 'Konsep utama, venue & tanggal' },
  { id: '6_months', label: '6 Bulan Sebelum', desc: 'Catering, dekorasi & busana' },
  { id: '3_months', label: '3 Bulan Sebelum', desc: 'MUA, berkas KUA, seragam' },
  { id: '1_month', label: '1 Bulan Sebelum', desc: 'Undangan, souvenir & TM vendor' },
  { id: '1_week', label: '1 Minggu Sebelum', desc: 'Gladi resik & final check' },
  { id: 'day_h', label: 'Hari H Acara', desc: 'Pelaksanaan rundown & logistik' }
];

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  project,
  eventWanita,
  eventPria,
  tasksWanita,
  tasksPria,
  onTasksUpdated,
  activeSideFilter,
  onFilterChange
}) => {
  const [selectedPhase, setSelectedPhase] = useState<TimelinePhase | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ChecklistTask | null>(null);

  const [formData, setFormData] = useState<{
    event_id: string;
    task_name: string;
    category: string;
    timeline_phase: TimelinePhase;
    deadline: string;
    priority: TaskPriority;
    status: TaskStatus;
    assigned_to: string;
    reminder_notes: string;
  }>({
    event_id: eventWanita?.event_id || '',
    task_name: '',
    category: 'Persiapan Umum',
    timeline_phase: '6_months',
    deadline: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    status: 'Pending',
    assigned_to: '',
    reminder_notes: ''
  });

  // Calculate task counts
  const totalWanita = tasksWanita.length;
  const completedWanita = tasksWanita.filter(t => t.status === 'Completed').length;
  const totalPria = tasksPria.length;
  const completedPria = tasksPria.filter(t => t.status === 'Completed').length;

  // Filter tasks based on current side and phase
  let displayTasks: (ChecklistTask & { side: SideType })[] = [];
  if (activeSideFilter === 'ALL' || activeSideFilter === 'WANITA') {
    displayTasks.push(...tasksWanita.map(t => ({ ...t, side: 'WANITA' as SideType })));
  }
  if (activeSideFilter === 'ALL' || activeSideFilter === 'PRIA') {
    displayTasks.push(...tasksPria.map(t => ({ ...t, side: 'PRIA' as SideType })));
  }

  if (selectedPhase !== 'ALL') {
    displayTasks = displayTasks.filter(t => t.timeline_phase === selectedPhase);
  }

  // Sort tasks: pending first, then by deadline
  displayTasks.sort((a, b) => {
    if (a.status === 'Completed' && b.status !== 'Completed') return 1;
    if (a.status !== 'Completed' && b.status === 'Completed') return -1;
    return a.deadline.localeCompare(b.deadline);
  });

  const handleToggleTask = (taskId: string) => {
    apiService.toggleTaskStatus(taskId);
    onTasksUpdated();
  };

  const handleOpenAddModal = (side?: SideType) => {
    setEditingTask(null);
    const targetEventId = side === 'PRIA' ? eventPria?.event_id : eventWanita?.event_id;
    setFormData({
      event_id: targetEventId || eventWanita?.event_id || '',
      task_name: '',
      category: 'Persiapan Umum',
      timeline_phase: selectedPhase === 'ALL' ? '6_months' : selectedPhase,
      deadline: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      status: 'Pending',
      assigned_to: '',
      reminder_notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: ChecklistTask) => {
    setEditingTask(task);
    setFormData({
      event_id: task.event_id,
      task_name: task.task_name,
      category: task.category,
      timeline_phase: task.timeline_phase,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status,
      assigned_to: task.assigned_to || '',
      reminder_notes: task.reminder_notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Hapus task checklist ini?')) {
      apiService.deleteTask(taskId);
      onTasksUpdated();
    }
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.task_name) return;

    if (editingTask) {
      apiService.updateTask(editingTask.task_id, formData);
    } else {
      apiService.createTask({
        ...formData,
        wedding_id: project.wedding_id
      });
    }
    setIsModalOpen(false);
    onTasksUpdated();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900 tracking-tight">
            Checklist Management (2 Sisi Acara)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pantau seluruh tugas persiapan pernikahan terbagi rapi berdasarkan milestone waktu dan sisi acara.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal(activeSideFilter === 'PRIA' ? 'PRIA' : 'WANITA')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B88E4B] hover:bg-[#9B7337] text-white text-xs font-semibold shadow-md shadow-[#B88E4B]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Checklist Baru
        </button>
      </div>

      {/* Side Progress Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="p-4 rounded-2xl bg-gradient-to-r from-white to-[#FFF9F8] border border-rose-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 font-bold">
              {totalWanita > 0 ? Math.round((completedWanita/totalWanita)*100) : 0}%
            </div>
            <div>
              <div className="text-xs font-bold text-rose-900 uppercase">Checklist Acara Wanita</div>
              <div className="text-xs text-stone-600">{completedWanita} dari {totalWanita} task selesai</div>
            </div>
          </div>
          <button
            onClick={() => onFilterChange('WANITA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSideFilter === 'WANITA' ? 'bg-rose-600 text-white' : 'bg-white border border-rose-200 text-rose-700'
            }`}
          >
            Fokus Wanita
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-white to-[#F8FBFF] border border-blue-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {totalPria > 0 ? Math.round((completedPria/totalPria)*100) : 0}%
            </div>
            <div>
              <div className="text-xs font-bold text-blue-900 uppercase">Checklist Acara Pria</div>
              <div className="text-xs text-stone-600">{completedPria} dari {totalPria} task selesai</div>
            </div>
          </div>
          <button
            onClick={() => onFilterChange('PRIA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSideFilter === 'PRIA' ? 'bg-blue-600 text-white' : 'bg-white border border-blue-200 text-blue-700'
            }`}
          >
            Fokus Pria
          </button>
        </div>

      </div>

      {/* Filter Tabs: Side & Milestones */}
      <div className="p-4 rounded-2xl bg-white border border-[#EEDEC3] shadow-xs space-y-3">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => onFilterChange('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSideFilter === 'ALL' ? 'bg-[#B88E4B] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua Acara ({totalWanita + totalPria})
            </button>
            <button
              onClick={() => onFilterChange('WANITA')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSideFilter === 'WANITA' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Acara Wanita ({totalWanita})
            </button>
            <button
              onClick={() => onFilterChange('PRIA')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSideFilter === 'PRIA' ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Acara Pria ({totalPria})
            </button>
          </div>

          <span className="text-xs text-stone-500">
            Menampilkan: <strong>{displayTasks.length} task</strong>
          </span>
        </div>

        {/* Milestone Horizontal Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {PHASES.map(phase => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex flex-col items-start ${
                selectedPhase === phase.id
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{phase.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Tasks List */}
      <div className="space-y-3">
        {displayTasks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-[#EEDEC3] text-stone-400 text-xs">
            Tidak ada task checklist untuk filter yang dipilih.
          </div>
        ) : (
          displayTasks.map(task => {
            const isCompleted = task.status === 'Completed';
            const isWanita = task.side === 'WANITA';

            return (
              <div
                key={task.task_id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-stone-50/70 border-stone-200 opacity-75'
                    : 'bg-white border-[#EEDEC3] shadow-xs hover:border-[#CCA86E]'
                }`}
              >
                {/* Left: Checkbox & Task info */}
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => handleToggleTask(task.task_id)}
                    className="mt-0.5 shrink-0 text-[#B88E4B] hover:scale-110 transition-transform"
                    title={isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-400 hover:text-[#B88E4B]" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-semibold ${isCompleted ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                        {task.task_name}
                      </span>
                      
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isWanita ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isWanita ? 'Wanita' : 'Pria'}
                      </span>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                        {task.category}
                      </span>
                    </div>

                    {task.reminder_notes && (
                      <p className="text-xs text-stone-500 font-light">
                        {task.reminder_notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        Deadline: <strong className="text-stone-700">{formatDateIndo(task.deadline)}</strong>
                      </span>

                      {task.assigned_to && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          PIC: <strong className="text-stone-700">{task.assigned_to}</strong>
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <Flag className="w-3.5 h-3.5 text-stone-400" />
                        Prioritas: 
                        <strong className={`font-semibold ${
                          task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-amber-600' : 'text-stone-600'
                        }`}>
                          {task.priority}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                    task.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : task.status === 'On Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {task.status}
                  </span>

                  <button
                    onClick={() => handleOpenEditModal(task)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                    title="Edit task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.task_id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                    title="Hapus task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF9] border border-[#CCA86E]/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEDEC3] bg-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#B88E4B]" />
                <h3 className="font-bold font-serif-luxury text-[#4A3B2C] text-lg">
                  {editingTask ? 'Edit Task Checklist' : 'Tambah Task Checklist Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pihak Acara Terkait *
                </label>
                <select
                  value={formData.event_id}
                  onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                >
                  <option value={eventWanita?.event_id}>
                    Acara Pihak Wanita - {eventWanita?.nama_acara}
                  </option>
                  <option value={eventPria?.event_id}>
                    Acara Pihak Pria - {eventPria?.nama_acara}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Tugas / Checklist *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Booking catering & food tasting"
                  value={formData.task_name}
                  onChange={(e) => setFormData({ ...formData, task_name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Tahapan Milestone
                  </label>
                  <select
                    value={formData.timeline_phase}
                    onChange={(e) => setFormData({ ...formData, timeline_phase: e.target.value as TimelinePhase })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    <option value="12_months">12 Bulan Sebelum</option>
                    <option value="6_months">6 Bulan Sebelum</option>
                    <option value="3_months">3 Bulan Sebelum</option>
                    <option value="1_month">1 Bulan Sebelum</option>
                    <option value="1_week">1 Minggu Sebelum</option>
                    <option value="day_h">Hari H Acara</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Kategori Tugas
                  </label>
                  <input
                    type="text"
                    placeholder="Venue, Catering, KUA, dll"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Prioritas
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="On Progress">On Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  PIC / Ditugaskan Kepada
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sinta, Rina WO, Pak Bambang"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Catatan Reminder &amp; Detail
                </label>
                <textarea
                  rows={2}
                  placeholder="Informasi penting, kontak atau instruksi pekerjaan..."
                  value={formData.reminder_notes}
                  onChange={(e) => setFormData({ ...formData, reminder_notes: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#B88E4B] hover:bg-[#9B7337] text-white shadow-xs"
                >
                  Simpan Task
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
