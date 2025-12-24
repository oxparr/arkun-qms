import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { IssueModal } from './IssueModal';

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Open' | 'Contained' | 'In Progress' | 'Under Review' | 'Closed';
  reportedBy: string;
  assignedTo: string;
  category: 'Manufacturing' | 'Material' | 'Process' | 'Supplier' | 'Design' | 'FOD' | 'Safety';
  dateReported: string;
  dueDate: string;
  partNumber?: string;
  serialNumber?: string;
  customerImpact: 'Yes' | 'No' | 'Potential';
  containmentAction?: string;
  disposition: 'Use As Is' | 'Rework' | 'Scrap' | 'Return to Supplier' | 'Pending';
}

export function Issues() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 'NCR-2025-001',
      title: 'Part dimension out of tolerance - PN-12345',
      description: 'Critical dimension measuring 2.015" vs specification 2.000" ± 0.010"',
      severity: 'Major',
      status: 'Open',
      reportedBy: 'Jane Doe',
      assignedTo: 'Mike Johnson',
      category: 'Manufacturing',
      dateReported: '2025-12-04',
      dueDate: '2025-12-10',
      partNumber: 'PN-12345',
      serialNumber: 'SN-98765',
      customerImpact: 'No',
      disposition: 'Pending',
    },
    {
      id: 'NCR-2025-002',
      title: 'Material cert missing heat lot number',
      description: 'Material certification does not include required heat lot traceability',
      severity: 'Critical',
      status: 'In Progress',
      reportedBy: 'John Smith',
      assignedTo: 'Sarah Jones',
      category: 'Material',
      dateReported: '2025-12-03',
      dueDate: '2025-12-08',
      partNumber: 'PN-67890',
      customerImpact: 'Potential',
      containmentAction: 'Quarantined all parts from same lot',
      disposition: 'Pending',
    },
    {
      id: 'NCR-2025-003',
      title: 'FOD found in assembly area',
      description: 'Metal shavings discovered during pre-flight inspection',
      severity: 'Minor',
      status: 'Under Review',
      reportedBy: 'Mike Johnson',
      assignedTo: 'Tom Wilson',
      category: 'FOD',
      dateReported: '2025-12-02',
      dueDate: '2025-12-05',
      customerImpact: 'No',
      containmentAction: 'Area cleaned and re-inspected',
      disposition: 'Pending',
    },
    {
      id: 'NCR-2025-004',
      title: 'Supplier delivery - counterfeit suspect',
      description: 'Electronic component packaging shows signs of counterfeit origin',
      severity: 'Critical',
      status: 'Contained',
      reportedBy: 'Sarah Jones',
      assignedTo: 'Jane Doe',
      category: 'Supplier',
      dateReported: '2025-12-01',
      dueDate: '2025-12-15',
      partNumber: 'PN-45678',
      customerImpact: 'Yes',
      containmentAction: 'All suspect parts quarantined, supplier notified, customer informed',
      disposition: 'Return to Supplier',
    },
  ]);

  const handleAddIssue = (issue: Issue) => {
    setIssues([issue, ...issues]);
  };

  const handleUpdateIssue = (updatedIssue: Issue) => {
    setIssues(issues.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue)));
  };

  const openModal = (issue?: Issue) => {
    setSelectedIssue(issue || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.partNumber && issue.partNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'All' || issue.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Non-Conformance Reports (NCR)</h2>
          <p className="text-gray-600 mt-1">AS9100 Clause 8.7 - Control of Nonconforming Outputs</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New NCR
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search NCRs or part numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option>Open</option>
            <option>Contained</option>
            <option>In Progress</option>
            <option>Under Review</option>
            <option>Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600">NCR ID</th>
                <th className="text-left px-6 py-3 text-gray-600">Title</th>
                <th className="text-left px-6 py-3 text-gray-600">Part Number</th>
                <th className="text-left px-6 py-3 text-gray-600">Severity</th>
                <th className="text-left px-6 py-3 text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-gray-600">Customer Impact</th>
                <th className="text-left px-6 py-3 text-gray-600">Disposition</th>
                <th className="text-left px-6 py-3 text-gray-600">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => openModal(issue)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500">{issue.id}</td>
                  <td className="px-6 py-4 text-gray-900">{issue.title}</td>
                  <td className="px-6 py-4 text-gray-900">{issue.partNumber || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        issue.severity === 'Critical'
                          ? 'bg-red-600'
                          : issue.severity === 'Major'
                          ? 'bg-orange-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        issue.status === 'Open'
                          ? 'bg-red-50 text-red-600'
                          : issue.status === 'Contained'
                          ? 'bg-yellow-50 text-yellow-600'
                          : issue.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-600'
                          : issue.status === 'Under Review'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        issue.customerImpact === 'Yes'
                          ? 'bg-red-100 text-red-700'
                          : issue.customerImpact === 'Potential'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {issue.customerImpact}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{issue.disposition}</td>
                  <td className="px-6 py-4 text-gray-900">{issue.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <IssueModal
          issue={selectedIssue}
          onClose={closeModal}
          onSave={(issue) => {
            if (selectedIssue) {
              handleUpdateIssue(issue);
            } else {
              handleAddIssue(issue);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}