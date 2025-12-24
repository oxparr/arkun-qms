import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Risk } from './RiskManagement';

interface RiskModalProps {
  risk: Risk | null;
  onClose: () => void;
  onSave: (risk: Risk) => void;
}

export function RiskModal({ risk, onClose, onSave }: RiskModalProps) {
  const [formData, setFormData] = useState<Risk>({
    id: '',
    title: '',
    description: '',
    category: 'Quality',
    probability: 'Medium',
    severity: 'Moderate',
    riskLevel: 9,
    status: 'Open',
    owner: '',
    dateIdentified: new Date().toISOString().split('T')[0],
    mitigationPlan: '',
    residualRisk: 0,
  });

  useEffect(() => {
    if (risk) {
      setFormData(risk);
    }
  }, [risk]);

  const calculateRiskLevel = (probability: Risk['probability'], severity: Risk['severity']): number => {
    const probValues = { 'Very Low': 1, 'Low': 2, 'Medium': 3, 'High': 4, 'Very High': 5 };
    const sevValues = { 'Negligible': 1, 'Minor': 2, 'Moderate': 3, 'Major': 4, 'Catastrophic': 5 };
    return probValues[probability] * sevValues[severity];
  };

  const updateRiskCalculation = (prob: Risk['probability'], sev: Risk['severity']) => {
    const level = calculateRiskLevel(prob, sev);
    setFormData({ ...formData, probability: prob, severity: sev, riskLevel: level });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const riskToSave = {
      ...formData,
      id: formData.id || `RISK-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    };
    onSave(riskToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-slate-900 dark:text-slate-100 font-bold text-xl">{risk ? 'Edit Risk' : 'Identify New Risk'}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">AS9100 Clause 6.1 - Risk-Based Thinking</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-bold">Risk Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100 placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-bold">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white dark:bg-slate-800 dark:text-slate-100 placeholder-slate-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-bold">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Risk['category'] })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100"
              >
                <option>Safety</option>
                <option>Quality</option>
                <option>Delivery</option>
                <option>Operational</option>
                <option>Compliance</option>
                <option>Supply Chain</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-bold">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Risk['status'] })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100"
              >
                <option>Open</option>
                <option>Mitigating</option>
                <option>Monitoring</option>
                <option>Closed</option>
              </select>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
            <h3 className="text-slate-900 dark:text-slate-100 mb-3 font-bold">Risk Assessment</h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-bold">Probability *</label>
                <select
                  value={formData.probability}
                  onChange={(e) => updateRiskCalculation(e.target.value as Risk['probability'], formData.severity)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100"
                >
                  <option>Very Low</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Very High</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-bold">Severity *</label>
                <select
                  value={formData.severity}
                  onChange={(e) => updateRiskCalculation(formData.probability, e.target.value as Risk['severity'])}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100"
                >
                  <option>Negligible</option>
                  <option>Minor</option>
                  <option>Moderate</option>
                  <option>Major</option>
                  <option>Catastrophic</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-1 text-xs font-bold uppercase">Calculated Risk Level</p>
              <p className="text-slate-900 dark:text-slate-100">
                <span className={`px-3 py-1 rounded text-white font-bold ${formData.riskLevel >= 15 ? 'bg-red-500' :
                    formData.riskLevel >= 10 ? 'bg-orange-500' :
                      formData.riskLevel >= 5 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                  {formData.riskLevel >= 15 ? 'Extreme' :
                    formData.riskLevel >= 10 ? 'High' :
                      formData.riskLevel >= 5 ? 'Medium' : 'Low'} ({formData.riskLevel})
                </span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-bold">Mitigation Plan</label>
            <textarea
              value={formData.mitigationPlan}
              onChange={(e) => setFormData({ ...formData, mitigationPlan: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white dark:bg-slate-800 dark:text-slate-100 placeholder-slate-400"
              placeholder="Actions planned to reduce or eliminate the risk..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-bold">Risk Owner *</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100 placeholder-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-bold">Residual Risk</label>
              <input
                type="number"
                min="0"
                max="25"
                value={formData.residualRisk}
                onChange={(e) => setFormData({ ...formData, residualRisk: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100 p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-bold">Date Identified *</label>
            <input
              type="date"
              value={formData.dateIdentified}
              onChange={(e) => setFormData({ ...formData, dateIdentified: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {risk ? 'Update' : 'Create'} Risk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
