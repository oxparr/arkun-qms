import { useState } from 'react';
import { TrendingUp, DollarSign, Clock, Award, AlertCircle, Brain } from 'lucide-react';

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
  const [selectedTender, setSelectedTender] = useState<TenderAnalytics | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">AI-Based Smart Bidding Analytics</h2>
          <p className="text-gray-600 mt-1">Data-Driven Cost Predictions for Competitive Tenders</p>
        </div>
      </div>

      {/* AI Feature Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Brain className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-1">🤖 AI-Powered Bidding Intelligence</h3>
            <p className="text-purple-100">
              Machine learning algorithms analyze historical data, market trends, and risk factors to provide accurate cost predictions
              for tender submissions, helping you win more contracts with optimal pricing.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-center">
            <p className="text-white">{historicalPerformance.averageAccuracy}%</p>
            <p className="text-purple-100">Accuracy</p>
          </div>
        </div>
      </div>

      {/* Historical Performance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Bids Submitted</p>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-900">{historicalPerformance.totalBidsSubmitted}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Bids Won</p>
            <Award className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-green-600">{historicalPerformance.bidsWon}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Win Rate</p>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-blue-600">{historicalPerformance.winRate}%</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Avg Accuracy</p>
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-purple-600">{historicalPerformance.averageAccuracy}%</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-green-600">${(historicalPerformance.totalRevenue / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Active Tenders */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-gray-900">Active Tender Opportunities</h3>
        </div>
        <div className="p-4 space-y-4">
          {tenderAnalytics.map((tender) => {
            const breakdown = getCostBreakdown(tender);
            return (
              <div
                key={tender.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTender(tender)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-gray-900">{tender.projectName}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {tender.customer}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Part: {tender.partNumber}</span>
                      <span>Qty: {tender.quantity}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Due: {tender.submissionDeadline}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 mb-1">AI Predicted Cost</p>
                    <p className="text-green-600">${tender.aiPredictedCost.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            tender.confidenceLevel >= 90
                              ? 'bg-green-500'
                              : tender.confidenceLevel >= 80
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${tender.confidenceLevel}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{tender.confidenceLevel}% confidence</span>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown Visualization */}
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">Cost Breakdown</p>
                  <div className="flex h-8 rounded overflow-hidden">
                    <div
                      className="bg-blue-500 flex items-center justify-center text-white"
                      style={{ width: '35%' }}
                      title="Material"
                    >
                      <span className="text-xs">Material</span>
                    </div>
                    <div
                      className="bg-green-500 flex items-center justify-center text-white"
                      style={{ width: '40%' }}
                      title="Labor"
                    >
                      <span className="text-xs">Labor</span>
                    </div>
                    <div
                      className="bg-yellow-500 flex items-center justify-center text-white"
                      style={{ width: '15%' }}
                      title="Overhead"
                    >
                      <span className="text-xs">OH</span>
                    </div>
                    <div
                      className="bg-purple-500 flex items-center justify-center text-white"
                      style={{ width: '10%' }}
                      title="Profit"
                    >
                      <span className="text-xs">Profit</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-600">
                    <span>${breakdown.material.toLocaleString()}</span>
                    <span>${breakdown.labor.toLocaleString()}</span>
                    <span>${breakdown.overhead.toLocaleString()}</span>
                    <span>${breakdown.profit.toLocaleString()}</span>
                  </div>
                </div>

                {/* Historical Comparison */}
                <div className="bg-purple-50 border border-purple-200 rounded p-3 mb-3">
                  <p className="text-purple-900 mb-1">
                    <strong>📊 Similar Project:</strong> {tender.historicalComparison.similarProject}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-purple-700">
                    <span>Actual Cost: ${tender.historicalComparison.actualCost.toLocaleString()}</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        Math.abs(tender.historicalComparison.variance) < 5
                          ? 'bg-green-200 text-green-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {tender.historicalComparison.variance > 0 ? '+' : ''}
                      {tender.historicalComparison.variance}% variance
                    </span>
                  </div>
                </div>

                {/* Risk Factors */}
                {tender.riskFactors.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                    <p className="text-yellow-900 mb-2">
                      <strong>⚠️ Risk Factors:</strong>
                    </p>
                    <ul className="space-y-1 text-sm text-yellow-800">
                      {tender.riskFactors.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Recommendations */}
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-green-900 mb-2">
                    <strong>💡 AI Recommendations:</strong>
                  </p>
                  <ul className="space-y-1 text-sm text-green-800">
                    {tender.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Brain className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Tender Modal */}
      {selectedTender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-lg">
              <div className="flex items-center gap-3 text-white">
                <Brain className="w-8 h-8" />
                <div>
                  <h3 className="text-white mb-1">AI Tender Analysis</h3>
                  <p className="text-purple-100">{selectedTender.projectName}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Detailed Cost Analysis */}
              <div>
                <h4 className="text-gray-900 mb-3">Detailed Cost Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(getCostBreakdown(selectedTender)).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 mb-1 capitalize">{key}</p>
                      <p className="text-gray-900">${value.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        {((value / selectedTender.aiPredictedCost) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Strategy */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-900 mb-3">💰 Recommended Pricing Strategy</h4>
                <div className="space-y-2 text-blue-800">
                  <div className="flex justify-between">
                    <span>Base Cost (AI Prediction):</span>
                    <span>${selectedTender.aiPredictedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Contingency (5%):</span>
                    <span>${(selectedTender.aiPredictedCost * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-300 pt-2">
                    <span>
                      <strong>Recommended Bid Price:</strong>
                    </span>
                    <span>
                      <strong>${(selectedTender.aiPredictedCost * 1.05).toLocaleString()}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Competitive Intelligence */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-purple-900 mb-3">📈 Competitive Intelligence</h4>
                <p className="text-purple-800 mb-2">
                  Based on market analysis, competitors typically bid between 
                  ${(selectedTender.aiPredictedCost * 0.95).toLocaleString()} - 
                  ${(selectedTender.aiPredictedCost * 1.15).toLocaleString()} for similar projects.
                </p>
                <p className="text-purple-700">
                  Your recommended bid of ${(selectedTender.aiPredictedCost * 1.05).toLocaleString()} positions you competitively 
                  while maintaining healthy profit margins.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedTender(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Export Bid Package
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Submit Tender
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
