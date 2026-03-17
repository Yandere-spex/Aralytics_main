import { useState, useEffect, useRef } from 'react';
import { getQuestions, saveQuizSession } from '../../services/quizService';
import './QuizPage.css';

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────
const calcPoints = (isCorrect, timeTaken) => {
    if (!isCorrect) return 0;
    if (timeTaken <= 5)  return 10;
    if (timeTaken <= 10) return 7;
    return 5;
};

const TYPE_LABEL = {
    fact:    '📋 Fact',
    habitat: '🌍 Habitat',
    funfact: '⭐ Fun Fact',
    sci:     '🔬 Scientific',
};

// ─────────────────────────────────────────────────────────────────
// QUIZ HOME
// ─────────────────────────────────────────────────────────────────
function QuizHome({ onStart }) {
    return (
        <div className="qh-wrap">
            <div className="qh-hero">
                <span className="qh-icon">🐾</span>
                <h1 className="qh-title">Animal Quiz</h1>
                <p className="qh-sub">How well do you know your A to Z animals?</p>
            </div>

            <div className="qh-modes">
                <button className="qh-mode-card" onClick={() => onStart('random')}>
                    <span className="qh-mode-icon">🎲</span>
                    <div className="qh-mode-name">Random Quiz</div>
                    <div className="qh-mode-desc">10 random questions from all 26 animals</div>
                    <div className="qh-mode-badge easy">Easy–Medium</div>
                </button>

                <button className="qh-mode-card" onClick={() => onStart('byLetter')}>
                    <span className="qh-mode-icon">🔤</span>
                    <div className="qh-mode-name">By Letter</div>
                    <div className="qh-mode-desc">Pick a letter and focus on that animal</div>
                    <div className="qh-mode-badge medium">All levels</div>
                </button>

                <button className="qh-mode-card" onClick={() => onStart('hard')}>
                    <span className="qh-mode-icon">💀</span>
                    <div className="qh-mode-name">Hard Mode</div>
                    <div className="qh-mode-desc">Scientific names and tough questions only</div>
                    <div className="qh-mode-badge hard">Hard</div>
                </button>
            </div>

            <div className="qh-scoring">
                <div className="qh-scoring-title">How points work</div>
                <div className="qh-scoring-row"><span>⚡ Answer in 5s</span><span>+10 pts</span></div>
                <div className="qh-scoring-row"><span>✅ Answer in 10s</span><span>+7 pts</span></div>
                <div className="qh-scoring-row"><span>👍 Correct answer</span><span>+5 pts</span></div>
                <div className="qh-scoring-row"><span>🏆 Perfect score</span><span>+20 pts bonus</span></div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// LETTER PICKER
// ─────────────────────────────────────────────────────────────────
function LetterPicker({ onPick, onBack }) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return (
        <div className="lp-wrap">
            <button className="lp-back" onClick={onBack}>← Back</button>
            <h2 className="lp-title">Pick a Letter</h2>
            <p className="lp-sub">Quiz yourself on that letter's animal</p>
            <div className="lp-grid">
                {letters.map(l => (
                    <button key={l} className="lp-btn" onClick={() => onPick(l)}>
                        {l}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// QUIZ SESSION
// ─────────────────────────────────────────────────────────────────
function QuizSession({ questions, onComplete }) {
    const [index, setIndex]           = useState(0);
    const [selected, setSelected]     = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [answers, setAnswers]       = useState([]);
    const [timeLeft, setTimeLeft]     = useState(15);
    const [points, setPoints]         = useState(0);
    const [streak, setStreak]         = useState(0);
    const [streakBonus, setStreakBonus] = useState(false);
    const timerRef     = useRef(null);
    const startTimeRef = useRef(Date.now());

    const current = questions[index];

    // Reset timer each question
    useEffect(() => {
        setTimeLeft(15);
        startTimeRef.current = Date.now();

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleAnswer(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [index]);

    const handleAnswer = (option) => {
        if (isAnswered) return;
        clearInterval(timerRef.current);

        const timeTaken  = Math.round((Date.now() - startTimeRef.current) / 1000);
        const isCorrect  = option === current.correctAnswer;
        const earned     = calcPoints(isCorrect, timeTaken);
        const newStreak  = isCorrect ? streak + 1 : 0;
        const gotBonus   = isCorrect && newStreak > 0 && newStreak % 3 === 0;
        const bonusPts   = gotBonus ? 3 : 0;

        setSelected(option);
        setIsAnswered(true);
        setStreak(newStreak);
        setStreakBonus(gotBonus);
        setPoints(p => p + earned + bonusPts);

        setAnswers(prev => [...prev, {
            questionId:      current._id,
            questionText:    current.questionText,
            userAnswer:      option || '',
            correctAnswer:   current.correctAnswer,
            isCorrect,
            timeTakenSeconds: timeTaken,
            relatedLetter:   current.relatedLetter,
            type:            current.type,
        }]);
    };

    const handleNext = () => {
        setStreakBonus(false);
        if (index + 1 >= questions.length) {
            const finalAnswers = [...answers];
            const correctCount = finalAnswers.filter(a => a.isCorrect).length;
            const score        = Math.round((correctCount / questions.length) * 100);
            const totalPoints  = score === 100 ? points + 20 : points;
            onComplete({
                answers: finalAnswers,
                correctCount,
                score,
                totalQuestions: questions.length,
                pointsEarned: totalPoints,
            });
        } else {
            setIndex(i => i + 1);
            setSelected(null);
            setIsAnswered(false);
        }
    };

    const timerPct   = (timeLeft / 15) * 100;
    const timerColor = timeLeft > 8 ? '#34d399' : timeLeft > 4 ? '#f5a623' : '#ff6b6b';

    return (
        <div className="qs-wrap">

            {/* Top bar */}
            <div className="qs-topbar">
                <div className="qs-progress-text">{index + 1} / {questions.length}</div>
                <div className="qs-progress-track">
                    <div
                        className="qs-progress-fill"
                        style={{ width: `${((index + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <div className="qs-points-display">⭐ {points}</div>
            </div>

            {/* Timer */}
            <div className="qs-timer-row">
                <div className="qs-timer-track">
                    <div
                        className="qs-timer-fill"
                        style={{ width: `${timerPct}%`, background: timerColor }}
                    />
                </div>
                <div className="qs-timer-num" style={{ color: timerColor }}>{timeLeft}s</div>
            </div>

            {/* Streak bonus popup */}
            {streakBonus && (
                <div className="qs-streak-popup">🔥 Streak Bonus! +3 pts</div>
            )}

            {/* Question card */}
            <div className="qs-card">
                {current.imageUrl && (
                    <img src={current.imageUrl} alt="animal" className="qs-img" />
                )}
                <div className="qs-type-tag">{TYPE_LABEL[current.type] || current.type}</div>
                <div className="qs-question">{current.questionText}</div>
            </div>

            {/* Options */}
            <div className="qs-options">
                {current.options.map((opt, i) => {
                    let cls = 'qs-opt';
                    if (isAnswered) {
                        if (opt === current.correctAnswer)       cls += ' opt-correct';
                        else if (opt === selected)               cls += ' opt-wrong';
                        else                                     cls += ' opt-dim';
                    }
                    return (
                        <button
                            key={i}
                            className={cls}
                            onClick={() => handleAnswer(opt)}
                            disabled={isAnswered}
                        >
                            <span className="qs-opt-letter">{String.fromCharCode(65 + i)}</span>
                            {opt}
                        </button>
                    );
                })}
            </div>

            {/* Feedback + Next */}
            {isAnswered && (
                <div className={`qs-feedback ${selected === current.correctAnswer ? 'fb-correct' : 'fb-wrong'}`}>
                    <span>
                        {selected === current.correctAnswer
                            ? `✅ Correct! +${calcPoints(true, Math.round((Date.now() - startTimeRef.current) / 1000))} pts`
                            : `❌ Answer: ${current.correctAnswer}`}
                    </span>
                    <button className="qs-next-btn" onClick={handleNext}>
                        {index + 1 >= questions.length ? 'See Results →' : 'Next →'}
                    </button>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// QUIZ RESULT
// ─────────────────────────────────────────────────────────────────
function QuizResult({ result, onPlayAgain, onHome, saving }) {
    const { correctCount, totalQuestions, score, pointsEarned, answers } = result;

    const emoji  = score === 100 ? '🏆' : score >= 80 ? '⭐' : score >= 60 ? '👍' : '📝';
    const remark = score === 100 ? 'Perfect Score!'
        : score >= 80 ? 'Excellent work!'
        : score >= 60 ? 'Good job!'
        : 'Keep practicing!';
    const color  = score === 100 ? '#f5a623' : score >= 80 ? '#34d399' : score >= 60 ? '#4ecdc4' : '#a78bfa';

    return (
        <div className="qr-wrap">

            {/* Hero */}
            <div className="qr-hero">
                <div className="qr-emoji">{emoji}</div>
                <div className="qr-score" style={{ color }}>{score}%</div>
                <div className="qr-remark">{remark}</div>
                <div className="qr-meta">
                    {correctCount}/{totalQuestions} correct · {pointsEarned} pts earned
                    {score === 100 && ' · +20 bonus!'}
                </div>
                {saving && <div className="qr-saving">💾 Saving result...</div>}
            </div>

            {/* Breakdown */}
            <div className="qr-breakdown">
                <div className="qr-breakdown-title">Question Breakdown</div>
                {answers.map((a, i) => (
                    <div key={i} className={`qr-row ${a.isCorrect ? 'qr-row-ok' : 'qr-row-fail'}`}>
                        <span className="qr-row-icon">{a.isCorrect ? '✅' : '❌'}</span>
                        <div className="qr-row-body">
                            <div className="qr-row-q">{a.questionText}</div>
                            {!a.isCorrect && (
                                <div className="qr-row-ans">
                                    You said: <span className="ans-wrong">{a.userAnswer || 'No answer'}</span>
                                    {' · '}Correct: <span className="ans-correct">{a.correctAnswer}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="qr-actions">
                <button className="qr-btn qr-primary" onClick={onPlayAgain}>🎲 Play Again</button>
                <button className="qr-btn qr-secondary" onClick={onHome}>🏠 Home</button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// MAIN QUIZ PAGE
// ─────────────────────────────────────────────────────────────────
export default function QuizPage() {
    const [stage, setStage]       = useState('home');
    const [mode, setMode]         = useState('random');
    const [questions, setQuestions] = useState([]);
    const [result, setResult]     = useState(null);
    const [loading, setLoading]   = useState(false);
    const [saving, setSaving]     = useState(false);
    const [error, setError]       = useState(null);
    const sessionStartRef         = useRef(Date.now());

    const loadQuestions = async (selectedMode, letter = null) => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (selectedMode === 'byLetter' && letter) params.letter = letter;
            if (selectedMode === 'hard')               params.difficulty = 'hard';

            const data = await getQuestions(params);

            if (!data || data.length === 0) {
                setError('No questions found for this selection. Try a different mode.');
                setStage('home');
                return;
            }

            setQuestions(data);
            sessionStartRef.current = Date.now();
            setStage('session');
        } catch (err) {
            setError('Could not load questions. Check your connection.');
            setStage('home');
        } finally {
            setLoading(false);
        }
    };

    const handleStart = (selectedMode) => {
        setMode(selectedMode);
        if (selectedMode === 'byLetter') {
            setStage('letterPick');
        } else {
            loadQuestions(selectedMode);
        }
    };

    const handleLetterPick = (letter) => {
        loadQuestions('byLetter', letter);
    };

    const handleSessionComplete = async (sessionResult) => {
        const timeTakenSeconds = Math.round((Date.now() - sessionStartRef.current) / 1000);
        const fullResult = { ...sessionResult, timeTakenSeconds };
        setResult(fullResult);
        setStage('result');

        // Save to backend
        setSaving(true);
        try {
            await saveQuizSession({
                answers:          sessionResult.answers,
                totalQuestions:   sessionResult.totalQuestions,
                correctCount:     sessionResult.correctCount,
                score:            sessionResult.score,
                pointsEarned:     sessionResult.pointsEarned,
                mode,
                timeTakenSeconds,
            });
        } catch (err) {
            console.error('Failed to save quiz session:', err);
        } finally {
            setSaving(false);
        }
    };

    const handlePlayAgain = () => {
        setResult(null);
        setQuestions([]);
        loadQuestions(mode);
    };

    const handleHome = () => {
        setResult(null);
        setQuestions([]);
        setStage('home');
    };

    // Loading screen
    if (loading) return (
        <div className="quiz-loading">
            <div className="quiz-spinner" />
            <p>Loading questions...</p>
        </div>
    );

    return (
        <div className="quiz-page">
            {error && (
                <div className="quiz-error" onClick={() => setError(null)}>
                    ⚠️ {error} <span className="quiz-error-close">✕</span>
                </div>
            )}

            {stage === 'home'       && <QuizHome onStart={handleStart} />}
            {stage === 'letterPick' && <LetterPicker onPick={handleLetterPick} onBack={() => setStage('home')} />}
            {stage === 'session'    && <QuizSession questions={questions} onComplete={handleSessionComplete} />}
            {stage === 'result'     && (
                <QuizResult
                    result={result}
                    saving={saving}
                    onPlayAgain={handlePlayAgain}
                    onHome={handleHome}
                />
            )}
        </div>
    );
}