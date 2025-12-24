import { useState, useMemo } from 'react';
import { Layout, TrendingUp, DollarSign, Clock, BarChart, AlertTriangle, CheckCircle, Activity, Box } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// --- MOCK DATA STORE ---
const PROJECT_DATA: any = {
    'PRJ-ALTAY': {
        id: 'PRJ-ALTAY',
        code: 'PRJ-001',
        name: 'Altay Tank Modernization',
        description: 'Main Battle Tank Life Extension Program',
        metrics: { pv: 600000, ev: 540000, ac: 580000, bac: 1250000 },
        workPackages: [
            { id: 'WP-101', name: 'Turret Integration', budget: 450000, progress: 85, cpi: 0.92, status: 'In Progress' },
            { id: 'WP-102', name: 'Armor Plating Upgrade', budget: 300000, progress: 60, cpi: 0.88, status: 'Review' },
            { id: 'WP-103', name: 'Fire Control System', budget: 250000, progress: 40, cpi: 1.05, status: 'On Track' },
            { id: 'WP-104', name: 'Mobility Testing', budget: 150000, progress: 15, cpi: 0.98, status: 'Pending' },
            { id: 'WP-105', name: 'Crew Safety Systems', budget: 100000, progress: 95, cpi: 1.10, status: 'Completed' },
        ],
        milestones: [
            { name: 'System Design Review (SDR)', date: 'Oct 15, 2025', status: 'Completed', approved: true },
            { name: 'Critical Design Review (CDR)', date: 'Dec 30, 2025', status: 'In Progress', approved: false, description: 'Finalizing armor specs and turret interface.' },
            { name: 'Test Readiness Review (TRR)', date: 'Jan 15, 2026', status: 'Pending', approved: false },
            { name: 'Production Readiness Review (PRR)', date: 'Feb 01, 2026', status: 'Pending', approved: false },
        ],
        risks: [
            { name: 'Supply Chain Delay', pos: 'M-H', color: 'orange' },
            { name: 'Quality Deviation', pos: 'H-H', color: 'rose' }
        ],
        activeRisks: 2
    },
    'PRJ-FIRTINA': {
        id: 'PRJ-FIRTINA',
        code: 'PRJ-002',
        name: 'Firtina Howitzer Update',
        description: 'Self-Propelled Howitzer Automation Upgrade',
        metrics: { pv: 800000, ev: 850000, ac: 810000, bac: 2000000 },
        workPackages: [
            { id: 'WP-201', name: 'Auto-Loader Mechanism', budget: 600000, progress: 90, cpi: 1.08, status: 'In Progress' },
            { id: 'WP-202', name: 'Ballistic Computer', budget: 400000, progress: 85, cpi: 1.12, status: 'On Track' },
            { id: 'WP-203', name: 'Chassis Reinforcement', budget: 500000, progress: 30, cpi: 0.99, status: 'On Track' },
            { id: 'WP-204', name: 'Inertial Nav System', budget: 200000, progress: 10, cpi: 1.00, status: 'Pending' },
        ],
        milestones: [
            { name: 'System Design Review (SDR)', date: 'Aug 10, 2025', status: 'Completed', approved: true },
            { name: 'Critical Design Review (CDR)', date: 'Nov 05, 2025', status: 'Completed', approved: true },
            { name: 'Test Readiness Review (TRR)', date: 'Jan 20, 2026', status: 'In Progress', approved: false, description: 'Live fire testing preparation.' },
            { name: 'Production Readiness Review (PRR)', date: 'Mar 15, 2026', status: 'Pending', approved: false },
        ],
        risks: [
            { name: 'Software Integration', pos: 'M-M', color: 'amber' }
        ],
        activeRisks: 1
    },
    'PRJ-LEOPARD': {
        id: 'PRJ-LEOPARD',
        code: 'PRJ-003',
        name: 'Leopard 2A4 Upgrade',
        description: 'Next-Gen Armor Package Implementation',
        metrics: { pv: 400000, ev: 320000, ac: 380000, bac: 1500000 }, // Behind and Over Budget
        workPackages: [
            { id: 'WP-301', name: 'Reactive Armor Tiles', budget: 500000, progress: 40, cpi: 0.78, status: 'Delayed' },
            { id: 'WP-302', name: 'Laser Warning Receiver', budget: 200000, progress: 60, cpi: 0.85, status: 'Review' },
            { id: 'WP-303', name: 'Engine Refurbishment', budget: 300000, progress: 20, cpi: 0.90, status: 'In Progress' },
        ],
        milestones: [
            { name: 'System Design Review (SDR)', date: 'Sep 01, 2025', status: 'Completed', approved: true },
            { name: 'Critical Design Review (CDR)', date: 'Dec 15, 2025', status: 'Overdue', approved: false, description: 'Pending approval of structural analysis.' },
            { name: 'Test Readiness Review (TRR)', date: 'Feb 28, 2026', status: 'Pending', approved: false },
        ],
        risks: [
            { name: 'Design Failure', pos: 'H-H', color: 'rose' },
            { name: 'Cost Overrun', pos: 'M-H', color: 'orange' },
            { name: 'Vendor Insolvency', pos: 'L-H', color: 'amber' }
        ],
        activeRisks: 3
    },
    'PRJ-SABRA': {
        id: 'PRJ-SABRA',
        code: 'PRJ-004',
        name: 'M60T Sabra Overhaul',
        description: 'Active Protection System (APS) Integration',
        metrics: { pv: 1100000, ev: 1090000, ac: 1050000, bac: 1200000 },
        workPackages: [
            { id: 'WP-401', name: 'APS Radar Installation', budget: 400000, progress: 98, cpi: 1.05, status: 'Completed' },
            { id: 'WP-402', name: 'Counter-Measure Launchers', budget: 300000, progress: 95, cpi: 1.02, status: 'Completed' },
            { id: 'WP-403', name: 'Crew Display Units', budget: 150000, progress: 80, cpi: 1.01, status: 'In Progress' },
        ],
        milestones: [
            { name: 'System Design Review (SDR)', date: 'Jan 15, 2025', status: 'Completed', approved: true },
            { name: 'Critical Design Review (CDR)', date: 'Mar 30, 2025', status: 'Completed', approved: true },
            { name: 'Test Readiness Review (TRR)', date: 'Jun 10, 2025', status: 'Completed', approved: true },
            { name: 'Production Readiness Review (PRR)', date: 'Dec 20, 2025', status: 'In Progress', approved: false, description: 'Final line certification.' },
        ],
        risks: [],
        activeRisks: 0
    }
};

