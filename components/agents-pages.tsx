'use client';

import { useMemo, useState } from 'react';
import { Activity, CalendarDays, CheckCircle2, ChevronDown, Download, MoreVertical, Plus, Search, Truck, TrendingUp, X } from 'lucide-react';

type Agent = { id: string; name: string; location: string; status: 'Active' | 'Inactive'; units: number; initials: string; color: string };
const initialAgents: Agent[] = [
  { id: 'DEMO-COURIER-001', name: 'Demo Courier Lagos', location: 'Lagos', status: 'Active', units: 0, initials: 'DC', color: '#873cf0' },
  { id: 'DEMO-COURIER-002', name: 'Demo Courier Abuja', location: 'FCT Abuja', status: 'Active', units: 0, initials: 'DC', color: '#e78300' },
  { id: 'DEMO-COURIER-003', name: 'Demo Courier Rivers', location: 'Rivers', status: 'Active', units: 0, initials: 'DC', color: '#e52e32' },
  { id: 'DEMO-COURIER-004', name: 'Demo Courier Kano', location: 'Kano', status: 'Active', units: 0, initials: 'DC', color: '#079b78' },
];

export function AgentsListPage() {
  const [agents, setAgents] = useState(initialAgents);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All Statuses');
  const [selected, setSelected] = useState<string[]>([]);
  const [menu, setMenu] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const filtered = useMemo(() => agents.filter(a => (status === 'All Statuses' || a.status === status) && `${a.name} ${a.id} ${a.location}`.toLowerCase().includes(query.toLowerCase())), [agents, query, status]);
  const allSelected = filtered.length > 0 && filtered.every(a => selected.includes(a.id));
  const toggle = (id: string) => setSelected(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);
  const exportCsv = () => { const rows = [['Agent', 'Agent ID', 'Location', 'Status', 'Units in hand'], ...filtered.map(a => [a.name, a.id, a.location, a.status, String(a.units)])]; const csv = rows.map(r => r.map(v => `"${v.replaceAll('"', '""')}"`).join(',')).join('\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); const link = document.createElement('a'); link.href = url; link.download = 'salesgee-agents.csv'; link.click(); URL.revokeObjectURL(url); };
  const addAgent = () => { if (!name.trim() || !location.trim()) return; const next = agents.length + 1; setAgents(v => [...v, { id: `DEMO-COURIER-${String(next).padStart(3, '0')}`, name: name.trim(), location: location.trim(), status: 'Active', units: 0, initials: name.trim().split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase(), color: '#078f9b' }]); setName(''); setLocation(''); setShowAdd(false); };
  return <>
    <div className="page-heading agents-heading"><div><h1>Agents</h1><p>Manage logistics and delivery agents</p></div><div className="agents-heading-actions"><button className="button secondary" onClick={exportCsv}><Download size={15} /> Export CSV</button><button className="button primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Agent</button></div></div>
    <div className="agents-toolbar"><label className="agents-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." /></label><select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status"><option>All Statuses</option><option>Active</option><option>Inactive</option></select><label className="agents-select-all"><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? selected.filter(id => !filtered.some(a => a.id === id)) : [...new Set([...selected, ...filtered.map(a => a.id)])])} /> Select all</label></div>
    {selected.length > 0 && <div className="agents-bulkbar"><b>{selected.length} agent{selected.length > 1 ? 's' : ''} selected</b><button onClick={() => { setAgents(v => v.map(a => selected.includes(a.id) ? { ...a, status: 'Active' } : a)); setSelected([]); }}>Activate</button><button onClick={() => { setAgents(v => v.map(a => selected.includes(a.id) ? { ...a, status: 'Inactive' } : a)); setSelected([]); }}>Deactivate</button><button className="clear" onClick={() => setSelected([])}>Clear</button></div>}
    <div className="agents-table-wrap"><table className="agents-table"><thead><tr><th className="check-col"></th><th>Agent</th><th>Location</th><th>Status</th><th>Units in hand</th><th></th></tr></thead><tbody>{filtered.map(a => <tr key={a.id}><td><input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggle(a.id)} aria-label={`Select ${a.name}`} /></td><td><div className="agent-identity"><span className="agent-avatar" style={{ background: a.color }}>{a.initials}</span><span><b>{a.name}</b><small>{a.id}</small></span></div></td><td className="agent-location">{a.location}</td><td><span className={`agent-status ${a.status.toLowerCase()}`}>{a.status}</span></td><td className="agent-units"><b>{a.units}</b> <small>units</small></td><td className="agent-menu-cell"><button className="agent-menu-trigger" onClick={() => setMenu(menu === a.id ? null : a.id)} aria-label={`Actions for ${a.name}`}><MoreVertical size={18} /></button>{menu === a.id && <div className="agent-menu"><button onClick={() => setMenu(null)}>View agent</button><button onClick={() => setMenu(null)}>Edit agent</button><button onClick={() => { setAgents(v => v.map(x => x.id === a.id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x)); setMenu(null); }}>{a.status === 'Active' ? 'Deactivate' : 'Activate'}</button></div>}</td></tr>)}</tbody></table>{filtered.length === 0 && <div className="agents-empty">No agents match your search.</div>}</div>
    {showAdd && <div className="agent-modal-backdrop" onClick={() => setShowAdd(false)}><div className="agent-modal" onClick={e => e.stopPropagation()}><div className="agent-modal-head"><h2>Add Agent</h2><button onClick={() => setShowAdd(false)} aria-label="Close"><X size={18} /></button></div><label>Agent name<input value={name} onChange={e => setName(e.target.value)} placeholder="Enter agent name" /></label><label>Location<input value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter location" /></label><div className="agent-modal-actions"><button className="button secondary" onClick={() => setShowAdd(false)}>Cancel</button><button className="button primary" onClick={addAgent} disabled={!name.trim() || !location.trim()}>Save Agent</button></div></div></div>}
  </>;
}

const performance = [
  { name: 'Demo Courier Lagos', place: 'Lagos', assigned: 3, delivered: 3, transit: 0, cancelled: 0, revenue: '₦90,000', units: '32500' },
  { name: 'Demo Courier Rivers', place: 'Rivers', assigned: 3, delivered: 3, transit: 0, cancelled: 0, revenue: '₦90,000', units: '32500' },
  { name: 'Demo Courier Abuja', place: 'FCT Abuja', assigned: 2, delivered: 2, transit: 0, cancelled: 0, revenue: '₦60,000', units: '32500' },
  { name: 'Demo Courier Kano', place: 'Kano', assigned: 2, delivered: 2, transit: 0, cancelled: 0, revenue: '₦60,000', units: '32500' },
];
export function AgentPerformancePage() {
  const [period, setPeriod] = useState('This Week');
  return <>
    <div className="page-heading"><div><h1>Agent Performance</h1><p>See how your delivery agents are performing</p></div></div>
    <div className="performance-filter">
      <CalendarDays size={14} />
      <select value={period} onChange={e => setPeriod(e.target.value)}>
        <option>This Week</option>
        <option>This Month</option>
        <option>Last 7 Days</option>
        <option>Last 30 Days</option>
        <option>This Year</option>
      </select>
      <ChevronDown size={13} />
    </div>
    <div className="performance-stats">
      <div className="performance-stat"><span className="perf-icon orange"><Truck size={17} /></span><strong>10</strong><small>Total Deliveries</small></div>
      <div className="performance-stat"><span className="perf-icon green"><CheckCircle2 size={17} /></span><strong>10</strong><small>Delivered</small></div>
      <div className="performance-stat"><span className="perf-icon teal"><TrendingUp size={17} /></span><strong>₦300,000</strong><small>Revenue</small></div>
      <div className="performance-stat"><span className="perf-icon purple"><Activity size={17} /></span><strong>100%</strong><small>Delivery Rate</small></div>
    </div>
    <div className="top-agent-banner">
      <span className="top-agent-icon">
        <Truck size={21} />
      </span>
      <div>
        <small>TOP AGENT</small>
        <b>Demo Courier Lagos</b>
        <span>3 deliveries · 100% rate</span>
      </div>
      <span className="top-agent-decoration" />
    </div>
    <section className="agent-breakdown panel">
      <div className="breakdown-heading">
        <b>Agent Breakdown</b>
        <small>4 agents</small>
      </div>
      {performance.map(a => <div className="performance-agent" key={a.name}>
        <div className="performance-agent-heading">
          <div>
            <b>{a.name}</b>
            <small>{a.place} · {a.units} units in hand</small>
          </div>
          <strong>100%
            <small>RATE</small>
          </strong>
        </div>
        <div className="performance-counts">
          <div>
            <b>{a.assigned}</b>
            <small>Assigned</small>
          </div>
          <div className="delivered">
            <b>{a.delivered}</b>
            <small>Delivered</small>
          </div>
          <div className="transit">
            <b>{a.transit}</b>
            <small>In Transit</small>
          </div>
          <div className="cancelled">
            <b>{a.cancelled}</b>
            <small>Cancelled</small>
          </div>
        </div>
        <div className="performance-progress">
          <span style={{ width: '100%' }} />
        </div>
        <p>Revenue delivered: <b>{a.revenue}</b></p>
      </div>)}
    </section>
  </>;
}
