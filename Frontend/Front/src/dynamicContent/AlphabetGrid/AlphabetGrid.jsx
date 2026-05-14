import { useState, useEffect } from 'react';
import { getAllLetters } from '../../services/alphabetService.js';
import { saveQuizComplete } from '../../services/Dashboardservice.js';
import AlphabetCard from '../../Components/AlphabetCard/AlphabetCard.jsx';
import AlphabetModal from '../../Components/AlphabetModal/AlphabetModal.jsx';
import DifficultySelector from '../alphabetAnimalQuizFolder/Difficultyselector/Difficultyselector.jsx';
import QuizScreen from '../alphabetAnimalQuizFolder/Quizscreen/Quizscreen.jsx';
import ResultScreen from '../alphabetAnimalQuizFolder/Resultscreen/Resultscreen.jsx';
import './AlphabetGrid.css';

export default function AlphabetGrid() {
    const [letters, setLetters] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [loading, setLoading] = useState(true);

    // Stage control
    const [stage, setStage] = useState('grid');
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [quizResults, setQuizResults] = useState(null);
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'

    useEffect(() => {
        const fetchLetters = async () => {
            try {
                const data = await getAllLetters();
                setLetters(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLetters();
    }, []);

    const handleLetterClick = (letter) => setSelectedLetter(letter);
    const handleCloseModal = () => setSelectedLetter(null);

    // Stage handlers
    const handleDifficultySelect = (difficulty) => {
        setSelectedDifficulty(difficulty);
        setStage('quiz');
    };

    // Called by QuizScreen when user submits — saves to backend then shows results
    const handleQuizComplete = async (results) => {
        setQuizResults(results);
        setStage('results');
        setSaveStatus('saving');

        try {
            // Build the payload matching your backend's saveComplete endpoint
            const payload = {
                difficulty:     results.difficulty,
                totalQuestions: results.totalQuestions,
                correctCount:   results.correctAnswers,
                wrongCount:     results.wrongAnswers,
                score:          results.accuracy,          // 0-100
                accuracy:       results.accuracy,          // 0-100
                pointsEarned:   calcPoints(results),
                timeTaken:      results.timeTaken ?? null,
                answers: results.attempts.map((a) => ({  // ← backend expects 'answers'
                    questionId: a.questionId,
                    animalName: a.animalName,
                    type:       a.type,
                    difficulty: a.difficulty,
                    correct:    a.isCorrect,
                    timeTaken:  a.timeTaken ?? null,
                })),
            };

            await saveQuizComplete(payload);
            setSaveStatus('saved');
        } catch (err) {
            console.error('Failed to save quiz:', err);
            setSaveStatus('error');
        }
    };

    const handleRetry = () => {
        setQuizResults(null);
        setSelectedDifficulty(null);
        setSaveStatus('idle');
        setStage('difficulty');
    };

    const handleBackToGrid = () => {
        setQuizResults(null);
        setSelectedDifficulty(null);
        setSaveStatus('idle');
        setStage('grid');
    };

    if (loading) return <div className="loading">Loading alphabet...</div>;

    return (
        <>
            {/* Stage 1: Alphabet Grid */}
            {stage === 'grid' && (
                <div className="alphabet-container">
                    <h1 className="alphabet-title">Learn the Alphabet and Animal! 🎉</h1>
                    <p className="alphabet-subtitle">Click on any letter to discover an animal!</p>
                    <button
                        className='tab-btn1'
                        onClick={() => setStage('difficulty')}
                    >
                        Test animal knowledge?
                    </button>
                    <div className="alphabet-grid">
                        {letters.map((letter, index) => (
                            <AlphabetCard
                                key={letter._id}
                                letter={letter}
                                index={index}
                                onClick={() => handleLetterClick(letter)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Stage 2: Difficulty Selector */}
            {stage === 'difficulty' && (
                <DifficultySelector
                    onSelect={handleDifficultySelect}
                    onBack={handleBackToGrid}
                />
            )}

            {/* Stage 3: Quiz */}
            {stage === 'quiz' && (
                <QuizScreen
                    difficulty={selectedDifficulty}
                    onComplete={handleQuizComplete}
                />
            )}

            {/* Stage 4: Results */}
            {stage === 'results' && (
                <ResultScreen
                    difficulty={selectedDifficulty}
                    quizResults={quizResults}
                    saveStatus={saveStatus}
                    onRetry={handleRetry}
                    onBack={handleBackToGrid}
                />
            )}

            {/* Modal - only on grid stage */}
            {selectedLetter && stage === 'grid' && (
                <AlphabetModal
                    letter={selectedLetter}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}

// ── Points calculation (mirrors typical backend logic) ──────────────
// Easy: 10pts/q · Medium: 20pts/q · Hard: 30pts/q, scaled by accuracy
function calcPoints({ difficulty, correctAnswers }) {
    const pts = { easy: 10, medium: 20, hard: 30 };
    return (pts[difficulty] ?? 10) * correctAnswers;
}