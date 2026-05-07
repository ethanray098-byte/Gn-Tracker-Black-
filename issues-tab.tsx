"use client";

import { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { Agent, Issue } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../status-badge';

interface IssuesTabProps {
  issues: Issue[];
  setIssues: (issues: Issue[]) => void;
  agents: Agent[];
  getAgent: (id: string) => Agent | undefined;
}

export function IssuesTab({ issues, setIssues, agents, getAgent }: IssuesTabProps) {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    
    const newIssue: Issue = {
      id: `ISSUE${Date.now()}`,
      agentId: data.agentId || null,
      desc: data.desc,
      severity: data.severity as Issue['severity'],
      status: 'Open',
      resolution: '',
      date: new Date().toISOString().slice(0, 10)
    };
    setIssues([...issues, newIssue]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground">Issues Log</h2>
          <p className="text-xs text-muted-foreground font-medium">Log and resolve fleet incidents or disputes</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2" variant="destructive">
          <Plus size={18} />
          Log Incident
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl overflow-hidden border-t-4 border-t-destructive">
          <form className="p-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">Record Fleet Incident</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Related Agent</label>
                <select name="agentId" className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium">
                  <option value="">General / System Issue</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Severity Level</label>
                <select name="severity" required className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-black">
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Incident</option>
                  <option value="High">Critical Alert</option>
                </select>
              </div>
            </div>
            <div className="mt-6 space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Incident Description *</label>
              <textarea name="desc" required rows={3} className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm outline-none text-foreground font-medium" placeholder="Describe the problem in detail..." />
            </div>
            <div className="mt-8 flex gap-3">
              <Button type="submit" variant="destructive" className="flex-1">Log to Database</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Severity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {issues.slice().reverse().map(issue => (
                <tr key={issue.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4 text-center">
                    <StatusBadge variant={issue.status === 'Resolved' ? 'success' : issue.status === 'In Progress' ? 'warning' : 'destructive'}>
                      {issue.status}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-xs font-bold text-foreground">{issue.desc}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Logged on {issue.date}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                      issue.severity === 'High' ? 'bg-destructive text-destructive-foreground' : 
                      issue.severity === 'Medium' ? 'bg-chart-3 text-background' : 'bg-chart-2 text-background'
                    }`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-xs text-muted-foreground">
                    {getAgent(issue.agentId || '')?.name || 'General Fleet'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100">
                      {issue.status !== 'Resolved' && (
                        <button 
                          onClick={() => setIssues(issues.map(i => i.id === issue.id ? {...i, status: 'Resolved'} : i))}
                          className="p-1 px-3 bg-primary/15 text-primary rounded-lg text-[10px] font-black hover:bg-primary/25 transition-all"
                        >
                          RESOLVE
                        </button>
                      )}
                      <button 
                        onClick={() => setIssues(issues.filter(i => i.id !== issue.id))} 
                        className="p-2 text-muted-foreground/50 hover:text-destructive transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-xs text-muted-foreground font-bold uppercase italic border-0">
                    Operational clarity. No incidents logged.
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
