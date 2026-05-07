export interface Agent {
  id: string;
  name: string;
  phone: string;
  city: string;
  township: string;
  platform: string;
  status: 'Active' | 'Slow' | 'Inactive';
  fb: string;
  followers: number;
  source: string;
  notes: string;
  joinDate: string;
}

export interface SaleEntry {
  id: string;
  agentId: string;
  month: string;
  orders: number;
  sales: number;
  lastSales: number;
  date: string;
}

export interface RevenueEntry {
  id: string;
  month: string;
  gross: number;
  stock: number;
  ads: number;
  ops: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  open: number;
  sold: number;
  cost: number;
  reorder: number;
}

export interface Issue {
  id: string;
  agentId: string | null;
  desc: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  resolution: string;
  date: string;
}

export type TabType = 'dashboard' | 'agents' | 'sales' | 'revenue' | 'inventory' | 'roi' | 'issues' | 'report';

export interface DashboardMetrics {
  totalSales: number;
  totalCommission: number;
  totalNetProfit: number;
  totalOrders: number;
  totalStockValue: number;
  activeIssueCount: number;
  activeAgentCount: number;
}
