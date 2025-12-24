import { useState } from 'react';
import { Wrench, AlertTriangle, Lock, Calendar } from 'lucide-react';

interface Tool {
  id: string;
  toolName: string;
  toolNumber: string;
  type: string;
  maxLifeCycles: number;
  currentCycles: number;
  status: 'Active' | 'Near End-of-Life' | 'End-of-Life' | 'Locked';
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  calibrationStatus: 'Valid' | 'Due Soon' | 'Overdue';
  assignedTo?: string;
}

export function ToolManagement() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showCalibrationLock, setShowCalibrationLock] = useState(false);

  const tools: Tool[] = [
    {
      id: 'TOOL-001',
      toolName: 'Carbide End Mill - 0.500"',
      toolNumber: 'T-12345',
      type: 'Cutting Tool',
      maxLifeCycles: 1000,
      currentCycles: 850,
      status: 'Near End-of-Life',
      lastCalibrationDate: 'N/A',
      nextCalibrationDate: 'N/A',
      calibrationStatus: 'Valid',
      assignedTo: 'CNC Machine #5',
    },
    {
      id: 'TOOL-002',
      toolName: 'Torque Wrench - 0-100 ft-lb',
      toolNumber: 'T-67890',
      type: 'Calibrated Tool',
      maxLifeCycles: 5000,
      currentCycles: 3200,
      status: 'Active',
      lastCalibrationDate: '2025-06-15',
      nextCalibrationDate: '2025-12-15',
      calibrationStatus: 'Due Soon',
      assignedTo: 'Assembly Bay 3',
    },
    {
      id: 'TOOL-003',
      toolName: 'Drill Bit Set - HSS',
      toolNumber: 'T-24680',
      type: 'Cutting Tool',
      maxLifeCycles: 500,
      currentCycles: 500,
      status: 'End-of-Life',
      lastCalibrationDate: 'N/A',
      nextCalibrationDate: 'N/A',
      calibrationStatus: 'Valid',
    },
    {
      id: 'TOOL-004',
      toolName: 'Micrometer - 0-1"',
      toolNumber: 'T-13579',
      type: 'Calibrated Tool',
      maxLifeCycles: 10000,
      currentCycles: 4500,
      status: 'Locked',
      lastCalibrationDate: '2025-03-10',
      nextCalibrationDate: '2025-09-10',
      calibrationStatus: 'Overdue',
      assignedTo: 'Quality Lab 2',
    },
  ];

  const getLifePercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const attemptToolUse = (tool: Tool) => {
    setSelectedTool(tool);
    if (tool.calibrationStatus === 'Overdue') {
      setShowCalibrationLock(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Tool Life Management & Calibration Control</h2>
          <p className="text-gray-600 mt-1">AS9100 Clause 7.1.5 - Monitoring and Measuring Resources</p>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-900 mb-1">
                <strong>Tool Life Alerts:</strong> {tools.filter(t => t.status === 'Near End-of-Life').length} tool(s) nearing end-of-life
              </p>
              <p className="text-yellow-700">
                Operators will be notified when tools reach 85% of maximum cycles
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-900 mb-1">
                <strong>Calibration Locks:</strong> {tools.filter(t => t.calibrationStatus === 'Overdue').length} tool(s) overdue for calibration
              </p>
              <p className="text-red-700">
                Data entry is blocked for uncalibrated measuring equipment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 mb-1">Total Tools</p>
          <p className="text-gray-900">{tools.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-green-200">
          <p className="text-gray-600 mb-1">Active</p>
          <p className="text-green-600">{tools.filter(t => t.status === 'Active').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-yellow-200">
          <p className="text-gray-600 mb-1">Near EOL</p>
          <p className="text-yellow-600">{tools.filter(t => t.status === 'Near End-of-Life').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
          <p className="text-gray-600 mb-1">End-of-Life</p>
          <p className="text-orange-600">{tools.filter(t => t.status === 'End-of-Life').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-2 border-red-200">
          <p className="text-gray-600 mb-1">Locked</p>
          <p className="text-red-600">{tools.filter(t => t.status === 'Locked').length}</p>
        </div>
      </div>

      {/* Tool Inventory */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-gray-900">Tool Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600">Tool</th>
                <th className="text-left px-6 py-3 text-gray-600">Tool Number</th>
                <th className="text-left px-6 py-3 text-gray-600">Type</th>
                <th className="text-left px-6 py-3 text-gray-600">Life Remaining</th>
                <th className="text-left px-6 py-3 text-gray-600">Calibration</th>
                <th className="text-left px-6 py-3 text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tools.map((tool) => {
                const lifePercent = getLifePercentage(tool.currentCycles, tool.maxLifeCycles);
                return (
                  <tr key={tool.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{tool.toolName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{tool.toolNumber}</td>
                    <td className="px-6 py-4 text-gray-900">{tool.type}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{tool.currentCycles} / {tool.maxLifeCycles}</span>
                          <span className={`${
                            lifePercent >= 100 ? 'text-red-600' :
                            lifePercent >= 85 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {Math.round(lifePercent)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              lifePercent >= 100 ? 'bg-red-500' :
                              lifePercent >= 85 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(lifePercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tool.type === 'Calibrated Tool' ? (
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${
                            tool.calibrationStatus === 'Overdue' ? 'text-red-600' :
                            tool.calibrationStatus === 'Due Soon' ? 'text-yellow-600' :
                            'text-green-600'
                          }`} />
                          <div>
                            <p className={`text-sm ${
                              tool.calibrationStatus === 'Overdue' ? 'text-red-600' :
                              tool.calibrationStatus === 'Due Soon' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {tool.calibrationStatus}
                            </p>
                            <p className="text-xs text-gray-500">Next: {tool.nextCalibrationDate}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not applicable</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full ${
                        tool.status === 'Active'
                          ? 'bg-green-50 text-green-600'
                          : tool.status === 'Near End-of-Life'
                          ? 'bg-yellow-50 text-yellow-600'
                          : tool.status === 'End-of-Life'
                          ? 'bg-orange-50 text-orange-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {tool.status === 'End-of-Life' ? '🔒 EOL' : 
                         tool.status === 'Locked' ? '🔒 Locked' : tool.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => attemptToolUse(tool)}
                        className={`px-3 py-1 rounded transition-colors ${
                          tool.status === 'End-of-Life' || tool.status === 'Locked'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                        disabled={tool.status === 'End-of-Life' || tool.status === 'Locked'}
                      >
                        {tool.type === 'Calibrated Tool' ? 'Enter Data' : 'Use Tool'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tool Near End-of-Life Alert Modal */}
      {selectedTool && selectedTool.status === 'Near End-of-Life' && !showCalibrationLock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-yellow-500 p-6 rounded-t-lg">
              <div className="flex items-center gap-3 text-white">
                <AlertTriangle className="w-8 h-8" />
                <h3 className="text-white">⚠️ Tool Nearing End-of-Life</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-gray-900 mb-2">{selectedTool.toolName}</p>
                <p className="text-gray-600">Tool Number: {selectedTool.toolNumber}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
                <p className="text-yellow-900 mb-2">
                  <strong>Tool life at {Math.round(getLifePercentage(selectedTool.currentCycles, selectedTool.maxLifeCycles))}%</strong>
                </p>
                <p className="text-yellow-700">
                  Current: {selectedTool.currentCycles} / {selectedTool.maxLifeCycles} cycles
                </p>
                <p className="text-yellow-700 mt-2">
                  Please plan for tool replacement soon. Continued use may result in poor quality or tool breakage.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Acknowledge & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calibration Lock Modal */}
      {showCalibrationLock && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-red-600 p-6 rounded-t-lg">
              <div className="flex items-center gap-3 text-white">
                <Lock className="w-8 h-8" />
                <h3 className="text-white">🔒 Data Entry Blocked</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-gray-900 mb-2">{selectedTool.toolName}</p>
                <p className="text-gray-600">Tool Number: {selectedTool.toolNumber}</p>
              </div>
              <div className="bg-red-50 border border-red-300 rounded p-4">
                <p className="text-red-900 mb-2">
                  <strong>⛔ Calibration Overdue</strong>
                </p>
                <p className="text-red-700 mb-2">
                  Last Calibration: {selectedTool.lastCalibrationDate}
                </p>
                <p className="text-red-700 mb-2">
                  Due Date: {selectedTool.nextCalibrationDate}
                </p>
                <p className="text-red-700">
                  This measuring equipment cannot be used for data entry until calibration is performed and verified. 
                  Contact the Metrology Lab to schedule calibration.
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowCalibrationLock(false);
                    setSelectedTool(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
