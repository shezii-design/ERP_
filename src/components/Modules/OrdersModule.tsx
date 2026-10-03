import React, { useState } from 'react';
import { Order } from '../../types/erp';
import { ShoppingCart, Plus, Search, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface OrdersModuleProps {
  orders: Order[];
  onUpdateOrders: (updated: Order[]) => void;
  userRole: string;
}

export const OrdersModule: React.FC<OrdersModuleProps> = ({
  orders,
  onUpdateOrders,
  userRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState(5000);
  const [itemsCount, setItemsCount] = useState(3);
  const [shippingAddress, setShippingAddress] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: Order['status']) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o));
    onUpdateOrders(updated);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      totalAmount: Number(totalAmount),
      itemsCount: Number(itemsCount),
      shippingAddress: shippingAddress || 'HQ Corporate Logistics Bay',
    };

    onUpdateOrders([newOrder, ...orders]);
    setShowAddModal(false);
    setCustomerName('');
    setShippingAddress('');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1 w-max">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center space-x-1 w-max">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipped</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center space-x-1 w-max">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950 text-amber-400 border border-amber-800 flex items-center space-x-1 w-max">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-950 text-red-400 border border-red-800 flex items-center space-x-1 w-max">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <ShoppingCart className="w-7 h-7 text-indigo-400" />
            <span>Sales Orders & Fulfillment</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor purchase orders, client shipments, and automated fulfillment workflows.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Sales Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PO number, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Order ID / Client</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Items / Total</th>
                <th className="py-4 px-6">Shipping Address</th>
                <th className="py-4 px-6 text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white">{order.customerName}</div>
                    <div className="text-xs font-mono text-indigo-400">{order.orderNumber}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-300 text-xs">{order.date}</td>
                  <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                  <td className="py-4 px-6">
                    <div className="font-mono text-white">${order.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">{order.itemsCount} SKUs in order</div>
                  </td>
                  <td className="py-4 px-6 text-slate-300 text-xs max-w-xs truncate">{order.shippingAddress}</td>
                  <td className="py-4 px-6 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                    No orders found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create New Sales Order</h3>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Customer / Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="Apex Aero Dynamics"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Total Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Items Count</label>
                  <input
                    type="number"
                    min="1"
                    value={itemsCount}
                    onChange={(e) => setItemsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Shipping Address</label>
                <input
                  type="text"
                  placeholder="742 Evergreen Terrace, Sector 7"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
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
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
