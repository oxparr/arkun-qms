import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { CAPAItem } from './CAPA';

interface CAPAModalProps {
  capa: CAPAItem | null;
  onClose: () => void;
  onSave: (capa: CAPAItem) => void;
}

export function CAPAModal({ capa, onClose, onSave }: CAPAModalProps) {
  const [formData, setFormData] = useState<Partial<CAPAItem>>({
    type: 'Corrective',
    status: 'Open',
    priority: 'Medium',
    dateOpened: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (capa) {
      setFormData(capa);
    } else {
      // Reset for new entry
      setFormData({
        id: `CAPA-${Math.floor(Math.random() * 1000)}`,
        type: 'Corrective',
        status: 'Open',
        priority: 'Medium',
        dateOpened: new Date().toISOString().split('T')[0],
      });
    }
  }, [capa]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as CAPAItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-700/50 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <AlertCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {capa ? 'Edit CAPA Record' : 'New CAPA Entry'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-slate-600"
                placeholder="e.g. Batch Test Failure"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none"
              >
                <option value="Corrective">Corrective</option>
                <option value="Preventive">Preventive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-slate-600 resize-none"
              placeholder="Detailed description of the non-conformance..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Root Cause</label>
              <textarea
                rows={2}
                value={formData.rootCause || ''}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                placeholder="Identified root cause..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Proposed Action</label>
              <textarea
                rows={2}
                value={formData.proposedAction || ''}
                onChange={(e) => setFormData({ ...formData, proposedAction: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                placeholder="Action plan to resolve..."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Verified">Verified</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned To</label>
              <input
                type="text"
                value={formData.assignedTo || ''}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Date</label>
              <input
                type="date"
                value={formData.targetDate || ''}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Related Issue ID</label>
              <input
                type="text"
                value={formData.relatedIssue || ''}
                onChange={(e) => setFormData({ ...formData, relatedIssue: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                placeholder="ISS-XXX"
              />
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700/50 bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-500 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/50"
          >
            <Save className="w-4 h-4" />
            SAVE RECORD
          </button>
        </div>
      </div>
    </div>
  );
}
