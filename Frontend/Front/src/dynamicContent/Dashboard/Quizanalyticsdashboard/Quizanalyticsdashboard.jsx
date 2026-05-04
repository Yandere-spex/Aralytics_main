import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar } from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USER = { name: "Alex Rivera", avatar: "🦁", totalPoints: 4820 };

const MOCK_STATS = {
  totalSessions: 14,
  avgScore: 73.4,
  bestScore: 96,
  worstScore: 40,
  totalPoints: 4820,
  totalAnswered: 70,
  totalCorrect: 51,
  avgDuration: 138,
  passCount: 10,
  passRate: 71.4,
  overallAccuracy: 72.9,
  streakCurrent: 4,
};

const MOCK_TREND = [
  { attemptNumber: 1,  scorePercent: 40, totalPoints: 160, durationSeconds: 180, isPassed: false },
  { attemptNumber: 2,  scorePercent: 60, totalPoints: 240, durationSeconds: 165, isPassed: false },
  { attemptNumber: 3,  scorePercent: 55, totalPoints: 220, durationSeconds: 172, isPassed: false },
  { attemptNumber: 4,  scorePercent: 70, totalPoints: 280, durationSeconds: 148, isPassed: true  },
  { attemptNumber: 5,  scorePercent: 68, totalPoints: 272, durationSeconds: 155, isPassed: false },
  { attemptNumber: 6,  scorePercent: 75, totalPoints: 300, durationSeconds: 140, isPassed: true  },
  { attemptNumber: 7,  scorePercent: 80, totalPoints: 320, durationSeconds: 132, isPassed: true  },
  { attemptNumber: 8,  scorePercent: 72, totalPoints: 288, durationSeconds: 145, isPassed: true  },
  { attemptNumber: 9,  scorePercent: 85, totalPoints: 340, durationSeconds: 120, isPassed: true  },
  { attemptNumber: 10, scorePercent: 78, totalPoints: 312, durationSeconds: 138, isPassed: true  },
  { attemptNumber: 11, scorePercent: 82, totalPoints: 328, durationSeconds: 125, isPassed: true  },
  { attemptNumber: 12, scorePercent: 90, totalPoints: 360, durationSeconds: 110, isPassed: true  },
  { attemptNumber: 13, scorePercent: 88, totalPoints: 352, durationSeconds: 115, isPassed: true  },
  { attemptNumber: 14, scorePercent: 96, totalPoints: 384, durationSeconds: 98,  isPassed: true  },
];

const MOCK_MISSED = [
  { _id: "Chameleon", timesMissed: 11 },
  { _id: "Platypus",  timesMissed: 9  },
  { _id: "Axolotl",   timesMissed: 8  },
  { _id: "Narwhal",   timesMissed: 7  },
  { _id: "Tapir",     timesMissed: 6  },
  { _id: "Okapi",     timesMissed: 5  },
];

const MOCK_DIFFICULTY = {
  easy:   { total: 35, correct: 29 },
  medium: { total: 25, correct: 16 },
  hard:   { total: 10, correct: 6  },
};

const MOCK_RECENT = [
  { attemptNumber: 14, scorePercent: 96, totalPoints: 384, durationSeconds: 98,  isPassed: true,  completedAt: "2024-06-14T10:02:00Z", difficulty: "mixed" },
  { attemptNumber: 13, scorePercent: 88, totalPoints: 352, durationSeconds: 115, isPassed: true,  completedAt: "2024-06-13T09:30:00Z", difficulty: "hard"  },
  { attemptNumber: 12, scorePercent: 90, totalPoints: 360, durationSeconds: 110, isPassed: true,  completedAt: "2024-06-12T14:20:00Z", difficulty: "easy"  },
  { attemptNumber: 11, scorePercent: 82, totalPoints: 328, durationSeconds: 125, isPassed: true,  completedAt: "2024-06-11T11:00:00Z", difficulty: "mixed" },
  { attemptNumber: 10, scorePercent: 78, totalPoints: 312, durationSeconds: 138, isPassed: true,  completedAt: "2024-06-10T08:45:00Z", difficulty: "medium"},
];

