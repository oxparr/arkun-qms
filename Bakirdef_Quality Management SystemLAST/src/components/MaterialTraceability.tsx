import { useState } from 'react';
import { Scan, Search, FileText, Download, CheckCircle, XCircle } from 'lucide-react';

interface MaterialRecord {
  id: string;
  lotNumber: string;
  materialType: string;
  supplier: string;
  heatNumber: string;
  certNumber: string;
  receivedDate: string;
  status: 'Validated' | 'Pending' | 'Rejected';
  usedInParts: string[];
}

export function MaterialTraceability() {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<MaterialRecord | null>(null);

  const [materials, setMaterials] = useState<MaterialRecord[]>([
    {
      id: 'MAT-001',
      lotNumber: 'LOT-2025-A1234',
      materialType: '7075-T6 Aluminum',
      supplier: 'Alcoa Aerospace',
      heatNumber: 'H-789456',
      certNumber: 'CERT-2025-0045',
      receivedDate: '2025-11-15',
      status: 'Validated',
      usedInParts: ['PN-12345-A', 'PN-67890-B'],
    },
    {
      id: 'MAT-002',
      lotNumber: 'LOT-2025-B5678',
      materialType: 'Ti-6Al-4V Titanium',
      supplier: 'TIMET Corporation',
      heatNumber: 'H-654321',
      certNumber: 'CERT-2025-0089',
      receivedDate: '2025-12-01',
      status: 'Validated',
      usedInParts: ['PN-24680-C'],
    },
    {
      id: 'MAT-003',
      lotNumber: 'LOT-2025-C9999',
      materialType: '304 Stainless Steel',
      supplier: 'Unknown Vendor',
      heatNumber: 'N/A',
      certNumber: 'MISSING',
      receivedDate: '2025-12-03',
      status: 'Rejected',
      usedInParts: [],
    },
  ]);

  const handleBarcodeScan = () => {
    setScanning(true);
    // Simulate barcode scan
    setTimeout(() => {
      const material = materials.find(m => m.lotNumber.includes(barcodeInput));
      if (material) {
        setLastScanned(material);
      }
      setScanning(false);
    }, 1000);
  };

  const generateGenealogy = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    // Simulate genealogy report generation
    alert(`Generating Digital Genealogy Report for ${material.lotNumber}\n\nTraceable to parts: ${material.usedInParts.join(', ')}\nHeat Number: ${material.heatNumber}\nSupplier: ${material.supplier}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Raw Material Traceability & Digital Genealogy</h2>
          <p className="text-gray-600 mt-1">AS9100 Clause 8.5.2 - Material Identification and Traceability</p>
        </div>
      </div>

      {/* Barcode Scanner Interface */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Scan className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">Barcode Scanner</h3>
            <p className="text-gray-600">Scan material barcode to validate certification</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBarcodeScan()}
              placeholder="Scan barcode or enter LOT number manually"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleBarcodeScan}
            disabled={scanning || !barcodeInput}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              scanning || !barcodeInput
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Scan className="w-5 h-5" />
            {scanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        {/* Scan Result */}
        {lastScanned && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${
            lastScanned.status === 'Validated' 
              ? 'bg-green-50 border-green-500' 
              : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {lastScanned.status === 'Validated' ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
                <div>
                  <h4 className={lastScanned.status === 'Validated' ? 'text-green-900' : 'text-red-900'}>
                    {lastScanned.status === 'Validated' ? '✓ Material Validated' : '✗ Material Rejected'}
                  </h4>
                  <p className={lastScanned.status === 'Validated' ? 'text-green-700' : 'text-red-700'}>
                    {lastScanned.lotNumber}
                  </p>
                </div>
              </div>
              {lastScanned.status === 'Validated' && (
                <button
                  onClick={() => generateGenealogy(lastScanned.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Generate Genealogy
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Material: </span>
                <span className="text-gray-900">{lastScanned.materialType}</span>
              </div>
              <div>
                <span className="text-gray-600">Heat Number: </span>
                <span className="text-gray-900">{lastScanned.heatNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Supplier: </span>
                <span className="text-gray-900">{lastScanned.supplier}</span>
              </div>
              <div>
                <span className="text-gray-600">Cert Number: </span>
                <span className="text-gray-900">{lastScanned.certNumber}</span>
              </div>
            </div>

            {lastScanned.status === 'Rejected' && (
              <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                <p className="text-red-800">
                  <strong>⚠️ DO NOT USE:</strong> Material certification is missing or invalid. Quarantine immediately and notify quality department.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Material Inventory */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-gray-900">Material Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600">LOT Number</th>
                <th className="text-left px-6 py-3 text-gray-600">Material Type</th>
                <th className="text-left px-6 py-3 text-gray-600">Heat Number</th>
                <th className="text-left px-6 py-3 text-gray-600">Supplier</th>
                <th className="text-left px-6 py-3 text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-gray-600">Used In Parts</th>
                <th className="text-left px-6 py-3 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{material.lotNumber}</td>
                  <td className="px-6 py-4 text-gray-900">{material.materialType}</td>
                  <td className="px-6 py-4 text-gray-900">{material.heatNumber}</td>
                  <td className="px-6 py-4 text-gray-900">{material.supplier}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full ${
                      material.status === 'Validated'
                        ? 'bg-green-50 text-green-600'
                        : material.status === 'Pending'
                        ? 'bg-yellow-50 text-yellow-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {material.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {material.usedInParts.map((part, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {part}
                        </span>
                      ))}
                      {material.usedInParts.length === 0 && (
                        <span className="text-gray-400">Not used</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => generateGenealogy(material.id)}
                      disabled={material.status !== 'Validated'}
                      className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
                        material.status === 'Validated'
                          ? 'text-blue-600 hover:bg-blue-50'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      Genealogy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
