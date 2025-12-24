import { useState } from 'react';
import { Users, AlertTriangle, CheckCircle, Clock, XCircle, Search, Plus, UserCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Operator {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  certifications: Certification[];
  status: 'Compliant' | 'Expiring Soon' | 'Expired';
}

interface Certification {
  name: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  requiredFor: string[];
}

export function OperatorCompetency() {
  const { showToast } = useToast();
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [attemptedJob, setAttemptedJob] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const operators: Operator[] = [
    {
      id: 'OP-001',
      name: 'John Smith',
      employeeId: 'EMP-12345',
      department: 'Machining',
      status: 'Compliant',
      certifications: [
        {
          name: 'CNC Operator Level 2',
          issueDate: '2024-01-15',
          expiryDate: '2026-01-15',
          status: 'Valid',
          requiredFor: ['CNC Milling', 'CNC Turning'],
        },
        {
          name: 'AS9100 Quality Awareness',
          issueDate: '2024-06-01',
          expiryDate: '2025-06-01',
          status: 'Expiring Soon',
          requiredFor: ['All Operations'],
        },
      ],
    },
    {
      id: 'OP-002',
      name: 'Sarah Jones',
      employeeId: 'EMP-67890',
      department: 'Assembly',
      status: 'Expired',
      certifications: [
        {
          name: 'Torque Wrench Certification',
          issueDate: '2023-03-10',
          expiryDate: '2025-03-10',
          status: 'Valid',
          requiredFor: ['Fastener Installation'],
        },
        {
          name: 'FOD Prevention Training',
          issueDate: '2023-11-20',
          expiryDate: '2024-11-20',
          status: 'Expired',
          requiredFor: ['All Operations'],
        },
      ],
    },
    {
      id: 'OP-003',
      name: 'Mike Johnson',
      employeeId: 'EMP-24680',
      department: 'Inspection',
      status: 'Expiring Soon',
      certifications: [
        {
          name: 'CMM Programming',
          issueDate: '2024-02-15',
          expiryDate: '2026-02-15',
          status: 'Valid',
          requiredFor: ['CMM Inspection'],
        },
        {
          name: 'GD&T Level 3',
          issueDate: '2023-12-10',
          expiryDate: '2025-12-31',
          status: 'Expiring Soon',
          requiredFor: ['Complex Part Inspection'],
        },
      ],
    },
  ];

  const checkJobAuthorization = (operator: Operator, job: string) => {
    setSelectedOperator(operator);
    setAttemptedJob(job);

    const hasExpired = operator.certifications.some(cert => cert.status === 'Expired');
    if (hasExpired) {
      showToast(`Authorization Denied: ${operator.name} has expired certs`, 'error');
    } else {
      showToast(`Verifying credentials for ${job}...`, 'info');
    }
  };

  const filteredOperators = operators.filter(op =>
    op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-slate-100">Operator Competency Control (Skill Matrix)</h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">AS9100 Clause 7.2 - Competence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Operator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 text-sm w-64 shadow-sm bg-white dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <button
            onClick={() => showToast('Opening Enrollment Form...', 'success')}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium"
          >
            <Plus className="w-4 h-4" /> Add Operator
          </button>
        </div>
      </div>

      {/* Alert for Expired Certifications */}
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-900 dark:text-red-200 mb-1">
              <strong>Certification Compliance Alert:</strong> {operators.filter(o => o.status === 'Expired').length} operator(s) have expired certifications
            </p>
            <p className="text-red-700 dark:text-red-300">
              Operators with expired certifications will be blocked from initiating jobs until compliance is restored.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <p className="text-gray-600 dark:text-slate-400 mb-1">Total Operators</p>
          <p className="text-gray-900 dark:text-slate-100">{operators.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-green-200 dark:border-green-900/30">
          <p className="text-gray-600 dark:text-slate-400 mb-1">Compliant</p>
          <p className="text-green-600 dark:text-green-400">{operators.filter(o => o.status === 'Compliant').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-yellow-200 dark:border-yellow-900/30">
          <p className="text-gray-600 dark:text-slate-400 mb-1">Expiring Soon</p>
          <p className="text-yellow-600 dark:text-yellow-400">{operators.filter(o => o.status === 'Expiring Soon').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-red-200 dark:border-red-900/30">
          <p className="text-gray-600 dark:text-slate-400 mb-1">Expired</p>
          <p className="text-red-600 dark:text-red-400">{operators.filter(o => o.status === 'Expired').length}</p>
        </div>
      </div>

      {/* Skill Matrix */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
          <h3 className="text-gray-900 dark:text-slate-100">Operator Skill Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400 font-medium text-sm">Operator</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400 font-medium text-sm">Employee ID</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400 font-medium text-sm">Department</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400 font-medium text-sm">Certifications</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400 font-medium text-sm">Status</th>
                <th className="text-left px-6 py-3 text-gray-600 dark:text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredOperators.map((operator) => (
                <tr key={operator.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-slate-100 font-medium">{operator.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-slate-100 text-sm">{operator.employeeId}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-slate-100 text-sm">{operator.department}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {operator.certifications.map((cert, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {cert.status === 'Valid' && <CheckCircle className="w-3 h-3 text-green-600" />}
                          {cert.status === 'Expiring Soon' && <Clock className="w-3 h-3 text-yellow-600" />}
                          {cert.status === 'Expired' && <XCircle className="w-3 h-3 text-red-600" />}
                          <span className={`text-xs ${cert.status === 'Valid' ? 'text-gray-900 dark:text-slate-100' :
                            cert.status === 'Expiring Soon' ? 'text-yellow-700 dark:text-yellow-400' :
                              'text-red-700 dark:text-red-400'
                            }`}>
                            {cert.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${operator.status === 'Compliant'
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : operator.status === 'Expiring Soon'
                        ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                      {operator.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => checkJobAuthorization(operator, 'CNC Milling')}
                      className="px-3 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors text-sm font-medium border border-blue-200 dark:border-blue-700 hover:border-blue-400 flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3" /> Check Auth
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Authorization Check Modal */}
      {selectedOperator && attemptedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full animate-in zoom-in duration-200">
            <div className={`p-6 rounded-t-lg ${selectedOperator.status === 'Expired' ? 'bg-red-600' : 'bg-green-600'
              }`}>
              <div className="flex items-center gap-3 text-white">
                {selectedOperator.status === 'Expired' ? (
                  <XCircle className="w-8 h-8" />
                ) : (
                  <CheckCircle className="w-8 h-8" />
                )}
                <div>
                  <h3 className="text-white text-xl font-bold">
                    {selectedOperator.status === 'Expired' ? '🚫 Access Denied' : '✓ Authorization Granted'}
                  </h3>
                  <p className={selectedOperator.status === 'Expired' ? 'text-red-100' : 'text-green-100'}>
                    Job: {attemptedJob}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-gray-600 mb-1 font-medium">Operator</p>
                <p className="text-gray-900 text-lg">{selectedOperator.name} ({selectedOperator.employeeId})</p>
              </div>

              <div>
                <p className="text-gray-600 mb-2 font-medium">Certification Status</p>
                <div className="space-y-2">
                  {selectedOperator.certifications.map((cert, idx) => (
                    <div key={idx} className={`p-3 rounded border ${cert.status === 'Expired' ? 'bg-red-50 border-red-300' :
                      cert.status === 'Expiring Soon' ? 'bg-yellow-50 border-yellow-300' :
                        'bg-green-50 border-green-300'
                      }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-bold">{cert.name}</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${cert.status === 'Expired' ? 'bg-red-200 text-red-800' :
                          cert.status === 'Expiring Soon' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                          }`}>
                          {cert.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1 text-sm">Expires: {cert.expiryDate}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOperator.status === 'Expired' && (
                <div className="bg-red-50 border border-red-300 rounded p-4">
                  <p className="text-red-900 text-sm">
                    <strong>⛔ Job Initiation Blocked:</strong> Operator has expired certifications.
                    Please contact Training Department to renew required certifications before proceeding.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedOperator(null);
                    setAttemptedJob(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedOperator.status !== 'Expired' && (
                  <button
                    onClick={() => {
                      showToast('Job Started Successfully', 'success');
                      setSelectedOperator(null);
                      setAttemptedJob(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Proceed with Job
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
