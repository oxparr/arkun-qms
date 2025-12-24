
import { useState } from 'react';
import { Plus, Search, FileText, Download, Eye, Filter, FolderOpen, FileCheck } from 'lucide-react';
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
    { id: 'DOC-001', title: 'Quality Control Testing Procedure', type: 'SOP', version: '2.1', status: 'Active', owner: 'John Smith', effectiveDate: '2025-01-01', nextReviewDate: '2026-01-01', category: 'Quality Control' },
    { id: 'DOC-002', title: 'Document Control Policy', type: 'Policy', version: '1.5', status: 'Active', owner: 'Sarah Jones', effectiveDate: '2024-06-15', nextReviewDate: '2025-06-15', category: 'Quality Management' },
    { id: 'DOC-003', title: 'Equipment Calibration Log', type: 'Form', version: '3.0', status: 'Active', owner: 'Mike Johnson', effectiveDate: '2025-03-01', nextReviewDate: '2026-03-01', category: 'Equipment' },
    { id: 'DOC-004', title: 'Batch Release Work Instruction', type: 'Work Instruction', version: '1.2', status: 'Under Review', owner: 'Jane Doe', effectiveDate: '2024-08-01', nextReviewDate: '2025-12-15', category: 'Manufacturing' },
    { id: 'DOC-005', title: 'Previous Inspection Record Template', type: 'Record', version: '2.0', status: 'Obsolete', owner: 'Tom Wilson', effectiveDate: '2023-01-01', nextReviewDate: '2024-01-01', category: 'Quality Control' },
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
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Document Library</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
            <FolderOpen className="w-4 h-4 text-emerald-500" />
            AS9100 Clause 7.5 - Documented Information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium">
            <Plus className="w-4 h-4" /> Add Document
          </button>
        </div>
      </div>

      {/* --- Search & Filter --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search titles, IDs, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 shadow-sm bg-white dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-300 font-medium focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800"
          >
            <option>All</option>
            <option>SOP</option>
            <option>Work Instruction</option>
            <option>Form</option>
            <option>Policy</option>
          </select>
        </div>
      </div>

      {/* --- Document List --- */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-700">
            <tr className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Document ID</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Version</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <td className="px-6 py-4 font-mono font-bold text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
                  {doc.type === 'SOP' ? <FileText className="w-3.5 h-3.5 text-blue-400" /> :
                    doc.type === 'Form' ? <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> :
                      <FolderOpen className="w-3.5 h-3.5 text-slate-400" />}
                  {doc.id}
                </td>
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 text-sm">{doc.title}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">{doc.type}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">v{doc.version}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${doc.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50' :
                    doc.status === 'Draft' ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600' :
                      doc.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50' :
                        'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/50'
                    }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{doc.owner}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(doc)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded transition-colors" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
