"use client";

import { Download, Leaf } from 'lucide-react';
import { Agent } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeAgentCount: number;
  agents: Agent[];
}

export function Header({ activeAgentCount, agents }: HeaderProps) {
  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'City', 'Platform', 'Status', 'Followers', 'Join Date'];
    const rows = agents.map(a => [a.id, a.name, a.phone, a.city, a.platform, a.status, a.followers, a.joinDate]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gn_agents_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 md:hidden">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <Leaf size={18} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight">GN Agent Tracker</h1>
          <p className="text-[10px] text-muted-foreground font-medium">Click Boost X</p>
        </div>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-bold text-primary">{activeAgentCount} active</span>
        </div>
        
        <Button 
          onClick={exportCSV}
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-2 text-xs"
        >
          <Download size={14} />
          Export CSV
        </Button>
      </div>
    </header>
  );
}
