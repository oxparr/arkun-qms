import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, DollarSign, LogOut } from 'lucide-react';
import api from '../lib/api';

interface AndonBoardProps {
    onBack: () => void;
}

export function AndonBoard({ onBack }: AndonBoardProps) {
    const [data, setData] = useState<any>(null);
    const [machines, setMachines] = useState<any[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Clock
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, machRes] = await Promise.all([
                    api.get('/dashboard/summary'),
                    api.get('/production/machines')
                ]);
                setData(dashRes.data);
                setMachines(machRes.data);
            } catch (e) {
                console.error('Andon Polling Error', e);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000); // Fast polling for TV
        return () => clearInterval(interval);
    }, []);

    if (!data) return <div className="bg-slate-950 h-screen flex items-center justify-center text-slate-500 font-mono text-2xl">Initializing Andon...</div>;

    // Calculate OEE (Simple Average of machines that are running)
    const totalMachines = machines.length || 1;
    const runningMachines = machines.filter((m: any) => m.status === 'Running').length;
    // Mock OEE logic: Running * 0.95 efficiency
    const oee = Math.round((runningMachines / totalMachines) * 95);

    const stats = data.stats || {};
    const target = 500;
    const actual = 342; // Mocked for visual as requested, or derive from work orders if available

    // Alerts generator
    const alerts = [];
    machines.forEach((m: any) => {
        if (m.status === 'Error') alerts.push(`${m.name}: VIBRATION DETECTED`);
        if (m.health_score < 40) alerts.push(`${m.name}: PREDICTIVE MAINT REQ`);
    });
    if (data.recentNCRs?.some((n: any) => n.severity === 'Critical' && n.status === 'Open')) {
        alerts.push("CRITICAL QUALITY ALERT: STOP PRODUCTION");
    }
    if (alerts.length === 0) alerts.push("NO ACTIVE ALERTS - PRODUCTION NORMAL");

    const copq = stats.totalScrap ? stats.totalScrap * 700 : 0;

    return (
        <div className="bg-slate-950 text-white h-screen w-screen overflow-hidden p-4 font-mono relative">
            <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-rtl {
          animation: marquee 20s linear infinite;
        }
      `}</style>

            {/* Exit Button */}
            <button
                onClick={onBack}
                className="absolute top-6 right-6 z-50 bg-slate-800 text-slate-400 p-2 rounded-full hover:bg-rose-900 hover:text-white transition-colors border border-slate-700"
                title="Exit TV Mode"
            >
                <LogOut size={24} />
            </button>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b-2 border-slate-700 pb-2">
                <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    BAKIRDEF FACTORY STATUS
                </h1>
                <div className="text-3xl font-bold text-slate-400 pr-16">
                    {currentTime.toLocaleTimeString()}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 h-[calc(100vh-140px)]">

                {/* Top Left: Production Target */}
                <div className="bg-slate-900/60 rounded-2xl p-8 flex flex-col items-center justify-center border-2 border-slate-700 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-4 left-6 text-2xl text-slate-400 uppercase tracking-widest">Shift Output</div>
                    <div className="relative w-64 h-64">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="128" cy="128" r="120" stroke="#334155" strokeWidth="24" fill="none" />
                            <circle cx="128" cy="128" r="120" stroke="#10b981" strokeWidth="24" fill="none"
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={2 * Math.PI * 120 * (1 - (actual / target))}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-7xl font-bold">{actual}</span>
                            <span className="text-xl text-slate-400">/ {target}</span>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-emerald-400 text-2xl animate-pulse">
                        <TrendingUp size={32} />
                        <span>RUN RATE: 42 U/Hr</span>
                    </div>
                </div>

                {/* Top Right: OEE Score */}
                <div className={`rounded-2xl p-8 flex flex-col items-center justify-center border-2 transition-colors duration-500 backdrop-blur-sm
            ${oee < 65 ? 'bg-rose-900/20 border-rose-600' : 'bg-slate-900/60 border-slate-700'}
        `}>
                    <div className="text-2xl text-slate-400 uppercase tracking-widest mb-4">Global OEE</div>
                    <div className={`text-[12rem] font-black leading-none ${oee < 65 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
                        {oee}%
                    </div>
                    <div className="mt-4 text-3xl font-bold text-slate-500">
                        EFFICIENCY
                    </div>
                </div>

                {/* Bottom Left: Active Alerts (Ticker) */}
                <div className="bg-slate-900/60 rounded-2xl p-6 border-2 border-slate-700 flex flex-col relative overflow-hidden backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4 border-b border-slate-700 pb-4">
                        <AlertTriangle className="w-12 h-12 text-amber-500 animate-bounce" />
                        <h2 className="text-4xl font-bold text-amber-500">ACTIVE ALERTS</h2>
                    </div>
                    <div className="flex-1 flex items-center overflow-hidden relative w-full bg-black/30 rounded-xl border border-slate-700">
                        <div className="whitespace-nowrap animate-marquee-rtl text-5xl font-bold text-rose-500 absolute w-full">
                            {alerts.join("  •••  ")}  •••  {alerts.join("  •••  ")} ••• {alerts.join("  •••  ")}
                        </div>
                    </div>
                </div>

                {/* Bottom Right: COPQ (Cost of Quality) */}
                <div className="bg-slate-900/60 rounded-2xl p-8 flex flex-col items-center justify-center border-2 border-slate-700 backdrop-blur-sm">
                    <div className="text-2xl text-slate-400 uppercase tracking-widest mb-4">Cost of Poor Quality</div>
                    <div className="flex items-center gap-2 text-rose-500">
                        <DollarSign size={80} />
                        <span className="text-8xl font-black">{copq.toLocaleString()}</span>
                    </div>
                    <div className="mt-6 text-xl text-rose-400/60 font-mono">
                        REAL-TIME SCRAP LOSS
                    </div>
                </div>
            </div>
        </div>
    );
}
