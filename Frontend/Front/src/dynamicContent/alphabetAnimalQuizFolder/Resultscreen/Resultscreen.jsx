import './ResultScreen.css';

const getRank = (accuracy) => {
    if (accuracy === 100) return { label: 'Perfect!',   emoji: '🏆', color: '#facc15' };
    if (accuracy >= 80)   return { label: 'Excellent!', emoji: '🦁', color: '#4ade80' };
    if (accuracy >= 60)   return { label: 'Good Job!',  emoji: '🐬', color: '#22d3ee' };
    if (accuracy >= 40)   return { label: 'Keep Going!',emoji: '🐢', color: '#fb923c' };
    return                       { label: 'Try Again!', emoji: '🐣', color: '#f87171' };
};

// Save status banner shown at top of result screen
const SaveBanner = ({ status }) => {
    if (status === 'idle') return null;

    const config = {
        saving: { text: '⏳ Saving your results...',       bg: '#1e3a5f', color: '#7dd3fc' },
        saved:  { text: '✅ Results saved to your dashboard!', bg: '#14532d', color: '#4ade80' },
        error:  { text: '⚠️ Could not save results. Your score is still shown below.', bg: '#450a0a', color: '#f87171' },
    };

    const c = config[status];
    return (
        <div style={{
            background:   c.bg,
            color:        c.color,
            padding:      '10px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize:     '0.875rem',
            textAlign:    'center',
            fontWeight:   500,
        }}>
            {c.text}
        </div>
    );
};

export default function ResultScreen({ difficulty, quizResults, saveStatus = 'idle', onRetry, onBack }) {
    const { totalQuestions, correctAnswers, wrongAnswers, accuracy, attempts } = quizResults;
    const rank = getRank(accuracy);

    return (
        <div className="result-wrapper">

            <SaveBanner status={saveStatus} />

            <div className="result-hero">
                <span className="result-rankEmoji">{rank.emoji}</span>
                <h1 className="result-rankLabel" style={{ color: rank.color }}>
                    {rank.label}
                </h1>
                <p className="result-subtitle">
                    You completed the <strong>{difficulty}</strong> quiz!
                </p>
            </div>

            <div className="result-scoreGrid">
                <div className="result-scoreCard">
                    <span className="result-scoreValue" style={{ color: '#22d3ee' }}>{accuracy}%</span>
                    <span className="result-scoreLabel">Accuracy</span>
                </div>
                <div className="result-scoreCard">
                    <span className="result-scoreValue" style={{ color: '#4ade80' }}>{correctAnswers}</span>
                    <span className="result-scoreLabel">Correct</span>
                </div>
                <div className="result-scoreCard">
                    <span className="result-scoreValue" style={{ color: '#f87171' }}>{wrongAnswers}</span>
                    <span className="result-scoreLabel">Wrong</span>
                </div>
                <div className="result-scoreCard">
                    <span className="result-scoreValue" style={{ color: '#aaa' }}>{totalQuestions}</span>
                    <span className="result-scoreLabel">Total</span>
                </div>
            </div>

            <div className="result-accuracySection">
                <div className="result-barLabel">
                    <span>Score Progress</span>
                    <span>{correctAnswers}/{totalQuestions}</span>
                </div>
                <div className="result-bar">
                    <div
                        className="result-barFill"
                        style={{ width: `${accuracy}%`, background: rank.color }}
                    />
                </div>
            </div>

            <div className="result-breakdown">
                <h3 className="result-breakdownTitle">Question Breakdown</h3>
                <div className="result-attemptList">
                    {attempts.map((a, i) => (
                        <div
                            key={a.questionId}
                            className={`result-attemptRow ${a.isCorrect ? 'result-correct' : 'result-wrong'}`}
                        >
                            <span className="result-attemptNum">Q{i + 1}</span>
                            <span className="result-attemptAnimal">{a.animalName}</span>
                            <span className="result-attemptAnswer">
                                {a.isCorrect ? '✅' : `❌ → ${a.correctAnswer}`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="result-actions">
                <button className="result-retryBtn" onClick={onRetry}>🔁 Try Again</button>
                <button className="result-backBtn"  onClick={onBack}>← Back to Alphabet</button>
            </div>
        </div>
    );
}