const MOCK_LETTER = [
  { letter: "A", total: 10, correct: 8 },
  { letter: "B", total: 8,  correct: 5 },
  { letter: "C", total: 12, correct: 9 },
  { letter: "D", total: 7,  correct: 4 },
  { letter: "E", total: 6,  correct: 5 },
  { letter: "F", total: 9,  correct: 6 },
  { letter: "G", total: 5,  correct: 3 },
  { letter: "H", total: 7,  correct: 6 },
];

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg:      "#0a0c10",
  surface: "#111318",
  card:    "#161a22",
  border:  "#1e2430",
  text:    "#e8ecf4",
  muted:   "#5a6480",
  accent:  "#4ade80",
  amber:   "#fbbf24",
  coral:   "#f87171",
  sky:     "#38bdf8",
  purple:  "#a78bfa",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, d = 1) => typeof n === "number" ? n.toFixed(d) : n;
const fmtTime = (s) => s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ value, suffix = "", duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = parseFloat(value);
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(+(from + (to - from) * ease).toFixed(1));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);
  return <>{display}{suffix}</>;
}

// ─── Radial Progress ──────────────────────────────────────────────────────────
function RadialProgress({ value, color, size = 80, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
    </svg>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
      padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6,
      borderLeft: `3px solid ${accent}`, transition: "transform .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.text, fontFamily: "'Syne', sans-serif" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: accent }}>{sub}</div>}
    </div>
  );
}

// ─── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "28px 0 14px" }}>
      <div style={{ width: 3, height: 18, background: C.accent, borderRadius: 2 }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {children}
      </span>
    </div>
  );
}

// ─── Difficulty Bar ───────────────────────────────────────────────────────────
function DiffBar({ label, data, color }) {
  const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: C.text, textTransform: "capitalize" }}>{label}</span>
        <span style={{ fontSize: 13, color }}>
          {data.correct}/{data.total} &nbsp;·&nbsp; {pct}%
        </span>
      </div>
      <div style={{ height: 6, background: C.border, borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: color, borderRadius: 4,
          transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

// ─── Recent Row ───────────────────────────────────────────────────────────────
function RecentRow({ item }) {
  const bg = item.isPassed ? "#0f2a1a" : "#2a0f0f";
  const tag = item.isPassed ? { text: "PASSED", color: C.accent } : { text: "FAILED", color: C.coral };
  return (
    <div style={{
      background: bg, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, marginBottom: 8,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: C.card,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 700, color: C.text,
      }}>#{item.attemptNumber}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'Syne', sans-serif" }}>
            {item.scorePercent}%
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: tag.color,
            background: tag.color + "22", padding: "2px 8px", borderRadius: 20,
          }}>{tag.text}</span>
          <span style={{
            fontSize: 10, color: C.muted,
            background: C.border, padding: "2px 8px", borderRadius: 20, textTransform: "capitalize",
          }}>{item.difficulty}</span>
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
          ⏱ {fmtTime(item.durationSeconds)} &nbsp;·&nbsp; 💎 {item.totalPoints} pts &nbsp;·&nbsp; {timeAgo(item.completedAt)}
        </div>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: C.muted, marginBottom: 4 }}>Attempt #{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}{p.name === "Score" ? "%" : " pts"}</b></div>
      ))}
    </div>
  );
}

