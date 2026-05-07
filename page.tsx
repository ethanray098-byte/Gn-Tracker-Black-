"use client";

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  Agent, 
  SaleEntry, 
  RevenueEntry, 
  InventoryItem, 
  Issue, 
  TabType,
  DashboardMetrics 
} from '@/lib/types';

import { Sidebar, MobileNav } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { DashboardTab } from '@/components/dashboard/tabs/dashboard-tab';
import { AgentsTab } from '@/components/dashboard/tabs/agents-tab';
import { SalesTab } from '@/components/dashboard/tabs/sales-tab';
import { InventoryTab } from '@/components/dashboard/tabs/inventory-tab';
import { RevenueTab } from '@/components/dashboard/tabs/revenue-tab';
import { ROITab } from '@/components/dashboard/tabs/roi-tab';
import { IssuesTab } from '@/components/dashboard/tabs/issues-tab';
import { ReportTab } from '@/components/dashboard/tabs/report-tab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useLocalStorage<TabType>('gn_active_tab', 'dashboard');
  const [agents, setAgents] = useLocalStorage<Agent[]>('gn_agents', []);
  const [sales, setSales] = useLocalStorage<SaleEntry[]>('gn_sales', []);
  const [revenue, setRevenue] = useLocalStorage<RevenueEntry[]>('gn_revenue', []);
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('gn_inventory', []);
  const [issues, setIssues] = useLocalStorage<Issue[]>('gn_issues', []);
  const [costPerAgent, setCostPerAgent] = useLocalStorage<number>('gn_cost_per_agent', 500);

  // Helper functions
  const fmtTHB = (n: number) => Math.round(n).toLocaleString('en-US');
  const getAgent = (id: string) => agents.find(a => a.id === id);

  // Computed metrics
  const dashboardMetrics: DashboardMetrics = useMemo(() => {
    const totalSales = sales.reduce((sum, s) => sum + s.sales, 0);
    const totalCommission = totalSales * 0.2;
    const totalNetProfit = revenue.reduce((sum, r) => sum + (r.gross * 0.2 - r.ads - r.ops), 0);
    const totalOrders = sales.reduce((sum, s) => sum + s.orders, 0);
    const totalStockValue = inventory.reduce((sum, i) => sum + ((i.open - i.sold) * i.cost), 0);
    const activeIssueCount = issues.filter(i => i.status !== 'Resolved').length;

    return {
      totalSales,
      totalCommission,
      totalNetProfit,
      totalOrders,
      totalStockValue,
      activeIssueCount,
      activeAgentCount: agents.filter(a => a.status === 'Active').length
    };
  }, [sales, revenue, inventory, issues, agents]);

  const topAgents = useMemo(() => {
    const agentTotals: Record<string, number> = {};
    sales.forEach(s => {
      agentTotals[s.agentId] = (agentTotals[s.agentId] || 0) + s.sales;
    });
    return Object.entries(agentTotals)
      .map(([id, total]) => ({ id, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [sales]);

  const stockAlerts = useMemo(() => {
    return inventory.filter(i => (i.open - i.sold) <= i.reorder);
  }, [inventory]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header activeAgentCount={dashboardMetrics.activeAgentCount} agents={agents} />
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          activeAgentCount={dashboardMetrics.activeAgentCount}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardTab
                  metrics={dashboardMetrics}
                  topAgents={topAgents}
                  stockAlerts={stockAlerts}
                  issues={issues}
                  getAgent={getAgent}
                  fmtTHB={fmtTHB}
                />
              )}

              {activeTab === 'agents' && (
                <AgentsTab agents={agents} setAgents={setAgents} />
              )}

              {activeTab === 'sales' && (
                <SalesTab
                  sales={sales}
                  setSales={setSales}
                  agents={agents}
                  getAgent={getAgent}
                  fmtTHB={fmtTHB}
                />
              )}

              {activeTab === 'inventory' && (
                <InventoryTab
                  inventory={inventory}
                  setInventory={setInventory}
                  stockAlerts={stockAlerts}
                  fmtTHB={fmtTHB}
                />
              )}

              {activeTab === 'revenue' && (
                <RevenueTab revenue={revenue} setRevenue={setRevenue} fmtTHB={fmtTHB} />
              )}

              {activeTab === 'roi' && (
                <ROITab
                  agents={agents}
                  sales={sales}
                  costPerAgent={costPerAgent}
                  setCostPerAgent={setCostPerAgent}
                  fmtTHB={fmtTHB}
                />
              )}

              {activeTab === 'issues' && (
                <IssuesTab
                  issues={issues}
                  setIssues={setIssues}
                  agents={agents}
                  getAgent={getAgent}
                />
              )}

              {activeTab === 'report' && (
                <ReportTab
                  metrics={dashboardMetrics}
                  topAgents={topAgents}
                  getAgent={getAgent}
                  fmtTHB={fmtTHB}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Spacer */}
      <div className="h-6 md:hidden" />
    </div>
  );
}
