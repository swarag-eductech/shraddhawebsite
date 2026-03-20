import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import './LeadsCRM.css';

const supabase = createClient(
  'https://hmoodwzpkwblbymzpmxx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtb29kd3pwa3dibGJ5bXpwbXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMDYyMTksImV4cCI6MjA4ODY4MjIxOX0.qMY6NY-BeqsrudAK0SwNcQttPBMdLQmv6PGcDUcfOaY'
);

const TEAM_MEMBERS = ['Unassigned', 'Shraddha Ma\'am', 'Pooja', 'Rahul', 'Admin'];

const STATUS_OPTIONS = [
  { value: 'new',            label: '🆕 New',           color: '#3b82f6' },
  { value: 'called',         label: '📞 Called',         color: '#f59e0b' },
  { value: 'interested',     label: '✅ Interested',     color: '#10b981' },
  { value: 'enrolled',       label: '🎓 Enrolled',       color: '#8b5cf6' },
  { value: 'not_interested', label: '❌ Not Interested', color: '#ef4444' },
  { value: 'follow_up',      label: '🔁 Follow Up',      color: '#f97316' },
];

const PRIORITY_OPTIONS = [
  { value: 'hot',  label: '🔴 Hot',  color: '#ef4444', bg: '#fef2f2' },
  { value: 'warm', label: '🟡 Warm', color: '#d97706', bg: '#fffbeb' },
  { value: 'cold', label: '🔵 Cold', color: '#6b7280', bg: '#f3f4f6' },
];

const SOURCE_OPTIONS = [
  'Website Form', 'WhatsApp', 'Referral', 'Instagram', 'Facebook',
  'Walk-in', 'Phone Call', 'Other',
];

const CHART_COLORS = ['#3b82f6','#10b981','#8b5cf6','#ef4444','#f59e0b','#f97316','#06b6d4','#ec4899'];

// ────────────────────────────────────────────────────────────────────────────
const statusColor = (val) => STATUS_OPTIONS.find((s) => s.value === val)?.color || '#6b7280';
const statusLabel = (val) => STATUS_OPTIONS.find((s) => s.value === val)?.label || '🆕 New';
const priorityInfo = (val) => PRIORITY_OPTIONS.find((p) => p.value === val) || PRIORITY_OPTIONS[1];

const isOverdue = (lead) => {
  if (!lead.follow_up_date) return false;
  const terminal = ['enrolled', 'not_interested'];
  if (terminal.includes(lead.status)) return false;
  return new Date(lead.follow_up_date) < new Date(new Date().toDateString());
};

