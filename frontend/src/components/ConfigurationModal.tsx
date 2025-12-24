import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import type { ConfigurationItem } from './ConfigurationManagement';

interface ConfigurationModalProps {
  item: ConfigurationItem | null;
  onClose: () => void;
  onSave: (item: ConfigurationItem) => void;
}

export function ConfigurationModal({ item, onClose, onSave }: ConfigurationModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<ConfigurationItem>({
    id: '',
    partNumber: '',
    revision: 'A',
    description: '',
    status: 'Development',
    effectivityDate: '',
    changeNumber: '',
    baseline: '',
    classificationLevel: 'Level 2',
    owner: '',
    isKeyCharacteristic: false,
  });

  useEffect(() => {
    // Ported Logic: Initialize form with item data if editing
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemToSave = {
        ...formData,
        // Ported Logic: Auto-generate ID if new
        id: formData.id || `CI-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      };
      onSave(itemToSave);
      showToast(item ? 'Configuration Item Updated' : 'New Configuration Item Created', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to save Configuration Item', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">{item ? 'Edit Configuration Item' : 'New Configuration Item'}</h2>
            <p className="text-gray-600 mt-1">AS9100 Clause 8.1.1 - Configuration Management</p>
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
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ConfigurationItem['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Development</option>
                <option>Released</option>
                <option>In Service</option>
                <option>Obsolete</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Classification Level *</label>
              <select
                value={formData.classificationLevel}
                onChange={(e) => setFormData({ ...formData, classificationLevel: e.target.value as ConfigurationItem['classificationLevel'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Level 1</option>
                <option>Level 2</option>
                <option>Level 3</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Baseline *</label>
              <input
                type="text"
                value={formData.baseline}
                onChange={(e) => setFormData({ ...formData, baseline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Baseline X.X"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Change Number</label>
              <input
                type="text"
                value={formData.changeNumber}
                onChange={(e) => setFormData({ ...formData, changeNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ECN-XXXX-XXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Owner *</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Effectivity Date *</label>
              <input
                type="date"
                value={formData.effectivityDate}
                onChange={(e) => setFormData({ ...formData, effectivityDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <input
              type="checkbox"
              id="keyChar"
              checked={formData.isKeyCharacteristic}
              onChange={(e) => setFormData({ ...formData, isKeyCharacteristic: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="keyChar" className="text-gray-900">
              Key Characteristic (Critical to flight safety, fit, or function)
            </label>
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
              {item ? 'Update' : 'Create'} Configuration Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
