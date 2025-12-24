import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './lib/auth';
import { Sidebar, Tab } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastProvider } from './context/ToastContext';
import { Dashboard } from './components/Dashboard';
import { Issues } from './components/Issues';
import { CAPA } from './components/CAPA';
import { Audits } from './components/Audits';
import { Documents } from './components/Documents';
import { RiskManagement } from './components/RiskManagement';
import { ConfigurationManagement } from './components/ConfigurationManagement';
import { FirstArticleInspection } from './components/FirstArticleInspection';
import { MaterialTraceability } from './components/MaterialTraceability';
import { GFEManagement } from './components/GFEManagement';
import { OperatorCompetency } from './components/OperatorCompetency';
import { ToolManagement } from './components/ToolManagement';
import { ExportControl } from './components/ExportControl';
import { SmartBidding } from './components/SmartBidding';
import { RevisionLockModal } from './components/RevisionLockModal';
import { SimulationControl } from './components/SimulationControl';
import { ProjectManagement } from './components/ProjectManagement';
import { InventoryView } from './components/InventoryView';

export default function App() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showRevisionLock, setShowRevisionLock] = useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Router Bridge: Sync URL to Tab State
  useEffect(() => {
    if (location.pathname === '/ncrs') setActiveTab('issues');
    else if (location.pathname === '/pm-metrics') setActiveTab('projects');
    else if (location.pathname === '/inventory') setActiveTab('inventory');
    else if (location.pathname === '/dashboard') setActiveTab('dashboard');
    else if (location.pathname.length > 1) {
      // Generic fallback: try to match path to tab ID
      const path = location.pathname.substring(1) as Tab;
      // Simple validation or just attempt set
      setActiveTab(path);
    }
  }, [location]);

  if (!user) return null; // Should be handled by main.tsx but safe check

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 transition-colors duration-300">
        <Sidebar
          role={user.role as any}
          username={user.username}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          onLogout={logout}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <TopBar
            onNavigate={setActiveTab}
            onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'issues' && <Issues />}
              {activeTab === 'capa' && <CAPA />}
              {activeTab === 'risk' && <RiskManagement />}
              {activeTab === 'configuration' && <ConfigurationManagement />}
              {activeTab === 'fai' && <FirstArticleInspection />}
              {activeTab === 'traceability' && <MaterialTraceability />}
              {activeTab === 'gfe' && <GFEManagement />}
              {activeTab === 'competency' && <OperatorCompetency />}
              {activeTab === 'tools' && <ToolManagement />}
              {activeTab === 'export' && <ExportControl />}
              {activeTab === 'bidding' && <SmartBidding />}
              {activeTab === 'audits' && <Audits />}
              {activeTab === 'documents' && <Documents />}
              {activeTab === 'simulation-control' && <SimulationControl />}
              {activeTab === 'projects' && <ProjectManagement />}
              {activeTab === 'inventory' && <InventoryView />}
            </div>
          </main>
        </div>

        {/* Scenario 1: Dynamic Engineering Revision Lock */}
        {showRevisionLock && (
          <RevisionLockModal onAcknowledge={() => setShowRevisionLock(false)} />
        )}
      </div>
    </ToastProvider>
  );
}