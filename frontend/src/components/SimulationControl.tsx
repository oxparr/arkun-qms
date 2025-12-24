
import { useState } from 'react';
import { Settings, AlertTriangle, PenTool, Database, RefreshCw, CheckCircle, Ticket } from 'lucide-react';
import api from '../lib/api';

export function SimulationControl() {
    const [loading, setLoading] = useState('');
    const [success, setSuccess] = useState('');

    const handleAction = async (action: string, endpoint: string) => {
        setLoading(action);
        setSuccess('');
        try {
            await api.post(`/simulation/${endpoint}`);
            setSuccess(`Successfully triggered: ${action}`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setSuccess(`Simulated Trigger: ${action} (Dev Mode)`);
            setTimeout(() => setSuccess(''), 3000);
        } finally {
            setLoading('');
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">

            <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-xl border border-purple-200">
                    <Ticket className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Simulation Control Center</h2>
                    <p className="text-slate-500 flex items-center gap-2 text-sm mt-1">
                        Dynamic Scenario Injection for Demo Purposes (Manager Only)
                    </p>
                </div>
            </div>

            {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold text-sm">{success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Scenario 1: Breakdown */}
                <div className="bg-white dark:bg-slate-900/80 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 group-hover:text-red-600 transition-colors">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Force Machine Breakdown
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                Immediately sets <strong>CNC-001</strong> to ERROR state and drops Health Score to 20%.
                                <br /><em className="text-xs text-red-500/70 font-bold">Triggers: Dashboard Red Alert, Andon Map Pulse.</em>
                            </p>
                        </div>
                        <button
                            onClick={() => handleAction('Breakdown', 'force-breakdown')}
                            disabled={!!loading}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-100 transition-colors">
                            {loading === 'Breakdown' ? 'Injecting...' : 'EXECUTE'}
                        </button>
                    </div>
                </div>

                {/* Scenario 2: Tool Expiry */}
                <div className="bg-white dark:bg-slate-900/80 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 group-hover:text-orange-600 transition-colors">
                                <PenTool className="w-5 h-5 text-orange-500" />
                                Expire Tool Life
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                Sets <strong>Drill-001</strong> life to 0%.
                                <br /><em className="text-xs text-orange-500/70 font-bold">Triggers: Interlock on Operator Panel (403 Forbidden).</em>
                            </p>
                        </div>
                        <button
                            onClick={() => handleAction('Expire Tool', 'expire-tool')}
                            disabled={!!loading}
                            className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-100 border border-orange-100 transition-colors">
                            {loading === 'Expire Tool' ? 'Injecting...' : 'EXECUTE'}
                        </button>
                    </div>
                </div>

                {/* Scenario 3: Quality Spike */}
                <div className="bg-white dark:bg-slate-900/80 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 group-hover:text-amber-600 transition-colors">
                                <Database className="w-5 h-5 text-amber-500" />
                                Inject Quality Spike
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                Generates 5 random <strong>Critical NCRs</strong> instantly.
                                <br /><em className="text-xs text-amber-500/70 font-bold">Triggers: Andon Board Ticker & COPQ value jump.</em>
                            </p>
                        </div>
                        <button
                            onClick={() => handleAction('Quality Spike', 'inject-ncr')}
                            disabled={!!loading}
                            className="bg-amber-50 text-amber-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-100 border border-amber-100 transition-colors">
                            {loading === 'Quality Spike' ? 'Injecting...' : 'EXECUTE'}
                        </button>
                    </div>
                </div>

                {/* Scenario 4: Revision Update (Mock) */}
                <div className="bg-white dark:bg-slate-900/80 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                <RefreshCw className="w-5 h-5 text-blue-500" />
                                Issue New Revision
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                Activates <strong>Rev B</strong> for Titanium Bracket.
                                <br /><em className="text-xs text-blue-500/70 font-bold">Triggers: Revision mismatch on active orders.</em>
                            </p>
                        </div>
                        <button
                            onClick={() => setSuccess('Mock Revision B Issued via PLM Link')}
                            disabled={!!loading}
                            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-100 transition-colors">
                            EXECUTE
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
