import { useState, useEffect } from 'react';
import { getDashboard } from '../../services/Dashboardservice.js';
import './Dashboard.css';

// ── SMALL STAT CARD ──────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color }) => (
    <div className="stat-card" style={{ '--accent': color }}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
    </div>
);

// ── PROGRESS BAR ─────────────────────────────────────────────────
const ProgressBar = ({ label, value, max, color }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="progress-row">
            <div className="progress-label">{label}</div>
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <div className="progress-value">{value}</div>
        </div>
    );
};

// ── TREND MINI CHART (pure CSS bars) ─────────────────────────────
const TrendChart = ({ data, valueKey, color, label }) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map(d => d[valueKey]));
    return (
        <div className="trend-chart">
            <div className="trend-label">{label}</div>
            <div className="trend-bars">
                {data.map((d, i) => (
                    <div key={i} className="trend-bar-wrap" title={`${d.label}: ${d[valueKey]}`}>
                        <div
                            className="trend-bar"
                            style={{
                                height: `${max > 0 ? (d[valueKey] / max) * 100 : 0}%`,
                                background: color,
                            }}
                        />
                        <div className="trend-tick">{d.session}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── RECENT ROW ───────────────────────────────────────────────────
const RecentRow = ({ title, wpm, percentage, completedAt }) => (
    <div className="recent-row">
        <div className="recent-info">
            <div className="recent-title">{title}</div>
            <div className="recent-date">{new Date(completedAt).toLocaleDateString()}</div>
        </div>
        <div className="recent-badges">
            <span className="badge wpm-badge">{wpm} WPM</span>
            <span className={`badge comp-badge ${percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : 'needs-work'}`}>
                {percentage}%
            </span>
        </div>
    </div>
);

// ── DONUT RING (SVG) ─────────────────────────────────────────────
const DonutRing = ({ percentage, color, size = 100 }) => {
    const r = 38;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percentage / 100) * circ;
    return (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#1e1e2e" strokeWidth="12" />
            <circle
                cx="50" cy="50" r={r} fill="none"
                stroke={color} strokeWidth="12"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x="50" y="55" textAnchor="middle" fill={color} fontSize="18" fontWeight="bold">
                {percentage}%
            </text>
        </svg>
    );
};

// ── MAIN DASHBOARD ───────────────────────────────────────────────
export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reading');


    
    useEffect(() => {
    const fetchDashboard = async () => {
        const data = await getDashboard();
        setData(data);
    };
    fetchDashboard();
}, []);


    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getDashboard();
                setData(result);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return (
        <div className="dashboard-loading">
            <div className="loading-spinner" />
            <p>Loading your stats...</p>
        </div>
    );

    if (!data) return (
        <div className="dashboard-empty">
            <p>No data yet. Start reading or take a quiz!</p>
        </div>
    );

    const { reading, quiz } = data;

    return (
        <div className="dashboard">

            {/* ── HEADER ── */}
            <div className="dashboard-header">
                <h1> My Dashboard</h1>
                <p className="dashboard-sub">Track your reading and quiz progress</p>
            </div>

            {/* ── TABS ── */}
            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'reading' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reading')}
                >
                    Reading
                </button>
                <button
                    className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                    onClick={() => setActiveTab('quiz')}
                >
                    Quiz
                </button>
            </div>

            {/* ══════════════════════════════════════════
                READING TAB
            ══════════════════════════════════════════ */}
            {activeTab === 'reading' && (
                <div className="tab-content">

                    {reading.totalStoriesRead === 0 ? (
                        <div className="empty-state">
                            <span>📖</span>
                            <p>No stories read yet. Start your first story!</p>
                        </div>
                    ) : (
                        <>
                            {/* Top stat cards */}
                            <div className="stats-grid">
                                <StatCard icon="📚" label="Stories Read"    value={reading.totalStoriesRead}  color="#4ecdc4" />
                                <StatCard icon="🔤" label="Words Read"      value={reading.totalWordsRead.toLocaleString()} color="#f5a623" />
                                <StatCard icon="⚡" label="Avg Speed"       value={`${reading.avgWPM} WPM`}  color="#a78bfa" />
                                <StatCard icon="🧠" label="Avg Comprehension" value={`${reading.avgComprehension}%`} color="#34d399" />
                            </div>

                            {/* Donut rings */}
                            <div className="section-title">Overall Performance</div>
                            <div className="donuts-row">
                                <div className="donut-wrap">
                                    <DonutRing percentage={reading.avgComprehension} color="#34d399" />
                                    <div className="donut-label">Avg Comprehension</div>
                                </div>
                                <div className="donut-wrap">
                                    <DonutRing
                                        percentage={Math.min(Math.round((reading.avgWPM / 300) * 100), 100)}
                                        color="#a78bfa"
                                    />
                                    <div className="donut-label">Reading Speed</div>
                                    <div className="donut-sub">{reading.avgWPM} / 300 WPM</div>
                                </div>
                                <div className="donut-wrap">
                                    <DonutRing
                                        percentage={Math.min(Math.round((reading.totalStoriesRead / 20) * 100), 100)}
                                        color="#f5a623"
                                    />
                                    <div className="donut-label">Stories Goal</div>
                                    <div className="donut-sub">{reading.totalStoriesRead} / 20</div>
                                </div>
                            </div>

                            {/* Speed distribution */}
                            <div className="section-title">Reading Speed Distribution</div>
                            <div className="dist-section">
                                <ProgressBar label="🐢 Slow (< 150 WPM)"       value={reading.speedDistribution.slow}   max={reading.totalStoriesRead} color="#ff6b6b" />
                                <ProgressBar label="✅ Normal (150–250 WPM)"    value={reading.speedDistribution.normal} max={reading.totalStoriesRead} color="#34d399" />
                                <ProgressBar label="⚡ Fast (> 250 WPM)"        value={reading.speedDistribution.fast}   max={reading.totalStoriesRead} color="#a78bfa" />
                            </div>

                            {/* Comprehension distribution */}
                            <div className="section-title">Comprehension Distribution</div>
                            <div className="dist-section">
                                <ProgressBar label="🌟 Excellent (≥ 80%)"  value={reading.comprehensionDistribution.excellent}  max={reading.totalStoriesRead} color="#34d399" />
                                <ProgressBar label="👍 Good (60–79%)"      value={reading.comprehensionDistribution.good}       max={reading.totalStoriesRead} color="#f5a623" />
                                <ProgressBar label="📝 Needs Work (< 60%)" value={reading.comprehensionDistribution.needsWork}  max={reading.totalStoriesRead} color="#ff6b6b" />
                            </div>

                            {/* Trend chart */}
                            {reading.trend && reading.trend.length > 1 && (
                                <>
                                    <div className="section-title">Progress Over Sessions</div>
                                    <div className="charts-row">
                                        <TrendChart data={reading.trend} valueKey="wpm"           color="#a78bfa" label="WPM per Session" />
                                        <TrendChart data={reading.trend} valueKey="comprehension" color="#34d399" label="Comprehension % per Session" />
                                    </div>
                                </>
                            )}

                            {/* Personal bests */}
                            <div className="section-title">Personal Bests</div>
                            <div className="bests-row">
                                <div className="best-card">
                                    <span className="best-icon">🏆</span>
                                    <div className="best-value">{reading.bestWPM} WPM</div>
                                    <div className="best-label">Fastest Read</div>
                                </div>
                                <div className="best-card">
                                    <span className="best-icon">🎯</span>
                                    <div className="best-value">{reading.bestComprehension}%</div>
                                    <div className="best-label">Best Comprehension</div>
                                </div>
                            </div>

                            {/* Recent stories */}
                            <div className="section-title">Recent Stories</div>
                            <div className="recent-list">
                                {reading.recentStories.map((s, i) => (
                                    <RecentRow
                                        key={i}
                                        title={s.storyTitle}
                                        wpm={s.wpm}
                                        percentage={s.percentage}
                                        completedAt={s.completedAt}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════
                QUIZ TAB (placeholder until quiz is built)
            ══════════════════════════════════════════ */}
            {activeTab === 'quiz' && (
                <div className="tab-content">
                    {quiz.totalSessions === 0 ? (
                        <div className="empty-state">
                            <span>🐾</span>
                            <p>No quizzes taken yet. Try the Animal Quiz!</p>
                        </div>
                    ) : (
                        <div className="stats-grid">
                            <StatCard icon="🎯" label="Quizzes Taken"    value={quiz.totalSessions} color="#f5a623" />
                            <StatCard icon="📊" label="Average Score"    value={`${quiz.avgScore}%`} color="#4ecdc4" />
                            <StatCard icon="🏆" label="Best Score"       value={`${quiz.bestScore}%`} color="#34d399" />
                            <StatCard icon="💎" label="Total Points"     value={quiz.totalPoints} color="#a78bfa" />
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}