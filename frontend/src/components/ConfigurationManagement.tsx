import { useState } from 'react';
import { Plus, Search, GitBranch } from 'lucide-react';
import { ConfigurationModal } from './ConfigurationModal';

export interface ConfigurationItem {
  id: string;
  partNumber: string;
  revision: string;
  description: string;
  status: 'Development' | 'Released' | 'In Service' | 'Obsolete';
  effectivityDate: string;
  changeNumber?: string;
  baseline: string;
  classificationLevel: 'Level 1' | 'Level 2' | 'Level 3';
  owner: string;
  isKeyCharacteristic: boolean;
}

export function ConfigurationManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ConfigurationItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [configItems, setConfigItems] = useState<ConfigurationItem[]>([
    {
      id: 'CI-001',
      partNumber: 'PN-12345-A',
      revision: 'C',
      description: 'Main landing gear bracket assembly',
      status: 'In Service',
      effectivityDate: '2024-03-15',
      changeNumber: 'ECN-2024-045',
      baseline: 'Baseline 3.2',
      classificationLevel: 'Level 1',
      owner: 'Engineering Team',
      isKeyCharacteristic: true,
    },
    {
      id: 'CI-002',
      partNumber: 'PN-67890-B',
      revision: 'E',
      description: 'Hydraulic actuator housing',
      status: 'Released',
      effectivityDate: '2024-11-01',
      changeNumber: 'ECN-2024-102',
      baseline: 'Baseline 4.0',
      classificationLevel: 'Level 1',
      owner: 'Engineering Team',
      isKeyCharacteristic: true,
    },
    {
      id: 'CI-003',
      partNumber: 'PN-24680-C',
      revision: 'B',
      description: 'Avionics mounting bracket',
      status: 'In Service',
      effectivityDate: '2023-08-20',
      baseline: 'Baseline 2.5',
      classificationLevel: 'Level 2',
      owner: 'Engineering Team',
      isKeyCharacteristic: false,
    },
    {
      id: 'CI-004',
      partNumber: 'PN-13579-A',
      revision: 'A',
      description: 'Legacy connector housing (superseded)',
      status: 'Obsolete',
      effectivityDate: '2020-01-10',
      baseline: 'Baseline 1.0',
      classificationLevel: 'Level 3',
      owner: 'Engineering Team',
      isKeyCharacteristic: false,
    },
  ]);

  const handleAddItem = (item: ConfigurationItem) => {
    setConfigItems([item, ...configItems]);
  };

  const handleUpdateItem = (updatedItem: ConfigurationItem) => {
    setConfigItems(configItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const openModal = (item?: ConfigurationItem) => {
    setSelectedItem(item || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const filteredItems = configItems.filter(
    (item) =>
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-slate-100">Configuration Management</h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">AS9100 Clause 8.1.1 - Configuration Management</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Configuration Item
        </button>
      </div>

      {/* Configuration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <p className="text-gray-600 dark:text-slate-400 mb-1">In Service</p>
          <p className="text-gray-900 dark:text-slate-100">{configItems.filter(i => i.status === 'In Service').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <p className="text-gray-600 dark:text-slate-400 mb-1">Released</p>
          <p className="text-gray-900 dark:text-slate-100">{configItems.filter(i => i.status === 'Released').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <p className="text-gray-600 dark:text-slate-400 mb-1">Key Characteristics</p>
          <p className="text-gray-900 dark:text-slate-100">{configItems.filter(i => i.isKeyCharacteristic).length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <p className="text-gray-600 dark:text-slate-400 mb-1">Level 1 Items</p>
          <p className="text-gray-900 dark:text-slate-100">{configItems.filter(i => i.classificationLevel === 'Level 1').length}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by part number, description, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400">Part Number</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400">Rev</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400">Description</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400">Status</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400">Classification</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400">Baseline</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400">Key Char</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400">Effectivity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => openModal(item)}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-slate-100">{item.partNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">
                      {item.revision}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-slate-100">{item.description}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full ${item.status === 'In Service'
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : item.status === 'Released'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : item.status === 'Development'
                            ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-gray-50 text-gray-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded ${item.classificationLevel === 'Level 1'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : item.classificationLevel === 'Level 2'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                    >
                      {item.classificationLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-slate-100">{item.baseline}</td>
                  <td className="px-6 py-4">
                    {item.isKeyCharacteristic ? (
                      <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-slate-100">{item.effectivityDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ConfigurationModal
          item={selectedItem}
          onClose={closeModal}
          onSave={(item) => {
            if (selectedItem) {
              handleUpdateItem(item);
            } else {
              handleAddItem(item);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}
