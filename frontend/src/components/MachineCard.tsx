
import { Activity, Play, Square, AlertTriangle, Monitor, Sparkles, Clock, AlertOctagon } from 'lucide-react';

interface Machine {
    id: string;
    name: string;
    status: 'Idle' | 'Running' | 'Error' | 'Maintenance';
    health_score: number;
    oee: number;
    currentJob?: string;
    predicted_rul?: number; // AI Field
    failure_probability?: number; // AI Field
}

interface MachineCardProps {
    machine: Machine;
    onStart: (id: string) => void;
    onStop: (id: string) => void;
    userRole?: string;
}

export function MachineCard({ machine, onStart, onStop, userRole }: MachineCardProps) {
    const isError = machine.status === 'Error';
    const isRunning = machine.status === 'Running';
    const isMaintenance = machine.status === 'Maintenance';
    const pof = machine.failure_probability || 0;
    const isHighRisk = pof > 80;

    return (
        <div className={`p-6 rounded-xl border shadow-sm transition-all relative overflow-hidden ${isError ? 'bg-rose-50 border-rose-100' :
                isHighRisk && !isMaintenance ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-400 ring-opacity-50' :
                    isRunning ? 'bg-emerald-50 border-emerald-100' :
                        'bg-white border-slate-200'
            }`}>

            {/* AI High Risk Badge */}
            {isHighRisk && !isError && !isMaintenance && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1 shadow-sm animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> PREDICTIVE ALERT
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        {machine.name}
                        {machine.predicted_rul !== undefined && (
                            <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> AI Active
                            </span>
                        )}
                    </h4>
                    {isRunning && <span className="text-xs font-mono text-emerald-600 font-bold mt-1 block">JOB: {machine.currentJob || 'Running'}</span>}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-6 ${isError ? 'bg-rose-100 text-rose-600 border border-rose-200' :
                        isMaintenance ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                            isRunning ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                                'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                    {machine.status}
                </span>
            </div>

            {/* AI Metrics Area */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/60 rounded-lg p-2 border border-slate-100">
                    <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> RUL (Est.)
                    </p>
                    <p className="text-sm font-bold text-slate-800">{machine.predicted_rul?.toFixed(0) || '---'} hrs</p>
                </div>
                <div className={`rounded-lg p-2 border ${isHighRisk ? 'bg-amber-100/50 border-amber-200' : 'bg-white/60 border-slate-100'}`}>
                    <p className={`text-[10px] uppercase font-bold flex items-center gap-1 ${isHighRisk ? 'text-amber-700' : 'text-slate-500'}`}>
                        <AlertOctagon className="w-3 h-3" /> Failure Prob.
                    </p>
                    <p className={`text-sm font-bold ${isHighRisk ? 'text-amber-700' : 'text-slate-800'}`}>{machine.failure_probability?.toFixed(1) || '0'}%</p>
                </div>
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> System Health</span>
                    <span>{machine.health_score.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${machine.health_score < 40 ? 'bg-rose-500' :
                                machine.health_score < 80 ? 'bg-amber-500' :
                                    'bg-emerald-500'
                            }`}
                        style={{ width: `${machine.health_score}%` }}
                    />
                </div>
            </div>

            {userRole === 'operator' && (
                <div className="flex gap-3">
                    <button
                        onClick={() => onStart(machine.id)}
                        disabled={isRunning || isError || isMaintenance}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-all ${isRunning || isError || isMaintenance ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                    >
                        <Play className="w-4 h-4 fill-current" /> START
                    </button>
                    <button
                        onClick={() => onStop(machine.id)}
                        disabled={!isRunning}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm shadow-sm transition-all ${isRunning
                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <Square className="w-4 h-4 fill-current" /> STOP
                    </button>
                </div>
            )}
        </div>
    );
}
