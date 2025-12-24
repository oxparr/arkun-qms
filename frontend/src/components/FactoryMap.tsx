import { useState } from 'react';
import { Settings, ClipboardCheck, Package, CircleDot, Activity, Zap, Gauge, Box, ArrowRight } from 'lucide-react';

interface FactoryMapProps {
    machines: any[];
    onMachineClick?: (machineId: string) => void;
}

export function FactoryMap({ machines, onMachineClick }: FactoryMapProps) {
    const getMachine = (partialId: string) => machines.find(m => m.id.includes(partialId));

    const cnc = getMachine('CNC') || { id: 'CNC-001', status: 'Offline', health_score: 0, oee: 0 };
    const frn = getMachine('MILL') || { id: 'FRN-001', status: 'Offline', health_score: 0, oee: 0 };
    const cmm = getMachine('CMM') || { id: 'CMM-001', status: 'Offline', health_score: 0, oee: 0 };

    return (
        <div className="w-full h-[500px] border border-slate-300 dark:border-slate-700 rounded-xl relative overflow-hidden shadow-inner group select-none bg-slate-50 dark:bg-slate-900/50 blueprint-grid flex flex-col">

            {/* Legend / Floor Label - Floating Absolute is fine for label */}
            <div className="absolute top-6 left-8 bg-white/80 dark:bg-slate-950/50 backdrop-blur border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg shadow-sm z-30">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    Production Floor A-01
                </h3>
            </div>

            {/* Floor Area Markings - Decorative Background */}
            <div className="absolute inset-x-10 top-20 bottom-20 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[50px] pointer-events-none opacity-50" />

            {/* MAIN FLEX CONTAINER */}
            <div className="flex-1 flex flex-row items-center justify-center w-full gap-0 overflow-x-auto p-10 z-10 relative">

                {/* 1. STORAGE */}
                <div className="w-24 h-32 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center p-2 relative group hover:shadow-md transition-all shrink-0">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest text-center mt-auto mb-auto">STORAGE</span>
                    <div className="absolute bottom-0 w-full h-1 bg-slate-200 dark:bg-slate-600" />
                    {/* Active Indicator */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-800 animate-pulse" />
                </div>

                {/* CONNECTOR */}
                <Connector />

                {/* 2. CNC MACHINE */}
                <MachineUnit machine={cnc} label="CNC MILLING" color="blue" onClick={() => onMachineClick?.(cnc.id)} />

                {/* CONNECTOR */}
                <Connector />

                {/* 3. HEAT TREAT */}
                <MachineUnit machine={frn} label="HEAT TREAT" color="orange" onClick={() => onMachineClick?.(frn.id)} />

                {/* CONNECTOR */}
                <Connector />

                {/* 4. QUALITY */}
                <MachineUnit machine={cmm} label="QUALITY Q/C" color="emerald" onClick={() => onMachineClick?.(cmm.id)} />

            </div>

            {/* Floor Shadow Decoration */}
            <div className="absolute -bottom-4 left-4 right-4 h-3 bg-black/20 blur-md rounded-[50%]" />
        </div>
    );
}

function Connector() {
    return (
        <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden self-center mx-2 shrink-0 border border-slate-300 dark:border-slate-600 shadow-inner flex items-center">
            {/* Base Track */}
            <div className="absolute inset-0 border-b border-dashed border-slate-300 dark:border-slate-500 opacity-50 h-1 top-0"></div>
            {/* Moving Particle */}
            <div className="h-1.5 w-3 bg-blue-500 rounded-full absolute animate-[shimmer_2s_linear_infinite]" />
        </div>
    );
}

function MachineUnit({ machine, label, color, onClick }: { machine: any, label: string, color: 'blue' | 'orange' | 'emerald', onClick?: () => void }) {
    const isError = machine.status === 'Error' || machine.status === 'Critical';
    const isRunning = machine.status === 'Running';

    // Color Mappings
    const bodyColors = {
        blue: 'bg-slate-800 border-slate-700',
        orange: 'bg-slate-800 border-slate-700',
        emerald: 'bg-slate-800 border-slate-700'
    };

    const staticLed = isError ? 'bg-rose-500' : isRunning ? 'bg-emerald-500' : 'bg-slate-600';

    return (
        <div
            onClick={onClick}
            className="relative group cursor-pointer hover:z-30 transition-all hover:scale-105 shrink-0"
        >

            {/* MACHINE BODY */}
            <div className={`w-36 h-40 ${bodyColors[color]} rounded-xl border-b-4 shadow-2xl flex flex-col relative overflow-hidden`}>


                {/* Status Bar / Top Plate */}
                <div className="h-2 w-full bg-black/20 flex justify-between items-center px-3 py-3">
                    {/* Status Lights */}
                    <div className="flex gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${staticLed} led-light`} />
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                    </div>
                    {/* Animated Error Beacon */}
                    {isError && (
                        <div className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 animate-ping" />
                    )}
                </div>

                {/* Main Screen Area */}
                <div className="flex-1 bg-slate-900 mx-3 mt-2 mb-0 rounded-t-lg relative border border-slate-700 overflow-hidden group-hover:border-slate-500 transition-colors p-3 flex flex-col justify-center">
                    {/* Inner Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-${color}-500/5 pointer-events-none`} />

                    {/* Active Scanline Animation */}
                    {isRunning && (
                        <div className="absolute inset-x-0 h-[2px] bg-emerald-500/50 blur-[1px] animate-[scan_2s_linear_infinite]" />
                    )}

                    {/* Metrics List - Centered */}
                    <div className="flex flex-col flex-1 justify-center gap-2 text-[10px] font-mono text-slate-400 z-10">
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-1">
                            <span>RPM</span>
                            <span className="text-white font-bold">{machine.rpm || machine.speed || 0}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-1">
                            <span>TEMP</span>
                            <span className={(machine.temp || 0) > 305 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                                {machine.temp || 45} K
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span>STATUS</span>
                            <span className={isError ? 'text-rose-500 font-bold uppercase ring-1 ring-rose-500/50 px-1 rounded bg-rose-500/10' : isRunning ? 'text-emerald-500 uppercase' : 'text-slate-500 uppercase'}>
                                {machine.status}
                            </span>
                        </div>
                    </div>

                    {/* Critical Failure Banner */}
                    {isError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-rose-900/80 backdrop-blur-sm z-20">
                            <span className="text-white text-[10px] font-bold tracking-widest animate-pulse border-2 border-rose-500 px-2 py-1 rounded shadow-[0_0_15px_rgba(244,63,94,0.5)]">FAILURE</span>
                        </div>
                    )}
                </div>

                {/* Control Panel / Bottom Area */}
                <div className="h-10 bg-slate-800 border-t border-slate-700 flex items-center justify-center">
                    <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-[10px] font-bold text-slate-300 tracking-wider font-mono shadow-sm">
                        {label}
                    </div>
                </div>
            </div>

            {/* Machine Floor Shadow - Local */}
            <div className="absolute -bottom-2 left-2 right-2 h-2 bg-black/40 blur-sm rounded-[100%]" />

        </div>
    );
}

// Add scan and shimmer animation styles
const style = document.createElement('style');
style.innerHTML = `
@keyframes scan {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
@keyframes shimmer {
  0% { left: -100%; opacity: 0; }
  50% { opacity: 1; }
  100% { left: 200%; opacity: 0; }
}
`;
document.head.appendChild(style);
