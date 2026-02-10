import './QuizWrapper.css';
import { useState } from 'react';

function QuizWrapper({ quizPackage, onComplete }) {
    const { information, comprehensionQuestions } = quizPackage;
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [userAnswers, setUserAnswers] = useState(new Array(comprehensionQuestions.length).fill(''));
    const [quizComplete, setQuizComplete] = useState(false);

    const isAtLastQuestion = currentIndex === comprehensionQuestions.length - 1;

    // ✅ Calculate and send results when quiz completes
    const handleFinishQuiz = () => {
        // Save last answer
        const finalAnswers = [...userAnswers];
        finalAnswers[currentIndex] = selectedAnswer;
        
        // Calculate results
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

        // ✅ Create results object
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

        // ✅ Send to parent via callback
        if (onComplete && typeof onComplete === 'function') {
            onComplete(resultsObject);  // Parent receives this object
        }
    };

    const handleNext = () => {
        // Save current answer
        setUserAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[currentIndex] = selectedAnswer;
            return newAnswers;
        });

        // Check if last question
        if (isAtLastQuestion) {
            handleFinishQuiz();  // ✅ Calculate and send results
        } else {
            setCurrentIndex(currentIndex + 1);
        }

        setSelectedAnswer('');
    };

    return (
        <div className='quizWrapperContainer'>
            <h1>{information.title}</h1>
            
            <div className="questionNumber">
                Question <span>{currentIndex + 1}</span> of <span>{comprehensionQuestions.length}</span>
            </div>

            <h3 className='question'>{comprehensionQuestions[currentIndex].question}</h3>

            <div className='optionsContainer'>
                {comprehensionQuestions[currentIndex].options.map((option, index) => (
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
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
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