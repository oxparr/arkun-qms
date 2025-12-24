import { useEffect, useState } from 'react';
import { Monitor, Box, Activity, Play, Square, AlertTriangle, CheckCircle, Smartphone, Lock, XCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';

interface Machine {
    id: string;
    name: string;
    status: 'Idle' | 'Running' | 'Error' | 'Maintenance';
    health: number;
    currentJob?: string;
    rpm?: number;
    temp?: number;
    min_competency_level?: number; // Zero-Error: Skill Enforcement
}

interface WorkOrder {
    id: string;
    partNumber: string;
    qty: number;
    status: 'Pending' | 'In Progress' | 'Completed';
}

export function OperatorDashboard() {
    const { showToast } = useToast();
    const [selectedWo, setSelectedWo] = useState<string | null>(null);
    const [workOrders] = useState<WorkOrder[]>([
        { id: 'WO-2025-001', partNumber: 'PN-1001', qty: 32, status: 'Pending' },
        { id: 'WO-2025-002', partNumber: 'PN-1002', qty: 18, status: 'Pending' },
        { id: 'WO-2025-003', partNumber: 'PN-1003', qty: 62, status: 'Pending' },
        { id: 'WO-2025-004', partNumber: 'PN-1004', qty: 30, status: 'Pending' },
        { id: 'WO-2025-005', partNumber: 'PN-1005', qty: 12, status: 'Pending' },
    ]);

    const [machines, setMachines] = useState<Machine[]>([
        { id: 'CNC-001', name: 'CNC-001', status: 'Error', health: 20, min_competency_level: 3 },
        { id: 'CNC-002', name: 'CNC-002', status: 'Error', health: 88.5, min_competency_level: 4 },
        { id: 'CNC-003', name: 'CNC-003', status: 'Error', health: 86.6, min_competency_level: 2 },
        { id: 'FRN-001', name: 'FURNACE-001', status: 'Error', health: 77.1, min_competency_level: 5 },
        { id: 'FRN-002', name: 'FURNACE-002', status: 'Error', health: 97.8, min_competency_level: 1 },
        { id: 'CMM-001', name: 'CMM-001', status: 'Error', health: 95.3, min_competency_level: 3 },
    ]);

    // Error Modal State
    const [errorModal, setErrorModal] = useState<{ type: 'skill' | 'fai' | null, message: string }>({ type: null, message: '' });

    // Simulate "Live" Health Data to make it feel alive
    useEffect(() => {
        const interval = setInterval(() => {
            setMachines(prev => prev.map(m => ({
                ...m,
                health: Math.min(100, Math.max(0, m.health + (Math.random() - 0.5) * 2))
            })));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Mock User Competency (Simulated from Auth)
    const USER_LEVEL = 3;

    const handleStartMachine = async (machineId: string) => {
        if (!selectedWo) {
            showToast('Please select a Work Order first!', 'error');
            return;
        }

        const machine = machines.find(m => m.id === machineId);
        if (!machine) return;

        // 1. Zero-Error: Competency Check
        if ((machine.min_competency_level || 0) > USER_LEVEL) {
            setErrorModal({
                type: 'skill',
                message: `Competency Gap: Machine requires Level ${machine.min_competency_level}, but you are Level ${USER_LEVEL}. Training required.`
            });
            // Log Audit Risk
            console.warn(`[AUDIT] Blocked Start: Unauthorized Skill Level for ${machineId}`);
            showToast('Quality Risk Logged: Unauthorized Start Attempt', 'error');
            return;
        }

        // 2. Zero-Error: FAI Status Check
        const wo = workOrders.find(w => w.id === selectedWo);
        const partNumber = wo?.partNumber;
        const faiStatus = localStorage.getItem(`fai-status-${partNumber}`);

        if (faiStatus === 'Rejected') {
            setErrorModal({
                type: 'fai',
                message: `STOP! FAI for ${partNumber} is REJECTED. Production is strictly locked until a Corrective Action (CAPA) is resolved.`
            });
            console.warn(`[AUDIT] Blocked Start: FAI Rejected for ${partNumber}`);
            showToast('Quality Risk Logged: Attempt to start Rejected FAI', 'error');
            return;
        }

        try {
            await api.post(`/work-orders/${selectedWo}/start`, { machineId });

            // Optimistic Update
            setMachines(prev => prev.map(m => {
                if (m.id === machineId) {
                    return { ...m, status: 'Running', currentJob: wo?.partNumber, health: 100 };
                }
                return m;
            }));

            // 3. Auto-Stock Deduction & EVM Sync
            showToast('Materials Auto-Deducted from Inventory', 'info');

            // Simulating EVM Update
            const costImpact = 500; // Mock material cost
            const evmData = JSON.parse(localStorage.getItem('evm-data') || '{"actualCost": 15000}');
            evmData.actualCost += costImpact;
            localStorage.setItem('evm-data', JSON.stringify(evmData));
            showToast(`EVM Sync: Project Actual Cost updated (+$${costImpact})`, 'success');

            // 4. Digital Genealogy Logging
            const newLog = {
                timestamp: new Date().toISOString(),
                action: 'Production Start',
                details: `Started ${wo?.partNumber} on ${machine.name}. Stock deduced. Validated Skill Level ${USER_LEVEL}.`,
                machine: machine.name,
                operator: `Operator (Lvl ${USER_LEVEL})`,
                type: 'production'
            };
            const existingLogs = JSON.parse(localStorage.getItem('traceability-logs') || '[]');
            localStorage.setItem('traceability-logs', JSON.stringify([newLog, ...existingLogs]));

            showToast(`Started ${machineId} with ${selectedWo}`, 'success');
            setSelectedWo(null);

        } catch (error: any) {
            console.error("Start Failed", error);
            const msg = error.response?.data?.error || 'Failed to start machine';
            showToast(msg, 'error');
        }
    };

    const handleStopMachine = (machineId: string) => {
        setMachines(prev => prev.map(m => {
            if (m.id === machineId) {
                return { ...m, status: 'Idle', currentJob: undefined };
            }
            return m;
        }));
        showToast(`${machineId} Stopped`, 'warning');
    };

    const handleInitiateCAPA = () => {
        showToast('Redirecting to CAPA Module...', 'info');
        setErrorModal({ type: null, message: '' });
        // In real app: navigate('/capa/new')
        // For simulation, we'll confirm the action
        setTimeout(() => showToast('CAPA Draft Created for FAI Failure', 'success'), 1000);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 relative">

            {/* ERROR MODAL */}
            {errorModal.type && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className={`p-6 ${errorModal.type === 'skill' ? 'bg-rose-50' : 'bg-amber-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${errorModal.type === 'skill' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {errorModal.type === 'skill' ? <XCircle className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                                </div>
                                <div>
                                    <h3 className={`text-lg font-bold ${errorModal.type === 'skill' ? 'text-rose-900' : 'text-amber-900'}`}>
                                        {errorModal.type === 'skill' ? 'Skill Gap Limit' : 'Quality Hold Active'}
                                    </h3>
                                    <p className={`text-sm ${errorModal.type === 'skill' ? 'text-rose-700' : 'text-amber-700'}`}>
                                        Zero-Error Protocol Violation
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-700 font-medium text-lg leading-relaxed mb-6">
                                {errorModal.message}
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setErrorModal({ type: null, message: '' })}
                                    className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Dismiss
                                </button>
                                {errorModal.type === 'fai' && (
                                    <button
                                        onClick={handleInitiateCAPA}
                                        className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                                    >
                                        Initiate CAPA
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl border border-blue-200">
                    <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Operator Workstation</h2>
                    <p className="text-slate-500 flex items-center gap-2 text-sm mt-1">
                        Select Work Order and Assign to Machine
                    </p>
                </div>
            </div>

            {/* Work Orders List (Carousel) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Box className="w-4 h-4 text-emerald-500" />
                    Available Work Orders
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                    {workOrders.map(wo => (
                        <div
                            key={wo.id}
                            onClick={() => setSelectedWo(wo.id)}
                            className={`min-w-[240px] p-5 rounded-xl cursor-pointer border transition-all duration-200 relative group
                                ${selectedWo === wo.id
                                    ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500 dark:bg-blue-900/20 dark:border-blue-500/50'
                                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-500/50'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-lg text-slate-900">{wo.partNumber}</span>
                                {selectedWo === wo.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                            </div>
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded font-mono block w-fit mb-3">{wo.id}</span>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Target Qty:</span>
                                <span className="font-bold text-slate-900">{wo.qty}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Machines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machines.map(machine => {
                    const isError = machine.status === 'Error';
                    const isRunning = machine.status === 'Running';
                    const skillGap = (machine.min_competency_level || 0) > USER_LEVEL;

                    // Smart Tooltip Logic
                    let startTooltip = "Start Production";
                    if (skillGap) startTooltip = `LOCKED: Requires Level ${machine.min_competency_level}, You are Level ${USER_LEVEL}`;
                    if (isRunning) startTooltip = "Machine is currently running";

                    return (
                        <div key={machine.id} className={`p-6 rounded-xl border shadow-sm transition-all ${isError ? 'bg-rose-50 border-rose-100' :
                            isRunning ? 'bg-emerald-50 border-emerald-100' :
                                'bg-white border-slate-200'
                            }`}>

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900">{machine.name}</h4>
                                    {isRunning && <span className="text-xs font-mono text-emerald-600 font-bold mt-1 block">JOB: {machine.currentJob}</span>}
                                    {machine.min_competency_level && (
                                        <span className={`text-[10px] font-bold uppercase tracking-wider block mt-1 ${skillGap ? 'text-rose-500' : 'text-slate-400'}`}>
                                            Req. Skill Level: {machine.min_competency_level}
                                        </span>
                                    )}
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isError ? 'bg-rose-100 text-rose-600 border border-rose-200' :
                                    isRunning ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                                        'bg-slate-100 text-slate-500 border border-slate-200'
                                    }`}>
                                    {machine.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> System Health</span>
                                    <span>{machine.health.toFixed(2)}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${machine.health < 40 ? 'bg-rose-500' :
                                            machine.health < 80 ? 'bg-amber-500' :
                                                'bg-emerald-500'
                                            }`}
                                        style={{ width: `${machine.health}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleStartMachine(machine.id)}
                                    title={startTooltip}
                                    className={`flex-1 flex items-center justify-center gap-2 text-white py-2 rounded-lg font-bold text-sm shadow-sm transition-all
                                        ${skillGap ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'}`}
                                >
                                    {skillGap ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                                    START
                                </button>
                                <button
                                    onClick={() => handleStopMachine(machine.id)}
                                    disabled={!isRunning}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm shadow-sm transition-all ${isRunning
                                        ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-900/50 dark:text-slate-600'
                                        }`}
                                >
                                    <Square className="w-4 h-4 fill-current" /> STOP
                                </button>
                            </div>

                        </div>
                    );
                })}
            </div>

        </div>
    );
}
