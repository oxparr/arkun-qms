import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { RiskModal } from './RiskModal';

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: 'Safety' | 'Quality' | 'Delivery' | 'Operational' | 'Compliance' | 'Supply Chain';
  probability: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  severity: 'Negligible' | 'Minor' | 'Moderate' | 'Major' | 'Catastrophic';
  riskLevel: number;
  status: 'Open' | 'Mitigating' | 'Monitoring' | 'Closed';
  owner: string;
  dateIdentified: string;
  mitigationPlan?: string;
  residualRisk?: number;
}

export function RiskManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const calculateRiskLevel = (probability: Risk['probability'], severity: Risk['severity']): number => {
    const probValues = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    const sevValues = { 'Negligible': 1, 'Minor': 2, 'Moderate': 3, 'Major': 4, 'Catastrophic': 5 };
    return probValues[probability] * sevValues[severity];
  };

  const [risks, setRisks] = useState<Risk[]>([
    {
      id: 'RISK-001',
      title: 'Single source supplier for critical component',
      description: 'Only one qualified supplier for main landing gear component creates supply chain vulnerability',
      category: 'Supply Chain',
      probability: 'Medium',
      severity: 'Major',
      riskLevel: 12,
      status: 'Mitigating',
      owner: 'Sarah Jones',
      dateIdentified: '2025-11-15',
      mitigationPlan: 'Qualify second supplier by Q2 2026, increase inventory buffer',
      residualRisk: 6,
    },
    {
      id: 'RISK-002',
      title: 'Counterfeit parts in supply chain',
      description: 'Risk of counterfeit electronic components entering production',
      category: 'Quality',
      probability: 'Low',
      severity: 'Catastrophic',
      riskLevel: 10,
      status: 'Monitoring',
      owner: 'Mike Johnson',
      dateIdentified: '2025-10-20',
      mitigationPlan: 'Enhanced supplier verification, incoming inspection protocols, test lab analysis',
      residualRisk: 4,
    },
    {
      id: 'RISK-003',
      title: 'Key personnel retirement',
      description: 'Chief Inspector retiring in 6 months with specialized knowledge',
      category: 'Operational',
      probability: 'High',
      severity: 'Moderate',
      riskLevel: 12,
      status: 'Mitigating',
      owner: 'John Smith',
      dateIdentified: '2025-09-10',
      mitigationPlan: 'Knowledge transfer program, cross-training, documentation update',
      residualRisk: 3,
    },
    {
      id: 'RISK-004',
      title: 'FOD contamination in final assembly',
      description: 'Foreign Object Debris risk in critical flight hardware assembly area',
      category: 'Safety',
      probability: 'Low',
      severity: 'Catastrophic',
      riskLevel: 10,
      status: 'Monitoring',
      owner: 'Tom Wilson',
      dateIdentified: '2025-08-05',
      mitigationPlan: 'FOD prevention program, daily inspections, controlled access, tool accountability',
      residualRisk: 2,
    },
  ]);

  const handleAddRisk = (risk: Risk) => {
    setRisks([risk, ...risks]);
  };

  const handleUpdateRisk = (updatedRisk: Risk) => {
    setRisks(risks.map((risk) => (risk.id === updatedRisk.id ? updatedRisk : risk)));
  };

  const openModal = (risk?: Risk) => {
    setSelectedRisk(risk || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRisk(null);
  };

  const filteredRisks = risks.filter(
    (risk) =>
      risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (level: number) => {
    if (level >= 15) return 'bg-red-500';
    if (level >= 10) return 'bg-orange-500';
    if (level >= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskLabel = (level: number) => {
    if (level >= 15) return 'Extreme';
    if (level >= 10) return 'High';
    if (level >= 5) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Risk Management</h2>
          <p className="text-gray-600 mt-1">AS9100 Clause 6.1 - Actions to Address Risks and Opportunities</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Identify Risk
        </button>
      </div>

      {/* Risk Matrix Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Risk Distribution</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
            <p className="text-gray-600 mb-1">Extreme Risk</p>
            <p className="text-red-600">{risks.filter(r => r.riskLevel >= 15).length}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-gray-600 mb-1">High Risk</p>
            <p className="text-orange-600">{risks.filter(r => r.riskLevel >= 10 && r.riskLevel < 15).length}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <p className="text-gray-600 mb-1">Medium Risk</p>
            <p className="text-yellow-600">{risks.filter(r => r.riskLevel >= 5 && r.riskLevel < 10).length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-gray-600 mb-1">Low Risk</p>
            <p className="text-green-600">{risks.filter(r => r.riskLevel < 5).length}</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search risks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-4">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            onClick={() => openModal(risk)}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500">{risk.id}</span>
                  <span className={`px-3 py-1 rounded text-white ${getRiskColor(risk.riskLevel)}`}>
                    {getRiskLabel(risk.riskLevel)} Risk ({risk.riskLevel})
                  </span>
                  <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">
                    {risk.category}
                  </span>
                </div>
                <h3 className="text-gray-900 mb-2">{risk.title}</h3>
                <p className="text-gray-600 mb-3">{risk.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full whitespace-nowrap ${
                  risk.status === 'Open'
                    ? 'bg-red-50 text-red-600'
                    : risk.status === 'Mitigating'
                    ? 'bg-blue-50 text-blue-600'
                    : risk.status === 'Monitoring'
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-green-50 text-green-600'
                }`}
              >
                {risk.status}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-gray-500 mb-1">Probability</p>
                <p className="text-gray-900">{risk.probability}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Severity</p>
                <p className="text-gray-900">{risk.severity}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Owner</p>
                <p className="text-gray-900">{risk.owner}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Date Identified</p>
                <p className="text-gray-900">{risk.dateIdentified}</p>
              </div>
            </div>

            {risk.mitigationPlan && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-500 mb-1">Mitigation Plan</p>
                <p className="text-gray-900">{risk.mitigationPlan}</p>
                {risk.residualRisk !== undefined && (
                  <div className="mt-2">
                    <span className="text-gray-500">Residual Risk: </span>
                    <span className={`px-2 py-1 rounded text-white ${getRiskColor(risk.residualRisk)}`}>
                      {getRiskLabel(risk.residualRisk)} ({risk.residualRisk})
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <RiskModal
          risk={selectedRisk}
          onClose={closeModal}
          onSave={(risk) => {
            if (selectedRisk) {
              handleUpdateRisk(risk);
            } else {
              handleAddRisk(risk);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}
