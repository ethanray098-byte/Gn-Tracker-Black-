"use client";

import { TrendingUp, Coins, AlertTriangle, Trophy, Package, Activity, Check, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Agent, SaleEntry, InventoryItem, Issue, DashboardMetrics } from '@/lib/types';
import { MetricCard } from '../metric-card';
import { StatusBadge } from '../status-badge';

interface DashboardTabProps {
  metrics: DashboardMetrics;
  topAgents: { id: string; total: number }[];
  stockAlerts: InventoryItem[];
  issues: Issue[];
  getAgent: (id: string) => Agent | undefined;
  fmtTHB: (n: number) => string;
}

export function DashboardTab({ 
  metrics, 
  topAgents, 
  stockAlerts, 
  issues, 
  getAgent, 
  fmtTHB 
}: DashboardTabProps) {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Sales"
          value={fmtTHB(metrics.totalSales)}
          subtitle="Accumulated gross THB"
          icon={TrendingUp}
          accentColor="primary"
        />
        <MetricCard
          title="Earnings (20%)"
          value={fmtTHB(metrics.totalCommission)}
          subtitle="Direct commission share"
          icon={Coins}
          accentColor="info"
        />
        <MetricCard
          title="Net Profit"
          value={fmtTHB(metrics.totalNetProfit)}
          subtitle="After operating costs"
          icon={TrendingUp}
          accentColor="warning"
        />
        <MetricCard
          title="Active Issues"
          value={metrics.activeIssueCount}
          subtitle="Pending resolutions"
          icon={AlertTriangle}
          accentColor={metrics.activeIssueCount > 0 ? 'destructive' : 'primary'}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Agents */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Trophy size={16} className="text-chart-3" /> 
              Top Performing Agents
            </h3>
            <Users size={16} className="text-muted-foreground" />
          </div>
          <div className="p-5 space-y-5">
            {topAgents.length > 0 ? topAgents.map((entry, idx) => {
              const agent = getAgent(entry.id);
              const percentage = (entry.total / topAgents[0].total) * 100;
              return (
                <div key={entry.id} className="group cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-muted-foreground w-4">0{idx + 1}</span>
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {agent?.name || entry.id}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {fmtTHB(entry.total)} <span className="text-[10px] font-medium text-muted-foreground">THB</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-10">
                <Activity size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground font-medium">No sales data recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Critical Stock Alerts */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Package size={16} className="text-primary" /> 
              Critical Stock Alerts
            </h3>
            <StatusBadge variant={stockAlerts.length > 0 ? 'destructive' : 'success'}>
              {stockAlerts.length} issues
            </StatusBadge>
          </div>
          <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
            {stockAlerts.length > 0 ? stockAlerts.map(item => {
              const remaining = item.open - item.sold;
              const isCritical = remaining <= item.reorder;
              return (
                <div key={item.id} className="px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-foreground">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.unit}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${isCritical ? 'text-destructive' : 'text-chart-3'}`}>
                      {remaining} left
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground">THR: {item.reorder}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-12">
                <Check size={32} className="mx-auto text-primary/30 mb-2" />
                <p className="text-xs text-muted-foreground font-medium">All inventory items are stocked.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Activity size={16} className="text-muted-foreground" /> 
            Recent System Activity
          </h3>
        </div>
        <div className="divide-y divide-border">
          {issues.slice(-4).reverse().map((issue) => (
            <div key={issue.id} className="px-5 py-4 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                issue.severity === 'High' ? 'bg-destructive/15 text-destructive' : 
                issue.severity === 'Medium' ? 'bg-chart-3/15 text-chart-3' : 'bg-chart-2/15 text-chart-2'
              }`}>
                <AlertTriangle size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground font-medium truncate">
                  <span className="font-bold">{getAgent(issue.agentId || '')?.name || 'General'}</span>: {issue.desc}
                </p>
                <p className="text-[10px] text-muted-foreground">{issue.date} - {issue.severity} Priority</p>
              </div>
              <StatusBadge variant={issue.status === 'Resolved' ? 'success' : issue.status === 'In Progress' ? 'warning' : 'destructive'}>
                {issue.status}
              </StatusBadge>
            </div>
          ))}
          {issues.length === 0 && (
            <p className="p-10 text-center text-xs text-muted-foreground font-medium">No activity log yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
