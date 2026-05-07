"use client";

import { Copy, Leaf } from 'lucide-react';
import { DashboardMetrics, Agent } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface ReportTabProps {
  metrics: DashboardMetrics;
  topAgents: { id: string; total: number }[];
  getAgent: (id: string) => Agent | undefined;
  fmtTHB: (n: number) => string;
}

export function ReportTab({ metrics, topAgents, getAgent, fmtTHB }: ReportTabProps) {
  const handleCopyReport = () => {
    const now = new Date().toLocaleDateString('en-GB');
    const text = `GN AGENT REPORT - ${now}\n\n` +
      `Active Agents: ${metrics.activeAgentCount}\n` +
      `Total Revenue: ${fmtTHB(metrics.totalSales)} THB\n` +
      `Your Commission (20%): ${fmtTHB(metrics.totalCommission)} THB\n` +
      `Net Profit: ${fmtTHB(metrics.totalNetProfit)} THB\n` +
      `Total Orders: ${metrics.totalOrders}\n` +
      `Open Issues: ${metrics.activeIssueCount}`;
    
    navigator.clipboard.writeText(text).then(() => alert('Report copied to clipboard!'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-foreground">Executive Report</h2>
        <Button onClick={handleCopyReport} variant="secondary" className="gap-2">
          <Copy size={18} />
          Copy to Clipboard
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-8 relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] select-none pointer-events-none transform rotate-12">
          <Leaf size={400} className="text-foreground" />
        </div>

        {/* Header */}
        <div className="pb-8 border-b border-border">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Leaf size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-black leading-tight text-foreground">Ganjah Nation Operational Intel</h1>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Strategic Agent Management Insight</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Report Date</p>
              <p className="text-sm font-black text-foreground">
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBox label="Portfolio Value" value={fmtTHB(metrics.totalSales)} />
          <MetricBox label="Your Share (20%)" value={`+${fmtTHB(metrics.totalCommission)}`} highlight />
          <MetricBox label="Active Agents" value={metrics.activeAgentCount.toString()} />
          <MetricBox label="Orders Fulfilled" value={metrics.totalOrders.toString()} />
        </div>

        {/* Two Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Business Health</h4>
            <div className="space-y-3">
              <DetailRow label="Inventory Liquidity" value={`${fmtTHB(metrics.totalStockValue)} THB`} />
              <DetailRow 
                label="Operational Margin" 
                value={`${Math.round((metrics.totalNetProfit / (metrics.totalCommission || 1)) * 100)}%`} 
                highlight 
              />
              <DetailRow label="Net Business Profit" value={`${fmtTHB(metrics.totalNetProfit)} THB`} variant="info" />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Status Recap</h4>
            <div className="space-y-3">
              <DetailRow 
                label="Total Unresolved Issues" 
                value={`${metrics.activeIssueCount} Incident${metrics.activeIssueCount !== 1 ? 's' : ''}`}
                variant={metrics.activeIssueCount > 0 ? 'destructive' : 'success'}
              />
              <DetailRow 
                label="Top Monthly Agent" 
                value={topAgents.length > 0 ? (getAgent(topAgents[0].id)?.name || 'N/A') : 'No Data'}
                mono
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 text-center">
          <div className="inline-block px-4 py-2 bg-foreground text-[10px] text-background font-black rounded-lg uppercase tracking-widest">
            Official Ledger Document
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-muted/50 p-4 rounded-xl border border-border">
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-lg font-black ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}

function DetailRow({ 
  label, 
  value, 
  highlight, 
  variant,
  mono
}: { 
  label: string; 
  value: string; 
  highlight?: boolean;
  variant?: 'success' | 'destructive' | 'info';
  mono?: boolean;
}) {
  const valueClass = variant === 'destructive' ? 'text-destructive' : 
                     variant === 'success' ? 'text-primary' : 
                     variant === 'info' ? 'text-chart-2' :
                     highlight ? 'text-primary' : 'text-foreground';
  
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="font-bold text-muted-foreground">{label}</span>
      <span className={`font-black ${valueClass} ${mono ? 'uppercase font-mono' : ''}`}>{value}</span>
    </div>
  );
}
