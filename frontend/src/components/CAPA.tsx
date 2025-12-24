import { useState } from 'react';
import { ShieldCheck, TrendingUp, AlertCircle, Search, Filter, Plus, CheckCircle, X, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export interface CAPAItem {
  id: string;
  title: string;
  type: 'Corrective' | 'Preventive';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed' | 'Verified';
  description: string;
  rootCause?: string;
  proposedAction?: string;
  assignedTo: string;
  dateOpened: string;
  targetDate: string;
  relatedIssue?: string;
}

export function CAPA() {
  const { showToast } = useToast();
  const [selectedCAPA, setSelectedCAPA] = useState<CAPAItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [capas] = useState<CAPAItem[]>([
    { id: 'CAPA-081', title: 'Improve batch testing procedure', description: 'Implement additional quality checks in batch testing process', type: 'Corrective', priority: 'High', status: 'In Progress', assignedTo: 'Mike Johnson', dateOpened: '2025-12-01', targetDate: '2025-12-20', rootCause: 'Inadequate testing coverage identified in defect analysis', proposedAction: 'Add two additional inspection points in the manufacturing process', relatedIssue: 'ISS-001' },
    { id: 'CAPA-082', title: 'Update documentation procedures', description: 'Revise SOP documentation workflow to prevent errors', type: 'Preventive', priority: 'Medium', status: 'Open', assignedTo: 'Sarah Jones', dateOpened: '2025-12-03', targetDate: '2025-12-15' },
    { id: 'CAPA-083', title: 'Equipment calibration tracking system', description: 'Implement automated calibration reminder system', type: 'Preventive', priority: 'High', status: 'Completed', assignedTo: 'Tom Wilson', dateOpened: '2025-11-25', targetDate: '2025-12-05' },
  ]);

  const stats = {
    active: capas.filter(c => c.status !== 'Completed').length,
    overdue: 1,
    completed: 12,
    riskReduction: '45%'
  };

  const openNewCAPA = () => {
    setSelectedCAPA({
      id: `CAPA-0${84 + capas.length}`,
      title: '',
      type: 'Corrective',
      priority: 'Medium',
      status: 'Open',
      description: '',
      assignedTo: '',
      dateOpened: new Date().toISOString().split('T')[0],
      targetDate: ''
    });
    setIsModalOpen(true);
  };

  const handleEditCAPA = (capa: CAPAItem) => {
    setSelectedCAPA(capa);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Corrective & Preventive Actions</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            AS9100 Clause 10.2 - Nonconformity and Corrective Action
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search CAPA records..." className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 text-sm w-64 shadow-sm bg-white dark:bg-slate-900 dark:text-slate-100 placeholder-slate-400" />
          </div>
          <button
            onClick={openNewCAPA}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md transition-all font-medium"
          >
            <Plus className="w-4 h-4" /> New CAPA
          </button>
        </div>
      </div>

      {/* --- KPI Widgets --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-28">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active CAPAs</span>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.active}</span>
            <TrendingUp className="w-6 h-6 text-slate-200 dark:text-slate-700" />
          </div>
        </div>

        <div className="p-5 rounded-xl border shadow-sm flex flex-col justify-between h-28 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/50">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Overdue Actions</span>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold">{stats.overdue}</span>
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-28">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed YTD</span>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.completed}</span>
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-28">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk Reduction</span>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.riskReduction}</span>
            <ShieldCheck className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* --- CAPA Cards --- */}
      <div className="space-y-4">
        {capas.map(capa => (
          <div
            key={capa.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleEditCAPA(capa)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded font-mono uppercase">{capa.id}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${capa.type === 'Corrective' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                    {capa.type}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${capa.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/50' : 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50'
                    }`}>
                    {capa.priority} Priority
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{capa.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{capa.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${capa.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                capa.status === 'In Progress' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}>
                {capa.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Assignee</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-300">
                    {capa.assignedTo.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{capa.assignedTo}</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Date Created</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 font-mono">{capa.dateOpened}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Target Date</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 font-mono">{capa.targetDate}</span>
              </div>
              <div className="flex items-center justify-end">
                <button className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline flex items-center gap-1">
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- NEW/EDIT CAPA MODAL --- */}
      {isModalOpen && selectedCAPA && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200 border dark:border-slate-800">

            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">{selectedCAPA.title ? 'Edit CAPA' : 'New CAPA'}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">AS9100 Clause 10.2 - Actions</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full rounded-lg border-gray-300 dark:border-slate-700 text-sm p-3 focus:ring-2 focus:ring-emerald-500 border bg-white dark:bg-slate-800 dark:text-slate-100"
                  defaultValue={selectedCAPA.title}
                  placeholder="Short descriptive title..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  className="w-full rounded-lg border-gray-300 dark:border-slate-700 text-sm p-3 focus:ring-2 focus:ring-emerald-500 border h-24 bg-white dark:bg-slate-800 dark:text-slate-100"
                  defaultValue={selectedCAPA.description}
                  placeholder="Detailed description of the issue..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-emerald-500 border" defaultValue={selectedCAPA.type}>
                    <option>Corrective</option>
                    <option>Preventive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-emerald-500 border" defaultValue={selectedCAPA.priority}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-emerald-500 border" defaultValue={selectedCAPA.status}>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Verified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Root Cause</label>
                <textarea
                  className="w-full rounded-lg border-gray-300 text-sm p-3 focus:ring-2 focus:ring-emerald-500 border h-20"
                  defaultValue={selectedCAPA.rootCause}
                  placeholder="Root cause analysis details..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Proposed Action</label>
                <textarea
                  className="w-full rounded-lg border-gray-300 text-sm p-3 focus:ring-2 focus:ring-emerald-500 border h-20"
                  defaultValue={selectedCAPA.proposedAction}
                  placeholder="Action plan to address root cause..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assigned To</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 text-sm p-3 focus:ring-2 focus:ring-emerald-500 border"
                    defaultValue={selectedCAPA.assignedTo}
                    placeholder="e.g. Mike Johnson"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Related Issue (Optional)</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 text-sm p-3 focus:ring-2 focus:ring-emerald-500 border"
                    defaultValue={selectedCAPA.relatedIssue}
                    placeholder="e.g. ISS-001"
                  />
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
                  showToast('CAPA Record Saved', 'success');
                  setIsModalOpen(false);
                }}
                className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 shadow-sm transition-all"
              >
                Save Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
