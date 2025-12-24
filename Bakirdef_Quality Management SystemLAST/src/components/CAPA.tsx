import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { CAPAModal } from './CAPAModal';

export interface CAPAItem {
  id: string;
  title: string;
  description: string;
  type: 'Corrective' | 'Preventive';
  rootCause: string;
  proposedAction: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Verified';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  dateOpened: string;
  targetDate: string;
  relatedIssue?: string;
}

export function CAPA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCAPA, setSelectedCAPA] = useState<CAPAItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [capas, setCAPAs] = useState<CAPAItem[]>([
    {
      id: 'CAPA-001',
      title: 'Improve batch testing procedure',
      description: 'Implement additional quality checks in batch testing process',
      type: 'Corrective',
      rootCause: 'Inadequate testing coverage identified in defect analysis',
      proposedAction: 'Add two additional inspection points in the manufacturing process',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Mike Johnson',
      dateOpened: '2025-12-01',
      targetDate: '2025-12-20',
      relatedIssue: 'ISS-001',
    },
    {
      id: 'CAPA-002',
      title: 'Update documentation procedures',
      description: 'Revise SOP documentation workflow to prevent errors',
      type: 'Preventive',
      rootCause: 'Documentation review process lacks sufficient checkpoints',
      proposedAction: 'Implement dual-review system for all SOPs',
      status: 'Open',
      priority: 'Medium',
      assignedTo: 'Sarah Jones',
      dateOpened: '2025-12-03',
      targetDate: '2025-12-15',
      relatedIssue: 'ISS-002',
    },
    {
      id: 'CAPA-003',
      title: 'Equipment calibration tracking system',
      description: 'Implement automated calibration reminder system',
      type: 'Preventive',
      rootCause: 'Manual tracking led to missed calibration deadline',
      proposedAction: 'Deploy automated calibration management software',
      status: 'Completed',
      priority: 'High',
      assignedTo: 'Tom Wilson',
      dateOpened: '2025-11-25',
      targetDate: '2025-12-05',
      relatedIssue: 'ISS-003',
    },
  ]);

  const handleAddCAPA = (capa: CAPAItem) => {
    setCAPAs([capa, ...capas]);
  };

  const handleUpdateCAPA = (updatedCAPA: CAPAItem) => {
    setCAPAs(capas.map((capa) => (capa.id === updatedCAPA.id ? updatedCAPA : capa)));
  };

  const openModal = (capa?: CAPAItem) => {
    setSelectedCAPA(capa || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCAPA(null);
  };

  const filteredCAPAs = capas.filter(
    (capa) =>
      capa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capa.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Corrective & Preventive Actions</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New CAPA
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search CAPAs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-4">
        {filteredCAPAs.map((capa) => (
          <div
            key={capa.id}
            onClick={() => openModal(capa)}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500">{capa.id}</span>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      capa.type === 'Corrective' ? 'bg-orange-500' : 'bg-purple-500'
                    }`}
                  >
                    {capa.type}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      capa.priority === 'High'
                        ? 'bg-red-500'
                        : capa.priority === 'Medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {capa.priority}
                  </span>
                </div>
                <h3 className="text-gray-900 mb-2">{capa.title}</h3>
                <p className="text-gray-600 mb-3">{capa.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full whitespace-nowrap ${
                  capa.status === 'Open'
                    ? 'bg-red-50 text-red-600'
                    : capa.status === 'In Progress'
                    ? 'bg-blue-50 text-blue-600'
                    : capa.status === 'Completed'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-purple-50 text-purple-600'
                }`}
              >
                {capa.status}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-gray-600">
              <div>
                <p className="text-gray-500 mb-1">Assigned To</p>
                <p className="text-gray-900">{capa.assignedTo}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Date Opened</p>
                <p className="text-gray-900">{capa.dateOpened}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Target Date</p>
                <p className="text-gray-900">{capa.targetDate}</p>
              </div>
              {capa.relatedIssue && (
                <div>
                  <p className="text-gray-500 mb-1">Related Issue</p>
                  <p className="text-blue-600">{capa.relatedIssue}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CAPAModal
          capa={selectedCAPA}
          onClose={closeModal}
          onSave={(capa) => {
            if (selectedCAPA) {
              handleUpdateCAPA(capa);
            } else {
              handleAddCAPA(capa);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}
