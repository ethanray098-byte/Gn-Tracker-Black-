"use client";

import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'purple';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function StatusBadge({ children, variant = 'default' }: StatusBadgeProps) {
  const styles: Record<BadgeVariant, string> = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-primary/15 text-primary border border-primary/20',
    warning: 'bg-chart-3/15 text-chart-3 border border-chart-3/20',
    destructive: 'bg-destructive/15 text-destructive border border-destructive/20',
    info: 'bg-chart-2/15 text-chart-2 border border-chart-2/20',
    purple: 'bg-chart-4/15 text-chart-4 border border-chart-4/20',
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
      styles[variant]
    )}>
      {children}
    </span>
  );
}
