import { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Lock } from 'lucide-react';
import { FAIModal } from './FAIModal';

export interface FAI {
  id: string;
  partNumber: string;
  revision: string;
  description: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Approved' | 'Rejected';
  inspectionDate: string;
  inspector: string;
  totalCharacteristics: number;
  inspectedCharacteristics: number;
  nonConformances: number;
  customerApproval?: string;
  notes?: string;
  productionLocked: boolean;
}

export function FirstArticleInspection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFAI, setSelectedFAI] = useState<FAI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductionLock, setShowProductionLock] = useState(false);
  const [attemptedProduction, setAttemptedProduction] = useState<FAI | null>(null);

  const [fais, setFAIs] = useState<FAI[]>([
    {
      id: 'FAI-2025-001',
      partNumber: 'PN-12345-A',
      revision: 'C',
      description: 'Main landing gear bracket assembly',
      status: 'Approved',
      inspectionDate: '2025-11-20',
      inspector: 'John Smith',
      totalCharacteristics: 45,
      inspectedCharacteristics: 45,
      nonConformances: 0,
      customerApproval: 'Boeing QA - Approved 2025-11-22',
      productionLocked: false,
    },
    {
      id: 'FAI-2025-002',
      partNumber: 'PN-67890-B',
      revision: 'E',
      description: 'Hydraulic actuator housing',
      status: 'In Progress',
      inspectionDate: '2025-12-05',
      inspector: 'Sarah Jones',
      totalCharacteristics: 52,
      inspectedCharacteristics: 38,
      nonConformances: 2,
      productionLocked: true,
    },
    {
      id: 'FAI-2025-003',
      partNumber: 'PN-24680-C',
      revision: 'B',
      description: 'Avionics mounting bracket',
      status: 'Planned',
      inspectionDate: '2025-12-15',
      inspector: 'Mike Johnson',
      totalCharacteristics: 28,
      inspectedCharacteristics: 0,
      nonConformances: 0,
      productionLocked: true,
    },
    {
      id: 'FAI-2024-089',
      partNumber: 'PN-98765-D',
      revision: 'A',
      description: 'Wing spar attachment fitting',
      status: 'Rejected',
      inspectionDate: '2025-11-10',
      inspector: 'Tom Wilson',
      totalCharacteristics: 67,
      inspectedCharacteristics: 67,
      nonConformances: 5,
      notes: 'Multiple dimensions out of tolerance. Requires tooling rework.',
      productionLocked: true,
    },
  ]);

  const handleAddFAI = (fai: FAI) => {
    setFAIs([fai, ...fais]);
  };

  const handleUpdateFAI = (updatedFAI: FAI) => {
    setFAIs(fais.map((fai) => (fai.id === updatedFAI.id ? updatedFAI : fai)));
  };

  const openModal = (fai?: FAI) => {
    setSelectedFAI(fai || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFAI(null);
  };

  const attemptProduction = (fai: FAI) => {
    if (fai.productionLocked) {
      setAttemptedProduction(fai);
      setShowProductionLock(true);
    } else {
      alert(`Production authorized for ${fai.partNumber}`);
    }
  };

  const filteredFAIs = fais.filter(
    (fai) =>
      fai.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fai.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fai.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">First Article Inspection (FAI)</h2>
          <p className="text-gray-600 mt-1">AS9100 Clause 8.5.1.2 - First Article Inspection with Process Interlock</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New FAI
        </button>
      </div>

      {/* Process Interlock Alert */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-900 mb-1">
              <strong>🔒 FAI Process Interlock Active:</strong> {fais.filter(f => f.productionLocked).length} part(s) locked
            </p>
            <p className="text-red-700">
              Production is halted for parts without approved FAI. Quality Department must enter measurements and approve before production can proceed.
            </p>
          </div>
        </div>
      </div>

      {/* FAI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 mb-1">Total FAIs</p>
          <p className="text-gray-900">{fais.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
          <p className="text-gray-600 mb-1">Planned</p>
          <p className="text-gray-900">{fais.filter(f => f.status === 'Planned').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
          <p className="text-gray-600 mb-1">In Progress</p>
          <p className="text-blue-600">{fais.filter(f => f.status === 'In Progress').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-green-200">
          <p className="text-gray-600 mb-1">Approved</p>
          <p className="text-green-600">{fais.filter(f => f.status === 'Approved').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-red-200">
          <p className="text-gray-600 mb-1">Production Locked</p>
          <p className="text-red-600">{fais.filter(f => f.productionLocked).length}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search FAI records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-4">
        {filteredFAIs.map((fai) => (
          <div
            key={fai.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500">{fai.id}</span>
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                    {fai.partNumber} Rev {fai.revision}
                  </span>
                  {fai.status === 'Approved' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {fai.status === 'Rejected' && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  {fai.productionLocked && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded">
                      <Lock className="w-4 h-4" />
                      Production Locked
                    </span>
                  )}
                </div>
                <h3 className="text-gray-900 mb-2">{fai.description}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full whitespace-nowrap ${
                  fai.status === 'Planned'
                    ? 'bg-gray-50 text-gray-600'
                    : fai.status === 'In Progress'
                    ? 'bg-blue-50 text-blue-600'
                    : fai.status === 'Completed'
                    ? 'bg-purple-50 text-purple-600'
                    : fai.status === 'Approved'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {fai.status}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <p className="text-gray-500 mb-1">Inspector</p>
                <p className="text-gray-900">{fai.inspector}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Inspection Date</p>
                <p className="text-gray-900">{fai.inspectionDate}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Total Characteristics</p>
                <p className="text-gray-900">{fai.totalCharacteristics}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Inspected</p>
                <p className="text-gray-900">
                  {fai.inspectedCharacteristics} / {fai.totalCharacteristics}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Non-Conformances</p>
                <p className={fai.nonConformances > 0 ? 'text-red-600' : 'text-green-600'}>
                  {fai.nonConformances}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-600">Inspection Progress</span>
                <span className="text-gray-900">
                  {Math.round((fai.inspectedCharacteristics / fai.totalCharacteristics) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    fai.status === 'Approved' ? 'bg-green-500' :
                    fai.status === 'Rejected' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(fai.inspectedCharacteristics / fai.totalCharacteristics) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => openModal(fai)}
                className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                View/Edit FAI
              </button>
              <button
                onClick={() => attemptProduction(fai)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  fai.productionLocked
                    ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {fai.productionLocked ? '🔒 Start Production (Locked)' : '✓ Start Production'}
              </button>
            </div>

            {(fai.customerApproval || fai.notes) && (
              <div className="pt-4 border-t border-gray-200 space-y-2 mt-4">
                {fai.customerApproval && (
                  <div>
                    <span className="text-gray-500">Customer Approval: </span>
                    <span className="text-green-700">{fai.customerApproval}</span>
                  </div>
                )}
                {fai.notes && (
                  <div>
                    <span className="text-gray-500">Notes: </span>
                    <span className="text-gray-900">{fai.notes}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Production Interlock Modal */}
      {showProductionLock && attemptedProduction && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="bg-red-600 p-6 rounded-t-lg">
              <div className="flex items-center gap-3 text-white">
                <Lock className="w-10 h-10" />
                <div>
                  <h3 className="text-white mb-1">🔒 Production Halted - FAI Process Interlock</h3>
                  <p className="text-red-100">First Article Inspection Required</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-gray-900 mb-2">{attemptedProduction.description}</p>
                <p className="text-gray-600">Part: {attemptedProduction.partNumber} Rev {attemptedProduction.revision}</p>
              </div>

              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="text-red-900 mb-3">
                  <strong>⛔ PRODUCTION CANNOT PROCEED</strong>
                </p>
                <p className="text-red-800 mb-2">
                  FAI Status: <span className={`px-2 py-1 rounded ${
                    attemptedProduction.status === 'Planned' ? 'bg-gray-200' :
                    attemptedProduction.status === 'In Progress' ? 'bg-blue-200' :
                    'bg-red-200'
                  }`}>{attemptedProduction.status}</span>
                </p>
                <p className="text-red-800 mb-2">
                  Inspection Progress: {attemptedProduction.inspectedCharacteristics} / {attemptedProduction.totalCharacteristics} characteristics ({Math.round((attemptedProduction.inspectedCharacteristics / attemptedProduction.totalCharacteristics) * 100)}%)
                </p>
                {attemptedProduction.nonConformances > 0 && (
                  <p className="text-red-800 mb-2">
                    Non-Conformances Found: {attemptedProduction.nonConformances}
                  </p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
                <p className="text-yellow-900 mb-2">
                  <strong>Required Actions:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-yellow-800">
                  <li>Quality Department must complete all {attemptedProduction.totalCharacteristics} dimensional inspections</li>
                  <li>Enter all measurements into the FAI record</li>
                  <li>Resolve any non-conformances identified</li>
                  <li>Obtain customer approval (if required)</li>
                  <li>Quality Manager must approve FAI before production release</li>
                </ol>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowProductionLock(false);
                    setAttemptedProduction(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowProductionLock(false);
                    openModal(attemptedProduction);
                    setAttemptedProduction(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Open FAI Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <FAIModal
          fai={selectedFAI}
          onClose={closeModal}
          onSave={(fai) => {
            if (selectedFAI) {
              handleUpdateFAI(fai);
            } else {
              handleAddFAI(fai);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}