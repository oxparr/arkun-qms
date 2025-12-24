import { useState } from 'react';
import { Shield, Package, AlertCircle, TrendingUp } from 'lucide-react';

interface GFEItem {
  id: string;
  itemName: string;
  serialNumber: string;
  customer: string;
  receivedDate: string;
  currentLocation: string;
  status: 'In Use' | 'Available' | 'Maintenance' | 'Returned';
  usageHours: number;
  assignedTo?: string;
}

export function GFEManagement() {
  const [gfeItems] = useState<GFEItem[]>([
    {
      id: 'GFE-001',
      itemName: 'Precision Test Fixture - Wing Assembly',
      serialNumber: 'GFE-SN-12345',
      customer: 'Boeing',
      receivedDate: '2024-06-15',
      currentLocation: 'Bay 3, Station A',
      status: 'In Use',
      usageHours: 450,
      assignedTo: 'Production Team A',
    },
    {
      id: 'GFE-002',
      itemName: 'Calibration Standard Set',
      serialNumber: 'GFE-SN-67890',
      customer: 'Lockheed Martin',
      receivedDate: '2024-08-20',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Government Furnished Equipment (GFE) Management</h2>
          <p className="text-gray-600 mt-1">AS9100 Clause 8.5.3 - Property Belonging to Customers or External Providers</p>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 mb-1">
              <strong>Shadow Inventory System:</strong> Customer property is tracked separately from company assets
            </p>
            <p className="text-blue-700">
              GFE items do not affect financial ledgers or asset depreciation calculations. Usage tracking is for customer reporting only.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Total GFE Items</p>
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-purple-600">{stats.totalGFE}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">In Use</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-green-600">{stats.inUse}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Available</p>
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-blue-600">{stats.available}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Maintenance</p>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-orange-600">{stats.maintenance}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GFE Inventory - Shadow Inventory */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="text-gray-900">Customer Property (Shadow Inventory)</h3>
              </div>
              <span className="px-3 py-1 bg-purple-600 text-white rounded-full">
                Not in Company Assets
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600">Item Name</th>
                  <th className="text-left px-4 py-3 text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 text-gray-600">Serial Number</th>
                  <th className="text-left px-4 py-3 text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600">Usage (hrs)</th>
                  <th className="text-left px-4 py-3 text-gray-600">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gfeItems.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-900">{item.itemName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{item.customer}</td>
                    <td className="px-4 py-3 text-gray-600">{item.serialNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full ${
                        item.status === 'In Use'
                          ? 'bg-green-50 text-green-600'
                          : item.status === 'Available'
                          ? 'bg-blue-50 text-blue-600'
                          : item.status === 'Maintenance'
                          ? 'bg-orange-50 text-orange-600'
                          : 'bg-gray-50 text-gray-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{item.usageHours}</td>
                    <td className="px-4 py-3 text-gray-900">{item.currentLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company Assets - For Comparison */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              <h3 className="text-gray-900">Company Assets</h3>
            </div>
            <p className="text-gray-600 mt-1">On financial ledger</p>
          </div>
          <div className="p-4 space-y-3">
            {companyAssets.map((asset, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-gray-900">{asset.name}</span>
                  <span className="text-green-600">{asset.value}</span>
                </div>
                <p className="text-gray-600">{asset.location}</p>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-gray-600">Total Asset Value</p>
              <p className="text-green-600">$755,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Differences Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-purple-900 mb-2">🛡️ Customer Property (GFE)</h4>
          <ul className="space-y-1 text-purple-700">
            <li>✓ Tracked in shadow inventory</li>
            <li>✓ Not depreciated</li>
            <li>✓ Usage reported to customer</li>
            <li>✓ Must be returned when requested</li>
          </ul>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-green-900 mb-2">📦 Company Assets</h4>
          <ul className="space-y-1 text-green-700">
            <li>✓ On balance sheet</li>
            <li>✓ Depreciation calculated</li>
            <li>✓ Affects financial statements</li>
            <li>✓ Company ownership</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
