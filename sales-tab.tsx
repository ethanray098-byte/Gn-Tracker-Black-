"use client";

import { useState } from 'react';
import { Plus, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Agent, SaleEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface SalesTabProps {
  sales: SaleEntry[];
  setSales: (sales: SaleEntry[]) => void;
  agents: Agent[];
  getAgent: (id: string) => Agent | undefined;
  fmtTHB: (n: number) => string;
}

export function SalesTab({ sales, setSales, agents, getAgent, fmtTHB }: SalesTabProps) {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    
    const newSale: SaleEntry = {
      id: `S${Date.now()}`,
      agentId: data.agentId,
      month: data.month,
      orders: parseInt(data.orders),
      sales: parseFloat(data.sales),
      lastSales: parseFloat(data.lastSales) || 0,
      date: new Date().toISOString()
    };
    setSales([...sales, newSale]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground">Monthly Sales</h2>
          <p className="text-xs text-muted-foreground font-medium">Record and track agent-driven revenue</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={18} />
          Log Sale Entry
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl overflow-hidden border-t-4 border-t-primary">
          <form className="p-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">Sales Logistics Management</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Select Agent *</label>
                <select name="agentId" required className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium">
                  <option value="">Choose an agent...</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Reporting Month *</label>
                <input name="month" type="month" required className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Number of Orders *</label>
                <input name="orders" type="number" required className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" placeholder="e.g. 24" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Gross Sales (THB) *</label>
                <input name="sales" type="number" required className="w-full px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl text-sm outline-none text-primary font-black" placeholder="5000" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Previous Month Sales (THB)</label>
                <input name="lastSales" type="number" className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" placeholder="4500" />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button type="submit" className="flex-1">Record Entry</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Period</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Orders</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Revenue (THB)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Growth</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Commission (20%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sales.slice().reverse().map((s) => {
                const agent = getAgent(s.agentId);
                const growth = s.lastSales ? ((s.sales - s.lastSales) / s.lastSales) * 100 : null;
                const commission = s.sales * 0.2;
                return (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{agent?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-medium">{s.month}</td>
                    <td className="px-6 py-4 text-xs font-bold text-foreground text-center">{s.orders}</td>
                    <td className="px-6 py-4 text-sm font-black text-foreground text-right">{fmtTHB(s.sales)}</td>
                    <td className="px-6 py-4 text-center">
                      {growth !== null ? (
                        <span className={`text-[11px] font-black inline-flex items-center gap-1 ${growth >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {Math.abs(growth).toFixed(1)}%
                        </span>
                      ) : <span className="text-[10px] text-muted-foreground/50">N/A</span>}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-primary text-right">+{fmtTHB(commission)}</td>
                  </tr>
                );
              })}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-xs text-muted-foreground font-bold tracking-widest uppercase italic">
                    The ledger is empty.
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
