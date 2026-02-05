import { useState } from 'react';
import './Quiz.css';

const Quiz = ({ 
    question, 
    options, 
    correctAnswer, 
    onAnswer,
    showResult = true,
    customStyles = {}
}) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (option) => {
        if (!isSubmitted) {
            setSelectedAnswer(option);
        }
    };

    const handleSubmit = () => {
        if (selectedAnswer) {
            setIsSubmitted(true);
            const isCorrect = selectedAnswer === correctAnswer;
            
            if (onAnswer) {
                onAnswer({
                    question,
                    selectedAnswer,
                    correctAnswer,
                    isCorrect
                });
            }
        }
    };

    const handleReset = () => {
        setSelectedAnswer(null);
        setIsSubmitted(false);
    };

    const getOptionClass = (option) => {
        if (!isSubmitted) {
            return selectedAnswer === option ? 'option selected' : 'option';
        }
        
        if (option === correctAnswer) {
            return 'option correct';
        }
        
        if (option === selectedAnswer && option !== correctAnswer) {
            return 'option incorrect';
        }
        
        return 'option disabled';
    };

    const letters = ['A', 'B', 'C', 'D'];

    return (
        <div className="quiz-container" style={customStyles}>
            <div className="quiz-question">
                <h2>{question}</h2>
            </div>

            <div className="quiz-options">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={getOptionClass(option)}
                        onClick={() => handleSelect(option)}
                    >
                        <span className="option-letter">{letters[index]}</span>
                        <span className="option-text">{option}</span>
                        
                        {isSubmitted && option === correctAnswer && (
                            <span className="option-icon">✓</span>
                        )}
                        {isSubmitted && option === selectedAnswer && option !== correctAnswer && (
                            <span className="option-icon">✗</span>
                        )}
                    </div>
                ))}
            </div>

            {showResult && isSubmitted && (
                <div className={`result ${selectedAnswer === correctAnswer ? 'correct' : 'incorrect'}`}>
                    {selectedAnswer === correctAnswer 
                        ? '🎉 Correct! Great job!' 
                        : `❌ Incorrect. The correct answer is: ${correctAnswer}`
                    }
                </div>
            )}

            <div className="quiz-actions">
                {!isSubmitted ? (
                    <button 
                        className="btn-submit" 
                        onClick={handleSubmit}
                        disabled={!selectedAnswer}
                    >
                        Submit Answer
                    </button>
                ) : (
                    <button className="btn-reset" onClick={handleReset}>
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quiz;