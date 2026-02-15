import './QuizWrapper.css';
import { useState } from 'react';

function QuizWrapper({ quizPackage, onComplete }) {

    if (!quizPackage) {
        console.warn('⚠️ quizPackage is null/undefined');
        return <div className="quiz-loading">Loading quiz...</div>;
    }

    const { information = {}, comprehensionQuestions = [] } = quizPackage;
    
    console.log('Questions array:', comprehensionQuestions);
    console.log('Questions length:', comprehensionQuestions.length);

    if (!Array.isArray(comprehensionQuestions) || comprehensionQuestions.length === 0) {
        console.error('❌ No questions available');
        return (
            <div className="quiz-error">
                <h2>Quiz Not Available</h2>
                <p>This story doesn't have quiz questions yet.</p>
                <p><strong>Story:</strong> {information.title || 'Unknown'}</p>
                <p><strong>Story ID:</strong> {quizPackage._id || 'Unknown'}</p>
            </div>
        );
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [userAnswers, setUserAnswers] = useState([]);

    const currentQuestion = comprehensionQuestions[currentIndex];
    
    console.log('Current index:', currentIndex);
    console.log('Current question:', currentQuestion);

    if (!currentQuestion) {
        console.error('❌ Current question is undefined at index:', currentIndex);
        return (
            <div className="quiz-error">
                <p>Error: Question not found at index {currentIndex}</p>
                <button onClick={() => setCurrentIndex(0)}>Reset to Start</button>
            </div>
        );
    }

    const isAtLastQuestion = currentIndex === comprehensionQuestions.length - 1;

    const handleFinishQuiz = () => {
        const finalAnswers = [...userAnswers];
        finalAnswers[currentIndex] = selectedAnswer;
        
        const correctAnswers = comprehensionQuestions.map(q => q.correctAnswer);
        const score = finalAnswers.reduce((acc, answer, idx) => 
            answer === correctAnswers[idx] ? acc + 1 : acc, 0
        );
        const totalQuestions = comprehensionQuestions.length;
        const percentage = Math.round((score / totalQuestions) * 100);

        let remark = "";
        let interpretation = "";
        
        if (score === totalQuestions) {
            remark = "🌟 Excellent comprehension!";
            interpretation = "Student clearly understood the story and can move to next level.";
        } else if (score === totalQuestions - 1) {
            remark = "👍 Good effort!";
            interpretation = "Student understands most parts but needs more practice with details.";
        } else if (score === 1) {
            remark = "⚠️ Needs improvement.";
            interpretation = "Student has partial understanding — assign easier or guided activity.";
        } else {
            remark = "❌ Try again.";
            interpretation = "Student didn't comprehend the text — retake test or re-read story.";
        }

        const resultsObject = {
            score,
            totalQuestions,
            percentage,
            userAnswers: finalAnswers,
            correctAnswers,
            remark,
            interpretation,
            questionResults: comprehensionQuestions.map((q, idx) => ({
                question: q.question,
                userAnswer: finalAnswers[idx],
                correctAnswer: q.correctAnswer,
                isCorrect: finalAnswers[idx] === q.correctAnswer
            })),
            completedAt: new Date()
        };

        if (onComplete && typeof onComplete === 'function') {
            onComplete(resultsObject);
        }
    };

    const handleNext = () => {
        setUserAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[currentIndex] = selectedAnswer;
            return newAnswers;
        });

        if (isAtLastQuestion) {
            handleFinishQuiz();
        } else {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer('');
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setSelectedAnswer(userAnswers[currentIndex - 1] || '');
        }
    };

    return (
        <div className='quizWrapperContainer'>
            <h1>{information.title || 'Quiz'}</h1>
            
            <div className="questionNumber">
                Question <span>{currentIndex + 1}</span> of <span>{comprehensionQuestions.length}</span>
            </div>

            {/* ✅ Now 100% safe to access */}
            <h3 className='question'>{currentQuestion.question}</h3>

            <div className='optionsContainer'>
                {(currentQuestion.options || []).map((option, index) => (
                    <button 
                        key={index} 
                        className={`optionButton ${selectedAnswer === option ? 'selected' : ''}`}
                        onClick={() => setSelectedAnswer(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
            
            <button 
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="prevButton"
            >
                Previous
            </button>
            
            <button 
                className='nextButton' 
                onClick={handleNext}
                disabled={!selectedAnswer}
            >
                {isAtLastQuestion ? 'Finish Quiz' : 'Next'}
            </button>
        </div>
    );
}

export default QuizWrapper;