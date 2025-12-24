import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CAPAItem } from './CAPA';

interface CAPAModalProps {
  capa: CAPAItem | null;
  onClose: () => void;
  onSave: (capa: CAPAItem) => void;
}

export function CAPAModal({ capa, onClose, onSave }: CAPAModalProps) {
  const [formData, setFormData] = useState<CAPAItem>({
    id: '',
    title: '',
    description: '',
    type: 'Corrective',
    rootCause: '',
    proposedAction: '',
    status: 'Open',
    priority: 'Medium',
    assignedTo: '',
    dateOpened: new Date().toISOString().split('T')[0],
    targetDate: '',
    relatedIssue: '',
  });

  useEffect(() => {
    if (capa) {
      setFormData(capa);
    }
  }, [capa]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const capaToSave = {
      ...formData,
      id: formData.id || `CAPA-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    };
    onSave(capaToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">{capa ? 'Edit CAPA' : 'New CAPA'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as CAPAItem['type'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Corrective</option>
                <option>Preventive</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as CAPAItem['priority'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CAPAItem['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Verified</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Root Cause</label>
            <textarea
              value={formData.rootCause}
              onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Proposed Action</label>
            <textarea
              value={formData.proposedAction}
              onChange={(e) => setFormData({ ...formData, proposedAction: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Assigned To</label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Related Issue (Optional)</label>
              <input
                type="text"
                value={formData.relatedIssue}
                onChange={(e) => setFormData({ ...formData, relatedIssue: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., ISS-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Date Opened</label>
              <input
                type="date"
                value={formData.dateOpened}
                onChange={(e) => setFormData({ ...formData, dateOpened: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Target Date</label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {capa ? 'Update' : 'Create'} CAPA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
