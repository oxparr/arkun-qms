import { useState } from 'react';
import { CalendarCheck, FileCheck, AlertOctagon, Search, Filter, Plus, Calendar, Clock, CheckCircle, X, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Audit {
  id: string;
  title: string;
  description: string;
  type: 'Internal' | 'External' | 'Supplier' | 'Certification';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
  auditor: string;
  date: string;
  scope: string;
  findings?: string;
  recommendations?: string;
}

export function Audits() {
  const { showToast } = useToast();
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [audits, setAudits] = useState<Audit[]>([
    {
      id: 'AUD-001',
      title: 'Internal Quality Audit Q4',
      description: 'Quarterly internal audit of quality management processes',
      type: 'Internal',
      date: '2025-12-15',
      status: 'Scheduled',
      auditor: 'John Smith',
      scope: 'Manufacturing, Documentation, Training'
    },
    {
      id: 'AUD-002',
      title: 'ISO 9001 Surveillance',
      description: 'Annual surveillance audit by verification body',
      type: 'Certification',
      date: '2025-12-20',
      status: 'Scheduled',
      auditor: 'External Team',
      scope: 'Full QMS review'
    },
    {
      id: 'AUD-003',
      title: 'Supplier Audit - Vendor A',
      description: 'On-site audit of critical supplier manufacturing lines',
      type: 'Supplier',
      date: '2025-11-28',
      status: 'Completed',
      auditor: 'Sarah Jones',
      scope: 'Supplier quality controls',
      findings: 'Minor non-conformance in material storage'
    },
  ]);

  const stats = {
    scheduled: audits.filter(a => a.status === 'Scheduled').length,
    findings: 2,
    compliance: 98
  };

  const openNewAudit = () => {
    setSelectedAudit({
      id: `AUD-00${audits.length + 1}`,
      title: '',
      description: '',
      type: 'Internal',
      status: 'Scheduled',
      auditor: '',
      date: '',
      scope: '',
      findings: '',
      recommendations: ''
    });
    setIsModalOpen(true);
  };

  const handleEditAudit = (audit: Audit) => {
    setSelectedAudit(audit);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Audits</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
            <CalendarCheck className="w-4 h-4 text-emerald-500" />
            Internal & External Audit Schedule
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openNewAudit}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium"
          >
            <Plus className="w-4 h-4" /> Schedule Audit
          </button>
        </div>
      </div>

      {/* --- KPI Widgets --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400"><Calendar className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Scheduled</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.scheduled}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400"><AlertOctagon className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Open Findings</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.findings}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Compliance</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.compliance}%</p>
          </div>
        </div>
      </div>

      {/* --- Audit List --- */}
      <div className="space-y-6">
        {audits.map(audit => (
          <div
            key={audit.id}
            onClick={() => handleEditAudit(audit)}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">{audit.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${audit.type === 'Internal' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    audit.type === 'Certification' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                    {audit.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{audit.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{audit.scope}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${audit.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                audit.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                {audit.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Lead Auditor</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-300 font-bold">
                    {audit.auditor.charAt(0)}
                  </div>
                  {audit.auditor}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Audit Date</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {audit.date}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- AUDIT MODAL --- */}
      {isModalOpen && selectedAudit && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200 border dark:border-slate-800">

            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">{selectedAudit.title ? 'Edit Audit' : 'Schedule Audit'}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Audit Management & Planning</p>
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
                  className="w-full rounded-lg border-gray-300 dark:border-slate-700 text-sm p-3 focus:ring-2 focus:ring-blue-500 border bg-white dark:bg-slate-800 dark:text-slate-100"
                  defaultValue={selectedAudit.title}
                  placeholder="e.g. Internal Quality Audit Q4"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  className="w-full rounded-lg border-gray-300 dark:border-slate-700 text-sm p-3 focus:ring-2 focus:ring-blue-500 border h-20 bg-white dark:bg-slate-800 dark:text-slate-100"
                  defaultValue={selectedAudit.description}
                  placeholder="Purpose and objective of audit..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 border" defaultValue={selectedAudit.type}>
                    <option>Internal</option>
                    <option>External</option>
                    <option>Supplier</option>
                    <option>Certification</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full rounded-lg border-gray-300 text-sm p-2.5 focus:ring-2 focus:ring-blue-500 border" defaultValue={selectedAudit.status}>
                    <option>Scheduled</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Delayed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Auditor</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-300 text-sm p-3 focus:ring-2 focus:ring-blue-500 border"
                    defaultValue={selectedAudit.auditor}
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Audit Date</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border-gray-300 text-sm p-3 focus:ring-2 focus:ring-blue-500 border"
                    defaultValue={selectedAudit.date}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Scope</label>
                <textarea
                  className="w-full rounded-lg border-gray-300 text-sm p-3 focus:ring-2 focus:ring-blue-500 border h-20"
                  defaultValue={selectedAudit.scope}
                  placeholder="Departments and processes to be audited..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Findings (Optional)</label>
                <textarea
                  className="w-full rounded-lg border-gray-300 text-sm p-3 focus:ring-2 focus:ring-blue-500 border h-20"
                  defaultValue={selectedAudit.findings}
                  placeholder="Document any findings from the audit"
                />
              </div>

              {/* Recommendations - Partial view in screenshot, adding for completeness */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Recommendations (Optional)</label>
                <textarea
                  className="w-full rounded-lg border-gray-300 text-sm p-3 focus:ring-2 focus:ring-blue-500 border h-20"
                  defaultValue={selectedAudit.recommendations}
                  placeholder="Ideas for improvement..."
                />
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
                  showToast('Audit Scheduled Successfully', 'success');
                  setIsModalOpen(false);
                }}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all"
              >
                Save Audit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
