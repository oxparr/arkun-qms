import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { FAI } from './FirstArticleInspection';

interface FAIModalProps {
  fai: FAI | null;
  onClose: () => void;
  onSave: (fai: FAI) => void;
}

export function FAIModal({ fai, onClose, onSave }: FAIModalProps) {
  const [formData, setFormData] = useState<FAI>({
    id: '',
    partNumber: '',
    revision: '',
    description: '',
    status: 'Planned',
    inspectionDate: '',
    inspector: '',
    totalCharacteristics: 0,
    inspectedCharacteristics: 0,
    nonConformances: 0,
    customerApproval: '',
    notes: '',
    productionLocked: true,
  });

  useEffect(() => {
    if (fai) {
      setFormData(fai);
    }
  }, [fai]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = new Date().getFullYear();
    const faiToSave = {
      ...formData,
      id: formData.id || `FAI-${year}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      productionLocked: formData.status !== 'Approved',
    };
    onSave(faiToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">{fai ? 'Edit FAI' : 'New First Article Inspection'}</h2>
            <p className="text-gray-600 mt-1">AS9100 Clause 8.5.1.2 - First Article Inspection</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-700 mb-2">Part Number *</label>
              <input
                type="text"
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PN-XXXXX-X"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Revision *</label>
              <input
                type="text"
                value={formData.revision}
                onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as FAI['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Planned</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Inspection Date *</label>
              <input
                type="date"
                value={formData.inspectionDate}
                onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Inspector *</label>
            <input
              type="text"
              value={formData.inspector}
              onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Total Characteristics *</label>
              <input
                type="number"
                min="0"
                value={formData.totalCharacteristics}
                onChange={(e) => setFormData({ ...formData, totalCharacteristics: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Inspected Characteristics *</label>
              <input
                type="number"
                min="0"
                max={formData.totalCharacteristics}
                value={formData.inspectedCharacteristics}
                onChange={(e) => setFormData({ ...formData, inspectedCharacteristics: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Non-Conformances</label>
              <input
                type="number"
                min="0"
                value={formData.nonConformances}
                onChange={(e) => setFormData({ ...formData, nonConformances: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {formData.status === 'Approved' || formData.status === 'Rejected' ? (
            <div className={`p-4 rounded-lg border-2 ${
              formData.status === 'Approved' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
            }`}>
              <p className={formData.status === 'Approved' ? 'text-green-900' : 'text-red-900'}>
                {formData.status === 'Approved' ? '✅ Production will be unlocked when FAI is saved' : '⚠️ Production will remain locked until issues are resolved'}
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
              <p className="text-yellow-900">
                ⚠️ Production remains locked until FAI is approved
              </p>
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Customer Approval</label>
            <input
              type="text"
              value={formData.customerApproval}
              onChange={(e) => setFormData({ ...formData, customerApproval: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Boeing QA - Approved 2025-12-05"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              placeholder="Additional notes or observations..."
            />
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
              {fai ? 'Update' : 'Create'} FAI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}