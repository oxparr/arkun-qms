import { useState } from 'react';
import { Shield, Package, AlertCircle, TrendingUp, Search, Plus, Wrench, Siren, Calendar } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';

interface GFEItem {
  id: string;
  itemName: string;
  serialNumber: string;
  customer: string;
  receivedDate: string;
  lastAuditDate: string; // New: Audit Requirement
  currentLocation: string;
  status: 'In Use' | 'Available' | 'Maintenance' | 'Returned';
  usageHours: number;
  assignedTo?: string;
  assignedProject?: string;
}

export function GFEManagement() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const [gfeItems] = useState<GFEItem[]>([
    {
      id: 'GFE-001',
      itemName: 'Precision Test Fixture - Wing Assembly',
      serialNumber: 'GFE-SN-12345',
      customer: 'Boeing',
      receivedDate: '2024-06-15',
      lastAuditDate: '2025-10-10', // Recent
      currentLocation: 'Bay 3, Station A',
      status: 'In Use',
      usageHours: 450,
      assignedTo: 'Production Team A',
      assignedProject: 'PRJ-2025-001'
    },
    {
      id: 'GFE-002',
      itemName: 'Calibration Standard Set',
      serialNumber: 'GFE-SN-67890',
      customer: 'Lockheed Martin',
      receivedDate: '2024-08-20',
      lastAuditDate: '2025-02-15', // Overdue (> 6 months from Dec 2025)
      currentLocation: 'Quality Lab 2',
      status: 'Available',
      usageHours: 120,
    },
    {
      id: 'GFE-003',
      itemName: 'Specialized Tooling - Fastener Installation',
      serialNumber: 'GFE-SN-24680',
      customer: 'Northrop Grumman',
      receivedDate: '2024-09-10',
      lastAuditDate: '2025-11-20',
      currentLocation: 'Tool Crib',
      status: 'Maintenance',
      usageHours: 890,
      assignedTo: 'Maintenance',
    },
    {
      id: 'GFE-004',
      itemName: 'Environmental Test Chamber',
      serialNumber: 'GFE-SN-13579',
      customer: 'Airbus',
      receivedDate: '2023-03-05',
      lastAuditDate: '2025-06-01', // Overdue
      currentLocation: 'Returned to Customer',
      status: 'Returned',
      usageHours: 2340,
    },
  ]);

  const companyAssets = [
    { name: 'CNC Machine #5', value: '$450,000', location: 'Bay 1' },
    { name: 'CMM Inspector Pro', value: '$220,000', location: 'Quality Lab' },
    { name: 'Laser Marking System', value: '$85,000', location: 'Bay 2' },
  ];

  const stats = {
    totalGFE: gfeItems.length,
    inUse: gfeItems.filter(i => i.status === 'In Use').length,
    available: gfeItems.filter(i => i.status === 'Available').length,
    maintenance: gfeItems.filter(i => i.status === 'Maintenance').length,
  };

  const filteredItems = gfeItems.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAuditOverdue = (dateStr: string) => {
    const lastAudit = new Date(dateStr);
    const today = new Date(); // Mock current date is Dec 2025 in simulation, but using system time roughly works too.
    // Let's assume strict 6 months (180 days)
    const diffTime = Math.abs(today.getTime() - lastAudit.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 180;
  };

  const handleRequestAudit = (item: GFEItem) => {
    // Simulate Alert Logic
    // api.post('/alerts', { type: 'audit_req', item: item.id }) ...
    showToast(`Audit requested for ${item.id}. Alert sent to Dashboard.`, 'error');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-slate-100">Government Furnished Equipment (GFE) Management</h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">AS9100 Clause 8.5.3 - Property Belonging to Customers or External Providers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search GFE Inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 text-sm w-64 shadow-sm bg-white dark:bg-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
          <button
            onClick={() => showToast('Opening Add Asset Form...', 'success')}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 dark:text-blue-100 mb-1">
              <strong>Shadow Inventory System:</strong> Customer property is tracked separately from company assets
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              GFE items do not affect financial ledgers. Strict audit cycles required (Every 6 Months).
            </p>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-900/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400">Total GFE Items</p>
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-purple-600 dark:text-purple-400 font-bold text-2xl">{stats.totalGFE}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border-2 border-green-200 dark:border-green-900/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400">In Use</p>
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-green-600 dark:text-green-400 font-bold text-2xl">{stats.inUse}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-900/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400">Available</p>
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-blue-600 dark:text-blue-400 font-bold text-2xl">{stats.available}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border-2 border-orange-200 dark:border-orange-900/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400">Maintenance</p>
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-orange-600 dark:text-orange-400 font-bold text-2xl">{stats.maintenance}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GFE Inventory - Shadow Inventory */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-purple-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-gray-900 dark:text-slate-100 font-bold">Customer Property (Shadow Inventory)</h3>
              </div>
              <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold uppercase flex items-center gap-1">
                <Shield className="w-3 h-3" /> Gov/Cust Property
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Item Details</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Audit Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Location</th>
                  <th className="text-right px-4 py-3 text-gray-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const overdue = isAuditOverdue(item.lastAuditDate);
                  return (
                    <tr key={item.id} className="hover:bg-purple-50/50 dark:hover:bg-slate-800 transition-colors border-b border-gray-100 dark:border-slate-800 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600 dark:text-purple-400">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-gray-900 dark:text-slate-100 font-bold block text-sm">{item.itemName}</span>
                            <span className="text-gray-500 dark:text-slate-500 text-xs font-mono">{item.serialNumber} • {item.customer}</span>
                            {item.assignedProject && (
                              <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">Project: {item.assignedProject}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <span className={`font-medium ${overdue ? 'text-rose-600' : 'text-slate-600 dark:text-slate-400'}`}>
                            {item.lastAuditDate}
                          </span>
                          {overdue && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-1.5 py-0.5 rounded w-fit mt-1">
                              <Siren className="w-3 h-3" /> AUDIT REQ
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">
                        {item.currentLocation}
                        <div className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${item.status === 'In Use' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          item.status === 'Available' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                            'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          }`}>
                          {item.status}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {overdue && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRequestAudit(item); }}
                              className="p-1.5 bg-rose-100 text-rose-600 rounded hover:bg-rose-200 transition-colors"
                              title="Request Audit"
                            >
                              <Siren className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); showToast(`Opening maintenance log for ${item.id}`, 'info'); }}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-400"
                            title="Maintenance Log"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company Assets - For Comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-gray-900 dark:text-slate-100 font-bold">Company Assets</h3>
            </div>
            <p className="text-gray-600 dark:text-slate-400 mt-1 text-sm">On financial ledger (for comparison)</p>
          </div>
          <div className="p-4 space-y-3">
            {companyAssets.map((asset, index) => (
              <div key={index} className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-gray-900 dark:text-slate-200 font-medium">{asset.name}</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">{asset.value}</span>
                </div>
                <p className="text-gray-600 dark:text-slate-400 text-sm">{asset.location}</p>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 dark:text-slate-400 font-medium">Total Asset Value</p>
                <p className="text-green-600 dark:text-green-400 font-bold text-lg">$755,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