const exportCSV = (leads) => {
  const headers = ['Name','Phone','Email','City','Program','Source','Priority','Status','Assigned To','Follow-up Date','Registered','Notes'];
  const rows = leads.map((l) => [
    l.name, l.phone, l.email || '', l.city || '', l.program || '',
    l.source || 'Website Form', l.priority || 'warm', l.status || 'new',
    l.assigned_to || 'Unassigned', l.follow_up_date || '', l.created_at || '', (l.notes || '').replace(/\n/g, ' | '),
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function LeadsCRM() {
  const [user, setUser]           = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [authError, setAuthError] = useState('');
  const [signing, setSigning]     = useState(false);

  const [leads, setLeads]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'analytics'

  // Filters
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterSource, setFilterSource]   = useState('all');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterAssigned, setFilterAssigned] = useState('all');
  const [sortOrder, setSortOrder]       = useState('desc');

  // Detail panel
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText]         = useState('');
  const [savingNote, setSavingNote]     = useState(false);

  // ── Auth ────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSigning(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message === 'Invalid login credentials'
        ? 'Wrong email or password. Try again.'
        : error.message);
    }
    setSigning(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ── Fetch ────────────────────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: sortOrder === 'asc' });
    if (!error && data) setLeads(data);
    setLoading(false);
  }, [sortOrder]);

  useEffect(() => { if (user) fetchLeads(); }, [user, fetchLeads]);

  // ── Generic field updater ───────────────────────────────────────────
  const updateField = useCallback(async (id, field, value) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
    await supabase.from('leads').update({ [field]: value }).eq('id', id);
    setSelectedLead((p) => p?.id === id ? { ...p, [field]: value } : p);
  }, []);

  // ── Delete lead ─────────────────────────────────────────────────────
  const deleteLead = useCallback(async (id) => {
    if (!window.confirm('Delete this lead permanently? This cannot be undone.')) return;
    await supabase.from('leads').delete().eq('id', id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLead((p) => (p?.id === id ? null : p));
  }, []);

  // ── Save note ────────────────────────────────────────────────────────
  const saveNote = async () => {
    if (!selectedLead || !noteText.trim()) return;
    setSavingNote(true);
    const stamp   = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const newNote = `[${stamp}]\n${noteText.trim()}\n\n${selectedLead.notes || ''}`.trim();
    await supabase.from('leads').update({ notes: newNote }).eq('id', selectedLead.id);
    setLeads((prev) => prev.map((l) => l.id === selectedLead.id ? { ...l, notes: newNote } : l));
    setSelectedLead((p) => ({ ...p, notes: newNote }));
    setNoteText('');
    setSavingNote(false);
  };

  // ── Filters ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => leads.filter((l) => {
    const s = search.toLowerCase();
    const matchSearch = !s ||
      l.name?.toLowerCase().includes(s) ||
      l.phone?.includes(s) ||
      l.city?.toLowerCase().includes(s) ||
      l.email?.toLowerCase().includes(s) ||
      l.message?.toLowerCase().includes(s) ||
      l.program?.toLowerCase().includes(s);
    const matchStatus   = filterStatus   === 'all' || (l.status   || 'new')          === filterStatus;
    const matchPriority = filterPriority === 'all' || (l.priority || 'warm')         === filterPriority;
    const matchSource   = filterSource   === 'all' || (l.source   || 'Website Form') === filterSource;
    const matchProgram  = filterProgram  === 'all' || l.program === filterProgram;
    const matchAssigned = filterAssigned === 'all' || (l.assigned_to || 'Unassigned') === filterAssigned;
    return matchSearch && matchStatus && matchPriority && matchSource && matchProgram && matchAssigned;
  }), [leads, search, filterStatus, filterPriority, filterSource, filterProgram, filterAssigned]);

  const programs  = useMemo(() => [...new Set(leads.map((l) => l.program).filter(Boolean))],  [leads]);
  const sources   = useMemo(() => [...new Set(leads.map((l) => l.source).filter(Boolean))],   [leads]);
  const assignees = useMemo(() => [...new Set(leads.map((l) => l.assigned_to).filter(Boolean))], [leads]);

  // ── Stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    leads.length,
    new:      leads.filter((l) => !l.status || l.status === 'new').length,
    enrolled: leads.filter((l) => l.status === 'enrolled').length,
    hot:      leads.filter((l) => l.priority === 'hot').length,
    overdue:  leads.filter(isOverdue).length,
  }), [leads]);

  // ── Analytics computations ───────────────────────────────────────────
  const analytics = useMemo(() => {
    // Leads per day — last 14 days
    const now = new Date();
    const dayMap = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      dayMap[d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })] = 0;
    }
    leads.forEach((l) => {
      if (l.created_at) {
        const key = new Date(l.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        if (key in dayMap) dayMap[key]++;
      }
    });
    const leadsPerDay = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

    // Status distribution
    const statusMap = {};
    STATUS_OPTIONS.forEach((s) => { statusMap[s.value] = 0; });
    leads.forEach((l) => { const s = l.status || 'new'; if (s in statusMap) statusMap[s]++; });
    const statusDist = STATUS_OPTIONS
      .map((s) => ({ name: s.label.replace(/^\S+\s/, ''), value: statusMap[s.value], color: s.color }))
      .filter((s) => s.value > 0);

    // Source distribution
    const sourceMap = {};
    leads.forEach((l) => {
      const src = l.source || 'Website Form';
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });
    const sourceDist = Object.entries(sourceMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    // Priority
    const pMap = { hot: 0, warm: 0, cold: 0 };
    leads.forEach((l) => { const p = l.priority || 'warm'; if (p in pMap) pMap[p]++; });

    // Conversion
    const convRate = leads.length > 0
      ? ((leads.filter((l) => l.status === 'enrolled').length / leads.length) * 100).toFixed(1)
      : '0.0';

    return { leadsPerDay, statusDist, sourceDist, pMap, convRate };
  }, [leads]);

  // ════════════════════════════ LOGIN SCREEN ══════════════════════════
  if (authLoading) {
    return (
      <div className="crm-login-wrap">
        <div className="crm-auth-loading">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="crm-login-wrap">
        <div className="crm-login-box">
          <div className="crm-login-logo">🎓</div>
          <h2>TTP Leads CRM</h2>
          <p>Sign in with your team account</p>
          <form onSubmit={handleLogin}>
            <label className="crm-field-label">Email</label>
            <input
              type="email"
              placeholder="you@shraddha.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setAuthError(''); }}
              className="crm-text-input"
              autoFocus
              required
            />
            <label className="crm-field-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthError(''); }}
              className="crm-text-input"
              required
            />
            {authError && <p className="crm-pin-error">{authError}</p>}
            <button type="submit" className="crm-login-btn" disabled={signing}>
              {signing ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
          <p className="crm-login-hint">Contact admin to create your team account.</p>
        </div>
      </div>
    );
  }

  // ════════════════════════════ MAIN CRM ══════════════════════════════
  return (
    <div className="crm-wrap">

      {/* ── Header ── */}
      <div className="crm-header">
        <div className="crm-header-left">
          <span className="crm-logo">🎓</span>
          <div>
            <h1>TTP Leads CRM</h1>
            <p>{user?.email || 'Shraddha Institute'}</p>
          </div>
        </div>
        <div className="crm-tabs">
          <button className={`crm-tab${activeTab === 'leads' ? ' crm-tab-active' : ''}`} onClick={() => setActiveTab('leads')}>📋 Leads</button>
          <button className={`crm-tab${activeTab === 'analytics' ? ' crm-tab-active' : ''}`} onClick={() => setActiveTab('analytics')}>📊 Analytics</button>
        </div>
        <div className="crm-header-right">
          <button className="crm-export-btn" onClick={() => exportCSV(leads)} title="Export to Excel/CSV">⬇ Export CSV</button>
          <button className="crm-refresh-btn" onClick={fetchLeads}>🔄 Refresh</button>
          <button className="crm-logout-btn" onClick={handleLogout}>🔓 Logout</button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="crm-stats-bar">
        <div className="crm-stat"><span className="crm-stat-num">{stats.total}</span><span className="crm-stat-label">Total Leads</span></div>
        <div className="crm-stat crm-stat-blue"><span className="crm-stat-num">{stats.new}</span><span className="crm-stat-label">New</span></div>
        <div className="crm-stat crm-stat-green"><span className="crm-stat-num">{stats.enrolled}</span><span className="crm-stat-label">Enrolled</span></div>
        <div className="crm-stat crm-stat-red"><span className="crm-stat-num">{stats.hot}</span><span className="crm-stat-label">🔴 Hot</span></div>
        <div className="crm-stat crm-stat-orange"><span className="crm-stat-num">{stats.overdue}</span><span className="crm-stat-label">⏰ Overdue</span></div>
        <div className="crm-stat crm-stat-purple">
          <span className="crm-stat-num">{analytics.convRate}%</span>
          <span className="crm-stat-label">Conversion</span>
        </div>
      </div>

      {/* ══════════════ ANALYTICS TAB ══════════════ */}
      {activeTab === 'analytics' && (
        <div className="crm-analytics">

          {/* Leads per Day */}
          <div className="crm-chart-card crm-chart-wide">
            <h3 className="crm-chart-title">📈 Leads per Day (Last 14 Days)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.leadsPerDay} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Bar dataKey="count" fill="#ff6600" radius={[4, 4, 0, 0]} name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="crm-charts-row">
            {/* Status Distribution */}
            <div className="crm-chart-card">
              <h3 className="crm-chart-title">📊 Status Breakdown</h3>
              {analytics.statusDist.length === 0
                ? <p className="crm-chart-empty">No data yet</p>
                : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={analytics.statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {analytics.statusDist.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
            </div>

            {/* Source Breakdown */}
            <div className="crm-chart-card">
              <h3 className="crm-chart-title">🔗 Lead Sources</h3>
              {analytics.sourceDist.length === 0
                ? <p className="crm-chart-empty">No data yet</p>
                : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={analytics.sourceDist} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Leads">
                        {analytics.sourceDist.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
            </div>

            {/* Priority Summary */}
            <div className="crm-chart-card crm-priority-summary">
              <h3 className="crm-chart-title">🎯 Priority Summary</h3>
              {PRIORITY_OPTIONS.map((p) => (
                <div key={p.value} className="crm-priority-row" style={{ borderLeft: `4px solid ${p.color}`, background: p.bg }}>
                  <span className="crm-priority-row-label">{p.label}</span>
                  <span className="crm-priority-row-num" style={{ color: p.color }}>{analytics.pMap[p.value]}</span>
                </div>
              ))}
              <div className="crm-priority-row" style={{ borderLeft: '4px solid #ef4444', background: '#fef2f2', marginTop: 12 }}>
                <span className="crm-priority-row-label">⏰ Overdue Follow-ups</span>
                <span className="crm-priority-row-num" style={{ color: '#ef4444' }}>{stats.overdue}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ LEADS TAB ══════════════ */}
      {activeTab === 'leads' && (
        <>
          {/* Filters */}
          <div className="crm-filters">
            <input
              className="crm-search"
              type="text"
              placeholder="🔍  Search name, phone, city, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="crm-select" value={filterStatus}   onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select className="crm-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all">All Priorities</option>
              {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <select className="crm-select" value={filterSource}   onChange={(e) => setFilterSource(e.target.value)}>
              <option value="all">All Sources</option>
              {sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="crm-select" value={filterProgram}  onChange={(e) => setFilterProgram(e.target.value)}>
              <option value="all">All Programs</option>
              {programs.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select className="crm-select" value={filterAssigned} onChange={(e) => setFilterAssigned(e.target.value)}>
              <option value="all">All Assignees</option>
              {assignees.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <select className="crm-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            <span className="crm-count">{filtered.length} leads</span>
          </div>

          {/* Table + Detail */}
          <div className="crm-body">
            <div className={`crm-table-wrap ${selectedLead ? 'crm-table-shrunk' : ''}`}>
              {loading ? (
                <div className="crm-loading">Loading leads…</div>
              ) : filtered.length === 0 ? (
                <div className="crm-empty">No leads match the current filters.</div>
              ) : (
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Program</th>
                      <th>Source</th>
                      <th>Priority</th>
                      <th>Submitted</th>
                      <th>Follow-up</th>
                      <th>Status</th>
                      <th>Assigned</th>
                      <th>Change Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead, idx) => {
                      const pInfo = priorityInfo(lead.priority || 'warm');
                      const overdue = isOverdue(lead);
                      return (
                        <tr
                          key={lead.id}
                          className={selectedLead?.id === lead.id ? 'crm-row-active' : ''}
                          onClick={() => { setSelectedLead(lead); setNoteText(''); }}
                        >
                          <td className="crm-idx">{idx + 1}</td>
                          <td className="crm-name">
                            <div className="crm-name-cell">
                              {lead.name}
                              {lead.message && (
                                <span className="crm-msg-indicator" title={lead.message}>💬</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="crm-phone-link">
                              {lead.phone}
                            </a>
                          </td>
                          <td>{lead.city || '—'}</td>
                          <td>
                            <span className="crm-program-badge">{lead.program || '—'}</span>
                          </td>
                          <td>
                            <span className="crm-source-badge">{lead.source || 'Website Form'}</span>
                          </td>
                          <td>
                            <span className="crm-priority-badge" style={{ color: pInfo.color, background: pInfo.bg, border: `1px solid ${pInfo.color}44` }}>
                              {pInfo.label}
                            </span>
                          </td>
                          <td>
                            <span className="crm-submitted-time">
                              {lead.submitted_at || lead.created_at
                                ? new Date(lead.submitted_at || lead.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })
                                : '—'}
                            </span>
                          </td>
                          <td>
                            {lead.follow_up_date ? (
                              <span className={overdue ? 'crm-overdue-badge' : 'crm-followup-date'}>
                                {overdue ? '⏰ ' : '📅 '}
                                {new Date(lead.follow_up_date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              </span>
                            ) : <span className="crm-no-followup">—</span>}
                          </td>
                          <td>
                            <span className="crm-status-badge" style={{ background: statusColor(lead.status || 'new') + '22', color: statusColor(lead.status || 'new'), border: `1px solid ${statusColor(lead.status || 'new')}44` }}>
                              {statusLabel(lead.status || 'new')}
                            </span>
                          </td>
                          <td className="crm-assigned-cell">{lead.assigned_to || 'Unassigned'}</td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <select
                              className="crm-status-select"
                              value={lead.status || 'new'}
                              onChange={(e) => updateField(lead.id, 'status', e.target.value)}
                            >
                              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <button
                              className="crm-delete-row-btn"
                              title="Delete lead"
                              onClick={() => deleteLead(lead.id)}
                            >🗑</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* ── Detail Panel ── */}
            {selectedLead && (
              <div className="crm-detail">
                <div className="crm-detail-header">
                  <div>
                    <h3>{selectedLead.name}</h3>
                    <span className="crm-detail-sub">{selectedLead.program || 'No program'}</span>
                  </div>
                  <button className="crm-detail-close" onClick={() => setSelectedLead(null)}>✕</button>
                </div>

                <div className="crm-detail-body">
                  {/* Lead message callout — shown prominently if present */}
                  {selectedLead.message && (
                    <div className="crm-message-callout">
                      <div className="crm-message-callout-header">💬 Message from Lead</div>
                      <p className="crm-message-callout-text">{selectedLead.message}</p>
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="crm-detail-row"><span>📞 Phone</span>
                    <a href={`tel:${selectedLead.phone}`}>{selectedLead.phone}</a>
                  </div>
                  {selectedLead.email && (
                    <div className="crm-detail-row"><span>📧 Email</span>
                      <a href={`mailto:${selectedLead.email}`}>{selectedLead.email}</a>
                    </div>
                  )}
                  <div className="crm-detail-row"><span>🏙️ City</span><p>{selectedLead.city || '—'}</p></div>
                  <div className="crm-detail-row"><span>📅 Submitted</span>
                    <p>{selectedLead.submitted_at || selectedLead.created_at
                      ? new Date(selectedLead.submitted_at || selectedLead.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                      : '—'}</p>
                  </div>

                  <div className="crm-detail-divider" />

                  {/* Priority */}
                  <div className="crm-detail-field-row">
                    <label>🎯 Priority</label>
                    <select className="crm-status-select" value={selectedLead.priority || 'warm'} onChange={(e) => updateField(selectedLead.id, 'priority', e.target.value)}>
                      {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>

                  {/* Source */}
                  <div className="crm-detail-field-row">
                    <label>🔗 Source</label>
                    <select className="crm-status-select" value={selectedLead.source || 'Website Form'} onChange={(e) => updateField(selectedLead.id, 'source', e.target.value)}>
                      {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Assigned To */}
                  <div className="crm-detail-field-row">
                    <label>👤 Assigned To</label>
                    <select className="crm-status-select" value={selectedLead.assigned_to || 'Unassigned'} onChange={(e) => updateField(selectedLead.id, 'assigned_to', e.target.value)}>
                      {TEAM_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  {/* Follow-up Date */}
                  <div className="crm-detail-field-row">
                    <label>📅 Follow-up Date {isOverdue(selectedLead) && <span className="crm-overdue-badge">OVERDUE</span>}</label>
                    <input
                      type="date"
                      className="crm-date-input"
                      value={selectedLead.follow_up_date || ''}
                      onChange={(e) => updateField(selectedLead.id, 'follow_up_date', e.target.value)}
                    />
                  </div>

                  {/* Status */}
                  <div className="crm-detail-field-row">
                    <label>📌 Status</label>
                    <select className="crm-status-select" value={selectedLead.status || 'new'} onChange={(e) => updateField(selectedLead.id, 'status', e.target.value)}>
                      {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  <div className="crm-detail-divider" />

                  {/* Quick Actions */}
                  <div className="crm-quick-actions">
                    <a
                      href={`https://wa.me/${selectedLead.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedLead.name}! 👋 This is Shraddha Institute. We received your registration for *${selectedLead.program}*. We'd love to connect with you. Is this a good time to talk?`)}`}
                      target="_blank" rel="noreferrer"
                      className="crm-action-btn crm-wa-btn"
                    >
                      💬 WhatsApp
                    </a>
                    <a href={`tel:${selectedLead.phone}`} className="crm-action-btn crm-call-btn">
                      📞 Call Now
                    </a>
                    <button
                      className="crm-action-btn crm-delete-btn"
                      onClick={() => deleteLead(selectedLead.id)}
                    >
                      🗑 Delete Lead
                    </button>
                  </div>

                  <div className="crm-detail-divider" />

                  {/* Notes */}
                  <div className="crm-notes-section">
                    <label>📝 Add Note</label>
                    <textarea
                      className="crm-notes-input"
                      rows={3}
                      placeholder="Call outcome, follow-up promise, anything relevant…"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <button
                      className="crm-save-note-btn"
                      onClick={saveNote}
                      disabled={!noteText.trim() || savingNote}
                    >
                      {savingNote ? 'Saving…' : '💾 Save Note'}
                    </button>

                    {selectedLead.notes && (
                      <div className="crm-notes-history">
                        <label>📋 Notes History</label>
                        <pre>{selectedLead.notes}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
