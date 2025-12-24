import { useState } from 'react';
import { Plus, Search, FileText, Download, Eye } from 'lucide-react';
import { DocumentModal } from './DocumentModal';

export interface Document {
  id: string;
  title: string;
  type: 'SOP' | 'Work Instruction' | 'Form' | 'Policy' | 'Record';
  version: string;
  status: 'Draft' | 'Active' | 'Obsolete' | 'Under Review';
  owner: string;
  effectiveDate: string;
  nextReviewDate: string;
  category: string;
}

export function Documents() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'DOC-001',
      title: 'Quality Control Testing Procedure',
      type: 'SOP',
      version: '2.1',
      status: 'Active',
      owner: 'John Smith',
      effectiveDate: '2025-01-01',
      nextReviewDate: '2026-01-01',
      category: 'Quality Control',
    },
    {
      id: 'DOC-002',
      title: 'Document Control Policy',
      type: 'Policy',
      version: '1.5',
      status: 'Active',
      owner: 'Sarah Jones',
      effectiveDate: '2024-06-15',
      nextReviewDate: '2025-06-15',
      category: 'Quality Management',
    },
    {
      id: 'DOC-003',
      title: 'Equipment Calibration Log',
      type: 'Form',
      version: '3.0',
      status: 'Active',
      owner: 'Mike Johnson',
      effectiveDate: '2025-03-01',
      nextReviewDate: '2026-03-01',
      category: 'Equipment',
    },
    {
      id: 'DOC-004',
      title: 'Batch Release Work Instruction',
      type: 'Work Instruction',
      version: '1.2',
      status: 'Under Review',
      owner: 'Jane Doe',
      effectiveDate: '2024-08-01',
      nextReviewDate: '2025-12-15',
      category: 'Manufacturing',
    },
    {
      id: 'DOC-005',
      title: 'Previous Inspection Record Template',
      type: 'Record',
      version: '2.0',
      status: 'Obsolete',
      owner: 'Tom Wilson',
      effectiveDate: '2023-01-01',
      nextReviewDate: '2024-01-01',
      category: 'Quality Control',
    },
  ]);

  const handleAddDocument = (doc: Document) => {
    setDocuments([doc, ...documents]);
  };

  const handleUpdateDocument = (updatedDoc: Document) => {
    setDocuments(documents.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)));
  };

  const openModal = (doc?: Document) => {
    setSelectedDoc(doc || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoc(null);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Document Management</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option>SOP</option>
            <option>Work Instruction</option>
            <option>Form</option>
            <option>Policy</option>
            <option>Record</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600">ID</th>
                <th className="text-left px-6 py-3 text-gray-600">Title</th>
                <th className="text-left px-6 py-3 text-gray-600">Type</th>
                <th className="text-left px-6 py-3 text-gray-600">Version</th>
                <th className="text-left px-6 py-3 text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-gray-600">Owner</th>
                <th className="text-left px-6 py-3 text-gray-600">Next Review</th>
                <th className="text-left px-6 py-3 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{doc.id}</td>
                  <td className="px-6 py-4 text-gray-900">{doc.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-600">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{doc.version}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        doc.status === 'Active'
                          ? 'bg-green-50 text-green-600'
                          : doc.status === 'Draft'
                          ? 'bg-gray-50 text-gray-600'
                          : doc.status === 'Under Review'
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{doc.owner}</td>
                  <td className="px-6 py-4 text-gray-900">{doc.nextReviewDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(doc)}
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                        title="View/Edit"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <DocumentModal
          document={selectedDoc}
          onClose={closeModal}
          onSave={(doc) => {
            if (selectedDoc) {
              handleUpdateDocument(doc);
            } else {
              handleAddDocument(doc);
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
}
