import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Shield, FileCheck, Bell, Activity, Layers, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { useToast } from '../context/ToastContext';
import { OperatorDashboard } from './OperatorDashboard';
import { FactoryMap } from './FactoryMap';
import { COPQWidget } from './COPQWidget';
import { useSocket } from '../lib/socket';

export function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [maintTasks, setMaintTasks] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Poll for AI Maintenance Tasks
      const tasks = JSON.parse(localStorage.getItem('maintenance-tasks') || '[]');
      setMaintTasks(tasks.filter((t: any) => t.status === 'Pending'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for real-time machine updates
  useSocket('machine_update', (event: any) => {
    if (event.machines) {
      setMachines(event.machines);
    }
  });

  // Initial Data Fetch
  useEffect(() => {
    if (user?.role === 'operator') return;

    const fetchData = async () => {
      try {
        const [dashRes, machRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/production/machines')
        ]);
        setData(dashRes.data);
        setMachines(machRes.data);
      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleResolveAlert = (alert: any) => {
    if (alert.type !== 'maintenance') return;

    if (window.confirm(`Perform Preventive Maintenance? Estimated Cost: $${alert.cost}`)) {
      // 1. Charge EVM
      const evmData = JSON.parse(localStorage.getItem('evm-data') || '{"actualCost": 15000}');
      evmData.actualCost += alert.cost;
      localStorage.setItem('evm-data', JSON.stringify(evmData));

      // 2. Resolve Task
      const allTasks = JSON.parse(localStorage.getItem('maintenance-tasks') || '[]');
      const updatedTasks = allTasks.map((t: any) => t.id === alert.source ? { ...t, status: 'Completed' } : t);
      localStorage.setItem('maintenance-tasks', JSON.stringify(updatedTasks));

      showToast(`Maintenance Complete. Project AC +$${alert.cost}`, 'success');
      // Force prompt refresh (will happen next tick of interval anyway)
      setMaintTasks(updatedTasks.filter((t: any) => t.status === 'Pending'));
    }
  };

  // Derive Active Alerts (NCRs + Machine Errors + AI Maintenance)
  const activeAlerts = [
    ...(machines || [])
      .filter((m: any) => m.status === 'Error')
      .map((m: any) => ({
        source: m.id,
        title: 'Machine Failure',
        message: 'Critical error detected. Automatic NCR generated.',
        time: 'Just now',
        type: 'machine'
      })),
    ...(data?.recentNCRs || [])
      .filter((ncr: any) => ncr.severity === 'Critical' || ncr.severity === 'Major')
      .map((ncr: any) => ({
        source: ncr.id,
        title: `${ncr.type} Alert`,
        message: ncr.description || `Severity: ${ncr.severity} `,
        time: 'Active',
        type: 'ncr'
      })),
    ...maintTasks.map((t: any) => ({
      source: t.id,
      title: 'AI Preventive Maint.',
      message: `${t.description} (Est. Cost $${t.cost})`,
      time: 'AI Prediction',
      type: 'maintenance',
      cost: t.cost
    }))
  ];

  if (user?.role === 'operator') {
    return <OperatorDashboard />;
  }

  if (loading || !data) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <div className="text-slate-600 dark:text-slate-400 font-medium animate-pulse text-sm uppercase tracking-wide">Loading System Data...</div>
        </div>
      </div>
    );
  }

  const { stats: apiStats = {}, recentNCRs = [], keyMetrics = [] } = data;

  const stats = [
    {
      label: 'Open NCRs',
      value: apiStats.openNCRs || 0,
      change: '+0',
      trend: apiStats.openNCRs > 5 ? 'up' : 'down',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 dark:bg-rose-900/20',
      trendColor: apiStats.openNCRs > 5 ? 'text-rose-600' : 'text-emerald-600',
      trendBg: apiStats.openNCRs > 5 ? 'bg-rose-50 dark:bg-rose-900/30' : 'bg-emerald-50 dark:bg-emerald-900/30'
    },
    {
      label: 'Active CAPAs',
      value: apiStats.activeCAPAs || 12,
      change: '-2',
      trend: 'down',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      trendColor: 'text-emerald-600',
      trendBg: 'bg-emerald-50 dark:bg-emerald-900/30'
    },
    {
      label: 'Open Risks',
      value: apiStats.openRisks || 8,
      change: '-1',
      trend: 'down',
      icon: Shield,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 dark:bg-amber-900/20',
      trendColor: 'text-emerald-600',
      trendBg: 'bg-emerald-50 dark:bg-emerald-900/30'
    },
    {
      label: 'Pending FAIs',
      value: apiStats.pendingFAIs || 0,
      change: '+2',
      trend: 'up',
      icon: FileCheck,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      trendColor: 'text-blue-600',
      trendBg: 'bg-blue-50 dark:bg-blue-900/30'
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950 space-y-6 p-4 md:p-6 transition-colors duration-300">

      {/* --- Corporate Header --- */}
      <header className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-3 md:px-6 md:py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">DIGITAL TWIN</h2>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Connection
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {currentTime.toDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <COPQWidget data={data} simple={true} />
          </div>

          {/* Notification System */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative w-10 h-10 flex items-center justify-center rounded-lg border transition-all shadow-sm ${activeAlerts.length > 0
                ? 'bg-white dark:bg-slate-800 border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-slate-700/50'
                }`}
            >
              <Bell className="w-5 h-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white dark:border-slate-900"></span>
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">Active Alerts</span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-full">{activeAlerts.length} Issues</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {activeAlerts.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
                        No active alerts
                      </div>
                    ) : (
                      activeAlerts.map((alert, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleResolveAlert(alert)}
                          className="p-3 border-b border-slate-50 dark:border-slate-800 hover:bg-rose-50/30 dark:hover:bg-rose-900/20 transition-colors group cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded shadow-sm group-hover:border-rose-200 dark:group-hover:border-rose-800 border border-slate-200 dark:border-slate-700 ${alert.type === 'maintenance' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                              {alert.type === 'maintenance' ? 'AI PREDICTION' : alert.source}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
                          </div>
                          <p className={`text-sm font-semibold mb-0.5 ${alert.type === 'maintenance' ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'}`}>{alert.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{alert.message}</p>
                          {alert.type === 'maintenance' && <p className="text-[10px] font-bold text-blue-600 mt-1">Tap to Resolve & Charge EVM</p>}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-center">
                    <button
                      onClick={() => {
                        navigate('/ncrs');
                        setShowNotifications(false);
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline"
                    >
                      View Global Issue Log
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">

        {/* --- Main Area (Stats + Map) --- */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">

          {/* SaaS Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
              return (
                <div key={i} className="flex flex-col justify-between bg-white dark:bg-slate-900 rounded-xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-200 h-32">
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-lg ${stat.iconBg}`}>
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stat.trendBg} ${stat.trendColor}`}>
                      <TrendIcon className="w-3 h-3" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-0.5">{stat.value}</h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technical Drawing Map --- Passes Real Machine Data Now */}
          <div className="flex-1 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <FactoryMap
              machines={machines}
              onMachineClick={(id) => showToast(`Navigating to machine details: ${id}`, 'info')}
            />
          </div>
        </div>

        {/* --- Right Panel (KPIs & Recent Lists) --- */}
        <div className="flex flex-col gap-6 overflow-hidden">

          {/* KPI Panel */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="text-slate-400 w-4 h-4" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">KPI Targets</h3>
              </div>
            </div>
            <div className="space-y-5">
              {keyMetrics.map((metric: any) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400">{metric.label}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{metric.value} <span className="text-slate-400 dark:text-slate-600 font-normal">/ {metric.target}</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${metric.status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent NCRs List (Real Backend Data) */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Recent NCRs</h3>
              <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Live Feed
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
              {recentNCRs.map((ncr: any) => (
                <div key={ncr.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-blue-200 hover:bg-white dark:hover:bg-slate-700/80 hover:shadow-sm transition-all group">
                  <div>
                    <p className="text-slate-800 dark:text-slate-200 font-bold text-xs md:text-sm group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{ncr.type}</p>
                    <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{ncr.id} • <span className="text-slate-400 dark:text-slate-500">{ncr.location || 'Factory Floor'}</span></p>
                  </div>
                  <span className={`text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wide border ${ncr.severity === 'Critical' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800' :
                    ncr.severity === 'Major' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-800' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800'
                    }`}>
                    {ncr.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}