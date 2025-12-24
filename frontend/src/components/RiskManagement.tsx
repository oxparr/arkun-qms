
import { useState } from 'react';
import { Plus, Search, Filter, AlertTriangle, Shield, CheckCircle, TrendingUp, SlidersHorizontal, MoreVertical, Calendar, User, Zap, Activity } from 'lucide-react';
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

  const [risks, setRisks] = useState<Risk[]>([
    {
      id: 'RISK-001',
      title: 'Single source supplier for landing gear',
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
      description: 'Risk of counterfeit electronic components entering production due to market shortage',
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
      title: 'Key personnel retirement flight risk',
      description: 'Chief Inspector retiring in 6 months with specialized knowledge not yet fully transferred',
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

  const handleAddRisk = (risk: Risk) => setRisks([risk, ...risks]);
  const handleUpdateRisk = (updatedRisk: Risk) => setRisks(risks.map((risk) => (risk.id === updatedRisk.id ? updatedRisk : risk)));

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

  const stats = {
    extreme: risks.filter(r => r.riskLevel >= 15).length,
    high: risks.filter(r => r.riskLevel >= 10 && r.riskLevel < 15).length,
    medium: risks.filter(r => r.riskLevel >= 5 && r.riskLevel < 10).length,
    low: risks.filter(r => r.riskLevel < 5).length
  };

  // Helper for Theme Colors based on Level
  const getTheme = (level: string) => {
    switch (level) {
      case 'Extreme': return { border: 'border-rose-500', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' };
      case 'High': return { border: 'border-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' };
      case 'Medium': return { border: 'border-amber-400', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' };
      case 'Low': return { border: 'border-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' };
      default: return { border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* --- Management Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Risk Management Cockpit</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-emerald-500" />
            AS9100 Rev D Compliant
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search risks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm w-64 shadow-sm bg-white dark:bg-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* Filter Button */}
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all">
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          {/* Primary Action */}
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md shadow-blue-900/10 hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Identify Risk
          </button>
        </div>
      </div>

      {/* --- KPI Widget Dashboard --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-rose-300 transition-colors">
          <div className="absolute right-0 top-0 p-3 opacity-10">
            <AlertTriangle className="w-24 h-24 text-rose-500" />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Extreme Risks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-rose-600 dark:text-rose-400">{stats.extreme}</span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/40 px-1.5 py-0.5 rounded-full">-1</span>
            </div>
            <div className="mt-2 text-xs text-slate-400 font-medium">Immediate Action Required</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-orange-300 transition-colors">
          <div className="absolute right-0 top-0 p-3 opacity-10">
            <Zap className="w-24 h-24 text-orange-500" />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">High Risks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.high}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full">-2</span>
            </div>
            <div className="mt-2 text-xs text-slate-400 font-medium">Monitoring Weekly</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors">
          <div className="absolute right-0 top-0 p-3 opacity-10">
            <Activity className="w-24 h-24 text-amber-500" />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Medium Risks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-500">{stats.medium}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">0</span>
            </div>
            <div className="mt-2 text-xs text-slate-400 font-medium">Review Quarterly</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors">
          <div className="absolute right-0 top-0 p-3 opacity-10">
            <CheckCircle className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Low Risks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.low}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">0</span>
            </div>
            <div className="mt-2 text-xs text-slate-400 font-medium">Acceptable Level</div>
          </div>
        </div>
      </div>

      {/* --- Grid Layout Risk Cards --- */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRisks.map((risk) => {
          const levelLabel = risk.riskLevel >= 15 ? 'Extreme' : risk.riskLevel >= 10 ? 'High' : risk.riskLevel >= 5 ? 'Medium' : 'Low';
          const theme = getTheme(levelLabel);

          return (
            <div key={risk.id} onClick={() => openModal(risk)} className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border-t-4 ${theme.border}`}>

              {/* Card Header Row */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">{risk.id}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${theme.badge}`}>
                    {levelLabel} Level ({risk.riskLevel})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${risk.status === 'Open' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                    risk.status === 'Mitigating' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      risk.status === 'Monitoring' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                    {risk.status}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{risk.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{risk.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
                    {risk.category}
                  </span>
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Probability</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${theme.bg.replace('50', '500').replace('dark:bg-', 'dark:bg-').split(' ')[0]}`} />
                      {risk.probability}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Severity</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-slate-400" />
                      {risk.severity}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Owner</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <User className="w-3 h-3 text-slate-400" />
                      {risk.owner}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Identified</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {risk.dateIdentified}
                    </span>
                  </div>

                </div>

                {risk.mitigationPlan && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start gap-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block">Active Mitigation Plan</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{risk.mitigationPlan}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
