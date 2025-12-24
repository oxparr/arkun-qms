import { useState } from 'react';
import { Plus, Calendar, User } from 'lucide-react';
import { AuditModal } from './AuditModal';

export interface Audit {
  id: string;
  title: string;
  description: string;
  type: 'Internal' | 'External' | 'Supplier' | 'Certification';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Follow-up Required';
  auditor: string;
  auditDate: string;
  scope: string;
  findings?: string;
  recommendations?: string;
}

export function Audits() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  const [audits, setAudits] = useState<Audit[]>([
    {
      id: 'AUD-001',
      title: 'Internal Quality Audit Q4',
      description: 'Quarterly internal audit of quality management processes',
      type: 'Internal',
      status: 'Scheduled',
      auditor: 'John Smith',
      auditDate: '2025-12-15',
      scope: 'Manufacturing, Documentation, Training',
    },
    {
      id: 'AUD-002',
      title: 'ISO 9001 Surveillance',
      description: 'Annual surveillance audit for ISO 9001 certification',
      type: 'Certification',
      status: 'Scheduled',
      auditor: 'External Team',
      auditDate: '2025-12-20',
      scope: 'Full QMS review',
    },
    {
      id: 'AUD-003',
      title: 'Supplier Audit - Vendor A',
      description: 'On-site audit of key supplier quality systems',
      type: 'Supplier',
      status: 'Completed',
      auditor: 'Sarah Jones',
      auditDate: '2025-11-28',
      scope: 'Supplier quality controls, raw material testing',
      findings: '2 minor non-conformances identified',
      recommendations: 'Improve documentation procedures',
    },
    {
      id: 'AUD-004',
      title: 'Process Audit - Production Line 2',
      description: 'Detailed audit of production line procedures',
      type: 'Internal',
      status: 'Follow-up Required',
      auditor: 'Mike Johnson',
      auditDate: '2025-11-20',
      scope: 'Production processes, work instructions',
      findings: '1 major non-conformance, 3 observations',
      recommendations: 'Update work instructions, provide additional training',
    },
  ]);

  const handleAddAudit = (audit: Audit) => {
    setAudits([audit, ...audits]);
  };

  const handleUpdateAudit = (updatedAudit: Audit) => {
    setAudits(audits.map((audit) => (audit.id === updatedAudit.id ? updatedAudit : audit)));
  };

  const openModal = (audit?: Audit) => {
    setSelectedAudit(audit || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAudit(null);
  };

  const getStatusColor = (status: Audit['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-50 text-blue-600';
      case 'In Progress':
        return 'bg-yellow-50 text-yellow-600';
      case 'Completed':
        return 'bg-green-50 text-green-600';
      case 'Follow-up Required':
        return 'bg-orange-50 text-orange-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Audits</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Audit
        </button>
      </div>

      <div className="grid gap-4">
        {audits.map((audit) => (
          <div
            key={audit.id}
            onClick={() => openModal(audit)}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500">{audit.id}</span>
                  <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">
                    {audit.type}
                  </span>
                </div>
                <h3 className="text-gray-900 mb-2">{audit.title}</h3>
                <p className="text-gray-600 mb-3">{audit.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(audit.status)}`}>
                {audit.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <div>
                  <p className="text-gray-500">Auditor</p>
                  <p className="text-gray-900">{audit.auditor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <div>
                  <p className="text-gray-500">Audit Date</p>
                  <p className="text-gray-900">{audit.auditDate}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Scope</p>
                <p className="text-gray-900">{audit.scope}</p>
              </div>
            </div>

            {(audit.findings || audit.recommendations) && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {audit.findings && (
                  <div>
                    <span className="text-gray-500">Findings: </span>
                    <span className="text-gray-900">{audit.findings}</span>
                  </div>
                )}
                {audit.recommendations && (
                  <div>
                    <span className="text-gray-500">Recommendations: </span>
                    <span className="text-gray-900">{audit.recommendations}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AuditModal
          audit={selectedAudit}
          onClose={closeModal}
          onSave={(audit) => {
            if (selectedAudit) {
              handleUpdateAudit(audit);
            } else {
              handleAddAudit(audit);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}
