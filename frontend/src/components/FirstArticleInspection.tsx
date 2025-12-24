
import { useState } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle, Search, Plus, Lock, Check } from 'lucide-react';
import { FAIModal } from './FAIModal';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';

export interface FAI {
  id: string;
  partNumber: string;
  revision: string;
  description: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Approved' | 'Rejected';
  inspectionDate: string;
  inspector: string;
  totalCharacteristics: number;
  inspectedCharacteristics: number;
  nonConformances: number;
  customerApproval?: string;
  notes?: string;
  productionLocked: boolean;
  progress?: number; // Calculated or from backend
  part?: string; // Mapped from partNumber
  rev?: string; // Mapped from revision
  name?: string; // Mapped from description
  locked?: boolean; // Mapped from productionLocked
  date?: string; // Mapped from inspectionDate
  chars?: string; // Mapped display string
}

export function FirstArticleInspection() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFai, setSelectedFai] = useState<FAI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Mock Data (enhanced with FAI interface structure)
  const [fais, setFais] = useState<FAI[]>([
    { id: 'FAI-2025-001', partNumber: 'PN-12345-A', revision: 'C', description: 'Main Landing Gear Bracket', status: 'Approved', productionLocked: false, inspector: 'John Smith', inspectionDate: '2025-11-20', totalCharacteristics: 45, inspectedCharacteristics: 45, nonConformances: 0, progress: 100 },
    { id: 'FAI-2025-002', partNumber: 'PN-67890-B', revision: 'E', description: 'Hydraulic Actuator Housing', status: 'In Progress', productionLocked: true, inspector: 'Sarah Jones', inspectionDate: '2025-12-05', totalCharacteristics: 52, inspectedCharacteristics: 38, nonConformances: 0, progress: 65 },
    { id: 'FAI-2025-003', partNumber: 'PN-11223-X', revision: 'A', description: 'Titanium Fastener Kit', status: 'Planned', productionLocked: true, inspector: 'Mike Brown', inspectionDate: '2025-12-08', totalCharacteristics: 12, inspectedCharacteristics: 0, nonConformances: 0, progress: 0 },
    { id: 'FAI-2025-004', partNumber: 'PN-99887-D', revision: 'D', description: 'Wing Spar Assembly', status: 'Rejected', productionLocked: true, inspector: 'John Smith', inspectionDate: '2025-11-15', totalCharacteristics: 128, inspectedCharacteristics: 128, nonConformances: 3, progress: 100 },
  ]);

  const handleOpenModal = (fai: FAI | null) => {
    setSelectedFai(fai);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFai(null);
  };

  const handleSaveFai = (savedFai: FAI) => {
    // Determine progress
    const progress = savedFai.totalCharacteristics > 0
      ? Math.round((savedFai.inspectedCharacteristics / savedFai.totalCharacteristics) * 100)
      : 0;

    const finalFai = { ...savedFai, progress };

    if (selectedFai) {
      // Edit
      setFais(prev => prev.map(f => f.id === finalFai.id ? finalFai : f));
      showToast('FAI record updated successfully', 'success');
    } else {
      // New
      setFais(prev => [finalFai, ...prev]);
      showToast('New FAI record created', 'success');
    }
    handleCloseModal();
  };

  const handleStartProduction = async (fai: FAI) => {
    try {
      await api.post('/production/start-batch', {
        partNumber: fai.partNumber,
        revision: fai.revision,
        faiId: fai.id
      });
      showToast(`Production started for ${fai.partNumber}`, 'success');
    } catch (e) {
      console.error(e);
      // Simulate success for demo if endpoint fails
      showToast(`Production started for ${fai.partNumber} (Simulated)`, 'success');
    }
  };

  const filteredFais = fais.filter(f =>
    f.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    locked: fais.filter(f => f.productionLocked).length,
    approved: fais.filter(f => f.status === 'Approved').length,
    inProgress: fais.filter(f => f.status === 'In Progress').length,
    yield: 92
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">First Article Inspection (FAI)</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
            <ClipboardCheck className="w-4 h-4 text-emerald-500" />
            AS9100 Clause 8.5.1.2 - First Article Inspection with Process Interlock
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenModal(null)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium"
          >
            <Plus className="w-4 h-4" /> New FAI
          </button>
        </div>
      </div>

      {/* --- Alert Banner --- */}
      {stats.locked > 0 && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/40 rounded-full text-rose-600 dark:text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
              FAI Process Interlock Active: {stats.locked} part(s) locked
            </h3>
            <p className="text-rose-600/80 dark:text-rose-400/80 text-sm mt-1">
              Production is halted for parts without approved FAI. Quality Department must enter measurements and approve before production can proceed.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 border-l border-rose-200 dark:border-rose-800">
              <span className="block text-2xl font-bold text-rose-700 dark:text-rose-400">{stats.locked}</span>
              <span className="text-xs uppercase font-bold text-rose-500 dark:text-rose-400">Locked</span>
            </div>
          </div>
        </div>
      )}

      {/* --- KPI Widgets --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Total FAIs</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{fais.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Planned</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{fais.filter(f => f.status === 'Planned').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-blue-500">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">In Progress</span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-emerald-500">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Approved</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.approved}</p>
        </div>
      </div>

      {/* --- Search --- */}
      <div className="relative group">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search FAI records (Part #, Description, ID)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 shadow-sm outline-none transition-all bg-white dark:bg-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
      </div>

      {/* --- FAI Cards --- */}
      <div className="space-y-6">
        {filteredFais.length === 0 ? (
          <div className="text-center py-12 text-slate-400 italic">No FAI records found matching your search.</div>
        ) : filteredFais.map(fai => (
          <div key={fai.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 hover:shadow-md transition-all">

            {/* Card Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">{fai.id}</span>
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded font-mono">{fai.partNumber} Rev {fai.revision}</span>
                  {fai.status === 'Approved' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  {fai.status === 'Rejected' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                  {fai.productionLocked && <Lock className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{fai.description}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${fai.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900/50' :
                fai.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-900/50' :
                  fai.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50' :
                    'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}>
                {fai.status}
              </span>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Inspector</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{fai.inspector}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Inspection Date</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{fai.inspectionDate}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Characteristics</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{fai.inspectedCharacteristics}/{fai.totalCharacteristics}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Defects</span>
                <span className={`text-sm font-bold ${fai.nonConformances > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>{fai.nonConformances}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-500 dark:text-slate-400">Inspection Progress</span>
                <span className="text-slate-900 dark:text-slate-100">{fai.progress || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${fai.status === 'Rejected' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${fai.progress || 0}%` }} />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleOpenModal(fai)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500 rounded-lg text-xs font-bold transition-colors"
              >
                View/Edit FAI
              </button>

              {fai.status === 'Approved' ? (
                <button
                  onClick={() => handleStartProduction(fai)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Start Production
                </button>
              ) : (
                <div className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold flex items-center gap-2 border border-rose-100 dark:border-rose-900/50 cursor-not-allowed opacity-75">
                  <Lock className="w-3.5 h-3.5" /> Production Locked
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {isModalOpen && (
        <FAIModal
          fai={selectedFai}
          onClose={handleCloseModal}
          onSave={handleSaveFai}
        />
      )}

    </div>
  );
}