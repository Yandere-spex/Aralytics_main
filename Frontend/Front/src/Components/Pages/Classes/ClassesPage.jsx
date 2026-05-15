    import { useState, useEffect } from 'react';

    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
        --bg:        #0c0f1a;
        --bg2:       #111523;
        --bg3:       #181c2e;
        --border:    rgba(255,255,255,0.07);
        --border2:   rgba(255,255,255,0.12);
        --text:      #e2e8f0;
        --muted:     #64748b;
        --accent:    #818cf8;
        --green:     #34d399;
        --amber:     #fbbf24;
        --red:       #f87171;
        --pink:      #e879f9;
        --font:      'Outfit', sans-serif;
        --mono:      'DM Mono', monospace;
        --radius:    12px;
        --radius-sm: 8px;
    }

    body { background: var(--bg); color: var(--text); font-family: var(--font); min-height: 100vh; }

    .cp-wrap {
        max-width: 1100px;
        margin: 0 auto;
        padding: 2.5rem 1.5rem 4rem;
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 1.5rem;
        align-items: start;
        animation: fadeUp 0.35s ease both;
    }
    @keyframes fadeUp {
        from { opacity:0; transform:translateY(14px); }
        to   { opacity:1; transform:translateY(0); }
    }

    .cp-card {
        background: var(--bg2);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.5rem;
        transition: border-color 0.2s;
    }
    .cp-card:hover { border-color: var(--border2); }
    .cp-card-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.35rem; }
    .cp-card-sub   { font-size: 0.8rem; color: var(--muted); line-height: 1.55; margin-bottom: 1.25rem; }

    .cp-input-row  { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
    .cp-input {
        flex: 1;
        background: var(--bg3);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.55rem 0.85rem;
        color: var(--text);
        font-family: var(--mono);
        font-size: 0.9rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        outline: none;
        transition: border-color 0.2s;
    }
    .cp-input::placeholder { color: #374151; font-family: var(--font); font-size: 0.82rem; letter-spacing: 0; }
    .cp-input:focus { border-color: var(--accent); }

    .cp-btn-primary {
        padding: 0.55rem 1.1rem;
        background: var(--accent);
        border: none;
        border-radius: var(--radius-sm);
        color: #fff;
        font-size: 0.83rem;
        font-weight: 700;
        font-family: var(--font);
        cursor: pointer;
        transition: opacity 0.18s, transform 0.1s;
        white-space: nowrap;
    }
    .cp-btn-primary:hover   { opacity: 0.88; }
    .cp-btn-primary:active  { transform: scale(0.97); }
    .cp-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

    .cp-msg { font-size: 0.78rem; margin-top: 0.45rem; display: flex; align-items: center; gap: 0.4rem; }
    .cp-msg.error   { color: var(--red); }
    .cp-msg.success { color: var(--green); }

    .cp-hint {
        display: flex; align-items: flex-start; gap: 0.5rem;
        margin-top: 1rem;
        background: rgba(129,140,248,0.07);
        border: 1px solid rgba(129,140,248,0.18);
        border-radius: var(--radius-sm);
        padding: 0.65rem 0.85rem;
        font-size: 0.76rem;
        color: var(--muted);
        line-height: 1.5;
    }
    .cp-hint i { color: var(--accent); margin-top: 1px; flex-shrink: 0; }

    .cp-right { display: flex; flex-direction: column; gap: 1rem; }
    .cp-section-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.1rem; }

    .cp-loading, .cp-empty {
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; gap: 0.75rem;
        padding: 3rem 1rem;
        color: var(--muted);
        background: var(--bg2);
        border: 1px solid var(--border);
        border-radius: var(--radius);
    }
    .cp-empty i { font-size: 2rem; }
    .cp-empty p { font-size: 0.85rem; }
    .cp-spinner {
        width: 30px; height: 30px;
        border: 2.5px solid var(--border);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .cp-table-wrap {
        background: var(--bg2);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
    }
    .cp-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
    .cp-table thead tr { background: var(--bg3); border-bottom: 1px solid var(--border); }
    .cp-table th {
        padding: 0.75rem 1rem; text-align: left;
        font-size: 0.68rem; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted);
    }
    .cp-table tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; }
    .cp-table tbody tr:last-child { border-bottom: none; }
    .cp-table tbody tr:hover { background: var(--bg3); }
    .cp-table td { padding: 0.85rem 1rem; vertical-align: middle; }

    .cp-class-name-cell { display: flex; align-items: center; gap: 0.65rem; }
    .cp-class-avatar {
        width: 34px; height: 34px; border-radius: 9px;
        background: rgba(129,140,248,0.12);
        display: flex; align-items: center; justify-content: center;
        font-size: 1rem; flex-shrink: 0;
    }
    .cp-class-name { font-weight: 600; }

    .cp-stat { display: flex; align-items: center; gap: 0.4rem; color: var(--muted); font-size: 0.8rem; }
    .cp-stat i { color: var(--accent); font-size: 0.8rem; }

    .cp-actions { display: flex; gap: 0.4rem; align-items: center; }
    .cp-btn-view {
        display: flex; align-items: center; gap: 0.35rem;
        padding: 0.3rem 0.75rem;
        background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.25);
        border-radius: 6px; color: var(--accent);
        font-size: 0.75rem; font-weight: 600; font-family: var(--font);
        cursor: pointer; transition: background 0.18s;
    }
    .cp-btn-view:hover { background: rgba(129,140,248,0.2); }
    .cp-btn-more {
        width: 28px; height: 28px;
        display: flex; align-items: center; justify-content: center;
        background: transparent; border: 1px solid var(--border);
        border-radius: 6px; color: var(--muted); font-size: 0.8rem; cursor: pointer;
        transition: border-color 0.18s, color 0.18s;
    }
    .cp-btn-more:hover { border-color: var(--border2); color: var(--text); }

    /* ── Modal ── */
    .cp-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.7);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; padding: 1rem;
        animation: overlayIn 0.18s ease;
    }
    @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }

    .cp-modal {
        background: var(--bg2);
        border: 1px solid var(--border2);
        border-radius: 16px;
        padding: 2rem;
        width: 100%; max-width: 400px;
        animation: popIn 0.22s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes popIn {
        from { opacity:0; transform:scale(0.92) translateY(10px); }
        to   { opacity:1; transform:scale(1) translateY(0); }
    }

    .cp-modal-icon {
        width: 52px; height: 52px; border-radius: 14px;
        background: rgba(129,140,248,0.12);
        border: 1px solid rgba(129,140,248,0.25);
        display: flex; align-items: center; justify-content: center;
        font-size: 1.4rem; margin-bottom: 1.1rem;
        color: var(--accent);
    }
    .cp-modal-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 0.4rem; }
    .cp-modal-sub   { font-size: 0.82rem; color: var(--muted); line-height: 1.6; margin-bottom: 1.35rem; }

    .cp-modal-code-box {
        display: flex; align-items: center; justify-content: space-between;
        background: var(--bg3);
        border: 1px solid rgba(232,121,249,0.2);
        border-radius: var(--radius-sm);
        padding: 0.8rem 1rem;
        margin-bottom: 1.5rem;
    }
    .cp-modal-code-label {
        font-size: 0.7rem; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.08em;
        color: var(--muted);
        display: flex; align-items: center; gap: 0.35rem;
    }
    .cp-modal-code-value {
        font-family: var(--mono); font-size: 1.1rem; font-weight: 700;
        letter-spacing: 0.12em; color: var(--pink);
    }

    .cp-modal-actions { display: flex; gap: 0.6rem; }
    .cp-btn-cancel {
        flex: 1; padding: 0.65rem;
        background: transparent; border: 1px solid var(--border2);
        border-radius: var(--radius-sm); color: var(--muted);
        font-size: 0.83rem; font-weight: 600; font-family: var(--font);
        cursor: pointer; transition: border-color 0.18s, color 0.18s;
    }
    .cp-btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }
    .cp-btn-confirm {
        flex: 1; padding: 0.65rem;
        background: var(--accent); border: none;
        border-radius: var(--radius-sm); color: #fff;
        font-size: 0.83rem; font-weight: 700; font-family: var(--font);
        cursor: pointer; transition: opacity 0.18s, transform 0.1s;
        display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    }
    .cp-btn-confirm:hover   { opacity: 0.88; }
    .cp-btn-confirm:active  { transform: scale(0.97); }
    .cp-btn-confirm:disabled { opacity: 0.45; cursor: not-allowed; }

    /* ── Success banner ── */
    .cp-success-banner {
        display: flex; flex-direction: column; align-items: center; text-align: center;
        gap: 0.45rem; padding: 1.4rem 1rem;
        background: rgba(52,211,153,0.06);
        border: 1px solid rgba(52,211,153,0.2);
        border-radius: var(--radius);
        margin-top: 1rem;
        animation: fadeUp 0.3s ease;
    }
    .cp-success-banner i { font-size: 1.6rem; color: var(--green); }
    .cp-success-banner strong { font-size: 0.9rem; }
    .cp-success-banner p  { font-size: 0.78rem; color: var(--muted); }
    .cp-success-code {
        font-family: var(--mono); font-size: 0.82rem; font-weight: 700;
        color: var(--green); letter-spacing: 0.1em;
        background: rgba(52,211,153,0.1); padding: 0.2rem 0.65rem;
        border-radius: 6px;
    }

    /* ── Responsive ── */
    @media (max-width: 820px) {
        .cp-wrap { grid-template-columns: 1fr; padding: 1.5rem 1rem 3rem; }
    }
    @media (max-width: 520px) {
        .cp-table th:nth-child(3), .cp-table td:nth-child(3) { display: none; }
        .cp-modal { padding: 1.35rem; }
        .cp-modal-actions { flex-direction: column-reverse; }
    }
    `;

    export default function ClassesPage() {
    const [classes, setClasses]       = useState([]);
    const [loading, setLoading]       = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [joinCode, setJoinCode]     = useState('');
    const [joinMsg, setJoinMsg]       = useState({ type: '', text: '' });
    const [joinLoading, setJoinLoading] = useState(false);

    const [showModal, setShowModal]   = useState(false);
    const [pendingCode, setPendingCode] = useState('');
    const [lastJoined, setLastJoined] = useState('');

    const token = localStorage.getItem('token');

    const fetchClasses = async () => {
        setLoading(true);
        try {
        const res  = await fetch('http://localhost:5000/api/classes/my', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setClasses(data.data.classes || []);
        else setFetchError(data.message || 'Failed to load classes');
        } catch {
        setFetchError('Network error. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => { fetchClasses(); }, []);

    // Step 1 — validate input, open modal
    const handleJoinClick = () => {
        setJoinMsg({ type: '', text: '' });
        if (!joinCode.trim()) {
        setJoinMsg({ type: 'error', text: 'Please enter a class code.' });
        return;
        }
        setPendingCode(joinCode.trim().toUpperCase());
        setShowModal(true);
    };

    // Step 2 — confirmed, call API
    const handleConfirm = async () => {
        setJoinLoading(true);
        try {
        const res  = await fetch('http://localhost:5000/api/enrollment/join', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body:    JSON.stringify({ classCode: pendingCode }),
        });
        const data = await res.json();
        if (res.ok) {
            setLastJoined(pendingCode);
            setJoinMsg({ type: 'success', text: '' });
            setJoinCode('');
            setShowModal(false);
            fetchClasses();
        } else {
            setJoinMsg({ type: 'error', text: data.message || 'Invalid class code.' });
            setShowModal(false);
        }
        } catch {
        setJoinMsg({ type: 'error', text: 'Network error. Please try again.' });
        setShowModal(false);
        } finally {
        setJoinLoading(false);
        }
    };

    const handleCancel = () => { setShowModal(false); setPendingCode(''); };

    const emojis = ['📚', '📖', '📝', '🎒', '✏️', '🔬', '🎨', '🌍'];

    return (
        <>
        <style>{css}</style>

        {/* ── Confirmation modal ── */}
        {showModal && (
            <div className="cp-overlay" onClick={handleCancel}>
            <div className="cp-modal" onClick={e => e.stopPropagation()}>

                <div className="cp-modal-icon">
                <i className="fa-solid fa-graduation-cap" />
                </div>

                <div className="cp-modal-title">Join this class?</div>
                <div className="cp-modal-sub">
                You're about to enroll using the code below. Make sure this is the correct code before confirming.
                </div>

                <div className="cp-modal-code-box">
                <span className="cp-modal-code-label">
                    <i className="fa-solid fa-key" /> Class code
                </span>
                <span className="cp-modal-code-value">{pendingCode}</span>
                </div>

                <div className="cp-modal-actions">
                <button className="cp-btn-cancel" onClick={handleCancel} disabled={joinLoading}>
                    Cancel
                </button>
                <button className="cp-btn-confirm" onClick={handleConfirm} disabled={joinLoading}>
                    {joinLoading
                    ? <><i className="fa-solid fa-circle-notch fa-spin" /> Joining…</>
                    : <><i className="fa-solid fa-check" /> Yes, join</>
                    }
                </button>
                </div>

            </div>
            </div>
        )}

        <div className="cp-wrap">

            {/* ── Left — join form ── */}
            <div>
            <div className="cp-card">
                <div className="cp-card-title">Join a class</div>
                <div className="cp-card-sub">
                Enter the class code provided by your teacher to join their class.
                </div>

                <div className="cp-input-row">
                <input
                    className="cp-input"
                    type="text"
                    placeholder="e.g. ARAL-K7X2MQ"
                    value={joinCode}
                    onChange={e => { setJoinCode(e.target.value.toUpperCase()); setJoinMsg({ type: '', text: '' }); setLastJoined(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleJoinClick()}
                    maxLength={11}
                />
                <button className="cp-btn-primary" onClick={handleJoinClick} disabled={joinLoading}>
                    Join
                </button>
                </div>

                {joinMsg.type === 'error' && (
                <p className="cp-msg error">
                    <i className="fa-solid fa-circle-exclamation" /> {joinMsg.text}
                </p>
                )}

                {joinMsg.type === 'success' && lastJoined && (
                <div className="cp-success-banner">
                    <i className="fa-solid fa-circle-check" />
                    <strong>You're enrolled!</strong>
                    <span className="cp-success-code">{lastJoined}</span>
                    <p>The class is now visible in your list.</p>
                </div>
                )}

                <div className="cp-hint">
                <i className="fa-solid fa-circle-info" />
                <span>
                    Ask your teacher for the class code. It looks like{' '}
                    <span style={{ color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: '0.78rem' }}>ARAL-XXXXXX</span>.
                </span>
                </div>
            </div>
            </div>

            {/* ── Right — classes list ── */}
            <div className="cp-right">
            <div className="cp-section-title">Your classes</div>

            {loading && (
                <div className="cp-loading">
                <div className="cp-spinner" />
                <p style={{ fontSize: '0.82rem' }}>Loading classes…</p>
                </div>
            )}

            {fetchError && (
                <p className="cp-msg error" style={{ padding: '1rem 0' }}>
                <i className="fa-solid fa-circle-exclamation" /> {fetchError}
                </p>
            )}

            {!loading && !fetchError && classes.length === 0 && (
                <div className="cp-empty">
                <i className="fa-solid fa-graduation-cap" />
                <p>You haven't joined any classes yet.</p>
                </div>
            )}

            {!loading && classes.length > 0 && (
                <div className="cp-table-wrap">
                <table className="cp-table">
                    <thead>
                    <tr>
                        <th>Class name</th>
                        <th>Teacher</th>
                        <th>Quizzes</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {classes.map((cls, i) => (
                        <tr key={cls._id}>
                        <td>
                            <div className="cp-class-name-cell">
                            <div className="cp-class-avatar">{emojis[i % emojis.length]}</div>
                            <span className="cp-class-name">{cls.name}</span>
                            </div>
                        </td>
                        <td>
                            <div className="cp-stat">
                            <i className="fa-solid fa-chalkboard-user" />
                            {cls.teacher?.name ?? '—'}
                            </div>
                        </td>
                        <td>
                            <div className="cp-stat">
                            <i className="fa-solid fa-clipboard-list" />
                            {cls.quizCount ?? 0}
                            </div>
                        </td>
                        <td>
                            <div className="cp-actions">
                            <button className="cp-btn-view">
                                <i className="fa-solid fa-eye" /> View
                            </button>
                            <button className="cp-btn-more">
                                <i className="fa-solid fa-ellipsis-vertical" />
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>

        </div>
        </>
    );
    }