
import { useState } from 'react';
import { GitCommit, Search, Box, Factory, FileCheck, ChevronRight, QrCode, AlertTriangle, FileText, CheckCircle, Monitor, Copy, Zap, MapPin, User, Anchor } from 'lucide-react';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

export function MaterialTraceability() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('WO-2025-001');
    showToast('Copied WO-2025-001 to clipboard', 'info');
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setResult(null);

    // DEMO OVERRIDE: Specific High-Fidelity Data for 'WO-2025-001'
    if (searchTerm === 'WO-2025-001') {
      setTimeout(() => {
        setResult({
          workOrder: { id: 'WO-2025-001', part_number: 'PN-TANK-MOD-77', project_name: 'Altay Tank Modernization' },
          metadata: {
            totalCycleTime: '8.5 Hours',
            energyConsumption: '124 kWh',
            qualityStatus: 'Verified'
          },
          timeline: [
            {
              stage: 'Material Origin',
              icon: <Box className="w-5 h-5" />,
              color: 'blue',
              timestamp: '2025-10-12 08:30:00',
              title: 'Material Origin Verified',
              details: (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Material Link:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-xs border border-blue-100 dark:border-blue-800">TI-BILLET-7075</span>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Supplier Cert #9921</span>
                    <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400"><Anchor className="w-3 h-3" /> Government Property</span>
                  </div>
                </div>
              )
            },
            {
              stage: 'Precision Machining',
              icon: <Factory className="w-5 h-5" />,
              color: 'purple',
              timestamp: '2025-10-14 14:15:00',
              title: 'Precision Machining Completed',
              details: (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200">CNC Milling - Station A-01</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">Time: 4h 12m</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700">
                    <User className="w-3 h-3" /> Operator: <span className="font-bold">John Smith (Level 4)</span>
                  </div>
                </div>
              )
            },
            {
              stage: 'Quality Assurance',
              icon: <FileCheck className="w-5 h-5" />,
              color: 'emerald',
              timestamp: '2025-10-15 09:45:00',
              title: 'Quality Assurance Passed',
              details: (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">FAI Verified</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 pl-6 border-l-2 border-emerald-100 dark:border-emerald-900/30 space-y-1">
                    <p>• NCR-2025-003 Resolved (Dimensional Variance)</p>
                    <p className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                      <GitCommit className="w-3 h-3" /> Digital Signature: <span className="font-mono">0x7f...3a9</span> Verified
                    </p>
                  </div>
                </div>
              )
            },
            {
              stage: 'Final Disposition',
              icon: <MapPin className="w-5 h-5" />,
              color: 'slate',
              timestamp: '2025-10-16 11:00:00',
              title: 'Ready for Shipment',
              details: (
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Current Location</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">Rack B-03</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full uppercase border border-emerald-200 dark:border-emerald-800">
                    Ready
                  </span>
                </div>
              )
            }
          ]
        });
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const res = await api.get(`/traceability/${searchTerm}`);
      // Fallback normal logic
      const localLogs = JSON.parse(localStorage.getItem('traceability-logs') || '[]')
        .filter((log: any) =>
          (log.details && log.details.includes(searchTerm)) ||
          (log.workOrder && log.workOrder === searchTerm)
        );

      if (localLogs.length > 0) {
        res.data.timeline = [...localLogs, ...res.data.timeline];
      }
      setResult(res.data);
    } catch (e) {
      // Basic Fallback
      setResult(null);
      showToast('Traceability Record Not Found (Try WO-2025-001)', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* --- Header --- */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Digital Product Genealogy</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
          <GitCommit className="w-4 h-4 text-emerald-500" />
          AS9100 Clause 8.5.2 - Identification and Traceability (DNA View)
        </p>
      </div>

      {/* --- Search Area --- */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center transition-colors">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
          <QrCode className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Search Traceability Record</h3>
        <div className="flex items-center justify-center gap-2 mb-6">
          <p className="text-slate-500 dark:text-slate-400">Enter Work Order ID to verify full production lineage.</p>
          <div
            className="flex items-center gap-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-500 dark:text-slate-300"
            onClick={handleCopy}
            title="Click to Copy Example"
          >
            WO-2025-001 <Copy className="w-3 h-3" />
          </div>
        </div>

        <div className="max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="e.g. WO-2025-001"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 shadow-sm text-lg bg-white dark:bg-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-all"
          >
            {loading ? 'Tracing DNA...' : 'Trace DNA'}
          </button>
        </div>
      </div>

      {/* --- Result Timeline --- */}
      {result && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

          {/* DNA Summary Badge */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-700">
            <div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Traceability Verified</span>
              <h3 className="text-xl font-bold mt-1">{result.workOrder.part_number} - {result.workOrder.id}</h3>
              <p className="text-slate-400 text-sm">Project: {result.workOrder.project_name || 'N/A'}</p>
            </div>

            <div className="flex gap-4">
              <div className="bg-slate-800 p-3 rounded-lg text-center min-w-[140px] border border-slate-700">
                <p className="text-xs text-slate-400 uppercase font-bold flex items-center justify-center gap-1"><Monitor className="w-3 h-3" /> Cycle Key</p>
                <div className="text-lg font-mono font-bold mt-1 text-emerald-400">{result.metadata.totalCycleTime || '0m'}</div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg text-center min-w-[140px] border border-slate-700">
                <p className="text-xs text-slate-400 uppercase font-bold flex items-center justify-center gap-1"><Zap className="w-3 h-3 text-yellow-400" /> Energy</p>
                <div className="text-lg font-mono font-bold mt-1 text-yellow-400">{result.metadata.energyConsumption || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-8 transition-colors">
            <div className="relative">
              {/* Vertical Thread Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

              <div className="space-y-12">
                {result.timeline.map((event: any, idx: number) => {
                  return (
                    <div key={idx} className="relative flex items-start gap-6 group">
                      {/* Node Icon */}
                      <div className={`w-12 h-12 rounded-full border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center z-10 shrink-0 
                        ${event.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' :
                          event.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' :
                            event.color === 'emerald' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' :
                              event.color === 'rose' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400' :
                                'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                        {event.icon || <Box className="w-5 h-5" />}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1">
                        <div className={`p-5 rounded-xl border transition-all hover:shadow-md 
                            ${event.color === 'rose' ? 'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/50' :
                            'bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-700'}`}>

                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${event.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                  event.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                                    event.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                                      'text-slate-500 dark:text-slate-400'
                                }`}>
                                {event.stage || 'Event Log'}
                              </span>
                              <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">{event.title || event.action}</h4>
                            </div>
                            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                              {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'N/A'}
                            </span>
                          </div>

                          <div className="text-sm text-slate-600 dark:text-slate-300">
                            {event.details}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Digital Thread End Anchor */}
                <div className="relative flex items-start gap-6 group opacity-50">
                  <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center z-10 shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
