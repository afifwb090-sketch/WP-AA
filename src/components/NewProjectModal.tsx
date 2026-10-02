import React, { useState } from 'react';
import { X, Sparkles, Heart, Calendar } from 'lucide-react';
import { apiService } from '../services/apiService';
import { WeddingProject } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: WeddingProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated
}) => {
  const [formData, setFormData] = useState({
    nama_pasangan_pria: '',
    nama_pasangan_wanita: '',
    tanggal_mulai_project: new Date().toISOString().split('T')[0],
    konsep_pernikahan: 'Modern Javanese Luxury & Champagne Gold',
    wedding_organizer: 'Royal Harmony Wedding Organizer',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_pasangan_pria || !formData.nama_pasangan_wanita) {
      alert('Silakan isi nama kedua mempelai');
      return;
    }

    const created = apiService.createProject(formData);
    onProjectCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDF9] border border-[#CCA86E]/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEDEC3] bg-gradient-to-r from-[#FAF7F2] to-[#F7EFE1]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#B88E4B]/15 text-[#9B7337]">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif-luxury text-[#4A3B2C]">
                Buat Wedding Project Baru
              </h2>
              <p className="text-xs text-[#7A6A58]">
                Sistem otomatis menyiapkan 2 sisi acara (Pihak Wanita & Pria)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#7A6A58] hover:text-[#2D2A26] rounded-lg hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nama Mempelai Pria *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Andi Pratama"
                value={formData.nama_pasangan_pria}
                onChange={(e) => setFormData({ ...formData, nama_pasangan_pria: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nama Mempelai Wanita *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Sinta Maharani"
                value={formData.nama_pasangan_wanita}
                onChange={(e) => setFormData({ ...formData, nama_pasangan_wanita: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Tanggal Mulai Persiapan Proyek
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.tanggal_mulai_project}
                onChange={(e) => setFormData({ ...formData, tanggal_mulai_project: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Konsep / Tema Pernikahan
            </label>
            <input
              type="text"
              placeholder="Contoh: Modern Javanese Luxury & Champagne Gold"
              value={formData.konsep_pernikahan}
              onChange={(e) => setFormData({ ...formData, konsep_pernikahan: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Wedding Organizer Pelaksana
            </label>
            <input
              type="text"
              placeholder="Nama Wedding Organizer"
              value={formData.wedding_organizer}
              onChange={(e) => setFormData({ ...formData, wedding_organizer: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Catatan Khusus (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Catatan tradisi keluarga, preferensi venue, atau permohonan khusus..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#B88E4B]"
            />
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DFC69C]/50 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#B88E4B] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#7A6A58] leading-relaxed">
              Setelah dibuat, Anda dapat langsung mengatur dua tanggal dan dua lokasi acara yang berbeda: satu untuk <strong>Acara Pihak Wanita</strong> (Akad/Resepsi) dan satu untuk <strong>Acara Pihak Pria</strong> (Ngunduh Mantu/Resepsi).
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#B88E4B] hover:bg-[#9B7337] text-white shadow-xs transition-all"
            >
              Simpan & Buka Proyek
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
