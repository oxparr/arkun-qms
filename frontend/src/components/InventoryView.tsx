
import { useState, useEffect } from 'react';
import { Shield, Package, AlertCircle, Search, Filter } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface InventoryItem {
    id: string;
    part_number: string;
    description: string;
    quantity: number;
    location: string;
    is_gfe: boolean;
    owner?: string;
    assignedProject?: string;
}

export function InventoryView() {
    const [items, setItems] = useState<InventoryItem[]>([
        { id: 'INV-001', part_number: 'TI-BILLET-7075', description: 'Titanium Billet 7075-T6', quantity: 45, location: 'Rack A-01', is_gfe: false },
        { id: 'INV-002', part_number: 'AL-SHEET-2024', description: 'Aluminum Sheet 2024-T3', quantity: 120, location: 'Rack B-03', is_gfe: false },
        { id: 'GFE-8899', part_number: 'ASM-LGEAR-MAIN', description: 'Main Landing Gear Assembly (Customer Material)', quantity: 2, location: 'Secure Cage 1', is_gfe: true, owner: 'ASELSAN', assignedProject: 'PRJ-2025-001' },
        { id: 'GFE-7721', part_number: 'AVIONIC-HUD-V2', description: 'HUD Unit Prototype', quantity: 1, location: 'Secure Cage 2', is_gfe: true, owner: 'TUSAŞ' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [issuanceModal, setIssuanceModal] = useState<{ isOpen: boolean, itemId: string | null }>({ isOpen: false, itemId: null });
    const [issueDetails, setIssueDetails] = useState({ projectId: '', workOrder: '', quantity: 1 });
    const { showToast } = useToast();

    const filteredItems = items.filter(item =>
        item.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenIssue = (id: string) => {
        setIssuanceModal({ isOpen: true, itemId: id });
        setIssueDetails({ projectId: 'PRJ-2025-001', workOrder: 'WO-', quantity: 1 });
    };

    const confirmIssue = () => {
        if (!issuanceModal.itemId) return;

        const itemIndex = items.findIndex(i => i.id === issuanceModal.itemId);
        if (itemIndex === -1) return;

        const item = items[itemIndex];
        if (item.quantity < issueDetails.quantity) {
            showToast('Insufficient Stock!', 'error');
            return;
        }

        const newItems = [...items];
        newItems[itemIndex] = {
            ...item,
            quantity: item.quantity - issueDetails.quantity,
            assignedProject: issueDetails.projectId // Track assignment
        };
        setItems(newItems);

        // EVM Integration Simulation
        // In a real app: await api.post('/evm/cost', { projectId, amount: cost * qty })
        console.log(`[Traceability] Issued ${issueDetails.quantity} of ${item.part_number} to ${issueDetails.projectId} (WO: ${issueDetails.workOrder})`);
        showToast(`Stock Issued. EVM Actual Cost (AC) updated for ${issueDetails.projectId}.`, 'success');

        setIssuanceModal({ isOpen: false, itemId: null });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Inventory & GFE Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">AS9100D Clause 8.1.4 - Counterfeit Part Prevention & Customer Property</p>
                </div>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Part or Owner..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64 bg-white dark:bg-slate-800 dark:text-slate-100"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredItems.map(item => (
                    <div key={item.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${item.is_gfe ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' : 'bg-white border-slate-200 dark:bg-slate-900/80 dark:border-slate-800'} pb-4`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${item.is_gfe ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                                {item.is_gfe ? <Shield className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.part_number}</h3>
                                    {item.is_gfe && (
                                        <span className="bg-purple-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Shield className="w-3 h-3" /> Gov Property ({item.owner})
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                                {item.assignedProject && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">Assigned: {item.assignedProject}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-8 text-sm">
                            <div className="text-right">
                                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Location</p>
                                <p className="font-mono font-medium text-slate-700 dark:text-slate-300">{item.location}</p>
                            </div>
                            <div className="text-right w-20">
                                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Qty</p>
                                <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{item.quantity}</p>
                            </div>
                            <button
                                onClick={() => handleOpenIssue(item.id)}
                                disabled={item.quantity === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                Issue Stock
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Issuance Modal */}
            {issuanceModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-slate-700">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100">Issue to Production</h3>
                            <button onClick={() => setIssuanceModal({ isOpen: false, itemId: null })} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Project ID (EVM Link)</label>
                                <select
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-800 dark:text-slate-100"
                                    value={issueDetails.projectId}
                                    onChange={e => setIssueDetails({ ...issueDetails, projectId: e.target.value })}
                                >
                                    <option value="PRJ-2025-001">PRJ-2025-001 (Main Contract)</option>
                                    <option value="PRJ-2025-002">PRJ-2025-002 (R&D)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Work Order #</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm font-mono bg-white dark:bg-slate-800 dark:text-slate-100"
                                    value={issueDetails.workOrder}
                                    onChange={e => setIssueDetails({ ...issueDetails, workOrder: e.target.value })}
                                    placeholder="WO-2025-XXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-800 dark:text-slate-100"
                                    value={issueDetails.quantity}
                                    onChange={e => setIssueDetails({ ...issueDetails, quantity: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded p-3 text-xs text-blue-700 dark:text-blue-300">
                                <strong>Digital Genealogy:</strong> This action will be securely logged. Actual Cost (AC) for the selected project will be automatically updated.
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                            <button
                                onClick={() => setIssuanceModal({ isOpen: false, itemId: null })}
                                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmIssue}
                                className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg text-sm shadow-sm"
                            >
                                Confirm Issuance
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
