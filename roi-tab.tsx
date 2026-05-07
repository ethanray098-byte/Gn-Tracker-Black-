"use client";

import { Agent, SaleEntry } from '@/lib/types';
import { StatusBadge } from '../status-badge';

interface ROITabProps {
  agents: Agent[];
  sales: SaleEntry[];
  costPerAgent: number;
  setCostPerAgent: (cost: number) => void;
  fmtTHB: (n: number) => string;
}

export function ROITab({ agents, sales, costPerAgent, setCostPerAgent, fmtTHB }: ROITabProps) {
  const calculateROI = (agent: Agent) => {
    const agentTotalSales = sales.filter(s => s.agentId === agent.id).reduce((sum, s) => sum + s.sales, 0);
    const commission = agentTotalSales * 0.2;
    const net = commission - costPerAgent;
    return costPerAgent > 0 ? (net / costPerAgent) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">ROI Analysis</h2>
          <p className="text-xs text-muted-foreground font-medium">Performance efficiency calculation per agent</p>
        </div>
        <div className="flex items-center gap-3 bg-card p-2 border border-border rounded-xl">
          <label className="text-[10px] font-black text-muted-foreground uppercase ml-2">Base Cost / Agent</label>
          <input 
            type="number" 
            value={costPerAgent} 
            onChange={(e) => setCostPerAgent(parseFloat(e.target.value) || 0)}
            className="w-24 px-3 py-1.5 font-bold text-sm bg-muted rounded-lg outline-none border-none focus:ring-1 focus:ring-primary text-foreground"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Total Sales</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Commission (20%)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Net Return</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">ROI (%)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agents.map(a => {
                const roi = calculateROI(a);
                const agentTotalSales = sales.filter(s => s.agentId === a.id).reduce((sum, s) => sum + s.sales, 0);
                const net = (agentTotalSales * 0.2) - costPerAgent;
                return (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{a.name}</td>
                    <td className="px-6 py-4 text-right text-xs font-bold text-muted-foreground">{fmtTHB(agentTotalSales)}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-foreground">{fmtTHB(agentTotalSales * 0.2)}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-foreground">{fmtTHB(net)}</td>
                    <td className="px-6 py-4 text-right font-black text-foreground italic font-mono">{roi.toFixed(1)}%</td>
                    <td className="px-6 py-4 text-center">
                      {roi >= 500 ? <StatusBadge variant="purple">Superstar</StatusBadge> :
                       roi >= 200 ? <StatusBadge variant="success">Excellent</StatusBadge> :
                       roi >= 100 ? <StatusBadge variant="info">Profitable</StatusBadge> :
                       roi >= 0 ? <StatusBadge variant="warning">Weak</StatusBadge> : 
                       <StatusBadge variant="destructive">LOSS</StatusBadge>}
                    </td>
                  </tr>
                );
              })}
              {agents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-xs text-muted-foreground font-bold tracking-widest uppercase italic border-0">
                    Recruit agents to begin ROI analysis.
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
