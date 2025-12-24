import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Issue } from './Issues';

interface IssueModalProps {
  issue: Issue | null;
  onClose: () => void;
  onSave: (issue: Issue) => void;
}

export function IssueModal({ issue, onClose, onSave }: IssueModalProps) {
  const [formData, setFormData] = useState<Issue>({
    id: '',
    title: '',
    description: '',
    severity: 'Major',
    status: 'Open',
    reportedBy: '',
    assignedTo: '',
    category: 'Manufacturing',
    dateReported: new Date().toISOString().split('T')[0],
    dueDate: '',
    partNumber: '',
    serialNumber: '',
    customerImpact: 'No',
    containmentAction: '',
    disposition: 'Pending',
  });

  useEffect(() => {
    if (issue) {
      setFormData(issue);
    }
  }, [issue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = new Date().getFullYear();
    const issueToSave = {
      ...formData,
      id: formData.id || `NCR-${year}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    };
    onSave(issueToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">{issue ? 'Edit NCR' : 'New Non-Conformance Report'}</h2>
            <p className="text-gray-600 mt-1">AS9100 Clause 8.7 - Control of Nonconforming Outputs</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-gray-900 border-b pb-2">Basic Information</h3>
            
            <div>
              <label className="block text-gray-700 mb-2">NCR Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                required
                placeholder="Detailed description of the non-conformance..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Severity *</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as Issue['severity'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Critical</option>
                  <option>Major</option>
                  <option>Minor</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Issue['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Open</option>
                  <option>Contained</option>
                  <option>In Progress</option>
                  <option>Under Review</option>
                  <option>Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Issue['category'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Manufacturing</option>
                  <option>Material</option>
                  <option>Process</option>
                  <option>Supplier</option>
                  <option>Design</option>
                  <option>FOD</option>
                  <option>Safety</option>
                </select>
              </div>
            </div>
          </div>

          {/* Traceability */}
          <div className="space-y-4">
            <h3 className="text-gray-900 border-b pb-2">Traceability (AS9100 Clause 8.5.2)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Part Number</label>
                <input
                  type="text"
                  value={formData.partNumber}
                  onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PN-XXXXX"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Serial Number</label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SN-XXXXX"
                />
              </div>
            </div>
          </div>

          {/* Disposition & Impact */}
          <div className="space-y-4">
            <h3 className="text-gray-900 border-b pb-2">Disposition & Impact Assessment</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Disposition *</label>
                <select
                  value={formData.disposition}
                  onChange={(e) => setFormData({ ...formData, disposition: e.target.value as Issue['disposition'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Pending</option>
                  <option>Use As Is</option>
                  <option>Rework</option>
                  <option>Scrap</option>
                  <option>Return to Supplier</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Customer Impact *</label>
                <select
                  value={formData.customerImpact}
                  onChange={(e) => setFormData({ ...formData, customerImpact: e.target.value as Issue['customerImpact'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>No</option>
                  <option>Potential</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Containment Action</label>
              <textarea
                value={formData.containmentAction}
                onChange={(e) => setFormData({ ...formData, containmentAction: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                placeholder="Immediate containment actions taken to prevent further occurrences..."
              />
            </div>
          </div>

          {/* Assignment & Dates */}
          <div className="space-y-4">
            <h3 className="text-gray-900 border-b pb-2">Assignment & Timeline</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Reported By *</label>
                <input
                  type="text"
                  value={formData.reportedBy}
                  onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Assigned To *</label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Date Reported *</label>
                <input
                  type="date"
                  value={formData.dateReported}
                  onChange={(e) => setFormData({ ...formData, dateReported: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {issue ? 'Update' : 'Create'} NCR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}