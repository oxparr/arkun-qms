import { useState } from 'react';
import { Wrench, AlertTriangle, Lock, Search, Plus, Gauge, RotateCcw, X, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Tool {
  id: string;
  toolName: string;
  toolNumber: string;
  type: string;
  maxLifeCycles: number;
  currentCycles: number;
  status: 'Active' | 'Near End-of-Life' | 'End-of-Life' | 'Locked';
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  calibrationStatus: 'Valid' | 'Due Soon' | 'Overdue';
  assignedTo?: string;
}

export function ToolManagement() {
  const { showToast } = useToast();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showCalibrationLock, setShowCalibrationLock] = useState(false);

  const tools: Tool[] = [
    {
      id: 'TOOL-001',
      toolName: 'Carbide End Mill - 0.500"',
      toolNumber: 'T-12345',
      type: 'Cutting Tool',
      maxLifeCycles: 1000,
      currentCycles: 850,
      status: 'Near End-of-Life',
      lastCalibrationDate: 'N/A',
      nextCalibrationDate: 'N/A',
      calibrationStatus: 'Valid',
      assignedTo: 'CNC Cell 1',
    },
    {
      id: 'TOOL-002',
      toolName: 'Torque Wrench - 0-100 ft-lb',
      toolNumber: 'T-67890',
      type: 'Calibrated Tool',
      maxLifeCycles: 5000,
      currentCycles: 3200,
      status: 'Active',
      lastCalibrationDate: '2025-06-15',
      nextCalibrationDate: '2025-12-15',
      calibrationStatus: 'Due Soon',
      assignedTo: 'Assembly Bay 3',
    },
    {
      id: 'TOOL-003',
      toolName: 'Drill Bit Set - HSS',
      toolNumber: 'T-24680',
      type: 'Cutting Tool',
      maxLifeCycles: 500,
      currentCycles: 500,
      status: 'End-of-Life',
      lastCalibrationDate: 'N/A',
      nextCalibrationDate: 'N/A',
      calibrationStatus: 'Valid',
    },
    {
      id: 'TOOL-004',
      toolName: 'Micrometer - 0-1"',
      toolNumber: 'T-13579',
      type: 'Calibrated Tool',
      maxLifeCycles: 10000,
      currentCycles: 4500,
      status: 'Locked',
      lastCalibrationDate: '2025-03-10',
      nextCalibrationDate: '2025-09-10',
      calibrationStatus: 'Overdue',
      assignedTo: 'Quality Lab 2',
    },
  ];

  const getLifePercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    if (tool.status === 'Near End-of-Life' || tool.status === 'End-of-Life') {
      setShowWarningModal(true);
    } else if (tool.calibrationStatus === 'Overdue' || tool.status === 'Locked') {
      setShowCalibrationLock(true);
    } else {
      // Just show info toast for active normal tools for now, or open edit modal if implemented
      showToast(`Selected ${tool.toolName}`, 'info');
    }
  };

  const stats = {
    total: tools.length,
    active: tools.filter(t => t.status === 'Active').length,
    nearEOL: tools.filter(t => t.status === 'Near End-of-Life').length,
    calibrationOverdue: tools.filter(t => t.calibrationStatus === 'Overdue').length
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Tool Life & Calibration</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 text-emerald-500" />
            AS9100 Clause 7.1.5 - Monitoring and Measuring Resources
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium">
            <Plus className="w-4 h-4" /> Register Tool
          </button>
        </div>
      </div>

      {/* --- Alert Banners --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 p-6 rounded-xl flex items-start gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400"><AlertTriangle className="w-6 h-6" /></div>
          <div>
            <h3 className="font-bold text-amber-800 dark:text-amber-400">Tool Life Alerts</h3>
            <p className="text-amber-700 dark:text-amber-300/80 text-sm mt-1">{stats.nearEOL} tool(s) are nearing end-of-life (&gt;85% usage). Please check inventory usage.</p>
          </div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 p-6 rounded-xl flex items-start gap-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/40 rounded-lg text-rose-600 dark:text-rose-400"><Lock className="w-6 h-6" /></div>
          <div>
            <h3 className="font-bold text-rose-800 dark:text-rose-400">Calibration Locks</h3>
            <p className="text-rose-700 dark:text-rose-300/80 text-sm mt-1">{stats.calibrationOverdue} tool(s) are overdue for calibration. Usage is strictly blocked.</p>
          </div>
        </div>
      </div>

      {/* --- KPI Widgets --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400"><Wrench className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Tools</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400"><Gauge className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.active}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400"><RotateCcw className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Wear Alert</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.nearEOL}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400"><Lock className="w-8 h-8" /></div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Locked</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.calibrationOverdue}</p>
          </div>
        </div>
      </div>

      {/* --- Tool Inventory --- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Tool Inventory</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search tool ID or name..." className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 dark:text-slate-100" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Tool Details</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Life Remaining</th>
                <th className="px-6 py-4">Calibration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tools.map((tool) => {
                const lifePercent = getLifePercentage(tool.currentCycles, tool.maxLifeCycles);
                return (
                  <tr
                    key={tool.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0"
                    onClick={() => handleToolClick(tool)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{tool.toolName}</p>
                          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{tool.toolNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{tool.type}</td>
                    <td className="px-6 py-4 w-48">
                      <div className="flex justify-between mb-1 text-xs font-bold">
                        <span className="text-slate-500 dark:text-slate-400">{tool.currentCycles} / {tool.maxLifeCycles}</span>
                        <span className={`${lifePercent >= 100 ? 'text-rose-600 dark:text-rose-400' :
                          lifePercent >= 85 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>{Math.round(lifePercent)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${lifePercent >= 100 ? 'bg-rose-500' :
                          lifePercent >= 85 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} style={{ width: `${Math.min(lifePercent, 100)}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tool.type === 'Calibrated Tool' ? (
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${tool.calibrationStatus === 'Overdue' ? 'bg-rose-500' :
                            tool.calibrationStatus === 'Due Soon' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} />
                          <div>
                            <p className={`text-xs font-bold ${tool.calibrationStatus === 'Overdue' ? 'text-rose-600' :
                              tool.calibrationStatus === 'Due Soon' ? 'text-amber-600' : 'text-emerald-600'
                              }`}>{tool.calibrationStatus}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Next: {tool.nextCalibrationDate}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${tool.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900/50' :
                        tool.status === 'Locked' ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900/50' :
                          tool.status === 'End-of-Life' ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-900/50' :
                            'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50'
                        }`}>
                        {tool.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${tool.status === 'Locked' || tool.status === 'End-of-Life' ?
                          'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-not-allowed' :
                          'bg-white text-blue-600 border-slate-200 hover:bg-blue-50 hover:border-blue-200 dark:bg-slate-800 dark:text-blue-400 dark:border-slate-700 dark:hover:bg-blue-900/30'
                          }`}
                      >
                        {tool.type === 'Calibrated Tool' ? 'Log Usage' : 'Checkout'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- WARNING MODAL (Deep Port) --- */}
      {showWarningModal && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-slate-800">

            {/* Header */}
            <div className="bg-amber-400 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-amber-900" />
                <h3 className="text-xl font-bold text-amber-900">Tool Nearing End-of-Life</h3>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedTool.toolName}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-mono mt-1">Tool Number: {selectedTool.toolNumber}</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-amber-800 text-sm">Tool life at {Math.round(getLifePercentage(selectedTool.currentCycles, selectedTool.maxLifeCycles))}%</span>
                </div>
                <div className="w-full bg-amber-200 h-2.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(getLifePercentage(selectedTool.currentCycles, selectedTool.maxLifeCycles), 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs font-mono text-amber-700 dark:text-amber-300 mb-4">
                  Current: {selectedTool.currentCycles} / {selectedTool.maxLifeCycles} cycles
                </p>
                <p className="text-amber-800 dark:text-amber-200 text-sm font-medium leading-relaxed">
                  Please plan for tool replacement soon. Continued use may result in poor quality or tool breakage.
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowWarningModal(false);
                    showToast('Warning acknowledged', 'info');
                  }}
                  className="px-5 py-2.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all shadow-md border-b-2 border-amber-600"
                >
                  Acknowledge & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calibration Lock Modal (Existing Logic) */}
      {showCalibrationLock && selectedTool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-slate-800">
            <div className="bg-rose-500 p-6">
              <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Usage Blocked</h3>
                  <p className="text-rose-100 text-sm">Hardware Interlock Active</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4 bg-white dark:bg-slate-900">
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedTool.toolName}</p>
                <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">{selectedTool.toolNumber}</p>
              </div>

              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-rose-800 dark:text-rose-300 font-bold text-sm mb-1">Calibration Expired</p>
                    <p className="text-rose-600 dark:text-rose-400 text-xs">
                      This device has exceeded its calibration interval ({selectedTool.nextCalibrationDate}).
                      Use is strictly prohibited to prevent quality escape.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setShowCalibrationLock(false);
                    setSelectedTool(null);
                  }}
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors"
                >
                  Acknowledge & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
