import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, AlertTriangle, Warehouse, 
  RefreshCw, Trash2, Edit3, X, Eye, DollarSign, Tag, 
  MapPin, Sliders, History, ArrowUpDown, Filter, Upload,
  Menu, Database, FileCode, Check, Copy, Layers, ChevronLeft, ChevronRight,
  Download, FileSpreadsheet, ZoomIn
} from 'lucide-react';
import { supabase } from './lib/supabase';

interface ItemLocation {
  location: string;
  cabin: string;
  quantity: number;
}

interface SellingPriceTier {
  id: string;
  name: string;
  profitPercentage: number;
}

interface PurchaseBatch {
  id: string;
  date: string;
  quantity: number;
  remainingQuantity: number;
  unitCost: number;
  vendorName: string;
}

interface HistoryLog {
  id: string;
  type: 'purchase' | 'sale' | 'audit_adjustment';
  date: string;
  quantityChange: number;
  unitPrice: number;
  partnerName: string;
  notes: string;
}

interface InventoryItem {
  id: string; // Internal Item ID e.g. NEX-1001
  name: string;
  brand: string;
  type: string;
  imageUrl: string;
  locations: ItemLocation[];
  totalQuantity: number;
  costPrice: number;
  generalPrice: number; // Main fixed price in PKR
  customPrices: { tierName: string; price: number; profitPercentage: number }[];
  dimensions: {
    height: string;
    outerDiameter: string;
    innerDiameter: string;
    gasketOd: string;
    gasketId: string;
  };
  threadSize: string;
  crossReferences: string[];
  machineApplication: string;
  purchaseBatches: PurchaseBatch[];
  history: HistoryLog[];
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'inventory' | 'fifo_valuation'>('inventory');
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPricingConfigOpen, setIsPricingConfigOpen] = useState(false);
  const [selectedItemHistory, setSelectedItemHistory] = useState<InventoryItem | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Universal Price Tiers Configuration
  const [priceTiers, setPriceTiers] = useState<SellingPriceTier[]>([
    { id: '1', name: 'Dealer Price', profitPercentage: 15 },
    { id: '2', name: 'Wholesale', profitPercentage: 25 },
    { id: '3', name: 'Retail', profitPercentage: 40 },
  ]);

  // Form state for New / Edit Item
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    brand: '',
    type: 'Oil Filter',
    imageUrl: '',
    locationsInput: 'Warehouse A [Cabin 12]',
    totalQuantity: 50,
    costPrice: 12000,
    generalPrice: 18500,
    height: '120mm',
    outerDiameter: '85mm',
    innerDiameter: '3/4-16 UNF',
    gasketOd: '70mm',
    gasketId: '60mm',
    threadSize: 'M20 x 1.5',
    crossReferences: 'LF16015, P550388, W712/83',
    machineApplication: 'Cat Excavator 320D, Perkins 1104',
  });

  // Fetch items from Supabase with fallback mock data
  useEffect(() => {
    fetchInventoryFromSupabase();
  }, []);

  const fetchInventoryFromSupabase = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('inventory_items').select('*');
      if (error || !data || data.length === 0) {
        // Fallback demo items in PKR
        setItems([
          {
            id: 'NEX-1001',
            name: 'Heavy Duty Lube Filter',
            brand: 'Fleetguard',
            type: 'Oil Filter',
            imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600',
            locations: [
              { location: 'Warehouse A', cabin: 'Cabin 12', quantity: 30 },
              { location: 'Warehouse B', cabin: 'Zone 2-Shelf 4', quantity: 24 }
            ],
            totalQuantity: 54,
            costPrice: 11500,
            generalPrice: 18500,
            customPrices: [
              { tierName: 'Dealer Price', price: 13225, profitPercentage: 15 },
              { tierName: 'Wholesale', price: 14375, profitPercentage: 25 },
              { tierName: 'Retail', price: 16100, profitPercentage: 40 }
            ],
            dimensions: { height: '145mm', outerDiameter: '93mm', innerDiameter: '1-12 UNF', gasketOd: '71mm', gasketId: '62mm' },
            threadSize: '1-12 UNF-2B',
            crossReferences: ['LF16015', 'P550388', 'W712/83'],
            machineApplication: 'Caterpillar 320D, Perkins 1104 Engine',
            purchaseBatches: [
              { id: 'b1', date: '2026-01-15', quantity: 30, remainingQuantity: 10, unitCost: 11000, vendorName: 'Global Filters Inc' },
              { id: 'b2', date: '2026-02-10', quantity: 44, remainingQuantity: 44, unitCost: 11800, vendorName: 'Industrial Parts Co' }
            ],
            history: [
              { id: 'h1', type: 'purchase', date: '2026-01-15', quantityChange: 30, unitPrice: 11000, partnerName: 'Global Filters Inc', notes: 'FIFO Batch 1' },
              { id: 'h2', type: 'purchase', date: '2026-02-10', quantityChange: 44, unitPrice: 11800, partnerName: 'Industrial Parts Co', notes: 'FIFO Batch 2' }
            ]
          },
          {
            id: 'NEX-1002',
            name: 'Hydraulic Return Filter',
            brand: 'Donaldson',
            type: 'Hydraulic Filter',
            imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
            locations: [
              { location: 'Warehouse B', cabin: 'Cabin 04', quantity: 18 }
            ],
            totalQuantity: 18,
            costPrice: 24000,
            generalPrice: 38000,
            customPrices: [
              { tierName: 'Dealer Price', price: 27600, profitPercentage: 15 },
              { tierName: 'Wholesale', price: 30000, profitPercentage: 25 },
              { tierName: 'Retail', price: 33600, profitPercentage: 40 }
            ],
            dimensions: { height: '210mm', outerDiameter: '115mm', innerDiameter: '50mm', gasketOd: '95mm', gasketId: '80mm' },
            threadSize: 'N/A (Cartridge)',
            crossReferences: ['P171573', 'HF6510', 'SH 56121'],
            machineApplication: 'Komatsu PC200-8 Excavator',
            purchaseBatches: [
              { id: 'b3', date: '2026-01-20', quantity: 20, remainingQuantity: 18, unitCost: 24000, vendorName: 'Hydraulics Direct Ltd' }
            ],
            history: [
              { id: 'h3', type: 'purchase', date: '2026-01-20', quantityChange: 20, unitPrice: 24000, partnerName: 'Hydraulics Direct Ltd', notes: 'Initial FIFO batch' }
            ]
          }
        ]);
      } else {
        setItems(data.map((row: any) => ({
          id: row.id,
          name: row.name,
          brand: row.brand,
          type: row.type,
          imageUrl: row.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
          locations: [{ location: 'Warehouse A', cabin: 'Cabin 01', quantity: row.total_quantity || 0 }],
          totalQuantity: row.total_quantity || 0,
          costPrice: row.cost_price || 0,
          generalPrice: row.general_price || 0,
          customPrices: priceTiers.map(tier => ({
            tierName: tier.name,
            price: Number((row.cost_price * (1 + tier.profitPercentage / 100)).toFixed(2)),
            profitPercentage: tier.profitPercentage
          })),
          dimensions: {
            height: row.height || 'N/A',
            outerDiameter: row.outer_diameter || 'N/A',
            innerDiameter: row.inner_diameter || 'N/A',
            gasketOd: row.gasket_od || 'N/A',
            gasketId: row.gasket_id || 'N/A',
          },
          threadSize: row.thread_size || 'N/A',
          crossReferences: row.cross_references || [],
          machineApplication: row.machine_application || 'N/A',
          purchaseBatches: [
            { id: 'b-default', date: new Date().toISOString().split('T')[0], quantity: row.total_quantity || 0, remainingQuantity: row.total_quantity || 0, unitCost: row.cost_price || 0, vendorName: 'Supabase DB' }
          ],
          history: []
        })));
      }
    } catch (err) {
      console.error('Error fetching from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      id: '',
      name: '',
      brand: '',
      type: 'Oil Filter',
      imageUrl: '',
      locationsInput: 'Warehouse A [Cabin 12]',
      totalQuantity: 50,
      costPrice: 12000,
      generalPrice: 18500,
      height: '120mm',
      outerDiameter: '85mm',
      innerDiameter: '3/4-16 UNF',
      gasketOd: '70mm',
      gasketId: '60mm',
      threadSize: 'M20 x 1.5',
      crossReferences: 'LF16015, P550388, W712/83',
      machineApplication: 'Cat Excavator 320D, Perkins 1104',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setFormData({
      id: item.id,
      name: item.name,
      brand: item.brand,
      type: item.type,
      imageUrl: item.imageUrl,
      locationsInput: `${item.locations[0]?.location || 'Warehouse A'} [${item.locations[0]?.cabin || 'Cabin 01'}]`,
      totalQuantity: item.totalQuantity,
      costPrice: item.costPrice,
      generalPrice: item.generalPrice,
      height: item.dimensions.height,
      outerDiameter: item.dimensions.outerDiameter,
      innerDiameter: item.dimensions.innerDiameter,
      gasketOd: item.dimensions.gasketOd,
      gasketId: item.dimensions.gasketId,
      threadSize: item.threadSize,
      crossReferences: item.crossReferences.join(', '),
      machineApplication: item.machineApplication,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent, isEditing: boolean) => {
    e.preventDefault();
    
    if (isEditing) {
      const updatedItem: InventoryItem = {
        id: formData.id,
        name: formData.name,
        brand: formData.brand,
        type: formData.type,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
        locations: [{ location: 'Warehouse A', cabin: formData.locationsInput, quantity: formData.totalQuantity }],
        totalQuantity: formData.totalQuantity,
        costPrice: formData.costPrice,
        generalPrice: formData.generalPrice,
        customPrices: priceTiers.map(tier => ({
          tierName: tier.name,
          price: Number((formData.costPrice * (1 + tier.profitPercentage / 100)).toFixed(2)),
          profitPercentage: tier.profitPercentage
        })),
        dimensions: {
          height: formData.height,
          outerDiameter: formData.outerDiameter,
          innerDiameter: formData.innerDiameter,
          gasketOd: formData.gasketOd,
          gasketId: formData.gasketId
        },
        threadSize: formData.threadSize,
        crossReferences: formData.crossReferences.split(',').map(s => s.trim()).filter(Boolean),
        machineApplication: formData.machineApplication,
        purchaseBatches: items.find(i => i.id === formData.id)?.purchaseBatches || [],
        history: items.find(i => i.id === formData.id)?.history || []
      };

      try {
        await supabase.from('inventory_items').update({
          name: updatedItem.name,
          brand: updatedItem.brand,
          type: updatedItem.type,
          image_url: updatedItem.imageUrl,
          total_quantity: updatedItem.totalQuantity,
          cost_price: updatedItem.costPrice,
          general_price: updatedItem.generalPrice,
          height: updatedItem.dimensions.height,
          outer_diameter: updatedItem.dimensions.outerDiameter,
          inner_diameter: updatedItem.dimensions.innerDiameter,
          gasket_od: updatedItem.dimensions.gasketOd,
          gasket_id: updatedItem.dimensions.gasketId,
          thread_size: updatedItem.threadSize,
          cross_references: updatedItem.crossReferences,
          machine_application: updatedItem.machineApplication
        }).eq('id', updatedItem.id);
      } catch (err) {
        console.error('Supabase update error:', err);
      }

      setItems(items.map(i => i.id === updatedItem.id ? updatedItem : i));
      setIsEditModalOpen(false);
    } else {
      const internalId = `NEX-${Math.floor(1000 + Math.random() * 9000)}`;
      const batchId = `b-${Date.now()}`;
      
      const newItem: InventoryItem = {
        id: internalId,
        name: formData.name,
        brand: formData.brand,
        type: formData.type,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
        locations: [{ location: 'Warehouse A', cabin: formData.locationsInput, quantity: formData.totalQuantity }],
        totalQuantity: formData.totalQuantity,
        costPrice: formData.costPrice,
        generalPrice: formData.generalPrice,
        customPrices: priceTiers.map(tier => ({
          tierName: tier.name,
          price: Number((formData.costPrice * (1 + tier.profitPercentage / 100)).toFixed(2)),
          profitPercentage: tier.profitPercentage
        })),
        dimensions: {
          height: formData.height,
          outerDiameter: formData.outerDiameter,
          innerDiameter: formData.innerDiameter,
          gasketOd: formData.gasketOd,
          gasketId: formData.gasketId
        },
        threadSize: formData.threadSize,
        crossReferences: formData.crossReferences.split(',').map(s => s.trim()).filter(Boolean),
        machineApplication: formData.machineApplication,
        purchaseBatches: [
          { id: batchId, date: new Date().toISOString().split('T')[0], quantity: formData.totalQuantity, remainingQuantity: formData.totalQuantity, unitCost: formData.costPrice, vendorName: 'Initial Supplier' }
        ],
        history: [
          {
            id: `h-${Date.now()}`,
            type: 'purchase',
            date: new Date().toISOString().split('T')[0],
            quantityChange: formData.totalQuantity,
            unitPrice: formData.costPrice,
            partnerName: 'Initial Supplier',
            notes: 'Initial FIFO batch created'
          }
        ]
      };

      try {
        await supabase.from('inventory_items').insert([{
          id: newItem.id,
          name: newItem.name,
          brand: newItem.brand,
          type: newItem.type,
          image_url: newItem.imageUrl,
          total_quantity: newItem.totalQuantity,
          cost_price: newItem.costPrice,
          general_price: newItem.generalPrice,
          height: newItem.dimensions.height,
          outer_diameter: newItem.dimensions.outerDiameter,
          inner_diameter: newItem.dimensions.innerDiameter,
          gasket_od: newItem.dimensions.gasketOd,
          gasket_id: newItem.dimensions.gasketId,
          thread_size: newItem.threadSize,
          cross_references: newItem.crossReferences,
          machine_application: newItem.machineApplication
        }]);
      } catch (err) {
        console.error('Supabase insert error:', err);
      }

      setItems([newItem, ...items]);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await supabase.from('inventory_items').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete error:', err);
    }
    setItems(items.filter(item => item.id !== id));
  };

  // CSV Template & Import/Export
  const downloadCsvTemplate = () => {
    const headers = "Name,Brand,Type,ImageUrl,Location,Cabin,Quantity,CostPrice,GeneralPrice,Height,OuterDiameter,InnerDiameter,GasketOD,GasketID,ThreadSize,CrossReferences,MachineApplication\n";
    const sampleRow = "Heavy Duty Air Filter,Baldwin,Air Filter,https://images.unsplash.com/photo-1581092160607-ee22621dd758,Warehouse A,Cabin 05,100,9500,16500,250mm,150mm,75mm,140mm,70mm,1-1/4 UNF,PA2800,Volvo Excavator EC210\n";
    const blob = new Blob([headers + sampleRow], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'nexus_erp_inventory_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportInventoryCsv = () => {
    let csv = "ID,Name,Brand,Type,Location,Cabin,Quantity,CostPrice,GeneralPrice,Height,OuterDiameter,InnerDiameter,GasketOD,GasketID,ThreadSize,CrossReferences,MachineApplication\n";
    items.forEach(i => {
      const loc = i.locations[0] || { location: 'Warehouse A', cabin: 'General' };
      csv += `"${i.id}","${i.name}","${i.brand}","${i.type}","${loc.location}","${loc.cabin}",${i.totalQuantity},${i.costPrice},${i.generalPrice},"${i.dimensions.height}","${i.dimensions.outerDiameter}","${i.dimensions.innerDiameter}","${i.dimensions.gasketOd}","${i.dimensions.gasketId}","${i.threadSize}","${i.crossReferences.join('; ')}","${i.machineApplication}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nexus_erp_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter(Boolean);
      const dataLines = lines.slice(1);
      const newItems: InventoryItem[] = [];

      for (let idx = 0; idx < dataLines.length; idx++) {
        const line = dataLines[idx];
        const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
        
        if (cols.length >= 9) {
          const name = cols[0] || 'Imported Part';
          const brand = cols[1] || 'Generic';
          const type = cols[2] || 'Filter';
          const imageUrl = cols[3] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600';
          const location = cols[4] || 'Warehouse A';
          const cabin = cols[5] || 'Cabin 01';
          const qty = parseInt(cols[6]) || 50;
          const cost = parseFloat(cols[7]) || 5000;
          const general = parseFloat(cols[8]) || 9500;
          const height = cols[9] || '100mm';
          const od = cols[10] || '80mm';
          const id = cols[11] || '50mm';
          const gOd = cols[12] || '70mm';
          const gId = cols[13] || '60mm';
          const thread = cols[14] || 'Standard';
          const cross = cols[15] ? cols[15].split(';').map(s => s.trim()) : ['IMP-001'];
          const machine = cols[16] || 'Universal Heavy Machinery';

          const internalId = `NEX-${Math.floor(1000 + Math.random() * 9000)}`;
          const batchId = `b-imp-${idx}`;

          const newItem: InventoryItem = {
            id: internalId,
            name,
            brand,
            type,
            imageUrl,
            locations: [{ location, cabin, quantity: qty }],
            totalQuantity: qty,
            costPrice: cost,
            generalPrice: general,
            customPrices: priceTiers.map(tier => ({
              tierName: tier.name,
              price: Number((cost * (1 + tier.profitPercentage / 100)).toFixed(2)),
              profitPercentage: tier.profitPercentage
            })),
            dimensions: { height, outerDiameter: od, innerDiameter: id, gasketOd: gOd, gasketId: gId },
            threadSize: thread,
            crossReferences: cross,
            machineApplication: machine,
            purchaseBatches: [
              { id: batchId, date: new Date().toISOString().split('T')[0], quantity: qty, remainingQuantity: qty, unitCost: cost, vendorName: 'CSV Bulk Import' }
            ],
            history: [
              {
                id: `h-imp-${idx}`,
                type: 'purchase',
                date: new Date().toISOString().split('T')[0],
                quantityChange: qty,
                unitPrice: cost,
                partnerName: 'CSV Bulk Import',
                notes: 'Imported via CSV template'
              }
            ]
          };

          try {
            await supabase.from('inventory_items').insert([{
              id: newItem.id,
              name: newItem.name,
              brand: newItem.brand,
              type: newItem.type,
              image_url: newItem.imageUrl,
              total_quantity: newItem.totalQuantity,
              cost_price: newItem.costPrice,
              general_price: newItem.generalPrice,
              height: newItem.dimensions.height,
              outer_diameter: newItem.dimensions.outerDiameter,
              inner_diameter: newItem.dimensions.innerDiameter,
              gasket_od: newItem.dimensions.gasketOd,
              gasket_id: newItem.dimensions.gasketId,
              thread_size: newItem.threadSize,
              cross_references: newItem.crossReferences,
              machine_application: newItem.machineApplication
            }]);
          } catch (err) {
            console.error('Supabase import error:', err);
          }

          newItems.push(newItem);
        }
      }

      if (newItems.length > 0) {
        setItems(prev => [...newItems, ...prev]);
        setIsImportModalOpen(false);
        alert(`Successfully imported ${newItems.length} items to Supabase & local FIFO storage!`);
      } else {
        alert('Could not parse CSV. Please ensure the template format is correct.');
      }
    };
    reader.readAsText(file);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.crossReferences.some(cr => cr.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalFifoValuation = items.reduce((acc, item) => {
    const itemVal = item.purchaseBatches.reduce((bAcc, batch) => bAcc + (batch.remainingQuantity * batch.unitCost), 0);
    return acc + itemVal;
  }, 0);

  const supabaseSqlCode = `-- ==============================================================================
-- NEXUS-ERP INDUSTRIAL INVENTORY & FIFO SQL SCHEMA FOR SUPABASE
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS inventory_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    image_url TEXT,
    total_quantity INT DEFAULT 0,
    cost_price NUMERIC(12, 2) NOT NULL,
    general_price NUMERIC(12, 2) NOT NULL,
    height VARCHAR(50),
    outer_diameter VARCHAR(50),
    inner_diameter VARCHAR(50),
    gasket_od VARCHAR(50),
    gasket_id VARCHAR(50),
    thread_size VARCHAR(100),
    cross_references TEXT[],
    machine_application TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS item_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id VARCHAR(50) REFERENCES inventory_items(id) ON DELETE CASCADE,
    warehouse_name VARCHAR(100) NOT NULL,
    cabin_number VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS purchase_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id VARCHAR(50) REFERENCES inventory_items(id) ON DELETE CASCADE,
    batch_date DATE NOT NULL,
    quantity INT NOT NULL,
    remaining_quantity INT NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id VARCHAR(50) REFERENCES inventory_items(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) CHECK (transaction_type IN ('purchase', 'sale', 'audit_adjustment')) NOT NULL,
    transaction_date DATE NOT NULL,
    quantity_change INT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    partner_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(supabaseSqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-x-hidden">
      
      {/* Collapsible Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-30 sticky top-0 h-screen`}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">NexusERP</span>
            </div>
          ) : (
            <div className="mx-auto h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Package className="h-5 w-5 text-white" />
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView('inventory')}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeView === 'inventory' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Package className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Inventory Products</span>}
          </button>

          <button
            onClick={() => setActiveView('fifo_valuation')}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeView === 'fifo_valuation' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ArrowUpDown className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>FIFO Valuation (PKR)</span>}
          </button>

          <button
            onClick={() => setIsSqlModalOpen(true)}
            className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <Database className="h-5 w-5 shrink-0 text-indigo-400" />
            {sidebarOpen && <span>Supabase SQL Schema</span>}
          </button>
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
            NexusERP • Currency: PKR (Rs)
          </div>
        )}
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {activeView === 'inventory' ? 'Product Catalog & Inventory' : 'FIFO Inventory Valuation'} 
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-normal">
                Currency: PKR (Rs)
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition border border-slate-700"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Bulk Import / Export</span>
            </button>
            <button
              onClick={() => setIsSqlModalOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-semibold transition border border-slate-700"
            >
              <FileCode className="h-4 w-4" />
              <span>SQL Code</span>
            </button>
            <button
              onClick={() => setIsPricingConfigOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
            >
              <Sliders className="h-4 w-4 text-indigo-400" />
              <span>Price Tiers</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6">
          
          {activeView === 'inventory' && (
            <>
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-3 w-full md:w-auto flex-1">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search ID, Name, Brand, or Cross-Reference..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="All">All Types</option>
                    <option value="Oil Filter">Oil Filter</option>
                    <option value="Hydraulic Filter">Hydraulic Filter</option>
                    <option value="Fuel Filter">Fuel Filter</option>
                    <option value="Air Filter">Air Filter</option>
                  </select>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  💡 <span className="text-indigo-400">Double-click</span> card for FIFO history • Click image to zoom.
                </div>
              </div>

              {/* Product Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-slate-500">
                    No products found.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div 
                      key={item.id}
                      onDoubleClick={() => setSelectedItemHistory(item)}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition group cursor-pointer shadow-xl relative"
                      title="Double-click to view FIFO purchase & sales history"
                    >
                      {/* Top info */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="relative group/img">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              onClick={(e) => { e.stopPropagation(); setEnlargedImage(item.imageUrl); }}
                              className="h-20 w-20 rounded-xl object-cover border border-slate-700 bg-slate-950 cursor-zoom-in hover:opacity-90 transition"
                              title="Click to enlarge image"
                            />
                            <div className="absolute bottom-1 right-1 bg-slate-950/80 p-1 rounded-md text-[10px] text-indigo-300 pointer-events-none">
                              <ZoomIn className="h-3 w-3" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-indigo-400">{item.id}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                {item.type}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mt-1 leading-tight group-hover:text-indigo-300 transition">{item.name}</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Brand: <span className="text-slate-200">{item.brand}</span></p>
                          </div>
                        </div>

                        {/* General Fixed Price - Big Display */}
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30 my-3 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">General Retail Price</span>
                            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
                              Rs {item.generalPrice.toLocaleString('en-PK')}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Cost Price</span>
                            <div className="text-sm font-bold text-slate-300 font-mono mt-0.5">
                              Rs {item.costPrice.toLocaleString('en-PK')}
                            </div>
                          </div>
                        </div>

                        {/* Custom Price Tiers */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {item.customPrices.map((cp, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 font-mono border border-slate-700/50">
                              {cp.tierName}: Rs {cp.price.toLocaleString('en-PK')}
                            </span>
                          ))}
                        </div>

                        {/* Specifications & Dimensions */}
                        <div className="text-xs font-mono text-slate-400 space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                          <div className="flex justify-between">
                            <span>Dimensions (H × OD):</span>
                            <span className="text-white">{item.dimensions.height} × {item.dimensions.outerDiameter}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Thread / Gasket:</span>
                            <span className="text-white">{item.threadSize} | G.OD {item.dimensions.gasketOd}</span>
                          </div>
                          <div className="truncate text-slate-500">
                            Cross: {item.crossReferences.join(', ')}
                          </div>
                        </div>
                      </div>

                      {/* Footer: Locations & Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-xs text-slate-300 flex items-center space-x-1">
                          <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{item.locations[0]?.location} ({item.locations[0]?.cabin})</span>
                        </div>
                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <span className="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/30">
                            Qty: {item.totalQuantity}
                          </span>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeView === 'fifo_valuation' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">FIFO Inventory Valuation Summary (PKR)</h3>
                    <p className="text-xs text-slate-400">First-In, First-Out valuation based on active purchase batches and remaining quantities.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Total FIFO Valuation</div>
                    <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                      Rs {totalFifoValuation.toLocaleString('en-PK')}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {items.map(item => {
                    const itemValuation = item.purchaseBatches.reduce((acc, b) => acc + (b.remainingQuantity * b.unitCost), 0);
                    return (
                      <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-xs font-bold text-indigo-400">{item.id}</span>
                            <span className="font-bold text-white">{item.name}</span>
                            <span className="text-xs text-slate-400">({item.brand})</span>
                          </div>
                          <div className="font-mono text-emerald-400 font-bold">
                            Valuation: Rs {itemValuation.toLocaleString('en-PK')}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">Active FIFO Purchase Batches:</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {item.purchaseBatches.map(batch => (
                            <div key={batch.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                              <div className="flex justify-between text-indigo-300">
                                <span>Batch: {batch.date}</span>
                                <span>Rs {batch.unitCost.toLocaleString('en-PK')} / unit</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span>Remaining Qty:</span>
                                <span className="font-bold text-white">{batch.remainingQuantity} / {batch.quantity}</span>
                              </div>
                              <div className="text-slate-400 text-[10px]">Vendor: {batch.vendorName}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Image Enlargement Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4" onClick={() => setEnlargedImage(null)}>
          <div className="relative max-w-3xl w-full flex flex-col items-center">
            <button onClick={() => setEnlargedImage(null)} className="absolute -top-12 right-0 text-white hover:text-indigo-400 p-2">
              <X className="h-8 w-8" />
            </button>
            <img src={enlargedImage} alt="Enlarged Product" className="max-h-[80vh] max-w-full rounded-2xl object-contain border border-slate-700 shadow-2xl bg-slate-900" />
            <p className="text-xs text-slate-400 mt-4">Click anywhere outside or the X button to close</p>
          </div>
        </div>
      )}

      {/* Bulk Import / Export Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
            <button onClick={() => setIsImportModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
              Bulk Import & Export Inventory (PKR)
            </h3>
            <p className="text-xs text-slate-400 mb-6">Download the CSV template, fill in all item details (including General Fixed Sale Price in PKR), and upload for instant Supabase & FIFO sync.</p>

            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">1. Download CSV Template</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Includes PKR pricing columns and all technical specs</p>
                </div>
                <button
                  onClick={downloadCsvTemplate}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-semibold transition border border-slate-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Template CSV</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">2. Export Current Inventory</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Export all products to CSV</p>
                </div>
                <button
                  onClick={exportInventoryCsv}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition border border-slate-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-semibold text-white">3. Upload Completed CSV Template</h4>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvImport}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SQL Code Modal */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-8">
            <button onClick={() => setIsSqlModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-400" />
                  Supabase PostgreSQL Schema for FIFO Inventory
                </h3>
                <p className="text-xs text-slate-400 mt-1">Run this SQL script in your Supabase SQL Editor.</p>
              </div>
              <button
                onClick={copySqlToClipboard}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow"
              >
                {copiedSql ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[500px]">
              {supabaseSqlCode}
            </pre>
          </div>
        </div>
      )}

      {/* Item History Modal (Double Click) */}
      {selectedItemHistory && (
        <ItemHistoryModal 
          item={selectedItemHistory} 
          onClose={() => setSelectedItemHistory(null)} 
        />
      )}

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">Add New Product (Supabase & FIFO Connected)</h3>
            <form onSubmit={(e) => handleSaveItem(e, false)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heavy Duty Lube Filter"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fleetguard"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Type / Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oil Filter"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Location & Cabin</label>
                  <input
                    type="text"
                    required
                    placeholder="Warehouse A [Cabin 12]"
                    value={formData.locationsInput}
                    onChange={(e) => setFormData({ ...formData, locationsInput: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.totalQuantity}
                    onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Thread Size</label>
                  <input
                    type="text"
                    placeholder="M20 x 1.5"
                    value={formData.threadSize}
                    onChange={(e) => setFormData({ ...formData, threadSize: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Technical Dimensions & Gaskets</div>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Height</label>
                    <input type="text" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Outer Dia (OD)</label>
                    <input type="text" value={formData.outerDiameter} onChange={(e) => setFormData({ ...formData, outerDiameter: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Inner Dia (ID)</label>
                    <input type="text" value={formData.innerDiameter} onChange={(e) => setFormData({ ...formData, innerDiameter: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Gasket OD</label>
                    <input type="text" value={formData.gasketOd} onChange={(e) => setFormData({ ...formData, gasketOd: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Gasket ID</label>
                    <input type="text" value={formData.gasketId} onChange={(e) => setFormData({ ...formData, gasketId: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Cross-References (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="LF16015, P550388"
                    value={formData.crossReferences}
                    onChange={(e) => setFormData({ ...formData, crossReferences: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Machine Application</label>
                  <input
                    type="text"
                    placeholder="Cat Excavator 320D"
                    value={formData.machineApplication}
                    onChange={(e) => setFormData({ ...formData, machineApplication: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Pricing in PKR */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Cost Price (Rs PKR)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1 font-bold">General Retail Price (Rs PKR)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.generalPrice}
                    onChange={(e) => setFormData({ ...formData, generalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-4 py-2 text-sm text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
                >
                  Save Product to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-1">Edit Product ({formData.id})</h3>
            <p className="text-xs text-slate-400 mb-4">Update product details, dimensions, and pricing in PKR.</p>
            <form onSubmit={(e) => handleSaveItem(e, true)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Type / Category</label>
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Location & Cabin</label>
                  <input
                    type="text"
                    required
                    value={formData.locationsInput}
                    onChange={(e) => setFormData({ ...formData, locationsInput: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Total Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.totalQuantity}
                    onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Thread Size</label>
                  <input
                    type="text"
                    value={formData.threadSize}
                    onChange={(e) => setFormData({ ...formData, threadSize: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Technical Dimensions & Gaskets</div>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Height</label>
                    <input type="text" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Outer Dia (OD)</label>
                    <input type="text" value={formData.outerDiameter} onChange={(e) => setFormData({ ...formData, outerDiameter: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Inner Dia (ID)</label>
                    <input type="text" value={formData.innerDiameter} onChange={(e) => setFormData({ ...formData, innerDiameter: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Gasket OD</label>
                    <input type="text" value={formData.gasketOd} onChange={(e) => setFormData({ ...formData, gasketOd: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Gasket ID</label>
                    <input type="text" value={formData.gasketId} onChange={(e) => setFormData({ ...formData, gasketId: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Cross-References</label>
                  <input
                    type="text"
                    value={formData.crossReferences}
                    onChange={(e) => setFormData({ ...formData, crossReferences: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Machine Application</label>
                  <input
                    type="text"
                    value={formData.machineApplication}
                    onChange={(e) => setFormData({ ...formData, machineApplication: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Pricing in PKR */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Cost Price (Rs PKR)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1 font-bold">General Retail Price (Rs PKR)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.generalPrice}
                    onChange={(e) => setFormData({ ...formData, generalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-4 py-2 text-sm text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
                >
                  Update Product in Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Pricing Config Modal */}
      {isPricingConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsPricingConfigOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Universal Selling Price Tiers</h3>
            <p className="text-xs text-slate-400 mb-4">Configure universal selling price tiers with profit percentages over cost in PKR.</p>
            
            <div className="space-y-3 mb-6">
              {priceTiers.map((tier, idx) => (
                <div key={tier.id} className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => {
                      const updated = [...priceTiers];
                      updated[idx].name = e.target.value;
                      setPriceTiers(updated);
                    }}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-white"
                  />
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={tier.profitPercentage}
                      onChange={(e) => {
                        const updated = [...priceTiers];
                        updated[idx].profitPercentage = parseFloat(e.target.value) || 0;
                        setPriceTiers(updated);
                      }}
                      className="w-20 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-emerald-400 font-mono text-right"
                    />
                    <span className="text-xs text-slate-400">% profit</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsPricingConfigOpen(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition shadow"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Item History & Audit Modal
function ItemHistoryModal({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const [filterPartner, setFilterPartner] = useState('');
  const [sortByPrice, setSortByPrice] = useState<'none' | 'asc' | 'desc'>('none');
  const [filterType, setFilterType] = useState<'all' | 'purchase' | 'sale' | 'audit_adjustment'>('all');

  let filteredHistory = item.history.filter(h => {
    const matchesPartner = h.partnerName.toLowerCase().includes(filterPartner.toLowerCase()) ||
                           h.notes.toLowerCase().includes(filterPartner.toLowerCase());
    const matchesType = filterType === 'all' || h.type === filterType;
    return matchesPartner && matchesType;
  });

  if (sortByPrice === 'asc') {
    filteredHistory = [...filteredHistory].sort((a, b) => a.unitPrice - b.unitPrice);
  } else if (sortByPrice === 'desc') {
    filteredHistory = [...filteredHistory].sort((a, b) => b.unitPrice - a.unitPrice);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-4 mb-6">
          <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-xl object-cover border border-slate-700 bg-slate-950" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-indigo-400">{item.id}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{item.brand}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">{item.name}</h2>
            <p className="text-xs text-slate-400">FIFO Audit Trail • Sales, Purchases & Stock History (PKR)</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1">Search Customer / Vendor</label>
            <input
              type="text"
              placeholder="e.g. Delta Construction"
              value={filterPartner}
              onChange={(e) => setFilterPartner(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1">Filter Transaction Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              <option value="all">All Transactions</option>
              <option value="purchase">Purchases</option>
              <option value="sale">Sales</option>
              <option value="audit_adjustment">Audit Adjustments</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1">Sort by Price</label>
            <select
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              <option value="none">Default Order</option>
              <option value="asc">Lowest Price to Highest Price</option>
              <option value="desc">Highest Price to Lowest Price</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-xs uppercase">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Partner (Customer / Vendor)</th>
                <th className="py-3 px-4">Qty Change</th>
                <th className="py-3 px-4">Unit Price (PKR)</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No history records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-900/60 transition">
                    <td className="py-3 px-4 text-slate-400">{h.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        h.type === 'purchase' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                        h.type === 'sale' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {h.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold">{h.partnerName}</td>
                    <td className={`py-3 px-4 font-bold ${h.quantityChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {h.quantityChange > 0 ? `+${h.quantityChange}` : h.quantityChange}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">Rs {h.unitPrice.toLocaleString('en-PK')}</td>
                    <td className="py-3 px-4 text-slate-400">{h.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
}
