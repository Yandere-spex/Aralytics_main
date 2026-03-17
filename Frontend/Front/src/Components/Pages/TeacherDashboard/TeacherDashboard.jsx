import { useState, useEffect } from 'react';
import { getTeacherDashboard } from '../../../services/teacherService';
import './TeacherDashboard.css';

const StatCard = ({ icon, label, value, sub, color }) => (
    <div className="td-stat-card" style={{ '--accent': color }}>
        <i className={`fa-solid ${icon} td-stat-icon`}></i>
        <div className="td-stat-value">{value}</div>
        <div className="td-stat-label">{label}</div>
        {sub && <div className="td-stat-sub">{sub}</div>}
    </div>
);

const ProgressBar = ({ label, value, max, color }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="td-progress-row">
            <div className="td-progress-label">{label}</div>
            <div className="td-progress-track">
                <div className="td-progress-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <div className="td-progress-val">{value}</div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const map = {
        'on-track':        { label: 'On track', cls: 'badge-green'  },
        'needs-attention': { label: 'Watch',     cls: 'badge-amber'  },
        'at-risk':         { label: 'At risk',   cls: 'badge-red'    },
        'inactive':        { label: 'Inactive',  cls: 'badge-gray'   },
    };
    const { label, cls } = map[status] || map['inactive'];
    return <span className={`td-badge ${cls}`}>{label}</span>;
};

const Sparkline = ({ data, valueKey, color }) => {
    if (!data?.length) return <div className="td-no-data">Not enough data yet</div>;
    const max = Math.max(...data.map(d => d[valueKey]), 1);
    return (
        <div className="td-spark-row">
            {data.map((d, i) => (
                <div
                    key={i}
                    className="td-spark-bar"
                    style={{ height: `${(d[valueKey] / max) * 100}%`, background: color }}
                    title={`Session ${d.session}: ${d[valueKey]}`}
                />
            ))}
        </div>
    );
};

