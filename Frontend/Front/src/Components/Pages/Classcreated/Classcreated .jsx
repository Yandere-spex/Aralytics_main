import { useState } from 'react';
import './ClassCreated.css';

export default function ClassCreated({ classData, onGoToManage }) {
    const [copied, setCopied] = useState(false);

    // Fallback demo data so the component renders standalone
    const cls = classData ?? {
        name:       'Grade 4 – Reading A',
        code:       'ARA-4821',
        gradeLevel: 'Grade 4',
        subject:    'Reading',
        createdAt:  new Date().toISOString(),
    };

    const formattedDate = new Date(cls.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });

    const copyCode = () => {
        navigator.clipboard.writeText(cls.code).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareCode = () => {
        if (navigator.share) {
            navigator.share({
                title: `Join my class on Aralytics`,
                text:  `Use code ${cls.code} to join "${cls.name}" on Aralytics.`,
            }).catch(() => {});
        } else {
            copyCode();
        }
    };

    return (
        <div className="clc-wrap">
            {/* Left — success card */}
            <div className="clc-main">
                <div className="clc-success-badge">
                    <i className="fa-solid fa-circle-check"></i>
                </div>
                <h2 className="clc-title">Class Created Successfully! 🎉</h2>
                <p className="clc-sub">Share this code with your students so they can join your class.</p>

                <div className="clc-class-name">{cls.name}</div>

                <div className="clc-code-label">Class Code</div>
                <div className="clc-code">{cls.code}</div>

                <div className="clc-code-actions">
                    <button className={`clc-btn-copy ${copied ? 'copied' : ''}`} onClick={copyCode}>
                        <i className={`fa-solid fa-${copied ? 'check' : 'copy'}`}></i>
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                    <button className="clc-btn-share" onClick={shareCode}>
                        <i className="fa-solid fa-share-nodes"></i>
                        Share Code
                    </button>
                </div>

                {/* Class details strip */}
                <div className="clc-details">
                    <div className="clc-detail">
                        <i className="fa-solid fa-graduation-cap"></i>
                        <div className="clc-detail-info">
                            <span className="clc-detail-label">Grade Level</span>
                            <span className="clc-detail-val">{cls.gradeLevel || '—'}</span>
                        </div>
                    </div>
                    <div className="clc-detail">
                        <i className="fa-solid fa-book"></i>
                        <div className="clc-detail-info">
                            <span className="clc-detail-label">Subject</span>
                            <span className="clc-detail-val">{cls.subject || '—'}</span>
                        </div>
                    </div>
                    <div className="clc-detail">
                        <i className="fa-solid fa-calendar"></i>
                        <div className="clc-detail-info">
                            <span className="clc-detail-label">Created At</span>
                            <span className="clc-detail-val">{formattedDate}</span>
                        </div>
                    </div>
                </div>

                <button className="clc-btn-manage" onClick={() => onGoToManage?.(cls)}>
                    <i className="fa-solid fa-gear"></i> Go to Class Management
                </button>
            </div>

            {/* Right — what's next */}
            <div className="clc-side">
                <div className="clc-side-card">
                    <div className="clc-side-title">
                        <i className="fa-solid fa-list-check"></i> What's Next?
                    </div>
                    <ul className="clc-next-steps">
                        <li className="clc-next-step">
                            <div className="clc-next-icon"><i className="fa-solid fa-users"></i></div>
                            <div>
                                <div className="clc-next-head">Students go to "Join Class"</div>
                                <div className="clc-next-desc">Students open their portal and tap Join Class.</div>
                            </div>
                        </li>
                        <li className="clc-next-step">
                            <div className="clc-next-icon"><i className="fa-solid fa-keyboard"></i></div>
                            <div>
                                <div className="clc-next-head">Enter the class code to join.</div>
                                <div className="clc-next-desc">They type in <strong>{cls.code}</strong> to join your class.</div>
                            </div>
                        </li>
                        <li className="clc-next-step">
                            <div className="clc-next-icon"><i className="fa-solid fa-clipboard-list"></i></div>
                            <div>
                                <div className="clc-next-head">Once joined, you can assign quizzes.</div>
                                <div className="clc-next-desc">Head to Class Management to create and assign quizzes.</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}