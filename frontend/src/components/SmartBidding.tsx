import { useState } from 'react';
import { TrendingUp, DollarSign, Clock, Award, AlertCircle, Brain, Search, Plus, ArrowRight, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface TenderAnalytics {
  id: string;
  projectName: string;
  customer: string;
  partNumber: string;
  quantity: number;
  submissionDeadline: string;
  aiPredictedCost: number;
  confidenceLevel: number;
  historicalComparison: {
    similarProject: string;
    actualCost: number;
    variance: number;
  };
  riskFactors: string[];
  recommendations: string[];
}

export function SmartBidding() {
  const { showToast } = useToast();
  const [selectedTender, setSelectedTender] = useState<TenderAnalytics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tenderAnalytics: TenderAnalytics[] = [
    {
      id: 'TENDER-001',
      projectName: 'Landing Gear Bracket - Series Production',
      customer: 'Boeing',
      partNumber: 'PN-12345-A',
      quantity: 500,
      submissionDeadline: '2025-12-15',
      aiPredictedCost: 285000,
      confidenceLevel: 92,
      historicalComparison: {
        similarProject: 'Wing Bracket Production (2024)',
        actualCost: 278500,
        variance: 2.3,
      },
      riskFactors: [
        'Material costs trending up 5% (Ti-6Al-4V)',
        'Single source supplier dependency',
        'Tight delivery schedule - 8 weeks',
      ],
      recommendations: [
        'Add 3.5% material cost contingency',
        'Negotiate extended delivery timeline',
        'Lock in material pricing with supplier',
      ],
    },
    {
      id: 'TENDER-002',
      projectName: 'Hydraulic Actuator Housing',
      customer: 'Lockheed Martin',
      partNumber: 'PN-67890-B',
      quantity: 200,
      submissionDeadline: '2025-12-20',
      aiPredictedCost: 156000,
      confidenceLevel: 87,
      historicalComparison: {
        similarProject: 'Actuator Assembly (2023)',
        actualCost: 162400,
        variance: -3.9,
      },
      riskFactors: [
        'Complex machining requirements',
        'First Article Inspection required',
        'Special process - Nadcap heat treat',
      ],
      recommendations: [
        'Include FAI costs in quote ($8,500)',
        'Build in 10% for special process qualification',
        'Consider subcontracting heat treat',
      ],
    },
    {
      id: 'TENDER-003',
      projectName: 'Avionics Bracket - Low Volume',
      customer: 'Northrop Grumman',
      partNumber: 'PN-24680-C',
      quantity: 50,
      submissionDeadline: '2025-12-25',
      aiPredictedCost: 42000,
      confidenceLevel: 95,
      historicalComparison: {
        similarProject: 'Electronic Housing (2024)',
        actualCost: 41200,
        variance: 1.9,
      },
      riskFactors: [
        'Low volume - high setup cost ratio',
        'ITAR controlled item',
      ],
      recommendations: [
        'Amortize setup costs over 75 units',
        'Include ITAR compliance overhead',
        'Excellent profit margin opportunity',
      ],
    },
  ];

  const historicalPerformance = {
    totalBidsSubmitted: 47,
    bidsWon: 32,
    winRate: 68,
    averageAccuracy: 94.3,
    totalRevenue: 8450000,
  };

  const getCostBreakdown = (tender: TenderAnalytics) => {
    const material = tender.aiPredictedCost * 0.35;
    const labor = tender.aiPredictedCost * 0.40;
    const overhead = tender.aiPredictedCost * 0.15;
    const profit = tender.aiPredictedCost * 0.10;
    return { material, labor, overhead, profit };
  };

  const filteredTenders = tenderAnalytics.filter(tender =>
    tender.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-slate-100">AI-Based Smart Bidding Analytics</h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Data-Driven Cost Predictions for Competitive Tenders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 text-sm w-64 shadow-sm bg-white dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <button
            onClick={() => showToast('Starting New Proposal Workflow...', 'success')}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium"
          >
            <Plus className="w-4 h-4" /> New Proposal
          </button>
        </div>
      </div>

      {/* AI Feature Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Brain className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-1 font-bold">🤖 AI-Powered Bidding Intelligence</h3>
            <p className="text-purple-100 text-sm opacity-90">
              Machine learning algorithms analyze historical data, market trends, and risk factors to provide accurate cost predictions
              for tender submissions, helping you win more contracts with optimal pricing.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-center backdrop-blur-sm">
            <p className="text-white font-bold text-xl">{historicalPerformance.averageAccuracy}%</p>
            <p className="text-purple-100 text-xs">Accuracy</p>
          </div>
        </div>
      </div>

      {/* Historical Performance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">Bids Submitted</p>
            <TrendingUp className="w-5 h-5 text-gray-400 dark:text-slate-500" />
          </div>
          <p className="text-gray-900 dark:text-slate-100 text-2xl font-bold">{historicalPerformance.totalBidsSubmitted}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-green-100 dark:border-green-900/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">Bids Won</p>
            <Award className="w-5 h-5 text-green-600 dark:text-green-500" />
          </div>
          <p className="text-green-600 dark:text-green-400 text-2xl font-bold">{historicalPerformance.bidsWon}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-blue-100 dark:border-blue-900/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">Win Rate</p>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          </div>
          <p className="text-blue-600 dark:text-blue-400 text-2xl font-bold">{historicalPerformance.winRate}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-purple-100 dark:border-purple-900/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">Avg Accuracy</p>
            <Brain className="w-5 h-5 text-purple-600 dark:text-purple-500" />
          </div>
          <p className="text-purple-600 dark:text-purple-400 text-2xl font-bold">{historicalPerformance.averageAccuracy}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-green-100 dark:border-green-900/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400 text-sm font-medium">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-500" />
          </div>
          <p className="text-green-600 dark:text-green-400 text-2xl font-bold">${(historicalPerformance.totalRevenue / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Active Tenders */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="text-gray-900 dark:text-slate-100 font-bold">Active Tender Opportunities</h3>
          <span className="text-xs text-gray-500 dark:text-slate-400">{filteredTenders.length} Active</span>
        </div>
        <div className="p-4 space-y-4">
          {filteredTenders.map((tender) => {
            const breakdown = getCostBreakdown(tender);
            return (
              <div
                key={tender.id}
                className="border border-gray-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer relative group bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-slate-700"
                onClick={() => setSelectedTender(tender)}
              >
                <div className="absolute top-6 right-6 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors">
                  <ArrowRight className="w-6 h-6" />
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-gray-900 dark:text-slate-100 text-lg font-bold">{tender.projectName}</h4>
                      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800">
                        {tender.customer}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-slate-400">
                      <span className="font-medium bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded">Part: {tender.partNumber}</span>
                      <span>Qty: {tender.quantity}</span>
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500 font-medium">
                        <Clock className="w-4 h-4" />
                        Due: {tender.submissionDeadline}
                      </span>
                    </div>
                  </div>

                  <div className="text-left md:text-right mr-12">
                    <p className="text-gray-500 dark:text-slate-400 mb-1 text-xs font-bold uppercase tracking-wide">AI Predicted Cost</p>
                    <p className="text-gray-900 dark:text-slate-100 font-bold text-2xl">${tender.aiPredictedCost.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1 justify-start md:justify-end">
                      <div className="w-24 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${tender.confidenceLevel >= 90
                            ? 'bg-green-500'
                            : tender.confidenceLevel >= 80
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                            }`}
                          style={{ width: `${tender.confidenceLevel}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">{tender.confidenceLevel}% Conf.</span>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown Visualization */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-2">
                    <span className="font-medium">Cost Structure Analysis</span>
                  </div>
                  <div className="flex h-8 rounded-lg overflow-hidden border border-white dark:border-slate-800 ring-1 ring-gray-200 dark:ring-slate-700">
                    <div
                      className="bg-blue-500 flex items-center justify-center text-white transition-all hover:bg-blue-600"
                      style={{ width: '35%' }}
                      title={`Material: $${breakdown.material.toLocaleString()}`}
                    >
                      <span className="text-[10px] font-bold">Mat 35%</span>
                    </div>
                    <div
                      className="bg-indigo-500 flex items-center justify-center text-white transition-all hover:bg-indigo-600"
                      style={{ width: '40%' }}
                      title={`Labor: $${breakdown.labor.toLocaleString()}`}
                    >
                      <span className="text-[10px] font-bold">Lab 40%</span>
                    </div>
                    <div
                      className="bg-amber-500 flex items-center justify-center text-white transition-all hover:bg-amber-600"
                      style={{ width: '15%' }}
                      title={`Overhead: $${breakdown.overhead.toLocaleString()}`}
                    >
                      <span className="text-[10px] font-bold">OH 15%</span>
                    </div>
                    <div
                      className="bg-emerald-500 flex items-center justify-center text-white transition-all hover:bg-emerald-600"
                      style={{ width: '10%' }}
                      title={`Profit: $${breakdown.profit.toLocaleString()}`}
                    >
                      <span className="text-[10px] font-bold">10%</span>
                    </div>
                  </div>
                </div>

                {/* Historical Comparison */}
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg p-3 text-sm flex items-center justify-between">
                  <p className="text-purple-900 dark:text-purple-300">
                    <strong className="font-bold">📊 Similar Project:</strong> {tender.historicalComparison.similarProject}
                  </p>
                  <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
                    <span className="font-medium">Actual: ${tender.historicalComparison.actualCost.toLocaleString()}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${Math.abs(tender.historicalComparison.variance) < 5
                        ? 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                        }`}
                    >
                      {tender.historicalComparison.variance > 0 ? '+' : ''}
                      {tender.historicalComparison.variance}% Var
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Tender Modal */}
      {selectedTender && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border dark:border-slate-700">

            {/* Modal Header - Purple Gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-4 text-white">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold leading-tight">AI Tender Analysis</h3>
                  <p className="text-purple-100 text-sm opacity-90">{selectedTender.projectName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTender(null)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">

              {/* Detailed Cost Analysis Grid */}
              <div>
                <h4 className="text-gray-900 dark:text-slate-100 mb-4 font-bold text-lg border-b border-gray-100 dark:border-slate-800 pb-2">Detailed Cost Analysis</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-5 border border-gray-100 dark:border-slate-700 hover:border-gray-200 transition-colors">
                    <p className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Material</p>
                    <p className="text-gray-900 dark:text-slate-100 text-xl font-bold">${getCostBreakdown(selectedTender).material.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">35.0% of total</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-5 border border-gray-100 dark:border-slate-700 hover:border-gray-200 transition-colors">
                    <p className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Labor</p>
                    <p className="text-gray-900 dark:text-slate-100 text-xl font-bold">${getCostBreakdown(selectedTender).labor.toLocaleString()}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">40.0% of total</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-5 border border-gray-100 dark:border-slate-700 hover:border-gray-200 transition-colors">
                    <p className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Overhead</p>
                    <p className="text-gray-900 dark:text-slate-100 text-xl font-bold">${getCostBreakdown(selectedTender).overhead.toLocaleString()}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">15.0% of total</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-5 border border-gray-100 dark:border-slate-700 hover:border-gray-200 transition-colors">
                    <p className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Profit</p>
                    <p className="text-gray-900 dark:text-slate-100 text-xl font-bold">${getCostBreakdown(selectedTender).profit.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">10.0% of total</p>
                  </div>
                </div>
              </div>

              {/* Pricing Strategy */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <h4 className="text-blue-900 dark:text-blue-300 mb-4 font-bold flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Recommended Pricing Strategy
                </h4>
                <div className="space-y-3 text-blue-900/80 dark:text-blue-200/80">
                  <div className="flex justify-between items-center text-sm">
                    <span>Base Cost (AI Prediction):</span>
                    <span className="font-medium">${selectedTender.aiPredictedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Risk Contingency (5%):</span>
                    <span className="font-medium">${(selectedTender.aiPredictedCost * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-blue-200 dark:bg-blue-800 my-2"></div>
                  <div className="flex justify-between items-center font-bold text-lg text-blue-700 dark:text-blue-300">
                    <span>Recommended Bid Price:</span>
                    <span>${(selectedTender.aiPredictedCost * 1.05).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Competitive Intelligence */}
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                <h4 className="text-purple-900 dark:text-purple-300 mb-3 font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Competitive Intelligence
                </h4>
                <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                  Based on market analysis, competitors typically bid between
                  <strong className="mx-1 text-purple-900 dark:text-purple-100">${(selectedTender.aiPredictedCost * 0.95).toLocaleString()}</strong> -
                  <strong className="mx-1 text-purple-900 dark:text-purple-100">${(selectedTender.aiPredictedCost * 1.15).toLocaleString()}</strong> for similar projects.
                  Your recommended bid of <strong>${(selectedTender.aiPredictedCost * 1.05).toLocaleString()}</strong> positions you competitively while maintaining healthy profit margins.
                </p>
              </div>

              {/* Risk Factors & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                  <p className="text-amber-900 dark:text-amber-300 mb-4 font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Risk Factors
                  </p>
                  <ul className="space-y-2">
                    {selectedTender.riskFactors.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                  <p className="text-green-900 dark:text-green-300 mb-4 font-bold flex items-center gap-2">
                    <Brain className="w-5 h-5" /> AI Recommendations
                  </p>
                  <ul className="space-y-2">
                    {selectedTender.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-200">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedTender(null)}
                className="px-5 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-medium rounded-lg hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all"
              >
                Close
              </button>
              <button
                onClick={() => showToast('Bid Package Exported to PDF', 'success')}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" /> Export Bid Package
              </button>
              <button
                onClick={() => {
                  showToast('Tender Submitted Successfully!', 'success');
                  setSelectedTender(null);
                }}
                className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-sm transition-all"
              >
                Submit Tender
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
