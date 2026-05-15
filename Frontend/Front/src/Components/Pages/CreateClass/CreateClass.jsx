import { useState } from 'react';
import './CreateClass.css';

export default function CreateClass({ onCreated }) {
    const [form, setForm] = useState({
        name:        '',
        gradeLevel:  '',
        subject:     '',
        description: '',
    });
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');

    const token = localStorage.getItem('token');

    const grades   = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];
    const subjects = ['Reading','Mathematics','Science','English','Filipino','HEKASI','Values Education','MAPEH'];

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async () => {
        if (!form.name.trim())       { setError('Class name is required.');  return; }
        if (!form.gradeLevel.trim()) { setError('Grade level is required.'); return; }

        setLoading(true);
        setError('');
        try {
            const res  = await fetch('http://localhost:5000/api/classes', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body:    JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                onCreated?.(data.data.class);
            } else {
                setError(data.message || 'Failed to create class.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cc-wrap">
            {/* Left — form */}
            <div className="cc-main">
                <div className="cc-header">
                    <h2 className="cc-title">Create New Class</h2>
                    <p className="cc-sub">Create a class to connect with your students.</p>
                </div>

                <div className="cc-form">
                    {/* Class name */}
                    <div className="cc-field">
                        <label className="cc-label">Class Name</label>
                        <input
                            className="cc-input"
                            type="text"
                            name="name"
                            placeholder="e.g. Grade 4 – Reading A"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Grade + Subject */}
                    <div className="cc-row">
                        <div className="cc-field">
                            <label className="cc-label">Grade Level</label>
                            <select className="cc-select" name="gradeLevel" value={form.gradeLevel} onChange={handleChange}>
                                <option value="">Select grade</option>
                                {grades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="cc-field">
                            <label className="cc-label">Subject <span className="cc-optional">(Optional)</span></label>
                            <select className="cc-select" name="subject" value={form.subject} onChange={handleChange}>
                                <option value="">Select subject</option>
                                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="cc-field">
                        <label className="cc-label">Description <span className="cc-optional">(Optional)</span></label>
                        <textarea
                            className="cc-textarea"
                            name="description"
                            placeholder="e.g. Reading and comprehension activities for Grade 4."
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    {error && <p className="cc-error"><i className="fa-solid fa-circle-exclamation"></i> {error}</p>}

                    {/* Actions */}
                    <div className="cc-actions">
                        <button className="cc-btn-ghost" onClick={() => window.history.back()}>
                            Cancel
                        </button>
                        <button className="cc-btn-primary" onClick={handleSubmit} disabled={loading}>
                            {loading
                                ? <><i className="fa-solid fa-spinner fa-spin"></i> Creating…</>
                                : <><i className="fa-solid fa-plus"></i> Create Class</>
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Right — what happens next */}
            <div className="cc-side">
                <div className="cc-side-card">
                    <div className="cc-side-title">
                        <i className="fa-solid fa-circle-question"></i> What happens next?
                    </div>
                    <ul className="cc-steps">
                        <li className="cc-step">
                            <div className="cc-step-num">1</div>
                            <div>
                                <div className="cc-step-head">Unique code generated</div>
                                <div className="cc-step-desc">A unique class code will be generated automatically for your class.</div>
                            </div>
                        </li>
                        <li className="cc-step">
                            <div className="cc-step-num">2</div>
                            <div>
                                <div className="cc-step-head">Share with students</div>
                                <div className="cc-step-desc">Share the code with your students so they can join your class.</div>
                            </div>
                        </li>
                        <li className="cc-step">
                            <div className="cc-step-num">3</div>
                            <div>
                                <div className="cc-step-head">Students join</div>
                                <div className="cc-step-desc">Students can join using the code from their student portal.</div>
                            </div>
                        </li>
                        <li className="cc-step">
                            <div className="cc-step-num">4</div>
                            <div>
                                <div className="cc-step-head">Assign quizzes</div>
                                <div className="cc-step-desc">You can assign quizzes and track their progress anytime.</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}