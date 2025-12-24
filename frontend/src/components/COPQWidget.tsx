import { useEffect, useState } from 'react';
import { DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

interface COPQWidgetProps {
    scrapCount?: number;
    data?: any;
    simple?: boolean;
}

export function COPQWidget({ scrapCount, data, simple = false }: COPQWidgetProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const [isPulsing, setIsPulsing] = useState(false);

    // Calculate count from direct prop or data object
    const count = scrapCount ?? (data?.stats?.totalScrap || 0);

    const MATERIAL_COST = 500;
    const ENERGY_COST = 200;
    const PER_UNIT_LOSS = MATERIAL_COST + ENERGY_COST;

    const totalLoss = count * PER_UNIT_LOSS;

    useEffect(() => {
        if (totalLoss > displayValue) {
            setIsPulsing(true);
            const timeout = setTimeout(() => setIsPulsing(false), 2000);
            return () => clearTimeout(timeout);
        }
        setDisplayValue(totalLoss);
    }, [totalLoss]);

    // Simple Mode: Compact for Header
    if (simple) {
        return (
            <div className={`flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 ${isPulsing ? 'border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-900' : ''}`}>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Quality Loss (Live)</span>
                    <div className="flex items-center gap-1 text-slate-900 dark:text-slate-100 font-mono font-bold text-lg leading-none">
                        <span className="text-rose-500 dark:text-rose-400">$</span>
                        <span>{totalLoss.toLocaleString()}</span>
                    </div>
                </div>
                <div className={`p-2 rounded-lg ${totalLoss > 0 ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}>
                    <TrendingUp className={`w-4 h-4 ${totalLoss > 0 ? 'animate-pulse' : ''}`} />
                </div>
            </div>
        );
    }

    // Default Widget Mode (Card)
    return (
        <div className={`glass text-white rounded-lg p-3 flex items-center justify-between shadow-lg border-slate-700/50 overflow-hidden relative transition-all duration-300 ${isPulsing ? 'ring-2 ring-rose-500 scale-[1.02]' : ''}`}>
            {/* Background Red Glow if High */}
            {totalLoss > 0 && (
                <div className="absolute inset-0 bg-rose-600 opacity-5 animate-pulse pointer-events-none" />
            )}

            <div className="flex items-center gap-3 z-10 w-full px-2">
                <div className="bg-rose-500/20 p-2 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                    <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce-slow" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Real-Time Quality Loss</p>
                    <div className="flex items-center text-rose-400 font-mono text-xl font-bold">
                        <DollarSign className="w-5 h-5" />
                        <span>{totalLoss.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
