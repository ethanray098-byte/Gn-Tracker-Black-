"use client";

import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Coins, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Leaf
} from 'lucide-react';
import { TabType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeAgentCount: number;
}

interface NavItem {
  tab: TabType;
  icon: React.ElementType;
  label: string;
}

const mainNav: NavItem[] = [
  { tab: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { tab: 'agents', icon: Users, label: 'Agent Directory' },
];

const commercialNav: NavItem[] = [
  { tab: 'sales', icon: BarChart3, label: 'Monthly Sales' },
  { tab: 'revenue', icon: Coins, label: 'Revenue & Profit' },
  { tab: 'inventory', icon: Package, label: 'Inventory Stock' },
];

const analysisNav: NavItem[] = [
  { tab: 'roi', icon: TrendingUp, label: 'ROI Analysis' },
  { tab: 'issues', icon: AlertTriangle, label: 'Issues Log' },
  { tab: 'report', icon: FileText, label: 'Executive Report' },
];

export function Sidebar({ activeTab, setActiveTab, activeAgentCount }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Leaf size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-tight">GN Agent Tracker</h1>
            <p className="text-[10px] text-muted-foreground font-medium">Click Boost X</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <NavSection title="Principal" items={mainNav} activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavSection title="Commercial" items={commercialNav} activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavSection title="Analysis" items={analysisNav} activeTab={activeTab} setActiveTab={setActiveTab} />
      </nav>

      {/* Footer Stats */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Active Agents</span>
          <span className="font-bold text-primary">{activeAgentCount}</span>
        </div>
      </div>
    </aside>
  );
}

function NavSection({ 
  title, 
  items, 
  activeTab, 
  setActiveTab 
}: { 
  title: string; 
  items: NavItem[]; 
  activeTab: TabType; 
  setActiveTab: (tab: TabType) => void;
}) {
  return (
    <div className="mb-6">
      <p className="px-4 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
      {items.map(({ tab, icon: Icon, label }) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium transition-all",
            activeTab === tab 
              ? "text-primary bg-sidebar-accent border-r-2 border-primary" 
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </div>
  );
}

export function MobileNav({ activeTab, setActiveTab }: { activeTab: TabType; setActiveTab: (tab: TabType) => void }) {
  const allTabs: TabType[] = ['dashboard', 'agents', 'sales', 'revenue', 'inventory', 'roi', 'issues', 'report'];
  
  return (
    <div className="md:hidden flex overflow-x-auto bg-card border-b border-border">
      {allTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors capitalize",
            activeTab === tab 
              ? "text-primary border-primary" 
              : "text-muted-foreground border-transparent hover:text-foreground"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
