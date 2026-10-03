export type UserRole = 'Administrator' | 'Manager' | 'Staff';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  department: string;
  avatarUrl?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unitPrice: number;
  warehouseLocation: string;
  lastUpdated: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  itemsCount: number;
  shippingAddress: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  salary: number;
  hireDate: string;
}

export interface FinancialRecord {
  id: string;
  type: 'Revenue' | 'Expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'Cleared' | 'Pending';
}

export interface CRMContact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Lead' | 'Customer' | 'Partner';
  dealValue: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  module: string;
}
