import { useState } from 'react';
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
import { LayoutDashboard, AlertCircle, CheckCircle, FileSearch, FolderOpen, AlertTriangle, Settings, ClipboardCheck, Package, Shield, Users, Wrench, Globe, TrendingUp } from 'lucide-react';

type Tab = 'dashboard' | 'issues' | 'capa' | 'risk' | 'configuration' | 'fai' | 'audits' | 'documents' | 'traceability' | 'gfe' | 'competency' | 'tools' | 'export' | 'bidding';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showRevisionLock, setShowRevisionLock] = useState(true);

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'issues' as Tab, label: 'NCRs', icon: AlertCircle },
    { id: 'capa' as Tab, label: 'CAPA', icon: CheckCircle },
    { id: 'risk' as Tab, label: 'Risk', icon: AlertTriangle },
    { id: 'configuration' as Tab, label: 'Configuration', icon: Settings },
    { id: 'fai' as Tab, label: 'FAI', icon: ClipboardCheck },
    { id: 'traceability' as Tab, label: 'Traceability', icon: Package },
    { id: 'gfe' as Tab, label: 'GFE', icon: Shield },
    { id: 'competency' as Tab, label: 'Competency', icon: Users },
    { id: 'tools' as Tab, label: 'Tools', icon: Wrench },
    { id: 'export' as Tab, label: 'Export Control', icon: Globe },
    { id: 'bidding' as Tab, label: 'Smart Bidding', icon: TrendingUp },
    { id: 'audits' as Tab, label: 'Audits', icon: FileSearch },
    { id: 'documents' as Tab, label: 'Documents', icon: FolderOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-blue-600">AS9100 Quality Management System</h1>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full">AS9100 Rev D Compliant</span>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="p-6">
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
      </main>

      {/* Scenario 1: Dynamic Engineering Revision Lock */}
      {showRevisionLock && (
        <RevisionLockModal onAcknowledge={() => setShowRevisionLock(false)} />
      )}
    </div>
  );
}