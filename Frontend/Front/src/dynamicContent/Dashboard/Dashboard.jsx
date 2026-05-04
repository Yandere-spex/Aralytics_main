import { useState, useEffect } from 'react';
import { getDashboard } from '../../services/Dashboardservice.js';
import './Dashboard.css';


// ── STAT CARD ────────────────────────────────────────────────────
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

// ── TREND CHART ───────────────────────────────────────────────────
const TrendChart = ({ data, valueKey, color, label }) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map(d => d[valueKey]), 1);
    return (
        <div className="trend-chart">
            <div className="trend-label">{label}</div>
            <div className="trend-bars">
                {data.map((d, i) => (
                    <div key={i} className="trend-bar-wrap" title={`Session ${d.session}: ${d[valueKey]}`}>
                        <div
                            className="trend-bar"
                            style={{ height: `${(d[valueKey] / max) * 100}%`, background: color }}
                        />
                        <div className="trend-tick">{d.session}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── RECENT READING ROW ────────────────────────────────────────────
const RecentReadingRow = ({ title, wpm, percentage, completedAt }) => (
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

// ── RECENT QUIZ ROW ───────────────────────────────────────────────
const RecentQuizRow = ({ item }) => (
    <div className="recent-row">
        <div className="recent-info">
            <div className="recent-title">{item.correctCount}/{item.totalQuestions} correct · {item.mode} mode</div>
            <div className="recent-date">{new Date(item.completedAt).toLocaleDateString()}</div>
        </div>
        <div className="recent-badges">
            <span className="badge quiz-score-badge">{item.score}%</span>
            <span className="badge quiz-pts-badge">+{item.pointsEarned} pts</span>
        </div>
    </div>
);

// ── DONUT RING ────────────────────────────────────────────────────
const DonutRing = ({ percentage, color, size = 100 }) => {
    const r      = 38;
    const circ   = 2 * Math.PI * r;
    const offset = circ - (Math.min(percentage, 100) / 100) * circ;
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

// ── MAIN DASHBOARD ────────────────────────────────────────────────
export default function Dashboard() {
    /*const [data, setData]           = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [activeTab, setActiveTab] = useState('reading');

    // ✅ Single useEffect only
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const result = await getDashboard();
                setData(result);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                setError('Failed to load dashboard.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <div className="dashboard-loading">
            <div className="loading-spinner" />
            <p>Loading your stats...</p>
        </div>
    );

    if (error) return (
        <div className="dashboard-empty">
            <p style={{ color: '#ff6b6b' }}>{error}</p>
        </div>
    );

    if (!data) return (
        <div className="dashboard-empty">
            <p>No data yet. Start reading or take a quiz!</p>
        </div>
    );

    const { reading, quiz } = data;
*/
const [activeTab, setActiveTab] = useState('reading');

    // TEMPORARY DEMO DATA - remove when backend is ready
    const data = {
        reading: {
            totalStoriesRead: 12,
            totalWordsRead: 18450,
            avgWPM: 187,
            avgComprehension: 74,
            bestWPM: 245,
            bestComprehension: 95,
            speedDistribution: { slow: 2, normal: 7, fast: 3 },
            comprehensionDistribution: { excellent: 5, good: 4, needsWork: 3 },
            trend: [
                { session: 1, wpm: 140, comprehension: 60 },
                { session: 2, wpm: 155, comprehension: 65 },
                { session: 3, wpm: 170, comprehension: 70 },
                { session: 4, wpm: 187, comprehension: 74 },
                { session: 5, wpm: 210, comprehension: 80 },
                { session: 6, wpm: 245, comprehension: 95 },
            ],
            recentStories: [
                { storyTitle: 'The Lion and the Mouse', wpm: 210, percentage: 85, completedAt: '2026-05-03T10:00:00Z' },
                { storyTitle: 'Journey to the Ocean',   wpm: 187, percentage: 74, completedAt: '2026-05-02T09:00:00Z' },
                { storyTitle: 'The Clever Fox',         wpm: 165, percentage: 60, completedAt: '2026-05-01T08:00:00Z' },
            ],
        },
        quiz: {
            totalSessions: 8,
            avgScore: 72,
            bestScore: 95,
            totalQuestionsAnswered: 95,
            totalCorrect: 68,
            totalWrong: 27,
            avgAccuracy: 72,
            totalPoints: 3400,
            avgTimeTaken: 145,
            streakCurrent: 3,
            weakestType: 'sci',
            difficultyBreakdown: {
                easy:   { accuracy: 90 },
                medium: { accuracy: 70 },
                hard:   { accuracy: 48 },
            },
            typeBreakdown: {
                sci:     { accuracy: 48 },
                fact:    { accuracy: 82 },
                funfact: { accuracy: 76 },
                habitat: { accuracy: 65 },
            },
            trend: [
                { session: 1, score: 55, accuracy: 55 },
                { session: 2, score: 60, accuracy: 60 },
                { session: 3, score: 68, accuracy: 68 },
                { session: 4, score: 72, accuracy: 72 },
                { session: 5, score: 80, accuracy: 80 },
                { session: 6, score: 95, accuracy: 95 },
            ],
            recentSessions: [
                { correctCount: 9, totalQuestions: 10, mode: 'easy',   score: 90, pointsEarned: 450, completedAt: '2026-05-03T11:00:00Z' },
                { correctCount: 7, totalQuestions: 10, mode: 'medium', score: 70, pointsEarned: 350, completedAt: '2026-05-02T10:00:00Z' },
                { correctCount: 5, totalQuestions: 15, mode: 'hard',   score: 33, pointsEarned: 165, completedAt: '2026-05-01T09:00:00Z' },
            ],
        },
    };

    const { reading, quiz } = data;
    return (
        <div className="dashboard">

            {/* HEADER */}
            <div className="dashboard-header">
                <h1> My Dashboard</h1>
                <p className="dashboard-sub">Track your Reading (WPS) and Comprehension</p>
            </div>

            {/* TABS */}
            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'reading' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reading')}
                >
                    WPS and Comprehension
                </button>
                <button
                    className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                    onClick={() => setActiveTab('quiz')}
                >
                    Animal Knowdlege
                </button>
            </div>

            {/* ══════════════════════════════════════
                READING TAB
            ══════════════════════════════════════ */}
            {activeTab === 'reading' && (
                <div className="tab-content">
                    {reading.totalStoriesRead === 0 ? (
                        <div className="empty-state">
                            <span>📖</span>
                            <p>No stories read yet. Start your first story!</p>
                        </div>
                    ) : (
                        <>
                            <div className="stats-grid">
                                <StatCard icon="📚" label="Stories Read"      value={reading.totalStoriesRead}                color="#4ecdc4" />
                                <StatCard icon="🔤" label="Words Read"        value={reading.totalWordsRead.toLocaleString()} color="#f5a623" />
                                <StatCard icon="⚡" label="Avg Speed"         value={`${reading.avgWPM} WPM`}                color="#a78bfa" />
                                <StatCard icon="🧠" label="Avg Comprehension" value={`${reading.avgComprehension}%`}          color="#34d399" />
                            </div>

                            <div className="section-title">Overall Performance</div>
                            <div className="donuts-row">
                                <div className="donut-wrap">
                                    <DonutRing percentage={reading.avgComprehension} color="#34d399" />
                                    <div className="donut-label">Avg Comprehension</div>
                                </div>
                                <div className="donut-wrap">
                                    <DonutRing percentage={Math.min(Math.round((reading.avgWPM / 300) * 100), 100)} color="#a78bfa" />
                                    <div className="donut-label">Reading Speed</div>
                                    <div className="donut-sub">{reading.avgWPM} / 300 WPM</div>
                                </div>
                                <div className="donut-wrap">
                                    <DonutRing percentage={Math.min(Math.round((reading.totalStoriesRead / 20) * 100), 100)} color="#f5a623" />
                                    <div className="donut-label">Stories Goal</div>
                                    <div className="donut-sub">{reading.totalStoriesRead} / 20</div>
                                </div>
                            </div>

                            <div className="section-title">Reading Speed Distribution</div>
                            <div className="dist-section">
                                <ProgressBar label="🐢 Slow (< 150 WPM)"     value={reading.speedDistribution.slow}   max={reading.totalStoriesRead} color="#ff6b6b" />
                                <ProgressBar label="✅ Normal (150–250 WPM)"  value={reading.speedDistribution.normal} max={reading.totalStoriesRead} color="#34d399" />
                                <ProgressBar label="⚡ Fast (> 250 WPM)"      value={reading.speedDistribution.fast}   max={reading.totalStoriesRead} color="#a78bfa" />
                            </div>

                            <div className="section-title">Comprehension Distribution</div>
                            <div className="dist-section">
                                <ProgressBar label="🌟 Excellent (≥ 80%)"  value={reading.comprehensionDistribution.excellent}  max={reading.totalStoriesRead} color="#34d399" />
                                <ProgressBar label="👍 Good (60–79%)"      value={reading.comprehensionDistribution.good}       max={reading.totalStoriesRead} color="#f5a623" />
                                <ProgressBar label="📝 Needs Work (< 60%)" value={reading.comprehensionDistribution.needsWork}  max={reading.totalStoriesRead} color="#ff6b6b" />
                            </div>

                            {reading.trend && reading.trend.length > 1 && (
                                <>
                                    <div className="section-title">Progress Over Sessions</div>
                                    <div className="charts-row">
                                        <TrendChart data={reading.trend} valueKey="wpm"           color="#a78bfa" label="WPM per Session" />
                                        <TrendChart data={reading.trend} valueKey="comprehension" color="#34d399" label="Comprehension %" />
                                    </div>
                                </>
                            )}

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

                            <div className="section-title">Recent Stories</div>
                            <div className="recent-list">
                                {reading.recentStories.map((s, i) => (
                                    <RecentReadingRow
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

            {/* ══════════════════════════════════════
    QUIZ TAB
══════════════════════════════════════ */}
{activeTab === 'quiz' && (
    <div className="tab-content">
        {quiz.totalSessions === 0 ? (
            <div className="empty-state">
                <span>🐾</span>
                <p>No quizzes taken yet. Try the Animal Quiz!</p>
            </div>
        ) : (
            <>
                {/* STAT CARDS */}
                <div className="stats-grid">
                    <StatCard icon="🎯" label="Quizzes Taken"         value={quiz.totalSessions}                  color="#f5a623" />
                    <StatCard icon="📊" label="Avg Accuracy"          value={`${quiz.avgScore}%`}                 color="#4ecdc4" />
                    <StatCard icon="🏆" label="Best Accuracy"         value={`${quiz.bestScore}%`}                color="#34d399" />
                    <StatCard icon="❓" label="Questions Answered"    value={quiz.totalQuestionsAnswered}         color="#a78bfa" />
                    <StatCard icon="✅" label="Total Correct"         value={quiz.totalCorrect}                   color="#34d399" />
                    <StatCard icon="❌" label="Total Wrong"           value={quiz.totalWrong}                     color="#ff6b6b" />
                    <StatCard icon="⚡" label="Avg Accuracy"          value={`${quiz.avgAccuracy}%`}              color="#4ecdc4" />
                    <StatCard icon="💎" label="Total Points"          value={quiz.totalPoints?.toLocaleString()}  color="#f5a623" />
                </div>

                {/* OVERALL PERFORMANCE */}
                <div className="section-title">Overall Performance</div>
                <div className="donuts-row">
                    <div className="donut-wrap">
                        <DonutRing percentage={quiz.avgScore}  color="#4ecdc4" />
                        <div className="donut-label">Avg Score</div>
                    </div>
                    <div className="donut-wrap">
                        <DonutRing percentage={quiz.bestScore} color="#34d399" />
                        <div className="donut-label">Best Score</div>
                    </div>
                    <div className="donut-wrap">
                        <DonutRing percentage={Math.min(Math.round((quiz.totalSessions / 20) * 100), 100)} color="#f5a623" />
                        <div className="donut-label">Quiz Goal</div>
                        <div className="donut-sub">{quiz.totalSessions} / 20</div>
                    </div>
                </div>

                {/* ACCURACY BY DIFFICULTY */}
                <div className="section-title">Accuracy by Difficulty</div>
                <div className="dist-section">
                    <ProgressBar label="🌿 Easy"   value={quiz.difficultyBreakdown?.easy?.accuracy   ?? 0} max={100} color="#4ade80" />
                    <ProgressBar label="🦁 Medium" value={quiz.difficultyBreakdown?.medium?.accuracy ?? 0} max={100} color="#facc15" />
                    <ProgressBar label="🦅 Hard"   value={quiz.difficultyBreakdown?.hard?.accuracy   ?? 0} max={100} color="#f87171" />
                </div>

                {/* ACCURACY BY TYPE */}
                <div className="section-title">Accuracy by Question Type</div>
                <div className="dist-section">
                    <ProgressBar label="🔬 Sci"      value={quiz.typeBreakdown?.sci?.accuracy      ?? 0} max={100} color="#22d3ee" />
                    <ProgressBar label="📖 Fact"     value={quiz.typeBreakdown?.fact?.accuracy     ?? 0} max={100} color="#a78bfa" />
                    <ProgressBar label="🎉 Fun Fact" value={quiz.typeBreakdown?.funfact?.accuracy  ?? 0} max={100} color="#f5a623" />
                    <ProgressBar label="🌍 Habitat"  value={quiz.typeBreakdown?.habitat?.accuracy  ?? 0} max={100} color="#34d399" />
                </div>

                {/* SCORE TREND */}
                {quiz.trend && quiz.trend.length > 1 && (
                    <>
                        <div className="section-title">Score Trend</div>
                        <div className="charts-row">
                            <TrendChart data={quiz.trend} valueKey="score"    color="#4ecdc4" label="Score % per Session" />
                            <TrendChart data={quiz.trend} valueKey="accuracy" color="#f5a623" label="Accuracy per Session" />
                        </div>
                    </>
                )}

                {/* MORE STATS */}
                <div className="section-title">More Stats</div>
                <div className="dist-section">
                    <div className="info-row">
                        <span>⏱ Avg Time Per Quiz</span>
                        <span>{quiz.avgTimeTaken}s</span>
                    </div>
                    <div className="info-row">
                        <span>🔥 Current Streak</span>
                        <span>{quiz.streakCurrent} day{quiz.streakCurrent !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="info-row">
                        <span>🐾 Weakest Animal Type</span>
                        <span>{quiz.weakestType ?? 'N/A'}</span>
                    </div>
                </div>

                {/* RECENT QUIZZES */}
                <div className="section-title">Recent Quizzes</div>
                <div className="recent-list">
                    {quiz.recentSessions.map((s, i) => (
                        <RecentQuizRow key={i} item={s} />
                    ))}
                </div>
            </>
        )}
    </div>
)}

        </div>
    );
}