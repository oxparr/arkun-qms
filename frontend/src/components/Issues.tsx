import { useState } from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle, Search, Filter, Plus, Clock, ArrowRight, X, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface NCR {
  id: string;
  title: string;
  partNumber: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Open' | 'In Progress' | 'Closed' | 'Contained';
  disposition: 'Pending' | 'Rework' | 'Scrap' | 'UAI';
  date: string;
  dueDate: string;
  category: 'Manufacturing' | 'Receiving' | 'Engineering' | 'Other';
  serialNumber?: string;
  customerImpact: 'Yes' | 'No' | 'Unknown';
}

export function Issues() {
  const { showToast } = useToast();
  const [selectedNCR, setSelectedNCR] = useState<NCR | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [intro, setIntro] = useState({
    title: 'Non-Conformance Reports (NCR)',
    desc: 'AS9100 Clause 8.7 - Control of Nonconforming Outputs'
  });

  const [ncrs] = useState<NCR[]>([
    {
      id: 'NCR-2025-001',
      title: 'Dimension Mismatch - CNC-001',
      partNumber: 'PN-10000',
      description: 'Critical dimension measuring 2.015" vs specification 2.000" +/- 0.010"',
      severity: 'Critical',
      status: 'Open',
      disposition: 'Pending',
      date: '2025-12-05',
      dueDate: '2025-12-07',
      category: 'Manufacturing',
      serialNumber: 'SN-98765',
      customerImpact: 'No'
    },
    {
      id: 'NCR-2025-002',
      title: 'Surface Scratch - Assembly Line',
      partNumber: 'PN-10053',
      description: 'Cosmetic scratch on surface A, exceeds allowables.',
      severity: 'Minor',
      status: 'In Progress',
      disposition: 'Pending',
      date: '2025-12-04',
      dueDate: '2025-12-06',
      category: 'Manufacturing',
      serialNumber: 'SN-11223',
      customerImpact: 'No'
    },
    {
      id: 'NCR-2025-003',
      title: 'Thermal Deformation - Oven-02',
      partNumber: 'PN-10106',
      description: 'Part warped during heat treat cycle.',
      severity: 'Major',
      status: 'Closed',
      disposition: 'Scrap',
      date: '2025-12-01',
      dueDate: '2025-12-06',
      category: 'Manufacturing',
      customerImpact: 'No'
    }
  ]);

  const stats = {
    open: ncrs.filter(n => n.status !== 'Closed').length,
    critical: ncrs.filter(n => n.severity === 'Critical').length,
    avgDays: 4.2
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Major': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Minor': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const openNewNCR = () => {
    setSelectedNCR({
      id: `NCR-2025-00${ncrs.length + 1}`,
      title: '',
      partNumber: '',
      description: '',
      severity: 'Minor',
      status: 'Open',
      disposition: 'Pending',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      category: 'Manufacturing',
      customerImpact: 'Unknown'
    });
    setIsModalOpen(true);
  };

  const handleEditNCR = (ncr: NCR) => {
    setSelectedNCR(ncr);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{intro.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
            <AlertOctagon className="w-4 h-4 text-rose-500" />
            {intro.desc}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openNewNCR}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium"
          >
            <Plus className="w-4 h-4" /> New NCR
          </button>
        </div>
      </div>

      {/* --- KPI Widgets --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Open NCRs */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400"><AlertOctagon className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Open NCRs</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.open}</p>
          </div>
        </div>

        {/* Critical */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400"><AlertTriangle className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Critical</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.critical}</p>
          </div>
        </div>

        {/* Avg Closure */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400"><Clock className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg Closure</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.avgDays} Days</p>
          </div>
        </div>

        {/* Dispositioned */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Dispositioned</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">89%</p>
          </div>
        </div>
      </div>

      {/* --- Filter Bar --- */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search NCRs or part numbers..." className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 shadow-sm bg-white dark:bg-slate-900 dark:text-slate-100 placeholder-slate-400" />
        </div>
        <select className="border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-300 font-medium bg-white dark:bg-slate-900">
          <option>All Statuses</option>
          <option>Open</option>
          <option>Critical</option>
        </select>
      </div>

      {/* --- NCR List --- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              <th className="px-6 py-4">NCR ID</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Part Number</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Disposition</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {ncrs.map(ncr => (
              <tr
                key={ncr.id}
                onClick={() => handleEditNCR(ncr)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer border-b last:border-0 border-slate-100 dark:border-slate-800"
              >
                <td className="px-6 py-4 font-mono font-bold text-slate-500 dark:text-slate-400 text-xs">{ncr.id}</td>
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 text-sm">{ncr.title}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">{ncr.partNumber}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityColor(ncr.severity)}`}>
                    {ncr.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${ncr.status === 'Open' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900/50' :
                    ncr.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50' :
                      ncr.status === 'Contained' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50' :
                        'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900/50'
                    }`}>
                    {ncr.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">{ncr.disposition}</td>
                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-500 font-mono">{ncr.dueDate}</td>
                <td className="px-6 py-4 text-right">
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- EDIT NCR MODAL --- */}
      {isModalOpen && selectedNCR && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200 border dark:border-slate-800">

            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                  {selectedNCR.id.includes('New') ? 'New NCR' : 'Edit NCR'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">AS9100 Clause 8.7 - Control of Nonconforming Outputs</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Basic Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-slate-400 mb-1">NCR Title *</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 dark:border-slate-700 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 border bg-white dark:bg-slate-800 dark:text-slate-100"
                      defaultValue={selectedNCR.title}
                      placeholder="e.g. Part dimension out of tolerance"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      className="w-full rounded-lg border-gray-300 text-sm p-3 focus:ring-2 focus:ring-blue-500 border h-24"
                      defaultValue={selectedNCR.description}
                      placeholder="Describe the non-conformance in detail..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Severity *</label>
                      <select className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 border" defaultValue={selectedNCR.severity}>
                        <option>Minor</option>
                        <option>Major</option>
                        <option>Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status *</label>
                      <select className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 border" defaultValue={selectedNCR.status}>
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Contained</option>
                        <option>Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                      <select className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 border" defaultValue={selectedNCR.category}>
                        <option>Manufacturing</option>
                        <option>Receiving</option>
                        <option>Engineering</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Traceability (AS9100 Clause 8.5.2)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Part Number</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 border"
                      defaultValue={selectedNCR.partNumber}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Serial Number</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 border"
                      defaultValue={selectedNCR.serialNumber}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 border-b pb-2">Disposition & Impact Assessment</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Disposition *</label>
                    <select className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 border" defaultValue={selectedNCR.disposition}>
                      <option>Pending</option>
                      <option>Rework</option>
                      <option>Scrap</option>
                      <option>Use As Is (UAI)</option>
                      <option>Return to Vendor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Customer Impact *</label>
                    <select className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 border" defaultValue={selectedNCR.customerImpact}>
                      <option>No</option>
                      <option>Yes</option>
                      <option>Unknown</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('NCR Updated Successfully', 'success');
                  setIsModalOpen(false);
                }}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}