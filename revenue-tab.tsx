"use client";

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { RevenueEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface RevenueTabProps {
  revenue: RevenueEntry[];
  setRevenue: (revenue: RevenueEntry[]) => void;
  fmtTHB: (n: number) => string;
}

export function RevenueTab({ revenue, setRevenue, fmtTHB }: RevenueTabProps) {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    
    const newRev: RevenueEntry = {
      id: `R${Date.now()}`,
      month: data.month,
      gross: parseFloat(data.gross),
      stock: parseFloat(data.stock) || 0,
      ads: parseFloat(data.ads) || 0,
      ops: parseFloat(data.ops) || 0
    };
    setRevenue([...revenue, newRev]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground">Revenue & Profit</h2>
          <p className="text-xs text-muted-foreground font-medium">Monthly P&L tracking after all costs</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={18} />
          Log Month Data
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl overflow-hidden border-t-4 border-t-primary">
          <form className="p-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">Monthly Financial Entry</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Accounting Month *</label>
                <input name="month" type="month" required className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Gross Total Revenue (THB) *</label>
                <input name="gross" type="number" required className="w-full px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl text-sm outline-none text-primary font-black" placeholder="50000" />
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-border">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Cost Inputs</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Stock CoGS (THB)</label>
                  <input name="stock" type="number" className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" placeholder="20000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Ads & Marketing (THB)</label>
                  <input name="ads" type="number" className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" placeholder="2000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Operational / Misc (THB)</label>
                  <input name="ops" type="number" className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" placeholder="1000" />
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button type="submit" className="flex-1">Sync to Ledger</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Month</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Gross Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Your 20%</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Ads/Ops</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Net Profit</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {revenue.slice().reverse().map((r) => {
                const share = r.gross * 0.2;
                const totalCosts = r.ads + r.ops;
                const net = share - totalCosts;
                const margin = share > 0 ? Math.round((net / share) * 100) : 0;
                return (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{r.month}</td>
                    <td className="px-6 py-4 text-right text-xs font-bold text-muted-foreground">{fmtTHB(r.gross)}</td>
                    <td className="px-6 py-4 text-right text-sm font-black text-primary font-mono tracking-tighter">+{fmtTHB(share)}</td>
                    <td className="px-6 py-4 text-right text-xs text-muted-foreground font-medium">-{fmtTHB(totalCosts)}</td>
                    <td className="px-6 py-4 text-right font-black text-foreground">{fmtTHB(net)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-widest ${margin >= 50 ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive'}`}>
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {revenue.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-xs text-muted-foreground font-bold uppercase tracking-widest italic">
                    Profit data pending.
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
