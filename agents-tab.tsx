"use client";

import { useState } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { Agent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../status-badge';

interface AgentsTabProps {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
}

export function AgentsTab({ agents, setAgents }: AgentsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    
    const newAgent: Agent = {
      id: editingAgent?.id || `AG${Math.floor(Math.random() * 10000)}`,
      name: data.name,
      phone: data.phone,
      city: data.city,
      township: data.township,
      platform: data.platform,
      status: data.status as Agent['status'],
      fb: data.fb,
      followers: parseInt(data.followers) || 0,
      source: data.source,
      notes: data.notes,
      joinDate: editingAgent?.joinDate || new Date().toISOString().slice(0, 10)
    };

    if (editingAgent) {
      setAgents(agents.map(a => a.id === editingAgent.id ? newAgent : a));
    } else {
      setAgents([...agents, newAgent]);
    }
    setShowForm(false);
    setEditingAgent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">Agent Directory</h2>
          <p className="text-xs text-muted-foreground font-medium">Manage and track your recruitment pipeline</p>
        </div>
        <Button 
          onClick={() => { setEditingAgent(null); setShowForm(true); }}
          className="gap-2"
        >
          <Plus size={18} />
          Recruit New Agent
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl overflow-hidden border-t-4 border-t-primary">
          <form className="p-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">
                {editingAgent ? 'Edit Agent Profile' : 'Recruit New Agent'}
              </h3>
              <button 
                type="button" 
                onClick={() => { setShowForm(false); setEditingAgent(null); }} 
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField label="Full Name" name="name" defaultValue={editingAgent?.name} required placeholder="e.g. Ko Aung Kyaw" />
              <InputField label="Phone Number" name="phone" defaultValue={editingAgent?.phone} required placeholder="09-xxxxxxxxx" />
              <InputField label="Primary City" name="city" defaultValue={editingAgent?.city} required placeholder="e.g. Yangon" />
              <InputField label="Township" name="township" defaultValue={editingAgent?.township} placeholder="e.g. Insein" />
              <SelectField label="Platform" name="platform" defaultValue={editingAgent?.platform || 'Facebook'} options={['Facebook', 'Instagram', 'Telegram', 'TikTok', 'Multi']} />
              <SelectField label="Status" name="status" defaultValue={editingAgent?.status || 'Active'} options={['Active', 'Slow', 'Inactive']} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <InputField label="Social Profile Link" name="fb" defaultValue={editingAgent?.fb} placeholder="fb.com/username" />
              <InputField label="Estimated Followers" name="followers" type="number" defaultValue={editingAgent?.followers?.toString()} placeholder="500" />
            </div>

            <div className="mt-6">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Strategic Notes</label>
              <textarea 
                name="notes" 
                defaultValue={editingAgent?.notes} 
                rows={3} 
                className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all text-foreground" 
                placeholder="Agent specialities, performance history..." 
              />
            </div>

            <div className="mt-8 flex gap-3">
              <Button type="submit" className="flex-1">
                {editingAgent ? 'Update Profile' : 'Confirm Recruitment'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingAgent(null); }}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Name & Location</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Platform</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Followers</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agents.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-[11px] text-muted-foreground">{a.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-foreground">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">{a.city}{a.township ? `, ${a.township}` : ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <PlatformBadge platform={a.platform} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge variant={a.status === 'Active' ? 'success' : a.status === 'Slow' ? 'warning' : 'destructive'}>
                      {a.status}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-foreground">
                    {a.followers?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingAgent(a); setShowForm(true); }} 
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { if(confirm('Delete this agent?')) setAgents(agents.filter(ag => ag.id !== a.id)) }} 
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-xs text-muted-foreground font-bold uppercase tracking-widest italic">
                    No agents matching the records.
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

function InputField({ label, name, defaultValue, placeholder, required, type = 'text' }: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label} {required && '*'}</label>
      <input 
        name={name} 
        defaultValue={defaultValue} 
        required={required}
        type={type}
        className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all text-foreground" 
        placeholder={placeholder} 
      />
    </div>
  );
}

function SelectField({ label, name, defaultValue, options }: {
  label: string;
  name: string;
  defaultValue?: string;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      <select 
        name={name} 
        defaultValue={defaultValue} 
        className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all text-foreground"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    Facebook: 'bg-chart-2/15 text-chart-2',
    Instagram: 'bg-destructive/15 text-destructive',
    Telegram: 'bg-chart-2/15 text-chart-2',
    TikTok: 'bg-foreground/15 text-foreground',
    Multi: 'bg-chart-4/15 text-chart-4',
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${colors[platform] || 'bg-muted text-muted-foreground'}`}>
      {platform}
    </span>
  );
}
