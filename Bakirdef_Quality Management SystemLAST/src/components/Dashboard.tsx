import { AlertCircle, CheckCircle, Clock, TrendingUp, TrendingDown, Package, Shield, FileCheck } from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      label: 'Open NCRs',
      value: 23,
      change: '+3',
      trend: 'up' as const,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Active CAPAs',
      value: 12,
      change: '-2',
      trend: 'down' as const,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Open Risks',
      value: 8,
      change: '-1',
      trend: 'down' as const,
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Pending FAIs',
      value: 5,
      change: '+2',
      trend: 'up' as const,
      icon: FileCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const recentNCRs = [
    { id: 'NCR-2025-001', title: 'Part dimension out of tolerance - PN-12345', severity: 'Major', status: 'Open', date: '2025-12-04', type: 'Manufacturing' },
    { id: 'NCR-2025-002', title: 'Material cert missing heat lot number', severity: 'Critical', status: 'In Progress', date: '2025-12-03', type: 'Material' },
    { id: 'NCR-2025-003', title: 'FOD found in assembly area', severity: 'Minor', status: 'Under Review', date: '2025-12-02', type: 'Process' },
    { id: 'NCR-2025-004', title: 'Supplier delivery - counterfeit suspect', severity: 'Critical', status: 'Contained', date: '2025-12-01', type: 'Supplier' },
  ];

  const keyMetrics = [
    { label: 'On-Time Delivery', value: '94.5%', target: '95%', status: 'warning' },
    { label: 'First Pass Yield', value: '97.2%', target: '95%', status: 'good' },
    { label: 'Escaped Defects', value: '2', target: '0', status: 'warning' },
    { label: 'Overdue CAPAs', value: '1', target: '0', status: 'warning' },
  ];

  const upcomingAudits = [
    { id: 'AUD-001', title: 'AS9100 Internal Audit - Manufacturing', date: '2025-12-15', auditor: 'John Smith', type: 'Internal' },
    { id: 'AUD-002', title: 'Customer Source Inspection', date: '2025-12-18', auditor: 'Boeing QA', type: 'Customer' },
    { id: 'AUD-003', title: 'Nadcap Special Process Audit', date: '2025-12-20', auditor: 'PRI Auditor', type: 'Certification' },
  ];

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div key={stat.label} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-gray-900 mb-2">{stat.value}</p>
                  <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                    <TrendIcon className="w-3 h-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AS9100 Key Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-4">AS9100 Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyMetrics.map((metric) => (
            <div key={metric.label} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-gray-900">{metric.value}</p>
                <span className="text-gray-500">/ {metric.target}</span>
              </div>
              <div className="mt-2">
                <div className={`h-1 rounded-full ${
                  metric.status === 'good' ? 'bg-green-500' : 
                  metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} style={{ width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent NCRs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Recent Non-Conformance Reports</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentNCRs.map((ncr) => (
              <div key={ncr.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-500">{ncr.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-white ${
                          ncr.severity === 'Critical'
                            ? 'bg-red-600'
                            : ncr.severity === 'Major'
                            ? 'bg-orange-500'
                            : 'bg-yellow-500'
                        }`}
                      >
                        {ncr.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                        {ncr.type}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-1">{ncr.title}</p>
                    <p className="text-gray-500">{ncr.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full whitespace-nowrap ${
                      ncr.status === 'Open'
                        ? 'bg-red-50 text-red-600'
                        : ncr.status === 'Contained'
                        ? 'bg-yellow-50 text-yellow-600'
                        : ncr.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    {ncr.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Audits */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Upcoming Audits</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingAudits.map((audit) => (
              <div key={audit.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-500">{audit.id}</span>
                      <span className={`px-2 py-0.5 rounded ${
                        audit.type === 'Customer' ? 'bg-purple-100 text-purple-700' :
                        audit.type === 'Certification' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {audit.type}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-1">{audit.title}</p>
                    <p className="text-gray-500">Auditor: {audit.auditor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600">{audit.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}