import React from 'react';
import { InventoryItem, Order, Employee, FinancialRecord, CRMContact, ActivityLog } from '../../types/erp';
import { TrendingUp, Package, ShoppingCart, Users, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck } from 'lucide-react';

interface DashboardModuleProps {
  inventory: InventoryItem[];
  orders: Order[];
  employees: Employee[];
  financials: FinancialRecord[];
  crm: CRMContact[];
  activityLogs: ActivityLog[];
  onNavigateModule: (module: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  inventory,
  orders,
  employees,
  financials,
  crm,
  activityLogs,
  onNavigateModule,
}) => {
  const totalRevenue = financials
    .filter((f) => f.type === 'Revenue')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = financials
    .filter((f) => f.type === 'Expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const lowStockCount = inventory.filter((i) => i.quantity <= i.minStock).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Enterprise Command Center</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back, Operations Executive</h1>
            <p className="text-slate-400 text-sm mt-1">
              All core operational subsystems are synchronised with Supabase. 
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateModule('inventory')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Manage Inventory ({inventory.length})</span>
            </button>
            <button
              onClick={() => onNavigateModule('orders')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateModule('finance')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Profit (YTD)</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            ${netProfit.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateModule('orders')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Orders</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {pendingOrdersCount} <span className="text-sm font-normal text-slate-400">pending</span>
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-indigo-400 font-medium">
            <span>{orders.length} total orders recorded</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateModule('inventory')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${lowStockCount > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {lowStockCount} <span className="text-sm font-normal text-slate-400">items</span>
          </div>
          <div className={`flex items-center space-x-1.5 mt-2 text-xs ${lowStockCount > 0 ? 'text-amber-400 font-medium' : 'text-slate-500'}`}>
            <span>{lowStockCount > 0 ? 'Action required in warehouse' : 'Stock levels optimal'}</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateModule('hr')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Workforce</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {employees.length} <span className="text-sm font-normal text-slate-400">staff</span>
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-cyan-400 font-medium">
            <span>Across 5 global departments</span>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Real-Time Enterprise Activity Log</span>
            </h3>
            <span className="text-xs text-slate-400">Supabase DB Sync Live</span>
          </div>

          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium">{log.action}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    User: <span className="text-slate-300">{log.user}</span> • Module: <span className="text-indigo-400">{log.module}</span>
                  </p>
                </div>
                <div className="text-xs text-slate-500 shrink-0">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Module Navigation Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2">ERP Subsystem Modules</h3>
            <p className="text-xs text-slate-400 mb-6">
              Navigate instantly across fully responsive enterprise modules.
            </p>
            <div className="space-y-2">
              {[
                { id: 'inventory', name: 'Inventory & Warehousing', count: `${inventory.length} items` },
                { id: 'orders', name: 'Sales Orders & Fulfillment', count: `${orders.length} orders` },
                { id: 'hr', name: 'Human Resources & Payroll', count: `${employees.length} staff` },
                { id: 'finance', name: 'Financials & P&L Ledger', count: `$${netProfit.toLocaleString()} net` },
                { id: 'crm', name: 'CRM & Client Accounts', count: `${crm.length} accounts` },
                { id: 'analytics', name: 'Analytics & Reports', count: 'Live metrics' },
              ].map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => onNavigateModule(mod.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/80 text-left transition-all group"
                >
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    {mod.name}
                  </span>
                  <span className="text-xs text-indigo-400 font-mono">
                    {mod.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            NexusERP Enterprise PWA v2.6 • Supabase Secure
          </div>
        </div>
      </div>
    </div>
  );
};
