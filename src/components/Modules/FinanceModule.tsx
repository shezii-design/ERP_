import React, { useState } from 'react';
import { FinancialRecord } from '../../types/erp';
import { DollarSign, Plus, ArrowUpRight, ArrowDownRight, FileText, CheckCircle2 } from 'lucide-react';

interface FinanceModuleProps {
  financials: FinancialRecord[];
  onUpdateFinancials: (updated: FinancialRecord[]) => void;
  userRole: string;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({
  financials,
  onUpdateFinancials,
  userRole,
}) => {
  const [typeFilter, setTypeFilter] = useState<'All' | 'Revenue' | 'Expense'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [type, setType] = useState<'Revenue' | 'Expense'>('Revenue');
  const [category, setCategory] = useState('Enterprise Contracts');
  const [amount, setAmount] = useState(15000);
  const [description, setDescription] = useState('');

  const totalRevenue = financials.filter((f) => f.type === 'Revenue').reduce((a, b) => a + b.amount, 0);
  const totalExpense = financials.filter((f) => f.type === 'Expense').reduce((a, b) => a + b.amount, 0);
  const netProfit = totalRevenue - totalExpense;

  const filteredFinancials = financials.filter((f) => typeFilter === 'All' || f.type === typeFilter);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    const newRecord: FinancialRecord = {
      id: 'fin-' + Date.now(),
      type,
      category,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      description,
      status: 'Cleared',
    };

    onUpdateFinancials([newRecord, ...financials]);
    setShowAddModal(false);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <DollarSign className="w-7 h-7 text-emerald-400" />
            <span>Financials & P&L Ledger</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time balance sheet, revenue streams, operational expenses, and audit logs.
          </p>
        </div>
        {userRole !== 'Staff' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Ledger Entry</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue (YTD)</span>
          <div className="text-3xl font-bold text-emerald-400 mt-2">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Across contracts and direct sales</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Expenses (YTD)</span>
          <div className="text-3xl font-bold text-red-400 mt-2">${totalExpense.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Payroll, infrastructure, equipment</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Operating Profit</span>
          <div className={`text-3xl font-bold mt-2 ${netProfit >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
            ${netProfit.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Healthy EBITDA margin</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {(['All', 'Revenue', 'Expense'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                typeFilter === t
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t} Ledger
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400">
          Showing {filteredFinancials.length} transactions
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Type / Category</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {filteredFinancials.map((record) => {
                const isRev = record.type === 'Revenue';
                return (
                  <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isRev ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {isRev ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className={`font-semibold ${isRev ? 'text-emerald-400' : 'text-red-400'}`}>{record.type}</span>
                          <div className="text-xs text-slate-400">{record.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-200">{record.description}</td>
                    <td className="py-4 px-6 text-slate-300 text-xs">{record.date}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{record.status}</span>
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-right font-mono font-bold ${isRev ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isRev ? '+' : '-'}${record.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Ledger Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">New Financial Ledger Entry</h3>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'Revenue' | 'Expense')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  >
                    <option value="Revenue">Revenue</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="Quarterly client renewal payment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-md shadow-indigo-600/30"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
