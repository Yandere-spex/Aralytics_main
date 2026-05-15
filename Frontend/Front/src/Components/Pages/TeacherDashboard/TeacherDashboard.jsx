    import { useState, useEffect } from "react";

    /* ─── Inline styles (no external CSS file needed) ─── */
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@400;500;600;700;800&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
        --bg:          #0c0f1a;
        --bg2:         #111523;
        --bg3:         #181c2e;
        --border:      rgba(255,255,255,0.07);
        --text:        #e2e8f0;
        --muted:       #64748b;
        --accent:      #818cf8;
        --green:       #34d399;
        --amber:       #fbbf24;
        --red:         #f87171;
        --pink:        #e879f9;
        --blue:        #60a5fa;
        --font:        'Outfit', sans-serif;
        --mono:        'DM Mono', monospace;
        --radius:      12px;
        --radius-sm:   8px;
        --shadow:      0 4px 24px rgba(0,0,0,0.4);
    }

    body { background: var(--bg); color: var(--text); font-family: var(--font); }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: #2d3453; border-radius: 3px; }

    /* ── Wrap ── */
    .td-wrap {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem 1.5rem 4rem;
        animation: fadeUp 0.4s ease both;
    }
    @keyframes fadeUp {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0); }
    }

    /* ── Header ── */
    .td-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }
    .td-title {
        font-size: 1.75rem;
        font-weight: 800;
        background: linear-gradient(135deg, #818cf8, #e879f9);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        line-height: 1.2;
    }
    .td-title i { -webkit-text-fill-color: #818cf8; font-size: 1.4rem; }
    .td-sub { color: var(--muted); font-size: 0.85rem; margin-top: 0.25rem; }

    /* ── Class code panel ── */
    .td-code-panel {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.4rem;
    }
    .td-code-label {
        font-size: 0.72rem;
        color: var(--muted);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }
    .td-code-display {
        font-family: var(--mono);
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: var(--pink);
        background: rgba(232,121,249,0.08);
        border: 1.5px solid rgba(232,121,249,0.25);
        padding: 0.3rem 0.9rem;
        border-radius: var(--radius-sm);
    }
    .td-code-copy {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        background: rgba(232,121,249,0.1);
        border: 1px solid rgba(232,121,249,0.25);
        color: var(--pink);
        padding: 0.3rem 0.8rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.78rem;
        font-weight: 600;
        font-family: var(--font);
        transition: background 0.2s, transform 0.1s;
    }
    .td-code-copy:hover { background: rgba(232,121,249,0.2); transform: translateY(-1px); }
    .td-code-copy:active { transform: translateY(0); }
    .td-code-hint { font-size: 0.68rem; color: #475569; }

    /* ── Tabs ── */
    .td-tabs {
        display: flex;
        gap: 0.35rem;
        background: var(--bg2);
        border: 1px solid var(--border);
        padding: 0.35rem;
        border-radius: var(--radius);
        width: fit-content;
        margin-bottom: 1.5rem;
    }
    .td-tab {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 1.1rem;
        border-radius: var(--radius-sm);
        border: none;
        background: transparent;
        color: var(--muted);
        font-size: 0.83rem;
        font-weight: 600;
        font-family: var(--font);
        cursor: pointer;
        transition: all 0.2s;
    }
    .td-tab:hover { color: var(--text); background: rgba(255,255,255,0.04); }
    .td-tab.active {
        background: var(--bg3);
        color: var(--accent);
        box-shadow: 0 1px 8px rgba(0,0,0,0.3);
        border: 1px solid var(--border);
    }
    .td-tab i { font-size: 0.8rem; }

    /* ── Panel ── */
    .td-panel {
        background: var(--bg2);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.25rem;
        transition: border-color 0.2s;
    }
    .td-panel:hover { border-color: rgba(255,255,255,0.11); }
    .td-panel-title {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.07em;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.45rem;
    }
    .td-panel-title i { color: var(--accent); }

    /* ── Stat cards ── */
    .td-stats-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0.85rem;
        margin-bottom: 1.25rem;
    }
    .td-stat-card {
        background: var(--bg2);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.1rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        position: relative;
        overflow: hidden;
        transition: transform 0.2s, border-color 0.2s;
    }
    .td-stat-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, var(--accent, #818cf8) 0%, transparent 60%);
        opacity: 0.04;
        pointer-events: none;
    }
    .td-stat-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.13); }
    .td-stat-icon {
        font-size: 1rem;
        color: var(--accent);
        margin-bottom: 0.3rem;
    }
    .td-stat-value {
        font-size: 1.6rem;
        font-weight: 800;
        color: var(--text);
        line-height: 1;
    }
    .td-stat-label {
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }
    .td-stat-sub { font-size: 0.68rem; color: #374151; }

    /* ── Two-col layout ── */
    .td-two-col {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 1rem;
    }
    .td-col-right { display: flex; flex-direction: column; gap: 1rem; }

    /* ── Three-col ── */
    .td-three-col {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    /* ── Progress bar ── */
    .td-progress-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-bottom: 0.55rem;
    }
    .td-progress-label {
        font-size: 0.72rem;
        color: var(--muted);
        width: 150px;
        flex-shrink: 0;
        white-space: nowrap;
    }
    .td-progress-track {
        flex: 1;
        height: 6px;
        background: rgba(255,255,255,0.06);
        border-radius: 99px;
        overflow: hidden;
    }
    .td-progress-fill {
        height: 100%;
        border-radius: 99px;
        transition: width 0.6s cubic-bezier(.22,1,.36,1);
    }
    .td-progress-val {
        font-size: 0.72rem;
        color: var(--muted);
        font-family: var(--mono);
        width: 18px;
        text-align: right;
    }

    /* ── Sparkline ── */
    .td-spark-row {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        height: 64px;
        padding: 0 0 4px;
    }
    .td-spark-bar {
        flex: 1;
        min-width: 6px;
        border-radius: 4px 4px 0 0;
        opacity: 0.85;
        transition: opacity 0.2s;
        cursor: default;
    }
    .td-spark-bar:hover { opacity: 1; }
    .td-spark-legend { font-size: 0.68rem; color: #374151; margin-top: 0.5rem; text-align: right; }

    /* ── Attention flags ── */
    .td-flag-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.55rem 0;
        border-bottom: 1px solid var(--border);
    }
    .td-flag-row:last-child { border-bottom: none; }
    .td-flag-dot {
        width: 8px; height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
    }
    .td-flag-dot.needs-attention { background: var(--amber); box-shadow: 0 0 6px rgba(251,191,36,.5); }
    .td-flag-dot.at-risk { background: var(--red); box-shadow: 0 0 6px rgba(248,113,113,.5); }
    .td-flag-name { font-size: 0.82rem; font-weight: 600; }
    .td-flag-desc { font-size: 0.78rem; color: var(--muted); }
    .td-no-data {
        font-size: 0.8rem;
        color: var(--muted);
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    /* ── Students topbar ── */
    .td-students-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        gap: 0.75rem;
    }
    .td-filters { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .td-filter-btn {
        padding: 0.35rem 0.85rem;
        border-radius: 99px;
        border: 1px solid var(--border);
        background: transparent;
        color: var(--muted);
        font-size: 0.75rem;
        font-weight: 600;
        font-family: var(--font);
        cursor: pointer;
        transition: all 0.18s;
    }
    .td-filter-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }
    .td-filter-btn.active { background: rgba(129,140,248,0.15); color: var(--accent); border-color: rgba(129,140,248,0.35); }
    .td-filter-btn.success.active { background: rgba(52,211,153,0.12); color: var(--green); border-color: rgba(52,211,153,0.3); }
    .td-filter-btn.warn.active    { background: rgba(251,191,36,0.12); color: var(--amber); border-color: rgba(251,191,36,0.3); }
    .td-filter-btn.danger.active  { background: rgba(248,113,113,0.12); color: var(--red);  border-color: rgba(248,113,113,0.3); }
    .td-search {
        padding: 0.4rem 0.9rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--bg3);
        color: var(--text);
        font-size: 0.8rem;
        font-family: var(--font);
        outline: none;
        width: 200px;
        transition: border-color 0.2s;
    }
    .td-search:focus { border-color: var(--accent); }

    /* ── Roster header ── */
    .td-roster-header {
        display: grid;
        grid-template-columns: 40px 1fr 72px 120px 80px 70px 90px 90px 24px;
        gap: 0.5rem;
        padding: 0 0.75rem 0.5rem;
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: var(--muted);
        border-bottom: 1px solid var(--border);
        margin-bottom: 0.5rem;
    }
    .td-col { text-align: right; }

    /* ── Student card ── */
    .td-student-card {
        border: 1px solid var(--border);
        border-radius: var(--radius);
        margin-bottom: 0.5rem;
        overflow: hidden;
        transition: border-color 0.2s;
    }
    .td-student-card:hover { border-color: rgba(255,255,255,0.13); }
    .td-student-card.expanded { border-color: rgba(129,140,248,0.35); }
    .td-roster-row {
        display: grid;
        grid-template-columns: 40px 1fr 72px 120px 80px 70px 90px 90px 24px;
        gap: 0.5rem;
        align-items: center;
        padding: 0.7rem 0.75rem;
        cursor: pointer;
        background: var(--bg2);
        transition: background 0.15s;
    }
    .td-roster-row:hover { background: var(--bg3); }

    /* ── Avatar ── */
    .td-avatar {
        width: 36px; height: 36px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.72rem;
        font-weight: 800;
        flex-shrink: 0;
    }
    .td-avatar.sm { width: 28px; height: 28px; border-radius: 8px; font-size: 0.65rem; }

    .td-student-name { font-size: 0.85rem; font-weight: 600; }
    .td-student-meta { font-size: 0.72rem; color: var(--muted); }

    .td-chevron {
        color: var(--muted);
        font-size: 0.7rem;
        transition: transform 0.25s;
        justify-self: center;
    }
    .td-chevron.open { transform: rotate(180deg); }

    .td-status-dot {
        width: 7px; height: 7px;
        border-radius: 50%;
        display: none;
    }

    /* ── Student detail expand ── */
    .td-student-detail {
        background: var(--bg3);
        border-top: 1px solid var(--border);
        padding: 1rem 1.25rem;
        animation: slideDown 0.2s ease;
    }
    @keyframes slideDown {
        from { opacity:0; transform:translateY(-8px); }
        to   { opacity:1; transform:translateY(0); }
    }

    .td-flag-strip {
        display: flex;
        gap: 0.4rem;
        flex-wrap: wrap;
        margin-bottom: 0.85rem;
    }
    .td-flag-chip {
        font-size: 0.72rem;
        font-weight: 600;
        padding: 0.2rem 0.6rem;
        border-radius: 99px;
        background: rgba(251,191,36,0.1);
        border: 1px solid rgba(251,191,36,0.25);
        color: var(--amber);
    }
    .td-flag-chip.danger {
        background: rgba(248,113,113,0.1);
        border-color: rgba(248,113,113,0.25);
        color: var(--red);
    }

    .td-detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    .td-detail-panel {
        background: var(--bg2);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.9rem;
    }
    .td-detail-title {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: var(--muted);
        margin-bottom: 0.75rem;
    }
    .td-detail-best {
        font-size: 0.75rem;
        color: var(--muted);
        margin-top: 0.5rem;
    }
    .td-detail-best strong { color: var(--text); }

    /* ── Stories list ── */
    .td-stories-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .td-story-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border);
    }
    .td-story-row:last-child { border-bottom: none; }
    .td-story-title { flex: 1; font-size: 0.8rem; font-weight: 500; }
    .td-story-date { font-size: 0.7rem; color: var(--muted); }
    .td-story-badges { display: flex; gap: 0.35rem; }
    .td-sbadge {
        font-size: 0.68rem;
        font-weight: 700;
        font-family: var(--mono);
        padding: 0.15rem 0.45rem;
        border-radius: 5px;
    }
    .td-sbadge.wpm { background: rgba(129,140,248,0.15); color: var(--accent); }
    .td-sbadge.comp.comp-good { background: rgba(52,211,153,0.15); color: var(--green); }
    .td-sbadge.comp.comp-warn { background: rgba(251,191,36,0.15); color: var(--amber); }
    .td-sbadge.comp.comp-danger { background: rgba(248,113,113,0.15); color: var(--red); }

    /* ── Expand title ── */
    .td-expand-title {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--muted);
        margin: 1rem 0 0.5rem;
    }

    /* ── Milestones ── */
    .td-milestone-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .td-milestone {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.3rem 0.65rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        transition: all 0.2s;
    }
    .td-milestone.achieved {
        background: rgba(52,211,153,0.12);
        border: 1px solid rgba(52,211,153,0.3);
        color: var(--green);
    }
    .td-milestone.locked {
        background: rgba(75,85,99,0.12);
        border: 1px solid rgba(75,85,99,0.25);
        color: #475569;
        opacity: 0.7;
    }
    .td-milestone-icon { font-size: 0.9rem; }
    .td-milestone-student {
        border-bottom: 1px solid var(--border);
        padding: 1rem 0;
    }
    .td-milestone-student:last-child { border-bottom: none; }
    .td-milestone-student-header {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        margin-bottom: 0.6rem;
    }

    /* ── Badges ── */
    .td-badge {
        font-size: 0.68rem;
        font-weight: 700;
        padding: 0.2rem 0.55rem;
        border-radius: 99px;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        white-space: nowrap;
    }
    .badge-green  { background: rgba(52,211,153,0.12); color: var(--green); border: 1px solid rgba(52,211,153,0.3); }
    .badge-amber  { background: rgba(251,191,36,0.12); color: var(--amber); border: 1px solid rgba(251,191,36,0.3); }
    .badge-red    { background: rgba(248,113,113,0.12); color: var(--red); border: 1px solid rgba(248,113,113,0.3); }
    .badge-gray   { background: rgba(100,116,139,0.12); color: var(--muted); border: 1px solid rgba(100,116,139,0.25); }
    .badge-purple { background: rgba(129,140,248,0.12); color: var(--accent); border: 1px solid rgba(129,140,248,0.3); }
    .badge-pink   { background: rgba(232,121,249,0.12); color: var(--pink); border: 1px solid rgba(232,121,249,0.3); }

    /* ── Leaderboard ── */
    .td-rank { font-family: var(--mono); font-size: 0.8rem; font-weight: 700; color: var(--muted); width: 26px; }
    .td-leader-row {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.6rem 0;
        border-bottom: 1px solid var(--border);
    }
    .td-leader-row:last-child { border-bottom: none; }
    .td-leader-row > span:not(.td-rank):not(.td-badge) { flex: 1; font-size: 0.83rem; }

    /* ── Loading / empty ── */
    .td-loading, .td-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        min-height: 200px;
        color: var(--muted);
    }
    .td-spinner {
        width: 36px; height: 36px;
        border: 3px solid var(--border);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 1100px) {
        .td-stats-grid { grid-template-columns: repeat(3, 1fr); }
        .td-two-col { grid-template-columns: 1fr; }
        .td-roster-header,
        .td-roster-row { grid-template-columns: 40px 1fr 72px 90px 72px 60px 80px 80px 24px; }
    }
    @media (max-width: 760px) {
        .td-stats-grid { grid-template-columns: repeat(2, 1fr); }
        .td-three-col  { grid-template-columns: 1fr; }
        .td-detail-grid { grid-template-columns: 1fr; }
        .td-tabs { flex-wrap: wrap; width: 100%; }
        .td-roster-header { display: none; }
        .td-roster-row { grid-template-columns: 40px 1fr auto auto; }
        .td-col:not(:first-of-type) { display: none; }
    }
    `;

    /* ─── Sub-components ─── */

    const StatCard = ({ icon, label, value, sub, color }) => (
    <div className="td-stat-card" style={{ "--accent": color }}>
        <i className={`fa-solid ${icon} td-stat-icon`} style={{ color }} />
        <div className="td-stat-value">{value}</div>
        <div className="td-stat-label">{label}</div>
        {sub && <div className="td-stat-sub">{sub}</div>}
    </div>
    );

    const ProgressBar = ({ label, value, max, color }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="td-progress-row">
        <div className="td-progress-label" dangerouslySetInnerHTML={{ __html: label }} />
        <div className="td-progress-track">
            <div className="td-progress-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
        <div className="td-progress-val">{value}</div>
        </div>
    );
    };

    const StatusBadge = ({ status }) => {
    const map = {
        "on-track":        { label: "On track", cls: "badge-green" },
        "needs-attention": { label: "Watch",    cls: "badge-amber" },
        "at-risk":         { label: "At risk",  cls: "badge-red"   },
        inactive:          { label: "Inactive", cls: "badge-gray"  },
    };
    const { label, cls } = map[status] || map["inactive"];
    return <span className={`td-badge ${cls}`}>{label}</span>;
    };

    const Sparkline = ({ data, valueKey, color }) => {
    if (!data?.length) return <div className="td-no-data">Not enough data yet</div>;
    const max = Math.max(...data.map((d) => d[valueKey]), 1);
    return (
        <div className="td-spark-row">
        {data.map((d, i) => (
            <div
            key={i}
            className="td-spark-bar"
            style={{ height: `${(d[valueKey] / max) * 100}%`, background: color }}
            title={`Session ${d.session}: ${d[valueKey]} WPM`}
            />
        ))}
        </div>
    );
    };

    const MilestoneBadges = ({ milestones }) => (
    <div className="td-milestone-row">
        {milestones.map((m) => (
        <div key={m.id} className={`td-milestone ${m.achieved ? "achieved" : "locked"}`} title={m.label}>
            <span className="td-milestone-icon">{m.icon}</span>
            <span className="td-milestone-label">{m.label}</span>
        </div>
        ))}
    </div>
    );

    const ClassCodePanel = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="td-code-panel">
        <div className="td-code-label"><i className="fa-solid fa-key" /> Class Code</div>
        <div className="td-code-display">{code}</div>
        <button className="td-code-copy" onClick={copy}>
            <i className={`fa-solid fa-${copied ? "check" : "copy"}`} />
            {copied ? "Copied!" : "Copy"}
        </button>
        <p className="td-code-hint">Share with students to join your class.</p>
        </div>
    );
    };

    const formatTime = (mins) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    const compClass = (c) => (c >= 80 ? "comp-good" : c >= 60 ? "comp-warn" : "comp-danger");

    const StudentDetail = ({ s }) => {
    const total = s.totalStories;
    return (
        <div className="td-student-detail">
        {s.flags?.length > 0 && (
            <div className="td-flag-strip">
            {s.flags.map((f, i) => (
                <span key={i} className={`td-flag-chip ${s.status === "at-risk" && i === 0 ? "danger" : ""}`}>{f}</span>
            ))}
            </div>
        )}

        <div className="td-detail-grid">
            <div className="td-detail-panel">
            <div className="td-detail-title">Reading speed</div>
            <ProgressBar label="Slow (&lt;150 WPM)"  value={s.speedDist?.slow   ?? 0} max={total} color="#f87171" />
            <ProgressBar label="Normal (150–250)"    value={s.speedDist?.normal ?? 0} max={total} color="#34d399" />
            <ProgressBar label="Fast (&gt;250 WPM)"  value={s.speedDist?.fast   ?? 0} max={total} color="#818cf8" />
            <div className="td-detail-best">Best: <strong>{s.bestWPM} WPM</strong></div>
            </div>

            <div className="td-detail-panel">
            <div className="td-detail-title">Comprehension</div>
            <ProgressBar label="Excellent (≥80%)"   value={s.compDist?.excellent  ?? 0} max={total} color="#34d399" />
            <ProgressBar label="Good (60–79%)"       value={s.compDist?.good        ?? 0} max={total} color="#fbbf24" />
            <ProgressBar label="Needs work (&lt;60%)" value={s.compDist?.needsWork  ?? 0} max={total} color="#f87171" />
            <div className="td-detail-best">Best: <strong>{s.bestComp}%</strong></div>
            </div>
        </div>

        {s.stories?.length > 0 && (
            <div className="td-detail-panel" style={{ marginBottom: "0.85rem" }}>
            <div className="td-detail-title">Recent stories</div>
            <div className="td-stories-list">
                {s.stories.map((st, i) => (
                <div key={i} className="td-story-row">
                    <span className="td-story-title">{st.title}</span>
                    <span className="td-story-date">{st.date}</span>
                    <div className="td-story-badges">
                    <span className="td-sbadge wpm">{st.wpm} WPM</span>
                    <span className={`td-sbadge comp ${compClass(st.comp)}`}>{st.comp}%</span>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        <div className="td-expand-title">
            🏅 Milestones — {s.achievedCount}/{s.milestones?.length ?? 0} achieved
        </div>
        <MilestoneBadges milestones={s.milestones ?? []} />
        </div>
    );
    };

    /* ─── Main component ─── */
    export default function TeacherDashboard() {
    const [data, setData]               = useState(null);
    const [classCode, setClassCode]     = useState(null);
    const [loading, setLoading]         = useState(true);
    const [activeTab, setActiveTab]     = useState("overview");
    const [filter, setFilter]           = useState("all");
    const [search, setSearch]           = useState("");
    const [expandedStudent, setExpanded] = useState(null);

    useEffect(() => {
        const fakeDashboardData = {
        summary: {
            totalStudents: 4,
            classAvgWPM: 188,
            classAvgComprehension: 71,
            classAvgQuizScore: 73,
            totalLearningTime: 745,
            speedDistribution:         { fast: 1, normal: 2, slow: 1 },
            comprehensionDistribution: { excellent: 2, good: 1, needsWork: 1 },
        },
        classTrend: [
            { session: 1, wpm: 150 }, { session: 2, wpm: 165 },
            { session: 3, wpm: 180 }, { session: 4, wpm: 190 }, { session: 5, wpm: 205 },
        ],
        attentionFlags: [
            { name: "John Cruz",  status: "needs-attention", flags: ["Low comprehension", "Slow reading speed"] },
            { name: "Mark Reyes", status: "at-risk",         flags: ["Inactive 5+ days", "Low reading speed", "Low comprehension"] },
        ],
        students: [
            {
            name: "Maria Santos", email: "maria@gmail.com",
            avgWPM: 245, avgComprehension: 95, avgQuizScore: 97,
            totalStories: 28, learningTime: 320, status: "on-track",
            achievedCount: 3, bestWPM: 280, bestComp: 100, flags: [],
            speedDist: { slow: 0, normal: 8, fast: 20 },
            compDist:  { excellent: 24, good: 4, needsWork: 0 },
            stories: [
                { title: "The Lion and the Mouse",  wpm: 245, comp: 95,  date: "5/3/2026" },
                { title: "Little Red Riding Hood",  wpm: 260, comp: 100, date: "5/1/2026" },
                { title: "Cinderella",              wpm: 230, comp: 90,  date: "4/28/2026" },
            ],
            milestones: [
                { id: 1, label: "First Story",  icon: "📘", achieved: true },
                { id: 2, label: "Quiz Master",  icon: "🏆", achieved: true },
                { id: 3, label: "Speed Reader", icon: "⚡", achieved: true },
            ],
            },
            {
            name: "John Cruz", email: "john@gmail.com",
            avgWPM: 160, avgComprehension: 58, avgQuizScore: 65,
            totalStories: 12, learningTime: 140, status: "needs-attention",
            achievedCount: 1, bestWPM: 190, bestComp: 72, flags: ["Low comprehension"],
            speedDist: { slow: 2, normal: 9, fast: 1 },
            compDist:  { excellent: 1, good: 5, needsWork: 6 },
            stories: [
                { title: "The Tortoise and the Hare", wpm: 155, comp: 55, date: "5/2/2026" },
                { title: "Jack and the Beanstalk",    wpm: 165, comp: 60, date: "4/30/2026" },
            ],
            milestones: [
                { id: 1, label: "First Story",  icon: "📘", achieved: true  },
                { id: 2, label: "Quiz Master",  icon: "🏆", achieved: false },
                { id: 3, label: "Speed Reader", icon: "⚡", achieved: false },
            ],
            },
            {
            name: "Angela Reyes", email: "angela@gmail.com",
            avgWPM: 225, avgComprehension: 87, avgQuizScore: 90,
            totalStories: 22, learningTime: 210, status: "on-track",
            achievedCount: 2, bestWPM: 255, bestComp: 98, flags: [],
            speedDist: { slow: 0, normal: 14, fast: 8 },
            compDist:  { excellent: 18, good: 4, needsWork: 0 },
            stories: [
                { title: "Snow White",        wpm: 220, comp: 88, date: "5/3/2026" },
                { title: "Hansel and Gretel", wpm: 230, comp: 86, date: "5/1/2026" },
            ],
            milestones: [
                { id: 1, label: "First Story",  icon: "📘", achieved: true  },
                { id: 2, label: "Quiz Master",  icon: "🏆", achieved: true  },
                { id: 3, label: "Speed Reader", icon: "⚡", achieved: false },
            ],
            },
            {
            name: "Mark Reyes", email: "mark@gmail.com",
            avgWPM: 120, avgComprehension: 45, avgQuizScore: 40,
            totalStories: 5, learningTime: 75, status: "at-risk",
            achievedCount: 0, bestWPM: 145, bestComp: 52,
            flags: ["Inactive 5+ days", "Low reading speed", "Low comprehension"],
            speedDist: { slow: 4, normal: 1, fast: 0 },
            compDist:  { excellent: 0, good: 1, needsWork: 4 },
            stories: [
                { title: "The Three Little Pigs", wpm: 118, comp: 42, date: "4/28/2026" },
            ],
            milestones: [
                { id: 1, label: "First Story",  icon: "📘", achieved: false },
                { id: 2, label: "Quiz Master",  icon: "🏆", achieved: false },
                { id: 3, label: "Speed Reader", icon: "⚡", achieved: false },
            ],
            },
        ],
        topPerformers: {
            readers:      [{ name: "Maria Santos", totalStories: 28 }, { name: "Angela Reyes", totalStories: 22 }],
            quizzers:     [{ name: "Maria Santos", avgQuizScore: 97 }, { name: "Angela Reyes", avgQuizScore: 90 }],
            timeLearners: [{ name: "Maria Santos", learningTime: 320 }, { name: "Angela Reyes", learningTime: 210 }],
        },
        };
        setTimeout(() => { setData(fakeDashboardData); setClassCode("ARAL-2026"); setLoading(false); }, 600);
    }, []);

    if (loading) return (
        <>
        <style>{css}</style>
        <div className="td-loading"><div className="td-spinner" /><p>Loading class data…</p></div>
        </>
    );

    if (!data) return (
        <>
        <style>{css}</style>
        <div className="td-empty"><i className="fa-solid fa-users-slash" /><p>No data yet.</p></div>
        </>
    );

    const { summary, classTrend, attentionFlags, students, topPerformers } = data;

    const filteredStudents = students.filter((s) => {
        const matchFilter = filter === "all" || s.status === filter;
        const q = search.toLowerCase();
        return matchFilter && (s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
    });

    const initials = (name) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    const avatarColors = {
        "on-track":        { bg: "rgba(52,211,153,0.12)", color: "#34d399" },
        "needs-attention": { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24" },
        "at-risk":         { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
    };

    return (
        <>
        <style>{css}</style>
        <div className="td-wrap">

            {/* Header */}
            <div className="td-header">
            <div>
                <h1 className="td-title">
                <i className="fa-solid fa-chart-line" /> Teacher Dashboard
                </h1>
                <p className="td-sub">Class overview · Aralytics</p>
            </div>
            {classCode && <ClassCodePanel code={classCode} />}
            </div>

            {/* Tabs */}
            <div className="td-tabs">
            {[
                { key: "overview",    icon: "gauge"  },
                { key: "students",   icon: "users"  },
                { key: "milestones", icon: "star"   },
                { key: "leaderboard",icon: "trophy" },
            ].map(({ key, icon }) => (
                <button
                key={key}
                className={`td-tab ${activeTab === key ? "active" : ""}`}
                onClick={() => { setActiveTab(key); setExpanded(null); }}
                >
                <i className={`fa-solid fa-${icon}`} />
                {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
            ))}
            </div>

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
            <>
                <div className="td-stats-grid">
                <StatCard icon="fa-users" label="Total Students"    value={summary.totalStudents}                   color="#818cf8" />
                <StatCard icon="fa-bolt"  label="Avg Reading Speed" value={`${summary.classAvgWPM} WPM`}           color="#34d399" sub="words per minute" />
                <StatCard icon="fa-brain" label="Avg Comprehension" value={`${summary.classAvgComprehension}%`}    color="#fbbf24" />
                <StatCard icon="fa-star"  label="Avg Quiz Score"    value={`${summary.classAvgQuizScore}%`}        color="#60a5fa" />
                <StatCard icon="fa-clock" label="Total Learn Time"  value={formatTime(summary.totalLearningTime)}  color="#e879f9" sub="across all students" />
                </div>

                <div className="td-two-col">
                <div className="td-panel">
                    <h3 className="td-panel-title"><i className="fa-solid fa-gauge-high" /> Reading speed distribution</h3>
                    <ProgressBar label="Fast (&gt;250 WPM)"    value={summary.speedDistribution.fast}   max={summary.totalStudents} color="#818cf8" />
                    <ProgressBar label="Normal (150–250 WPM)" value={summary.speedDistribution.normal} max={summary.totalStudents} color="#34d399" />
                    <ProgressBar label="Slow (&lt;150 WPM)"   value={summary.speedDistribution.slow}   max={summary.totalStudents} color="#f87171" />

                    <h3 className="td-panel-title" style={{ marginTop: "1.25rem" }}>
                    <i className="fa-solid fa-brain" /> Comprehension levels
                    </h3>
                    <ProgressBar label="Excellent (≥80%)"    value={summary.comprehensionDistribution.excellent}  max={summary.totalStudents} color="#34d399" />
                    <ProgressBar label="Good (60–79%)"       value={summary.comprehensionDistribution.good}       max={summary.totalStudents} color="#fbbf24" />
                    <ProgressBar label="Needs work (&lt;60%)" value={summary.comprehensionDistribution.needsWork} max={summary.totalStudents} color="#f87171" />
                </div>

                <div className="td-col-right">
                    <div className="td-panel">
                    <h3 className="td-panel-title"><i className="fa-solid fa-chart-bar" /> Class WPM trend</h3>
                    <Sparkline data={classTrend} valueKey="wpm" color="#818cf8" />
                    <p className="td-spark-legend">Last {classTrend.length} sessions</p>
                    </div>

                    <div className="td-panel">
                    <h3 className="td-panel-title"><i className="fa-solid fa-flag" /> Attention flags</h3>
                    {attentionFlags.length === 0
                        ? <p className="td-no-data"><i className="fa-solid fa-circle-check" /> All students on track!</p>
                        : attentionFlags.map((f, i) => (
                            <div key={i} className="td-flag-row">
                            <span className={`td-flag-dot ${f.status}`} />
                            <div>
                                <span className="td-flag-name">{f.name}</span>
                                <span className="td-flag-desc"> — {f.flags.join(", ")}</span>
                            </div>
                            </div>
                        ))
                    }
                    </div>
                </div>
                </div>
            </>
            )}

            {/* ── STUDENTS ── */}
            {activeTab === "students" && (
            <div className="td-panel">
                <div className="td-students-topbar">
                <div className="td-filters">
                    {[
                    { key: "all",             label: `All (${students.length})` },
                    { key: "on-track",        label: `On track (${students.filter(s => s.status === "on-track").length})`,        cls: "success" },
                    { key: "needs-attention", label: `Watch (${students.filter(s => s.status === "needs-attention").length})`,     cls: "warn"    },
                    { key: "at-risk",         label: `At risk (${students.filter(s => s.status === "at-risk").length})`,          cls: "danger"  },
                    ].map((f) => (
                    <button
                        key={f.key}
                        className={`td-filter-btn ${f.cls ?? ""} ${filter === f.key ? "active" : ""}`}
                        onClick={() => { setFilter(f.key); setExpanded(null); }}
                    >
                        {f.label}
                    </button>
                    ))}
                </div>
                <input
                    className="td-search"
                    type="text"
                    placeholder="Search student…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setExpanded(null); }}
                />
                </div>

                <div className="td-roster-header">
                <span />
                <span>Student</span>
                <span className="td-col">WPM</span>
                <span className="td-col">Comprehension</span>
                <span className="td-col">Quiz avg</span>
                <span className="td-col">Stories</span>
                <span className="td-col">Time</span>
                <span className="td-col">Status</span>
                <span />
                </div>

                {filteredStudents.length === 0
                ? <p className="td-no-data" style={{ padding: "1.5rem 0" }}>No students found.</p>
                : filteredStudents.map((s, i) => {
                    const isExp = expandedStudent === i;
                    const ac = avatarColors[s.status] ?? { bg: "#1e293b", color: "#64748b" };
                    return (
                        <div key={i} className={`td-student-card ${isExp ? "expanded" : ""}`}>
                        <div className="td-roster-row" onClick={() => setExpanded(isExp ? null : i)}>
                            <div className="td-avatar" style={{ background: ac.bg, color: ac.color }}>{initials(s.name)}</div>
                            <div>
                            <div className="td-student-name">{s.name}</div>
                            <div className="td-student-meta">{s.email}</div>
                            </div>
                            <span className="td-col" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>{s.avgWPM ?? "—"}</span>
                            <span className="td-col" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>{s.avgComprehension != null ? `${s.avgComprehension}%` : "—"}</span>
                            <span className="td-col" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>{s.avgQuizScore != null ? `${s.avgQuizScore}%` : "—"}</span>
                            <span className="td-col" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>{s.totalStories}</span>
                            <span className="td-col" style={{ fontFamily: "var(--mono)", fontSize: "0.82rem" }}>{formatTime(s.learningTime)}</span>
                            <span className="td-col"><StatusBadge status={s.status} /></span>
                            <i className={`fa-solid fa-chevron-down td-chevron ${isExp ? "open" : ""}`} />
                        </div>
                        {isExp && (
                            <div onClick={(e) => e.stopPropagation()}>
                            <StudentDetail s={s} />
                            </div>
                        )}
                        </div>
                    );
                    })
                }
            </div>
            )}

            {/* ── MILESTONES ── */}
            {activeTab === "milestones" && (
            <div className="td-panel">
                <h3 className="td-panel-title"><i className="fa-solid fa-star" /> Student Milestones</h3>
                {students.map((s, i) => {
                const ac = avatarColors[s.status] ?? { bg: "#1e293b", color: "#64748b" };
                return (
                    <div key={i} className="td-milestone-student">
                    <div className="td-milestone-student-header">
                        <div className="td-avatar sm" style={{ background: ac.bg, color: ac.color }}>{initials(s.name)}</div>
                        <span className="td-student-name">{s.name}</span>
                        <span className="td-badge badge-purple">{s.achievedCount}/{s.milestones.length} achieved</span>
                        <span className="td-badge badge-pink"><i className="fa-solid fa-clock" /> {formatTime(s.learningTime)}</span>
                    </div>
                    <MilestoneBadges milestones={s.milestones} />
                    </div>
                );
                })}
            </div>
            )}

            {/* ── LEADERBOARD ── */}
            {activeTab === "leaderboard" && (
            <div className="td-three-col">
                <div className="td-panel">
                <h3 className="td-panel-title"><i className="fa-solid fa-book-open" /> Most stories read</h3>
                {topPerformers.readers.map((s, i) => (
                    <div key={i} className="td-leader-row">
                    <span className="td-rank">#{i + 1}</span>
                    <div className="td-avatar sm" style={{ background: "rgba(129,140,248,0.12)", color: "#818cf8" }}>{initials(s.name)}</div>
                    <span>{s.name}</span>
                    <span className="td-badge badge-purple">{s.totalStories} stories</span>
                    </div>
                ))}
                </div>
                <div className="td-panel">
                <h3 className="td-panel-title"><i className="fa-solid fa-trophy" /> Highest quiz average</h3>
                {topPerformers.quizzers.map((s, i) => (
                    <div key={i} className="td-leader-row">
                    <span className="td-rank">#{i + 1}</span>
                    <div className="td-avatar sm" style={{ background: "rgba(52,211,153,0.12)", color: "#34d399" }}>{initials(s.name)}</div>
                    <span>{s.name}</span>
                    <span className="td-badge badge-green">{s.avgQuizScore}%</span>
                    </div>
                ))}
                </div>
                <div className="td-panel">
                <h3 className="td-panel-title"><i className="fa-solid fa-clock" /> Most time learning</h3>
                {topPerformers.timeLearners.map((s, i) => (
                    <div key={i} className="td-leader-row">
                    <span className="td-rank">#{i + 1}</span>
                    <div className="td-avatar sm" style={{ background: "rgba(232,121,249,0.12)", color: "#e879f9" }}>{initials(s.name)}</div>
                    <span>{s.name}</span>
                    <span className="td-badge badge-pink">{formatTime(s.learningTime)}</span>
                    </div>
                ))}
                </div>
            </div>
            )}

        </div>
        </>
    );
    }