export function ProjectManagement() {
    const { showToast } = useToast();
    const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-ALTAY');

    const project = useMemo(() => PROJECT_DATA[selectedProjectId], [selectedProjectId]);
    const { metrics, workPackages, milestones, risks, activeRisks } = project;

    // EVM Calculations
    const cv = metrics.ev - metrics.ac;
    const sv = metrics.ev - metrics.pv;
    const cpi = metrics.ac > 0 ? metrics.ev / metrics.ac : 0;
    const spi = metrics.pv > 0 ? metrics.ev / metrics.pv : 0;

    // Forecasting
    const cpiFixed = cpi || 1;
    const eac = metrics.bac / cpiFixed;
    const vac = metrics.bac - eac;

    const isOverBudget = vac < 0;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 transition-colors duration-300">

            {/* Header Projects Selector */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{project.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{project.description}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Project:</span>
                    <select
                        value={selectedProjectId}
                        onChange={e => setSelectedProjectId(e.target.value)}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        {Object.values(PROJECT_DATA).map((p: any) => (
                            <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* EVM Dashboard - Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Planned Value (PV)</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${metrics.pv.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">Baseline Budget Scheduled</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Earned Value (EV)</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">${metrics.ev.toLocaleString()}</p>
                    <div className="flex justify-between mt-1">
                        <p className="text-xs text-slate-400">Performed</p>
                        <p className={`text-xs font-bold ${sv >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>SV: ${sv.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Actual Cost (AC)</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">${metrics.ac.toLocaleString()}</p>
                    <div className="flex justify-between mt-1">
                        <p className="text-xs text-slate-400">Incurred</p>
                        <p className={`text-xs font-bold ${cv >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>CV: ${cv.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                        <BarChart className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Performance Index</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">CPI (Cost)</p>
                            <p className={`text-xl font-bold ${cpi >= 1 ? 'text-emerald-500' : 'text-rose-500'}`}>{cpi.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-slate-400">SPI (Schedule)</p>
                            <p className={`text-xl font-bold ${spi >= 1 ? 'text-emerald-500' : 'text-rose-500'}`}>{spi.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Variance Analysis (MIS Style) */}
            <div className={`rounded-xl overflow-hidden shadow-md text-slate-200 border shadow-black/50 ${isOverBudget ? 'bg-slate-900 border-rose-900/50' : 'bg-slate-900 border-slate-700'}`}>
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        <h3 className="font-bold tracking-wide uppercase text-sm">Forecasting & Variance Analysis</h3>
                    </div>
                    {isOverBudget ? (
                        <span className="text-[10px] bg-rose-900/50 text-rose-300 px-2 py-1 rounded border border-rose-800 animate-pulse flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> MANAGEMENT WARNING: OVER BUDGET
                        </span>
                    ) : (
                        <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-2 py-1 rounded border border-emerald-800 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> FORECAST: ON TRACK
                        </span>
                    )}
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="px-4">
                        <p className="text-xs uppercase text-slate-400 font-bold mb-1">Budget at Completion (BAC)</p>
                        <p className="text-3xl font-mono font-bold text-white">${metrics.bac.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Total Baseline Budget</p>
                    </div>
                    <div className="px-4">
                        <p className="text-xs uppercase text-slate-400 font-bold mb-1">Estimate at Completion (EAC)</p>
                        <p className={`text-3xl font-mono font-bold ${isOverBudget ? 'text-amber-400' : 'text-emerald-400'}`}>${Math.round(eac).toLocaleString()}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Forecast based on CPI {cpiFixed.toFixed(2)}</p>
                    </div>
                    <div className="px-4">
                        <p className="text-xs uppercase text-slate-400 font-bold mb-1">Variance at Completion (VAC)</p>
                        <p className={`text-3xl font-mono font-bold ${vac >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                            ${Math.round(vac).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">Projected {vac >= 0 ? 'Surplus' : 'Deficit'}</p>
                    </div>
                </div>
            </div>

            {/* Work Package Performance - Data Dense Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">Work Package Performance</h3>
                    </div>
                    <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View All Packages</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[800px]">
                        <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 uppercase text-xs font-bold border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3">WP ID</th>
                                <th className="px-6 py-3">Work Package Name</th>
                                <th className="px-6 py-3">Budget</th>
                                <th className="px-6 py-3">Progress</th>
                                <th className="px-6 py-3">CPI</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {workPackages.map((wp: any) => (
                                <tr key={wp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 font-mono text-slate-500 dark:text-slate-400 text-xs">{wp.id}</td>
                                    <td className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">{wp.name}</td>
                                    <td className="px-6 py-3 text-slate-600 dark:text-slate-300">${wp.budget.toLocaleString()}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                                <div className={`h-full rounded-full ${wp.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${wp.progress}%` }}></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{wp.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${wp.cpi >= 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'}`}>
                                            {wp.cpi.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`uppercase text-[10px] font-bold tracking-wider ${wp.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' :
                                            wp.status === 'Review' ? 'text-amber-600 dark:text-amber-400' :
                                                wp.status === 'Delayed' ? 'text-rose-600 dark:text-rose-400' :
                                                    'text-slate-500 dark:text-slate-400'
                                            }`}>
                                            {wp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Project Milestones */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/50">
                        <Layout className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Defense Milestones</h3>
                    </div>
                    <div className="p-6 relative flex-1">
                        {/* Vertical Line */}
                        <div className="absolute left-9 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800"></div>

                        <div className="space-y-8 relative">
                            {milestones.map((ms: any, idx: number) => (
                                <div key={idx} className={`flex gap-4 ${ms.status === 'Pending' ? 'opacity-60' : ''}`}>
                                    <div className={`relative z-10 w-6 h-6 rounded-full border-4 flex items-center justify-center shrink-0 
                                        ${ms.status === 'Completed' ? 'bg-emerald-500 border-emerald-100 dark:border-emerald-900' :
                                            ms.status === 'In Progress' ? 'bg-blue-600 border-blue-100 dark:border-blue-900 animate-pulse' :
                                                ms.status === 'Overdue' ? 'bg-rose-500 border-rose-100 dark:border-rose-900' :
                                                    'bg-slate-200 dark:bg-slate-700 border-slate-50 dark:border-slate-800'}`}>
                                        {ms.status === 'Completed' && <CheckCircle className="w-3 h-3 text-white" />}
                                        {ms.status === 'Overdue' && <AlertTriangle className="w-3 h-3 text-white" />}
                                        {ms.status === 'In Progress' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        {ms.status === 'Pending' && <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${ms.status === 'In Progress' ? 'text-blue-700 dark:text-blue-400' : ms.status === 'Overdue' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>{ms.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ms.status} • {ms.date}</p>
                                        {ms.approved && (
                                            <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 text-[10px] font-bold rounded uppercase">
                                                Approved
                                            </span>
                                        )}
                                        {ms.description && (
                                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-800/50">
                                                {ms.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Strategic Risk Matrix */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">Strategic Risk Matrix</h3>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Prob. vs Severity</span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-center">
                        <div className="grid grid-cols-3 gap-1 relative h-64 w-full max-w-sm mx-auto">
                            {/* Labels */}
                            <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-[10px] font-bold text-slate-400 py-4 h-full">
                                <span>High</span>
                                <span>Med</span>
                                <span>Low</span>
                            </div>
                            <div className="absolute left-0 right-0 -bottom-6 flex justify-between text-[10px] font-bold text-slate-400 px-4 w-full">
                                <span>Low</span>
                                <span>Med</span>
                                <span>High</span>
                            </div>

                            {/* Grid Cells */}
                            {/* Row 1 (High Probability) */}
                            <div className="bg-amber-100 dark:bg-amber-900/40 rounded border border-white dark:border-slate-800"></div> {/* L/H */}

                            {/* Dynamic Risk Injection Spot: M-H */}
                            <div className="bg-orange-200 dark:bg-orange-900/40 rounded border border-white dark:border-slate-800 relative group">
                                {risks.find((r: any) => r.pos === 'M-H') && (
                                    <div className="absolute inset-2 bg-slate-900/80 text-white text-[9px] flex items-center justify-center text-center rounded p-1 font-bold shadow-sm cursor-help hover:scale-110 transition-transform">
                                        {risks.find((r: any) => r.pos === 'M-H').name}
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Risk Injection Spot: H-H */}
                            <div className="bg-rose-300 dark:bg-rose-900/40 rounded border border-white dark:border-slate-800 relative group">
                                {risks.find((r: any) => r.pos === 'H-H') && (
                                    <div className="absolute inset-2 bg-rose-600 text-white text-[9px] flex items-center justify-center text-center rounded p-1 font-bold shadow-sm cursor-help hover:scale-110 transition-transform z-10">
                                        {risks.find((r: any) => r.pos === 'H-H').name}
                                    </div>
                                )}
                            </div>

                            {/* Row 2 (Med Probability) */}
                            {/* Dynamic Risk Injection Spot: M-M */}
                            <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded border border-white dark:border-slate-800 relative group">
                                {risks.find((r: any) => r.pos === 'M-M') && (
                                    <div className="absolute inset-2 bg-amber-600 text-white text-[9px] flex items-center justify-center text-center rounded p-1 font-bold shadow-sm cursor-help hover:scale-110 transition-transform">
                                        {risks.find((r: any) => r.pos === 'M-M').name}
                                    </div>
                                )}
                            </div>

                            <div className="bg-amber-100 dark:bg-amber-900/40 rounded border border-white dark:border-slate-800"></div>
                            <div className="bg-orange-200 dark:bg-orange-900/40 rounded border border-white dark:border-slate-800"></div>

                            {/* Row 3 (Low Probability) */}
                            <div className="bg-emerald-200 dark:bg-emerald-900/50 rounded border border-white dark:border-slate-800"></div>

                            {/* Dynamic Risk Injection Spot: L-H (Actually Column 3 Row 3 is Low Prob High Severity, wait grid is 3x3. 
                                Let's assume indices. 
                                Row 3 Col 3 is Low Prob High Severity? 
                                Labels are: Left: High->Low (Top->Bottom). Bottom: Low->High (Left->Right). 
                                TopLeft = High Prob, Low Severity. 
                                TopRight = High Prob, High Severity.
                                BottomLeft = Low Prob, Low Severity.
                            */}

                            <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded border border-white dark:border-slate-800"></div>

                            <div className="bg-amber-100 dark:bg-amber-900/40 rounded border border-white dark:border-slate-800 relative group">
                                {risks.find((r: any) => r.pos === 'L-H') && (
                                    <div className="absolute inset-2 bg-slate-900/80 text-white text-[9px] flex items-center justify-center text-center rounded p-1 font-bold shadow-sm cursor-help hover:scale-110 transition-transform">
                                        {risks.find((r: any) => r.pos === 'L-H').name}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-8 text-center text-xs text-slate-400 italic">
                            {activeRisks} Active Risks Identified in Critical Path
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
