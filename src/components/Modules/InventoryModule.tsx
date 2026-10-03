import React, { useState } from 'react';
import { InventoryItem } from '../../types/erp';
import { Package, Plus, Search, AlertTriangle, RefreshCw, Layers, MapPin } from 'lucide-react';

interface InventoryModuleProps {
  inventory: InventoryItem[];
  onUpdateInventory: (updated: InventoryItem[]) => void;
  userRole: string;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  onUpdateInventory,
  userRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Machinery');
  const [newQty, setNewQty] = useState(10);
  const [newMinStock, setNewMinStock] = useState(5);
  const [newPrice, setNewPrice] = useState(100);
  const [newLocation, setNewLocation] = useState('WH-Alpha Sector 1');

  const categories = ['All', ...Array.from(new Set(inventory.map((i) => i.category)))];

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku || !newName) return;

    const newItem: InventoryItem = {
      id: 'inv-' + Date.now(),
      sku: newSku.toUpperCase(),
      name: newName,
      category: newCategory,
      quantity: Number(newQty),
      minStock: Number(newMinStock),
      unitPrice: Number(newPrice),
      warehouseLocation: newLocation,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onUpdateInventory([newItem, ...inventory]);
    setShowAddModal(false);
    setNewSku('');
    setNewName('');
  };

  const handleAdjustStock = (id: string, delta: number) => {
    const updated = inventory.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return item;
    });
    onUpdateInventory(updated);
  };

  const lowStockCount = inventory.filter((i) => i.quantity <= i.minStock).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Package className="w-7 h-7 text-indigo-400" />
            <span>Inventory & Warehousing</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time tracking of enterprise stock levels across global storage hubs.
          </p>
        </div>
        {userRole !== 'Staff' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inventory Item</span>
          </button>
        )}
      </div>

      {/* Stats summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total SKUs</span>
            <div className="text-xl font-bold text-white mt-1">{inventory.length}</div>
          </div>
          <Layers className="w-8 h-8 text-indigo-400 opacity-80" />
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Low Stock Warnings</span>
            <div className={`text-xl font-bold mt-1 ${lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {lowStockCount} items
            </div>
          </div>
          <AlertTriangle className={`w-8 h-8 opacity-80 ${lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Inventory Value</span>
            <div className="text-xl font-bold text-white mt-1">
              ${inventory.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0).toLocaleString()}
            </div>
          </div>
          <Package className="w-8 h-8 text-cyan-400 opacity-80" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU, name, warehouse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">SKU / Item Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Quantity</th>
                <th className="py-4 px-6">Unit Price</th>
                <th className="py-4 px-6">Warehouse Location</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {filteredItems.map((item) => {
                const isLow = item.quantity <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-xs font-mono text-indigo-400">{item.sku}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${isLow ? 'text-amber-400 flex items-center space-x-1' : 'text-white'}`}>
                          {isLow && <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />}
                          {item.quantity}
                        </span>
                        <span className="text-xs text-slate-500">(Min: {item.minStock})</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-200">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-slate-300 text-xs flex items-center space-x-1 pt-5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.warehouseLocation}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          disabled={item.quantity <= 0}
                          className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold disabled:opacity-30"
                          title="Decrease Stock"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleAdjustStock(item.id, 1)}
                          className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                          title="Increase Stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                    No inventory items found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inventory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add New Inventory Item</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="SKU-9999"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  >
                    <option value="Machinery">Machinery</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Materials">Materials</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="Industrial Actuator Z-5"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Initial Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    min="0"
                    value={newMinStock}
                    onChange={(e) => setNewMinStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Warehouse Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
