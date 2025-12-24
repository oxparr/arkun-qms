import { useState } from 'react';
import { Shield, Globe, Lock, CheckCircle, XCircle, Search, FileText } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ExportItem {
  id: string;
  partNumber: string;
  description: string;
  eccn: string;
  itarControlled: boolean;
  authorizedCountries: string[];
  status: 'Approved' | 'Restricted' | 'Prohibited';
}

interface Shipment {
  id: string;
  customerName: string;
  destinationCountry: string;
  destinationAddress: string;
  items: string[];
  shippingDate: string;
  status: 'Pending Review' | 'Approved' | 'Blocked';
  blockReason?: string;
}

export function ExportControl() {
  const { showToast } = useToast();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showExportShield, setShowExportShield] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const exportItems: ExportItem[] = [
    {
      id: 'ITEM-001',
      partNumber: 'PN-12345-A',
      description: 'Flight Control Actuator Assembly',
      eccn: '9A991',
      itarControlled: true,
      authorizedCountries: ['USA', 'Canada', 'UK', 'Australia'],
      status: 'Restricted',
    },
    {
      id: 'ITEM-002',
      partNumber: 'PN-67890-B',
      description: 'Commercial Fastener Kit',
      eccn: 'EAR99',
      itarControlled: false,
      authorizedCountries: ['All except embargoed'],
      status: 'Approved',
    },
    {
      id: 'ITEM-003',
      partNumber: 'PN-24680-C',
      description: 'Military Grade Encryption Module',
      eccn: '5A002',
      itarControlled: true,
      authorizedCountries: ['USA only'],
      status: 'Prohibited',
    },
  ];

  const shipments: Shipment[] = [
    {
      id: 'SHIP-001',
      customerName: 'Boeing Commercial',
      destinationCountry: 'USA',
      destinationAddress: '100 N Riverside, Chicago, IL',
      items: ['PN-12345-A', 'PN-67890-B'],
      shippingDate: '2025-12-10',
      status: 'Approved',
    },
    {
      id: 'SHIP-002',
      customerName: 'Global Aerospace Inc',
      destinationCountry: 'China',
      destinationAddress: 'Beijing Industrial Park, Beijing',
      items: ['PN-12345-A'],
      shippingDate: '2025-12-12',
      status: 'Blocked',
      blockReason: 'ITAR-controlled item - destination not authorized',
    },
    {
      id: 'SHIP-003',
      customerName: 'AeroTech Solutions',
      destinationCountry: 'Russia',
      destinationAddress: 'Moscow Technology Center, Moscow',
      items: ['PN-24680-C'],
      shippingDate: '2025-12-15',
      status: 'Blocked',
      blockReason: 'Embargoed country - all exports prohibited',
    },
  ];

  const attemptDeliveryNote = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    if (shipment.status === 'Blocked') {
      setShowExportShield(true);
      showToast('Export Shield Triggered: Shipment Blocked', 'error');
    } else {
      showToast('Delivery Note Generated Successfully', 'success');
    }
  };

  const filteredItems = exportItems.filter(item =>
    item.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.eccn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const embargoedCountries = ['Russia', 'Iran', 'North Korea', 'Syria', 'Cuba'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-slate-100">Export Control (ITAR / EAR Compliance)</h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">AS9100 Clause 8.1.4 - Control of Externally Provided Processes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ECCN / Part..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 text-sm w-64 shadow-sm bg-white dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <button
            onClick={() => showToast('Generating Compliance Audit Report...', 'success')}
            className="flex items-center gap-2 px-5 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 shadow-md transition-all font-medium"
          >
            <FileText className="w-4 h-4" /> Audit Report
          </button>
        </div>
      </div>

      {/* Export Shield Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Shield className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-1">🛡️ Export Shield Active</h3>
            <p className="text-red-100">
              Automated ITAR/EAR compliance checking prevents unauthorized exports.
              All shipments are validated against export control regulations.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg text-center">
            <p className="text-white">{shipments.filter(s => s.status === 'Blocked').length}</p>
            <p className="text-red-100">Blocked</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400">Total Export Items</p>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-900 dark:text-slate-100">{exportItems.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-red-200 dark:border-red-900/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400">ITAR Controlled</p>
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-red-600 dark:text-red-400">{exportItems.filter(i => i.itarControlled).length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-green-200 dark:border-green-900/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400">Approved Shipments</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-green-600 dark:text-green-400">{shipments.filter(s => s.status === 'Approved').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-red-200 dark:border-red-900/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 dark:text-slate-400">Blocked Shipments</p>
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-red-600 dark:text-red-400">{shipments.filter(s => s.status === 'Blocked').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export-Controlled Items */}
        <div className="bg-white dark:bg-slate-900/80 rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
            <h3 className="text-gray-900 dark:text-slate-100">Export-Controlled Items Registry</h3>
          </div>
          <div className="p-4 space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 ${item.status === 'Prohibited'
                  ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-900/50'
                  : item.status === 'Restricted'
                    ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-900/50'
                    : 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-900/50'
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {item.itarControlled && <Shield className="w-5 h-5 text-red-600" />}
                    <span className="text-gray-900 dark:text-slate-100 font-medium">{item.partNumber}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Prohibited'
                      ? 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                      : item.status === 'Restricted'
                        ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                        : 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                      }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-slate-300 mb-2 text-sm">{item.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">ECCN: </span>
                    <span className="text-gray-900 dark:text-slate-100">{item.eccn}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">ITAR: </span>
                    <span className={item.itarControlled ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                      {item.itarControlled ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-gray-600 dark:text-slate-400">Authorized: </span>
                  <span className="text-gray-900 dark:text-slate-100">{item.authorizedCountries.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipments */}
        <div className="bg-white dark:bg-slate-900/80 rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
            <h3 className="text-gray-900 dark:text-slate-100">Pending Shipments</h3>
          </div>
          <div className="p-4 space-y-3">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className={`p-4 rounded-lg border ${shipment.status === 'Blocked'
                  ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-900/50'
                  : shipment.status === 'Approved'
                    ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-900/50'
                    : 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-900/50'
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-gray-900 dark:text-slate-100 font-bold">{shipment.customerName}</p>
                    <p className="text-gray-600 dark:text-slate-400 flex items-center gap-1 text-sm">
                      <Globe className="w-4 h-4" />
                      {shipment.destinationCountry}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${shipment.status === 'Blocked'
                      ? 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                      : shipment.status === 'Approved'
                        ? 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                        : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                      }`}
                  >
                    {shipment.status}
                  </span>
                </div>

                <div className="text-sm space-y-1 mb-3">
                  <p className="text-gray-600 dark:text-slate-400">Items: {shipment.items.join(', ')}</p>
                  <p className="text-gray-600 dark:text-slate-400">Ship Date: {shipment.shippingDate}</p>
                </div>

                {shipment.blockReason && (
                  <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-800 rounded p-2 mb-3">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                      <strong>⛔ Blocked:</strong> {shipment.blockReason}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => attemptDeliveryNote(shipment)}
                  className={`w-full px-4 py-2 rounded transition-colors text-sm font-bold ${shipment.status === 'Blocked'
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {shipment.status === 'Blocked' ? 'View Export Block' : 'Generate Delivery Note'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embargoed Countries Reference */}
      <div className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-4">
        <h4 className="text-gray-900 dark:text-slate-100 mb-2 font-bold">⚠️ Currently Embargoed Countries</h4>
        <div className="flex flex-wrap gap-2">
          {embargoedCountries.map((country, idx) => (
            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full border border-red-300 dark:border-red-900/50 text-sm font-medium">
              {country}
            </span>
          ))}
        </div>
        <p className="text-gray-600 dark:text-slate-400 mt-2 text-sm">
          All exports to these countries are automatically blocked. Special licenses may be required in exceptional cases.
        </p>
      </div>

      {/* Export Shield Block Modal */}
      {showExportShield && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full animate-in fade-in zoom-in duration-300">
            <div className="bg-red-600 p-6 rounded-t-lg">
              <div className="flex items-center gap-3 text-white">
                <Shield className="w-10 h-10" />
                <div>
                  <h3 className="text-white mb-1 text-xl font-bold">🛡️ Export Shield - Delivery Blocked</h3>
                  <p className="text-red-100">ITAR/EAR Compliance Violation Detected</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900 mb-2">
                      <strong>⛔ DELIVERY NOTE GENERATION BLOCKED</strong>
                    </p>
                    <p className="text-red-800 mb-2">
                      {selectedShipment.blockReason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 mb-1 font-bold">Shipment Details</p>
                  <div className="bg-gray-50 rounded p-3 space-y-2 text-sm border border-gray-200">
                    <p className="text-gray-900">Customer: {selectedShipment.customerName}</p>
                    <p className="text-gray-900">Destination: {selectedShipment.destinationCountry}</p>
                    <p className="text-gray-900">Address: {selectedShipment.destinationAddress}</p>
                    <p className="text-gray-900">Items: {selectedShipment.items.join(', ')}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
                  <p className="text-yellow-900 mb-2">
                    <strong>Required Actions:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
                    <li>Contact Export Compliance Officer immediately</li>
                    <li>Review item ECCN/ITAR classifications</li>
                    <li>Verify customer authorization and licensing</li>
                    <li>Do not proceed with shipment without approval</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-300 rounded p-4">
                  <p className="text-red-900 text-sm">
                    <strong>⚠️ Legal Warning:</strong> Unauthorized export of controlled items may result in severe civil and criminal penalties,
                    including fines up to $1,000,000 and imprisonment up to 20 years per violation.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowExportShield(false);
                    setSelectedShipment(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => showToast('Compliance Officer Notified', 'success')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Contact Compliance Officer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
