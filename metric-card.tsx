"use client";

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: 'primary' | 'info' | 'warning' | 'destructive';
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  accentColor = 'primary' 
}: MetricCardProps) {
  const accentStyles = {
    primary: 'border-l-primary text-primary bg-primary/10',
    info: 'border-l-chart-2 text-chart-2 bg-chart-2/10',
    warning: 'border-l-chart-3 text-chart-3 bg-chart-3/10',
    destructive: 'border-l-destructive text-destructive bg-destructive/10',
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className={cn(
        "p-5 flex flex-col justify-between h-32 border-l-4",
        accentStyles[accentColor].split(' ')[0]
      )}>
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className={cn(
            "p-2 rounded-lg",
            accentStyles[accentColor].split(' ').slice(1).join(' ')
          )}>
            <Icon size={16} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-foreground">{value}</h2>
          {subtitle && <p className="text-[10px] text-muted-foreground font-medium mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
