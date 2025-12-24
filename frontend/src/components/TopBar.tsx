import { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, LogOut, Settings, Menu, Sun, Moon, Clock, TrendingUp, Command, Briefcase, Archive, AlertCircle, CheckCircle, AlertTriangle, ClipboardCheck, FileSearch, FolderOpen, Package, Shield, Users, Wrench, Globe, FileText, ShieldAlert, ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useToast } from '../context/ToastContext';
import type { Tab } from './Sidebar';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
    onMenuClick?: () => void;
    onNavigate?: (tab: Tab) => void;
}

export function TopBar({ onMenuClick, onNavigate }: TopBarProps) {
    const { user, logout, switchRole } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isDemoOpen, setIsDemoOpen] = useState(false);

    // Search Enhancements State
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const placeholders = [
        "Search for projects...",
        "Search for NCRs..."
    ];

    // Universal Search Index
    // type: 'module' | 'data'
    const SEARCH_INDEX = [
        // Modules
        { id: 'projects', label: 'PM & EVM Metrics', type: 'module', roles: ['admin', 'manager'], icon: Briefcase },
        { id: 'inventory', label: 'Inventory', type: 'module', roles: ['admin', 'manager', 'quality', 'operator'], icon: Archive },
        { id: 'issues', label: 'NCRs (Non-Conformance)', type: 'module', roles: ['admin', 'manager', 'quality'], icon: AlertCircle },
        { id: 'capa', label: 'CAPA Management', type: 'module', roles: ['admin', 'manager', 'quality'], icon: CheckCircle },
        { id: 'risk', label: 'Risk Management', type: 'module', roles: ['admin', 'manager'], icon: AlertTriangle },
        { id: 'fai', label: 'First Article Inspection (FAI)', type: 'module', roles: ['admin', 'manager', 'quality'], icon: ClipboardCheck },
        { id: 'audits', label: 'Audit Management', type: 'module', roles: ['admin', 'manager', 'quality'], icon: FileSearch },
        { id: 'documents', label: 'Document Control', type: 'module', roles: ['admin', 'manager', 'quality'], icon: FolderOpen },
        { id: 'traceability', label: 'Material Traceability', type: 'module', roles: ['admin', 'manager', 'quality', 'operator'], icon: Package },
        { id: 'gfe', label: 'GFE Management', type: 'module', roles: ['admin', 'manager'], icon: Shield },
        { id: 'competency', label: 'Competency Matrix', type: 'module', roles: ['admin', 'manager'], icon: Users },
        { id: 'tools', label: 'Tool Management', type: 'module', roles: ['admin', 'manager', 'quality', 'operator'], icon: Wrench },
        { id: 'export', label: 'Export Control', type: 'module', roles: ['admin', 'manager', 'quality'], icon: Globe },
        { id: 'bidding', label: 'Smart Bidding', type: 'module', roles: ['admin', 'manager'], icon: TrendingUp },
        { id: 'configuration', label: 'Configuration Management', type: 'module', roles: ['admin', 'manager'], icon: Settings },

        // Mock Data Records
        { id: 'projects', label: 'Altay Tank Modernization', type: 'data', roles: ['admin', 'manager'], icon: FileText, subLabel: 'Project • Active' },
        { id: 'projects', label: 'Firtina Howitzer Update', type: 'data', roles: ['admin', 'manager'], icon: FileText, subLabel: 'Project • High Priority' },
        { id: 'inventory', label: 'TI-BILLET-7075', type: 'data', roles: ['admin', 'manager', 'quality', 'operator'], icon: Archive, subLabel: 'Inventory • Low Stock' },
        { id: 'issues', label: 'NCR-2025-001 - Hull Crack', type: 'data', roles: ['admin', 'manager', 'quality'], icon: AlertTriangle, subLabel: 'NCR • Critical' },
        { id: 'documents', label: 'Quality Control Policy v2', type: 'data', roles: ['admin', 'manager', 'quality'], icon: FileText, subLabel: 'Document • PDF' },
    ];

    // Search Logic
    useEffect(() => {
        if (!searchTerm) {
            setSearchResults([]);
            return;
        }

        const lowerTerm = searchTerm.toLowerCase();

        const filtered = SEARCH_INDEX.filter(item => {
            // 1. Strict RBAC (Hide restricted items)
            if (user?.role && !item.roles.includes(user.role)) return false;

            // 2. Check Match
            return item.label.toLowerCase().includes(lowerTerm) ||
                (item.subLabel && item.subLabel.toLowerCase().includes(lowerTerm));
        });

        setSearchResults(filtered.slice(0, 6)); // Limit to 6 results
    }, [searchTerm, user]);

    // Handle Navigation
    const handleResultClick = (item: any) => {
        // Safe Check: If roles undefined (manual link), allow. Else check permissions.
        const hasAccess = !item.roles || (user?.role && item.roles.includes(user.role));

        if (!hasAccess) {
            showToast('Access Denied: High-Level Security Clearance Required', 'error');
            return;
        }

        // Trigger Navigation
        if (onNavigate) {
            onNavigate(item.id as Tab);
        } else {
            // Fallback to router
            navigate(`/${item.id}`);
        }

        setIsSearchFocused(false);
        setSearchTerm('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (searchResults.length > 0) {
                handleResultClick(searchResults[0]);
            }
        }
    };

    // Theme Logic
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
        }
        return 'light';
    });

    // Rotate Placeholder
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Theme Effect
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.add('transition-colors', 'duration-300'); // Smooth transition

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Handle Click Outside Search
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Mock Notifications
    const notifications = [
        { id: 1, title: 'FAI Rejected', message: 'FAI-2025-004 requires quality review.', time: '10m ago', type: 'error' },
        { id: 2, title: 'Machine Maintenance', message: 'CNC-002 scheduled for maintenance.', time: '1h ago', type: 'info' },
    ];

    // Mock Recent Searches
    const recentSearches = [
        { id: 'documents', term: 'Production Quality Report', type: 'module', roles: ['admin', 'manager', 'quality'] },
        { id: 'traceability', term: 'WO-2025-001 Trace', type: 'data', roles: ['admin', 'manager', 'operator'] }
    ];

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm transition-colors duration-300">

            {/* Left: Mobile Menu & Search */}
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg">
                    <Menu className="w-5 h-5" />
                </button>

                {/* Enhanced Universal Search */}
                <div ref={searchContainerRef} className="hidden md:block relative z-50">
                    <div className={`relative flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg w-80 transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-blue-500/20 border-blue-400 w-96 shadow-lg' : 'border-slate-200 dark:border-slate-700'}`}>
                        <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-blue-500' : 'text-slate-400'}`} />
                        <input
                            type="text"
                            value={searchTerm}
                            onFocus={() => setIsSearchFocused(true)}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholders[placeholderIndex]}
                            className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 w-full placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                        />
                        {/* Cmd+K Badge */}
                        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-[10px] font-medium text-slate-500 dark:text-slate-400 shadow-sm opacity-60">
                            <Command className="w-3 h-3" /> K
                        </div>
                    </div>

                    {/* Search Results / Suggestions */}
                    {isSearchFocused && (
                        <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-100 slide-in-from-top-2">

                            {/* Scenario 1: User is typing and we have results */}
                            {searchTerm && searchResults.length > 0 && (
                                <div className="p-2">
                                    <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Search className="w-3 h-3" /> Best Matches
                                    </p>
                                    {searchResults.map((item, idx) => {
                                        const ResultIcon = item.icon;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleResultClick(item)}
                                                className="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-3 group text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                <div className={`p-1.5 rounded-md ${item.type === 'module' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                                                    <ResultIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="block font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                                        {item.label}
                                                    </span>
                                                    {item.subLabel && <span className="text-xs text-slate-400">{item.subLabel}</span>}
                                                </div>

                                                {item.type === 'module' && <ArrowUpRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Scenario 2: User is typing but NO results */}
                            {searchTerm && searchResults.length === 0 && (
                                <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                                    No results found for "{searchTerm}"
                                </div>
                            )}

                            {/* Scenario 3: Initial Focus (No Search Term) - Show Suggestions */}
                            {!searchTerm && (
                                <>
                                    <div className="p-2">
                                        <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> Recent Searches
                                        </p>
                                        {recentSearches.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleResultClick(item)}
                                                className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors flex items-center justify-between group"
                                            >
                                                <span>{item.term}</span>
                                                <ArrowUpRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2" />
                                    <div className="p-2">
                                        <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            <TrendingUp className="w-3 h-3 text-emerald-500" /> Suggested
                                        </p>
                                        <button
                                            onClick={() => handleResultClick({ id: 'projects', roles: ['admin', 'manager'] })}
                                            className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors group"
                                        >
                                            <span className="block font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">Altay Tank Modernization</span>
                                            <span className="text-xs text-slate-400">Project • Active</span>
                                        </button>
                                        <button
                                            onClick={() => handleResultClick({ id: 'inventory', roles: ['admin', 'manager', 'quality', 'operator'] })}
                                            className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors group"
                                        >
                                            <span className="block font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">TI-BILLET-7075</span>
                                            <span className="text-xs text-slate-400">Inventory • Low Stock</span>
                                        </button>
                                        <button
                                            onClick={() => handleResultClick({ id: 'issues', roles: ['admin', 'manager', 'quality'] })}
                                            className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors group"
                                        >
                                            <span className="block font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">NCR-2025-001</span>
                                            <span className="text-xs text-rose-500">Quality Alert • Open</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">

                {/* Demo Persona Selector (Dropdown) */}
                <div className="relative">
                    <button
                        onClick={() => setIsDemoOpen(!isDemoOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${user?.role === 'admin' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                            user?.role === 'manager' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' :
                                user?.role === 'quality' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
                                    'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                            }`}
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Demo Mode</span>
                    </button>

                    {isDemoOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDemoOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in zoom-in-95 duration-100">
                                <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Demo Personas</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Presentation Use Only - RBAC Simulation</p>
                                </div>
                                <div className="p-1">
                                    {[
                                        { id: 'admin', label: 'Admin', desc: 'Full Access (EVM, Risk)', colorClass: 'bg-blue-500' },
                                        { id: 'manager', label: 'Manager', desc: 'PM, Audits, Reporting', colorClass: 'bg-purple-500' },
                                        { id: 'quality', label: 'Quality Engineer', desc: 'NCR, CAPA, FAI', colorClass: 'bg-emerald-500' },
                                        { id: 'operator', label: 'Field Operator', desc: 'Inventory, Floor Only', colorClass: 'bg-amber-500' }
                                    ].map(role => (
                                        <button
                                            key={role.id}
                                            onClick={() => {
                                                switchRole(role.id as any);
                                                setIsDemoOpen(false);
                                                showToast(`Switched to ${role.label} Profile - Access permissions updated.`, 'info');
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 group ${user?.role === role.id ? 'bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700' : ''}`}
                                        >
                                            <div className={`mt-0.5 w-2 h-2 rounded-full ${role.colorClass} shrink-0`} />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{role.label}</p>
                                                <p className="text-[10px] text-slate-500">{role.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 border border-white dark:border-slate-900"></span>
                    </button>

                    {isNotifOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in zoom-in-95 duration-100">
                                <div className="p-3 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200 text-sm flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                                    <span>Notifications</span>
                                    <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer link-effect">Mark all read</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map(n => (
                                        <div key={n.id} className="p-3 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{n.title}</p>
                                                <span className="text-[10px] text-slate-400">{n.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 py-1.5 px-2 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none mb-1">{user?.role === 'admin' ? 'Admin' : (user?.username || 'User')}</p>
                            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">{user?.role || 'Guest'}</p>
                        </div>
                        <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-white dark:ring-slate-800">
                            {(user?.role === 'admin' ? 'Admin' : (user?.username || 'U')).charAt(0).toUpperCase()}
                        </div>
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in scale-95 duration-100 origin-top-right">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.role === 'admin' ? 'Admin' : user?.username}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
                                </div>
                                <div className="p-1">
                                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg flex items-center gap-2 transition-colors">
                                        <User className="w-4 h-4" /> Profile
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg flex items-center gap-2 transition-colors">
                                        <Settings className="w-4 h-4" /> Settings
                                    </button>
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg flex items-center gap-2 transition-colors font-medium"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

// Icon Helper
function ArrowUpRightIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
        </svg>
    )
}
