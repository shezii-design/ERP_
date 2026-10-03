/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { DashboardModule } from './components/Modules/DashboardModule';
import { InventoryModule } from './components/Modules/InventoryModule';
import { OrdersModule } from './components/Modules/OrdersModule';
import { HRModule } from './components/Modules/HRModule';
import { FinanceModule } from './components/Modules/FinanceModule';
import { CRMModule } from './components/Modules/CRMModule';
import { AnalyticsModule } from './components/Modules/AnalyticsModule';
import { SettingsModule } from './components/Modules/SettingsModule';

import {
  initialInventory,
  initialOrders,
  initialEmployees,
  initialFinancials,
  initialCRM,
  initialActivityLogs,
} from './data/mockErpData';

import { InventoryItem, Order, Employee, FinancialRecord, CRMContact, ActivityLog } from './types/erp';

function MainApp() {
  const { user, loading, role } = useAuth();
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // Persistent ERP state
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('nexus_erp_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nexus_erp_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('nexus_erp_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [financials, setFinancials] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('nexus_erp_financials');
    return saved ? JSON.parse(saved) : initialFinancials;
  });

  const [crm, setCrm] = useState<CRMContact[]>(() => {
    const saved = localStorage.getItem('nexus_erp_crm');
    return saved ? JSON.parse(saved) : initialCRM;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('nexus_erp_logs');
    return saved ? JSON.parse(saved) : initialActivityLogs;
  });

  useEffect(() => {
    localStorage.setItem('nexus_erp_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('nexus_erp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nexus_erp_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('nexus_erp_financials', JSON.stringify(financials));
  }, [financials]);

  useEffect(() => {
    localStorage.setItem('nexus_erp_crm', JSON.stringify(crm));
  }, [crm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-400">Loading NexusERP Enterprise Session...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const logActivity = (action: string, module: string) => {
    const newLog: ActivityLog = {
      id: 'act-' + Date.now(),
      user: user?.email || 'admin@nexuserp.com',
      action,
      timestamp: 'Just now',
      module,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 9)]);
  };

  const handleUpdateInventory = (updated: InventoryItem[]) => {
    setInventory(updated);
    logActivity('Updated stock levels and inventory catalog', 'Inventory');
  };

  const handleUpdateOrders = (updated: Order[]) => {
    setOrders(updated);
    logActivity('Modified sales order fulfillment status', 'Orders');
  };

  const handleUpdateEmployees = (updated: Employee[]) => {
    setEmployees(updated);
    logActivity('Onboarded new workforce member', 'HR');
  };

  const handleUpdateFinancials = (updated: FinancialRecord[]) => {
    setFinancials(updated);
    logActivity('Recorded new financial ledger transaction', 'Finance');
  };

  const handleUpdateCRM = (updated: CRMContact[]) => {
    setCrm(updated);
    logActivity('Updated enterprise CRM account profile', 'CRM');
  };

  return (
    <DashboardLayout activeModule={activeModule} onSelectModule={setActiveModule}>
      {activeModule === 'dashboard' && (
        <DashboardModule
          inventory={inventory}
          orders={orders}
          employees={employees}
          financials={financials}
          crm={crm}
          activityLogs={activityLogs}
          onNavigateModule={setActiveModule}
        />
      )}
      {activeModule === 'inventory' && (
        <InventoryModule
          inventory={inventory}
          onUpdateInventory={handleUpdateInventory}
          userRole={role}
        />
      )}
      {activeModule === 'orders' && (
        <OrdersModule
          orders={orders}
          onUpdateOrders={handleUpdateOrders}
          userRole={role}
        />
      )}
      {activeModule === 'hr' && (
        <HRModule
          employees={employees}
          onUpdateEmployees={handleUpdateEmployees}
          userRole={role}
        />
      )}
      {activeModule === 'finance' && (
        <FinanceModule
          financials={financials}
          onUpdateFinancials={handleUpdateFinancials}
          userRole={role}
        />
      )}
      {activeModule === 'crm' && (
        <CRMModule
          crm={crm}
          onUpdateCRM={handleUpdateCRM}
          userRole={role}
        />
      )}
      {activeModule === 'analytics' && <AnalyticsModule />}
      {activeModule === 'settings' && <SettingsModule />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
