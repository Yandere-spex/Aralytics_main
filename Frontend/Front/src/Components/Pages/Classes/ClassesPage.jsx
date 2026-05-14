import { useState, useEffect } from 'react';
import './ClassesPage.css';

export default function ClassesPage() {
    const [classes, setClasses]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [joinCode, setJoinCode]       = useState('');
    const [joinError, setJoinError]     = useState('');
    const [joinSuccess, setJoinSuccess] = useState('');
    const [joinLoading, setJoinLoading] = useState(false);

    const token = localStorage.getItem('token');

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const res  = await fetch('http://localhost:5000/api/classes/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setClasses(data.data.classes || []);
            else setError(data.message || 'Failed to load classes');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClasses(); }, []);

    const handleJoin = async () => {
        if (!joinCode.trim()) { setJoinError('Please enter a class code'); return; }
        setJoinLoading(true);
        setJoinError('');
        setJoinSuccess('');
        try {
            const res  = await fetch('http://localhost:5000/api/classes/join', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body:    JSON.stringify({ code: joinCode.trim().toUpperCase() }),
            });
            const data = await res.json();
            if (res.ok) {
                setJoinSuccess('Joined successfully!');
                setJoinCode('');
                fetchClasses();
            } else {
                setJoinError(data.message || 'Invalid class code');
            }
        } catch {
            setJoinError('Network error. Please try again.');
        } finally {
            setJoinLoading(false);
        }
    };

    const emojis = ['📚', '📖', '📝', '🎒', '✏️', '🔬', '🎨', '🌍'];
    const getEmoji = (index) => emojis[index % emojis.length];

    return (
        <div className="cp-wrap">

            {/* Left panel — join class */}
            <div className="cp-left">
                <div className="cp-card">
                    <div className="cp-card-title">Join a class</div>
                    <div className="cp-card-sub">
                        Enter the class code provided by your teacher to join their class.
                    </div>

                    <div className="cp-input-row">
                        <input
                            className="cp-input"
                            type="text"
                            placeholder="Enter class code"
                            value={joinCode}
                            onChange={e => setJoinCode(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === 'Enter' && handleJoin()}
                            maxLength={8}
                        />
                        <button
                            className="cp-btn-primary"
                            onClick={handleJoin}
                            disabled={joinLoading}
                        >
                            {joinLoading ? '...' : 'Join'}
                        </button>
                    </div>

                    {joinError   && <p className="cp-error">{joinError}</p>}
                    {joinSuccess && <p className="cp-success">{joinSuccess}</p>}

                    <div className="cp-hint">
                        <i className="fa-solid fa-circle-info"></i>
                        <span>Ask your teacher for the class code to join their class.</span>
                    </div>
                </div>
            </div>

            {/* Right panel — class list */}
            <div className="cp-right">
                <div className="cp-section-title">Your classes</div>

                {loading && (
                    <div className="cp-loading">
                        <div className="cp-spinner" />
                        <p>Loading classes...</p>
                    </div>
                )}

                {error && <p className="cp-error">{error}</p>}

                {!loading && !error && classes.length === 0 && (
                    <div className="cp-empty">
                        <i className="fa-solid fa-graduation-cap"></i>
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
                                                <div className="cp-class-avatar">{getEmoji(i)}</div>
                                                <span className="cp-class-name">{cls.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cp-stat">
                                                <i className="fa-solid fa-chalkboard-user"></i>
                                                {cls.teacher?.name ?? '—'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cp-stat">
                                                <i className="fa-solid fa-clipboard-list"></i>
                                                {cls.quizCount ?? 0}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cp-actions">
                                                <button className="cp-btn-view">
                                                    <i className="fa-solid fa-eye"></i> View
                                                </button>
                                                <button className="cp-btn-more">
                                                    <i className="fa-solid fa-ellipsis-vertical"></i>
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
    );
}