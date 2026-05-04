import { useState } from 'react';
import './DifficultySelector.css';

const difficulties = [
    {
        level: 'easy',
        label: 'Easy',
        emoji: '🌿',
        questions: 5,
        description: 'Perfect for beginners! Basic animal facts.',
        color: '#4ade80',
    },
    {
        level: 'medium',
        label: 'Medium',
        emoji: '🦁',
        questions: 10,
        description: 'A bit tricky. Mix of habitats & science.',
        color: '#facc15',
    },
    {
        level: 'hard',
        label: 'Hard',
        emoji: '🦅',
        questions: 15,
        description: 'Expert level. Deep animal science & facts.',
        color: '#f87171',
    },
];

export default function DifficultySelector({ onSelect, onBack }) {
    const [hovered, setHovered] = useState(null);

    return (
        <div className="diff-wrapper">
            <button className="diff-backBtn" onClick={onBack}>
                ← Back
            </button>

            <div className="diff-header">
                <h1 className="diff-title">Choose Your Challenge</h1>
                <p className="diff-subtitle">How well do you know the animal kingdom?</p>
            </div>

            <div className="diff-cards">
                {difficulties.map((d) => (
                    <button
                        key={d.level}
                        className={`diff-card ${hovered === d.level ? 'diff-card-hovered' : ''}`}
                        style={{ '--accent': d.color }}
                        onMouseEnter={() => setHovered(d.level)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => onSelect(d.level)}
                    >
                        <span className="diff-emoji">{d.emoji}</span>
                        <span className="diff-level">{d.label}</span>
                        <span className="diff-qCount">{d.questions} Questions</span>
                        <p className="diff-desc">{d.description}</p>
                        <span className="diff-startBtn">Start →</span>
                    </button>
                ))}
            </div>
        </div>
    );
}