// ─── Letter Heatmap ───────────────────────────────────────────────────────────
function LetterHeatmap({ data }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {data.map(({ letter, total, correct }) => {
        const pct = total > 0 ? correct / total : 0;
        const alpha = 0.15 + pct * 0.85;
        return (
          <div key={letter} title={`${letter}: ${correct}/${total}`}
            style={{
              width: 48, height: 48, borderRadius: 10, border: `1px solid ${C.border}`,
              background: `rgba(74, 222, 128, ${alpha})`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              cursor: "default", transition: "transform .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: pct > 0.5 ? "#000" : C.text }}>{letter}</span>
            <span style={{ fontSize: 9, color: pct > 0.5 ? "#0008" : C.muted }}>{Math.round(pct * 100)}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function QuizAnalyticsDashboard() {
    const [tab, setTab] = useState("overview");
    const stats   = MOCK_STATS;
    const trend   = MOCK_TREND;
    const missed  = MOCK_MISSED;
    const diff    = MOCK_DIFFICULTY;
    const recent  = MOCK_RECENT;
    const letters = MOCK_LETTER;

    const tabs = [
        { id: "overview",  label: "Overview"   },
        { id: "history",   label: "History"    },
        { id: "analytics", label: "Analytics"  },
    ];

    return (
        <div style={{
        minHeight: "100vh", background: C.bg, color: C.text,
        fontFamily: "'DM Sans', system-ui, sans-serif", padding: "0 0 60px",
        }}>
        {/* Google Fonts */}
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-track { background: ${C.bg}; }
            ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        `}</style>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{
            background: C.surface, borderBottom: `1px solid ${C.border}`,
            padding: "20px 32px", display: "flex", alignItems: "center", gap: 16,
            position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)",
        }}>
            <div style={{ fontSize: 32 }}>🦎</div>
            <div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>
                Animal Quiz
            </div>
            <div style={{ fontSize: 12, color: C.muted }}>Analytics Dashboard</div>
            </div>
            <div style={{ flex: 1 }} />

            {/* User badge */}
            <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 40,
            padding: "6px 16px 6px 8px",
            }}>
            <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "#1e2a14",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>{MOCK_USER.avatar}</div>
            <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{MOCK_USER.name}</div>
                <div style={{ fontSize: 11, color: C.accent }}>💎 {MOCK_USER.totalPoints.toLocaleString()} pts</div>
            </div>
            </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

            {/* ── Tabs ─────────────────────────────────────────────────────────── */}
            <div style={{ display: "flex", gap: 4, marginTop: 28, marginBottom: 4 }}>
            {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                background: tab === t.id ? C.accent : C.card,
                color: tab === t.id ? "#000" : C.muted,
                transition: "all .2s",
                }}>{t.label}</button>
            ))}
            </div>

            {/* ══ OVERVIEW TAB ══════════════════════════════════════════════════ */}
            {tab === "overview" && (
            <>
                {/* Stat Cards */}
                <SectionTitle>Performance Summary</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <StatCard icon="🎯" label="Quizzes Taken"   value={<Counter value={stats.totalSessions} />}   accent={C.amber} />
                <StatCard icon="📊" label="Average Score"   value={<><Counter value={stats.avgScore} />%</>}   accent={C.sky}   />
                <StatCard icon="🏆" label="Best Score"      value={`${stats.bestScore}%`}                       accent={C.accent}/>
                <StatCard icon="💎" label="Total Points"    value={<Counter value={stats.totalPoints} duration={1500} />} accent={C.purple} />
                <StatCard icon="🔥" label="Current Streak"  value={`${stats.streakCurrent}d`}                   accent={C.coral} />
                <StatCard icon="✅" label="Pass Rate"       value={<><Counter value={stats.passRate} />%</>}    accent={C.accent} sub={`${stats.passCount} / ${stats.totalSessions} quizzes`} />
                </div>

                {/* Donut rings */}
                <SectionTitle>Accuracy Rings</SectionTitle>
                <div style={{
                display: "flex", gap: 24, flexWrap: "wrap",
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24,
                }}>
                {[
                    { label: "Avg Score",      val: stats.avgScore,        color: C.sky    },
                    { label: "Best Score",     val: stats.bestScore,       color: C.accent },
                    { label: "Overall Acc.",   val: stats.overallAccuracy, color: C.purple },
                    { label: "Pass Rate",      val: stats.passRate,        color: C.amber  },
                ].map(({ label, val, color }) => (
                    <div key={label} style={{ textAlign: "center", flex: "1 1 120px" }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <RadialProgress value={val} color={color} size={90} stroke={8} />
                        <div style={{
                        position: "absolute", inset: 0, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color,
                        }}>{fmt(val)}%</div>
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>{label}</div>
                    </div>
                ))}
                </div>

                {/* Difficulty Breakdown */}
                <SectionTitle>Difficulty Breakdown</SectionTitle>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <DiffBar label="Easy"   data={diff.easy}   color={C.accent} />
                <DiffBar label="Medium" data={diff.medium} color={C.amber}  />
                <DiffBar label="Hard"   data={diff.hard}   color={C.coral}  />
                </div>

                {/* Score Trend */}
                <SectionTitle>Score Trend</SectionTitle>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 8px 12px" }}>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trend}>
                    <XAxis dataKey="attemptNumber" stroke={C.border} tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} label={{ value: "Attempt #", position: "insideBottom", offset: -2, fill: C.muted, fontSize: 11 }} />
                    <YAxis domain={[0, 100]} stroke={C.border} tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Line type="monotone" dataKey="scorePercent" name="Score" stroke={C.sky} strokeWidth={2.5}
                        dot={(p) => <circle key={p.key} cx={p.cx} cy={p.cy} r={4}
                        fill={p.payload.isPassed ? C.accent : C.coral} stroke="none" />}
                        activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: C.accent }}>● Passed</span>
                    <span style={{ fontSize: 11, color: C.coral }}>● Failed</span>
                </div>
                </div>
            </>
            )}

            {/* ══ HISTORY TAB ═══════════════════════════════════════════════════ */}
            {tab === "history" && (
            <>
                <SectionTitle>Recent Sessions</SectionTitle>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
                {recent.map((s, i) => <RecentRow key={i} item={s} />)}
                </div>

                <SectionTitle>Points Per Session</SectionTitle>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 8px 12px" }}>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={trend}>
                    <XAxis dataKey="attemptNumber" stroke={C.border} tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                    <YAxis stroke={C.border} tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                    <Tooltip content={<ChartTip />} />
                    <Bar dataKey="totalPoints" name="Points" radius={[4, 4, 0, 0]}>
                        {trend.map((e, i) => <Cell key={i} fill={e.isPassed ? C.accent : C.coral} fillOpacity={0.85} />)}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
                </div>

                <SectionTitle>Time Per Session (seconds)</SectionTitle>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 8px 12px" }}>
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={trend}>
                    <XAxis dataKey="attemptNumber" stroke={C.border} tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                    <YAxis stroke={C.border} tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                    <Tooltip content={({ active, payload, label }) =>
                        active && payload?.length
                        ? <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                            <div style={{ color: C.muted }}>Attempt #{label}</div>
                            <div style={{ color: C.amber }}>Time: <b>{fmtTime(payload[0].value)}</b></div>
                            </div>
                        : null
                    } />
                    <Line type="monotone" dataKey="durationSeconds" stroke={C.amber} strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </>
            )}

            {/* ══ ANALYTICS TAB ════════════════════════════════════════════════ */}
            {tab === "analytics" && (
            <>
                <SectionTitle>Most Missed Animals</SectionTitle>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                {missed.map((m, i) => {
                    const maxMissed = missed[0].timesMissed;
                    const pct = (m.timesMissed / maxMissed) * 100;
                    return (
                    <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: C.text }}>🐾 {m._id}</span>
                        <span style={{ fontSize: 13, color: C.coral }}>{m.timesMissed} misses</span>
                        </div>
                        <div style={{ height: 7, background: C.border, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                            height: "100%", width: `${pct}%`, borderRadius: 4,
                            background: `linear-gradient(90deg, ${C.coral}, ${C.amber})`,
                            transition: "width 1s ease",
                        }} />
                        </div>
                    </div>
                    );
                })}
                </div>

                <SectionTitle>Letter Performance Heatmap</SectionTitle>
                <div style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: 20,
                }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
                    Colour intensity = accuracy. Hover for detail.
                </div>
                <LetterHeatmap data={letters} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: C.muted }}>Low</div>
                    <div style={{
                    height: 8, width: 120, borderRadius: 4,
                    background: `linear-gradient(90deg, rgba(74,222,128,0.15), rgba(74,222,128,1))`,
                    }} />
                    <div style={{ fontSize: 11, color: C.muted }}>High</div>
                </div>
                </div>

                <SectionTitle>Key Stats</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <StatCard icon="❓" label="Total Answered"  value={stats.totalAnswered}                    accent={C.sky}    />
                <StatCard icon="✅" label="Total Correct"   value={stats.totalCorrect}                     accent={C.accent} />
                <StatCard icon="❌" label="Total Wrong"     value={stats.totalAnswered - stats.totalCorrect} accent={C.coral}  />
                <StatCard icon="⏱" label="Avg Quiz Time"   value={fmtTime(stats.avgDuration)}             accent={C.amber}  />
                </div>
            </>
            )}
        </div>
        </div>
    );
}