import { useState } from 'react';
import { AlertTriangle, Lock, CheckCircle } from 'lucide-react';

interface RevisionLockModalProps {
  onAcknowledge: () => void;
}

export function RevisionLockModal({ onAcknowledge }: RevisionLockModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [signature, setSignature] = useState('');

  const revisionChanges = [
    { partNumber: 'PN-12345-A', oldRev: 'B', newRev: 'C', changeType: 'Critical', description: 'Updated torque specification from 25 ft-lb to 30 ft-lb' },
    { partNumber: 'PN-67890-B', oldRev: 'D', newRev: 'E', changeType: 'Major', description: 'Material change from 7075-T6 to 7050-T7451' },
  ];

  const handleAcknowledge = () => {
    if (acknowledged && signature.trim()) {
      onAcknowledge();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-2xl">
        {/* Header with Lock Icon */}
        <div className="bg-red-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Lock className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-white mb-1">🔒 System Locked - Engineering Revision Released</h2>
              <p className="text-red-100">Production halted until acknowledgment</p>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <p className="text-white">Dec 5, 2025</p>
              <p className="text-red-100">10:42 AM</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alert Message */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 mb-2">
                  <strong>ATTENTION OPERATORS:</strong> New engineering revisions have been released. 
                  You must review and acknowledge these changes before resuming production.
                </p>
                <p className="text-yellow-700">
                  All shop-floor tablets are locked until each operator confirms understanding of the updates.
                </p>
              </div>
            </div>
          </div>

          {/* Revision Changes */}
          <div>
            <h3 className="text-gray-900 mb-3">Engineering Changes Requiring Acknowledgment</h3>
            <div className="space-y-3">
              {revisionChanges.map((change, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{change.partNumber}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Rev {change.oldRev} → {change.newRev}
                      </span>
                      <span className={`px-2 py-1 rounded text-white ${
                        change.changeType === 'Critical' ? 'bg-red-500' : 'bg-orange-500'
                      }`}>
                        {change.changeType}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{change.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Acknowledgment Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                id="acknowledge"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <label htmlFor="acknowledge" className="text-gray-900">
                <strong>I acknowledge that I have read and understood the engineering changes listed above.</strong>
                <p className="text-gray-600 mt-1">
                  I confirm that I will implement these changes in all future production activities and will not use outdated procedures or specifications.
                </p>
              </label>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Electronic Signature (Enter your name) *</label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!acknowledged}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={handleAcknowledge}
              disabled={!acknowledged || !signature.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                acknowledged && signature.trim()
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Acknowledge & Unlock System
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-gray-500 text-center border-t pt-4">
            Your acknowledgment will be recorded with timestamp and IP address for compliance tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
