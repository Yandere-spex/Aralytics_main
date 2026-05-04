import { useState, useEffect } from 'react';
import { getAllLetters } from '../../services/alphabetService.js';
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

    const handleQuizComplete = (results) => {
        setQuizResults(results);
        setStage('results');
    };

    const handleRetry = () => {
        setQuizResults(null);
        setSelectedDifficulty(null);
        setStage('difficulty');
    };

    const handleBackToGrid = () => {
        setQuizResults(null);
        setSelectedDifficulty(null);
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