export default function TeacherDashboard() {
    const [data, setData]           = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [filter, setFilter]       = useState('all');

    useEffect(() => {
        getTeacherDashboard()
            .then(setData)
            .catch(() => setError('Failed to load dashboard.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="td-loading">
            <div className="td-spinner" />
            <p>Loading class data…</p>
        </div>
    );

    if (error) return (
        <div className="td-empty">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p>{error}</p>
        </div>
    );

    if (!data) return (
        <div className="td-empty">
            <i className="fa-solid fa-users-slash"></i>
            <p>No data yet. Enroll students to get started.</p>
        </div>
    );

    const { summary, classTrend, attentionFlags, students, topPerformers } = data;

    const filteredStudents = filter === 'all'
        ? students
        : students.filter(s => s.status === filter);

    const initials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="td-wrap">

            {/* Header */}
            <div className="td-header">
                <div>
                    <h1 className="td-title">
                        <i className="fa-solid fa-chart-line"></i> Teacher Dashboard
                    </h1>
                    <p className="td-sub">Class overview · Aralytics</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="td-tabs">
                {['overview', 'students', 'leaderboard'].map(tab => (
                    <button
                        key={tab}
                        className={`td-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        <i className={`fa-solid fa-${tab === 'overview' ? 'gauge' : tab === 'students' ? 'users' : 'trophy'}`}></i>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* ── OVERVIEW ─────────────────────────────────────── */}
            {activeTab === 'overview' && (
                <>
                    <div className="td-stats-grid">
                        <StatCard icon="fa-users"       label="Total Students"    value={summary.totalStudents}              color="#7F77DD" />
                        <StatCard icon="fa-bolt"        label="Avg Reading Speed" value={`${summary.classAvgWPM} WPM`}       color="#1D9E75" sub="words per minute" />
                        <StatCard icon="fa-brain"       label="Avg Comprehension" value={`${summary.classAvgComprehension}%`} color="#f5a623" />
                        <StatCard icon="fa-star"        label="Avg Quiz Score"    value={`${summary.classAvgQuizScore}%`}     color="#378ADD" />
                    </div>

                    <div className="td-two-col">
                        <div className="td-panel">
                            <h3 className="td-panel-title">
                                <i className="fa-solid fa-gauge-high"></i> Reading speed distribution
                            </h3>
                            <ProgressBar label="Fast (>250 WPM)"      value={summary.speedDistribution.fast}   max={summary.totalStudents} color="#7F77DD" />
                            <ProgressBar label="Normal (150–250 WPM)" value={summary.speedDistribution.normal} max={summary.totalStudents} color="#1D9E75" />
                            <ProgressBar label="Slow (<150 WPM)"      value={summary.speedDistribution.slow}   max={summary.totalStudents} color="#ff6b6b" />

                            <h3 className="td-panel-title" style={{ marginTop: '1.25rem' }}>
                                <i className="fa-solid fa-brain"></i> Comprehension levels
                            </h3>
                            <ProgressBar label="Excellent (≥80%)"  value={summary.comprehensionDistribution.excellent}  max={summary.totalStudents} color="#1D9E75" />
                            <ProgressBar label="Good (60–79%)"     value={summary.comprehensionDistribution.good}       max={summary.totalStudents} color="#f5a623" />
                            <ProgressBar label="Needs work (<60%)" value={summary.comprehensionDistribution.needsWork}  max={summary.totalStudents} color="#ff6b6b" />
                        </div>

                        <div className="td-col-right">
                            <div className="td-panel">
                                <h3 className="td-panel-title">
                                    <i className="fa-solid fa-chart-bar"></i> Class WPM trend
                                </h3>
                                <Sparkline data={classTrend} valueKey="wpm" color="#7F77DD" />
                                <p className="td-spark-legend">Last {classTrend.length} sessions</p>
                            </div>

                            <div className="td-panel">
                                <h3 className="td-panel-title">
                                    <i className="fa-solid fa-flag"></i> Attention flags
                                </h3>
                                {attentionFlags.length === 0
                                    ? <p className="td-no-data"><i className="fa-solid fa-circle-check"></i> All students on track!</p>
                                    : attentionFlags.map((f, i) => (
                                        <div key={i} className="td-flag-row">
                                            <span className={`td-flag-dot ${f.status}`} />
                                            <div>
                                                <span className="td-flag-name">{f.name}</span>
                                                <span className="td-flag-desc"> — {f.flags.join(', ')}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── STUDENTS ─────────────────────────────────────── */}
            {activeTab === 'students' && (
                <div className="td-panel">
                    <div className="td-filters">
                        {[
                            { key: 'all',              label: `All (${students.length})` },
                            { key: 'on-track',         label: 'On track' },
                            { key: 'needs-attention',  label: 'Watch' },
                            { key: 'at-risk',          label: 'At risk' },
                            { key: 'inactive',         label: 'Inactive' },
                        ].map(f => (
                            <button
                                key={f.key}
                                className={`td-filter-btn ${filter === f.key ? 'active' : ''}`}
                                onClick={() => setFilter(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div className="td-roster-header">
                        <span style={{ width: 36 }} />
                        <span style={{ flex: 1 }}>Student</span>
                        <span className="td-col">WPM</span>
                        <span className="td-col">Comprehension</span>
                        <span className="td-col">Quiz avg</span>
                        <span className="td-col">Stories</span>
                        <span className="td-col">Status</span>
                    </div>

                    {filteredStudents.length === 0
                        ? <p className="td-no-data" style={{ padding: '1rem 0' }}>No students in this category.</p>
                        : filteredStudents.map((s, i) => (
                            <div key={i} className="td-roster-row">
                                <div className="td-avatar">{initials(s.name)}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="td-student-name">{s.name}</div>
                                    <div className="td-student-meta">{s.email}</div>
                                </div>
                                <span className="td-col">{s.avgWPM ?? '—'}</span>
                                <span className="td-col">{s.avgComprehension != null ? `${s.avgComprehension}%` : '—'}</span>
                                <span className="td-col">{s.avgQuizScore != null ? `${s.avgQuizScore}%` : '—'}</span>
                                <span className="td-col">{s.totalStories}</span>
                                <span className="td-col"><StatusBadge status={s.status} /></span>
                            </div>
                        ))
                    }
                </div>
            )}

            {/* ── LEADERBOARD ───────────────────────────────────── */}
            {activeTab === 'leaderboard' && (
                <div className="td-two-col">
                    <div className="td-panel">
                        <h3 className="td-panel-title"><i className="fa-solid fa-book-open"></i> Most stories read</h3>
                        {topPerformers.readers.map((s, i) => (
                            <div key={i} className="td-leader-row">
                                <span className="td-rank">#{i + 1}</span>
                                <div className="td-avatar sm">{initials(s.name)}</div>
                                <span style={{ flex: 1 }}>{s.name}</span>
                                <span className="td-badge badge-purple">{s.totalStories} stories</span>
                            </div>
                        ))}
                    </div>
                    <div className="td-panel">
                        <h3 className="td-panel-title"><i className="fa-solid fa-trophy"></i> Highest quiz average</h3>
                        {topPerformers.quizzers.map((s, i) => (
                            <div key={i} className="td-leader-row">
                                <span className="td-rank">#{i + 1}</span>
                                <div className="td-avatar sm" style={{ background: '#0d2b1a', color: '#34d399' }}>{initials(s.name)}</div>
                                <span style={{ flex: 1 }}>{s.name}</span>
                                <span className="td-badge badge-green">{s.avgQuizScore}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}