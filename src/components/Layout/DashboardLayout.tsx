import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, LayoutDashboard, Package, ShoppingCart, Users, DollarSign, Building, BarChart3, Settings, LogOut, Menu, X, Shield, ChevronDown } from 'lucide-react';

interface DashboardLayoutProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeModule,
  onSelectModule,
  children,
}) => {
  const { user, role, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard },
    { id: 'inventory', name: 'Inventory & Warehousing', icon: Package },
    { id: 'orders', name: 'Sales & Orders', icon: ShoppingCart },
    { id: 'hr', name: 'HR & Payroll', icon: Users },
    { id: 'finance', name: 'Finance & Ledger', icon: DollarSign },
    { id: 'crm', name: 'CRM Accounts', icon: Building },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings & Security', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide text-white">Nexus<span className="text-indigo-400">ERP</span></h1>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Enterprise Supabase</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card at bottom of sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.email || 'User'}</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <Shield className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] text-indigo-400 font-semibold">{role}</span>
              </div>
            </div>
            <button
              onClick={signOut}
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex lg:hidden">
          <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <h1 className="font-extrabold text-base text-white">NexusERP</h1>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectModule(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={signOut}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-red-600/20 text-red-400 rounded-xl text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user?.email})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider hidden sm:inline">
              Module: {activeModule.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">{user?.email}</span>
              <span className="text-[10px] text-indigo-400 font-semibold">{role} Role</span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Module Container */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
