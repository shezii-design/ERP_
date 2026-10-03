import { InventoryItem, Order, Employee, FinancialRecord, CRMContact, ActivityLog } from '../types/erp';

export const initialInventory: InventoryItem[] = [
  { id: 'inv-1', sku: 'SKU-8821', name: 'Industrial Hydraulic Pump X-9', category: 'Machinery', quantity: 14, minStock: 5, unitPrice: 1250.00, warehouseLocation: 'WH-Alpha Sector 3', lastUpdated: '2026-10-01' },
  { id: 'inv-2', sku: 'SKU-4412', name: 'Titanium Alloy Fastener Kit (100pcs)', category: 'Hardware', quantity: 230, minStock: 50, unitPrice: 85.50, warehouseLocation: 'WH-Alpha Sector 1', lastUpdated: '2026-10-02' },
  { id: 'inv-3', sku: 'SKU-9023', name: 'Smart IoT Sensor Node v4', category: 'Electronics', quantity: 8, minStock: 15, unitPrice: 320.00, warehouseLocation: 'WH-Beta Vault B', lastUpdated: '2026-09-28' },
  { id: 'inv-4', sku: 'SKU-1102', name: 'High-Temp Thermal Insulation Roll', category: 'Materials', quantity: 65, minStock: 20, unitPrice: 410.00, warehouseLocation: 'WH-Gamma Sector 4', lastUpdated: '2026-09-30' },
  { id: 'inv-5', sku: 'SKU-6634', name: 'Precision Laser Alignment Unit', category: 'Tools', quantity: 4, minStock: 5, unitPrice: 2800.00, warehouseLocation: 'WH-Beta Vault A', lastUpdated: '2026-10-02' },
];

export const initialOrders: Order[] = [
  { id: 'ord-1', orderNumber: 'PO-2026-901', customerName: 'Apex Aero Dynamics', date: '2026-10-02', status: 'Processing', totalAmount: 12500.00, itemsCount: 6, shippingAddress: '742 Evergreen Terrace, Sector 7' },
  { id: 'ord-2', orderNumber: 'PO-2026-902', customerName: 'Vanguard Robotics Corp', date: '2026-10-01', status: 'Shipped', totalAmount: 8400.50, itemsCount: 12, shippingAddress: '100 Cybernetic Way, Neo Tokyo' },
  { id: 'ord-3', orderNumber: 'PO-2026-903', customerName: 'Titan Energy Solutions', date: '2026-09-30', status: 'Delivered', totalAmount: 32100.00, itemsCount: 25, shippingAddress: '450 Petrochem Blvd, Houston' },
  { id: 'ord-4', orderNumber: 'PO-2026-904', customerName: 'Quantum Labs LLC', date: '2026-10-03', status: 'Pending', totalAmount: 1890.00, itemsCount: 2, shippingAddress: '88 Quantum Way, Geneva' },
];

export const initialEmployees: Employee[] = [
  { id: 'emp-1', name: 'Eleanor Vance', email: 'eleanor.vance@nexuserp.com', department: 'Executive', role: 'Chief Executive Officer', status: 'Active', salary: 185000, hireDate: '2021-03-15' },
  { id: 'emp-2', name: 'Marcus Sterling', email: 'marcus.sterling@nexuserp.com', department: 'Operations', role: 'Operations Director', status: 'Active', salary: 135000, hireDate: '2022-06-10' },
  { id: 'emp-3', name: 'Dr. Sofia Chen', email: 'sofia.chen@nexuserp.com', department: 'Engineering', role: 'Head of R&D', status: 'Active', salary: 155000, hireDate: '2020-11-01' },
  { id: 'emp-4', name: 'David Kim', email: 'david.kim@nexuserp.com', department: 'Finance', role: 'Senior Controller', status: 'Active', salary: 120000, hireDate: '2023-01-20' },
  { id: 'emp-5', name: 'Jessica Taylor', email: 'jessica.taylor@nexuserp.com', department: 'Sales & CRM', role: 'Sales Manager', status: 'On Leave', salary: 110000, hireDate: '2023-08-14' },
];

export const initialFinancials: FinancialRecord[] = [
  { id: 'fin-1', type: 'Revenue', category: 'Enterprise Contracts', amount: 84500, date: '2026-10-02', description: 'Q3 Enterprise license tier renewal', status: 'Cleared' },
  { id: 'fin-2', type: 'Revenue', category: 'Hardware Sales', amount: 32100, date: '2026-10-01', description: 'Bulk shipment PO-2026-903', status: 'Cleared' },
  { id: 'fin-3', type: 'Expense', category: 'Cloud Infrastructure', amount: 14200, date: '2026-10-01', description: 'AWS & Supabase Enterprise clusters', status: 'Cleared' },
  { id: 'fin-4', type: 'Expense', category: 'Payroll & Benefits', amount: 96000, date: '2026-09-30', description: 'Monthly global payroll disbursement', status: 'Cleared' },
  { id: 'fin-5', type: 'Expense', category: 'R&D Equipment', amount: 8500, date: '2026-09-28', description: 'Advanced sensor testing rigs', status: 'Pending' },
];

export const initialCRM: CRMContact[] = [
  { id: 'crm-1', name: 'Jonathan Wright', company: 'Apex Aero Dynamics', email: 'j.wright@apexaero.com', phone: '+1 (555) 382-9102', status: 'Customer', dealValue: 125000 },
  { id: 'crm-2', name: 'Amara Okafor', company: 'Vanguard Robotics', email: 'a.okafor@vanguardrob.io', phone: '+1 (555) 942-1188', status: 'Customer', dealValue: 95000 },
  { id: 'crm-3', name: 'Liam Thorne', company: 'Titan Energy Solutions', email: 'l.thorne@titanenergy.com', phone: '+1 (555) 732-5541', status: 'Customer', dealValue: 310000 },
  { id: 'crm-4', name: 'Elena Rostova', company: 'Quantum Labs LLC', email: 'elena@quantumlabs.net', phone: '+41 22 819 9100', status: 'Lead', dealValue: 45000 },
];

export const initialActivityLogs: ActivityLog[] = [
  { id: 'act-1', user: 'admin@nexuserp.com', action: 'Approved purchase order PO-2026-901', timestamp: '10 mins ago', module: 'Orders' },
  { id: 'act-2', user: 'manager@nexuserp.com', action: 'Updated stock level for SKU-9023', timestamp: '45 mins ago', module: 'Inventory' },
  { id: 'act-3', user: 'admin@nexuserp.com', action: 'Onboarded new enterprise client Quantum Labs', timestamp: '2 hours ago', module: 'CRM' },
  { id: 'act-4', user: 'staff@nexuserp.com', action: 'Generated monthly P&L expense report', timestamp: '5 hours ago', module: 'Finance' },
];
