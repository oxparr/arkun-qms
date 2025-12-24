import {
    LayoutDashboard,
    AlertCircle,
    CheckCircle,
    AlertTriangle,
    Settings,
    ClipboardCheck,
    Package,
    Shield,
    Users,
    Wrench,
    Globe,
    TrendingUp,
    FileSearch,
    FolderOpen,
    Briefcase,
    Archive
} from 'lucide-react';
import { useState } from 'react';

export type UserRole = 'operator' | 'quality' | 'manager' | 'admin';
export type Tab = 'dashboard' | 'issues' | 'capa' | 'risk' | 'configuration' | 'fai' | 'audits' | 'documents' | 'traceability' | 'gfe' | 'competency' | 'tools' | 'export' | 'bidding' | 'sim' | 'simulation-control' | 'projects' | 'inventory';

export interface NavItem {
    id: Tab;
    label: string;
    icon: any;
    badge?: number;
}

export function getNavItemsByRole(role: UserRole): NavItem[] {
    // Common icons map
    const icons = {
        dashboard: LayoutDashboard,
        issues: AlertCircle,
        capa: CheckCircle,
        risk: AlertTriangle,
        configuration: Settings,
        fai: ClipboardCheck,
        audits: FileSearch,
        documents: FolderOpen,
        traceability: Package,
        gfe: Shield,
        competency: Users,
        tools: Wrench,
        export: Globe,
        bidding: TrendingUp,
        sim: Settings,
        projects: Briefcase,
        inventory: Archive
    };

    switch (role) {
        case 'operator':
            return [
                { id: 'dashboard', label: 'My Workstation', icon: icons.dashboard },
                { id: 'documents', label: 'Documents', icon: icons.documents },
                { id: 'tools', label: 'Tools', icon: icons.tools },
                { id: 'issues', label: 'NCRs', icon: icons.issues },
            ];
        case 'quality':
            return [
                { id: 'dashboard', label: 'Overview', icon: icons.dashboard },
                { id: 'fai', label: 'FAI', icon: icons.fai, badge: 3 }, // Simulated notification count
                { id: 'issues', label: 'NCRs', icon: icons.issues },
                { id: 'capa', label: 'CAPA', icon: icons.capa },
                { id: 'audits', label: 'Audits', icon: icons.audits },
                { id: 'traceability', label: 'Traceability', icon: icons.traceability },
                { id: 'inventory', label: 'Inventory', icon: icons.inventory },
                { id: 'tools', label: 'Tools', icon: icons.tools },
            ];
        case 'manager':
            return [
                { id: 'dashboard', label: 'Overview', icon: icons.dashboard },
                { id: 'projects', label: 'PM & EVM Metrics', icon: icons.projects },
                { id: 'risk', label: 'Risk', icon: icons.risk },
                { id: 'bidding', label: 'Smart Bidding', icon: icons.bidding },
                { id: 'gfe', label: 'GFE', icon: icons.gfe },
                { id: 'inventory', label: 'Inventory', icon: icons.inventory },
                { id: 'export', label: 'Export Control', icon: icons.export },
                { id: 'competency', label: 'Competency', icon: icons.competency },
                { id: 'configuration', label: 'Configuration', icon: icons.configuration },

            ];
        case 'admin':
            return [
                { id: 'dashboard', label: 'Admin Overview', icon: icons.dashboard },
                { id: 'projects', label: 'PM & EVM Metrics', icon: icons.projects },
                { id: 'inventory', label: 'Inventory', icon: icons.inventory },
                { id: 'issues', label: 'NCRs', icon: icons.issues },
                { id: 'capa', label: 'CAPA', icon: icons.capa },
                { id: 'risk', label: 'Risk Management', icon: icons.risk },
                { id: 'fai', label: 'FAI', icon: icons.fai },
                { id: 'audits', label: 'Audits', icon: icons.audits },
                { id: 'traceability', label: 'Traceability', icon: icons.traceability },
                { id: 'configuration', label: 'Configuration', icon: icons.configuration },
                { id: 'gfe', label: 'GFE Management', icon: icons.gfe },
                { id: 'competency', label: 'Competency Matrix', icon: icons.competency },
                { id: 'tools', label: 'Tool Management', icon: icons.tools },
                { id: 'export', label: 'Export Control', icon: icons.export },
                { id: 'bidding', label: 'Smart Bidding', icon: icons.bidding },
                { id: 'documents', label: 'Documents', icon: icons.documents },

            ];
        default:
            return [];
    }
}

interface SidebarProps {
    role: UserRole;
    username?: string;
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    onLogout: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ role, username, activeTab, onTabChange, onLogout, isOpen = false, onClose }: SidebarProps) {
    const navItems = getNavItemsByRole(role);

    return (
        <>
            {/* Backdrop Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-40
                w-64 bg-slate-900 text-slate-400 border-r border-slate-800 h-screen flex flex-col font-sans shrink-0
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    {/* ARKUN Icon */}
                    <div className="flex items-center justify-center">
                        <img src="/arkun-ikon.png" alt="Arkun Icon" className="h-8 w-8 object-contain" />
                    </div>
                    {/* ARKUN Logo Text */}
                    <div className="flex flex-col justify-center">
                        <img src="/arkun-yazi.png" alt="ARKUN" className="h-8 w-auto object-contain ml-3" />
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/50'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`} />
                                    <span className="text-sm">{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <p className="text-[10px] text-slate-600 text-center">
                        &copy; 2025 ARKUN Systems
                    </p>
                </div>

            </div>
        </>
    );
}
