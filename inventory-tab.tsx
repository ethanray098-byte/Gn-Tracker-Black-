"use client";

import { useState } from 'react';
import { Plus, X, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../status-badge';

interface InventoryTabProps {
  inventory: InventoryItem[];
  setInventory: (inventory: InventoryItem[]) => void;
  stockAlerts: InventoryItem[];
  fmtTHB: (n: number) => string;
}

export function InventoryTab({ inventory, setInventory, stockAlerts, fmtTHB }: InventoryTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    
    const newItem: InventoryItem = {
      id: editingItem?.id || `INV${Date.now()}`,
      name: data.name,
      unit: data.unit,
      open: parseFloat(data.open),
      sold: parseFloat(data.sold) || 0,
      cost: parseFloat(data.cost),
      reorder: parseFloat(data.reorder) || 50
    };

    if (editingItem) {
      setInventory(inventory.map(i => i.id === editingItem.id ? newItem : i));
    } else {
      setInventory([...inventory, newItem]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground">Inventory Management</h2>
          <p className="text-xs text-muted-foreground font-medium">Real-time tracking of product stock and value</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setShowForm(true); }} className="gap-2">
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      {stockAlerts.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-4">
          <div className="bg-destructive/20 p-2 rounded-lg text-destructive">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-destructive">Operational Stock Alert</h4>
            <p className="text-xs text-destructive/80 font-medium">
              {stockAlerts.length} product{stockAlerts.length > 1 ? 's' : ''} below reorder threshold. Stock fulfillment required.
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-card border border-border rounded-xl overflow-hidden border-t-4 border-t-primary">
          <form className="p-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">
                {editingItem ? 'Update Product Details' : 'New Product Registration'}
              </h3>
              <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Product / Strain Name *</label>
                <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-bold" placeholder="e.g. Blue Dream" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Unit of Measurement</label>
                <select name="unit" defaultValue={editingItem?.unit || 'gram'} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium">
                  <option>gram</option>
                  <option>kilogram</option>
                  <option>unit</option>
                  <option>pack</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Opening Stock *</label>
                <input name="open" type="number" defaultValue={editingItem?.open} required className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Sold (MTD)</label>
                <input name="sold" type="number" defaultValue={editingItem?.sold} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Cost / Unit (THB)</label>
                <input name="cost" type="number" defaultValue={editingItem?.cost} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Reorder Point</label>
                <input name="reorder" type="number" defaultValue={editingItem?.reorder || 50} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button type="submit" className="flex-1">Save Inventory Item</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Remaining</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Cost/Unit</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Stock Value</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventory.map((item) => {
                const remaining = item.open - item.sold;
                const isLow = remaining <= item.reorder * 2 && remaining > item.reorder;
                const isCritical = remaining <= item.reorder;
                return (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-foreground">{item.name}</td>
                    <td className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-widest uppercase">{item.unit}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-black ${isCritical ? 'text-destructive' : isLow ? 'text-chart-3' : 'text-foreground'}`}>
                        {remaining}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-bold text-muted-foreground">{fmtTHB(item.cost)}</td>
                    <td className="px-6 py-4 text-right font-black text-foreground">{fmtTHB(remaining * item.cost)}</td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge variant={isCritical ? 'destructive' : isLow ? 'warning' : 'success'}>
                        {isCritical ? 'Reorder' : isLow ? 'Low Stock' : 'Optimized'}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingItem(item); setShowForm(true); }} 
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => { if(confirm('Delete?')) setInventory(inventory.filter(i => i.id !== item.id)) }} 
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-xs text-muted-foreground font-bold tracking-widest uppercase italic">
                    No inventory items registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
