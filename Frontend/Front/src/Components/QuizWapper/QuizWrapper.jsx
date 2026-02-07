
import { useState } from 'react';
import './QuizWrapper.css';

function QuizWrapper({ quizPackage }) {
    if (!quizPackage || !quizPackage.information || !quizPackage.comprehensionQuestions) {
        return <div>Loading quiz...</div>; // Prevents crashes
    }

    const { information, comprehensionQuestions } = quizPackage;
    const title = information.title; 

    if (!Array.isArray(comprehensionQuestions) || comprehensionQuestions.length === 0) {
        return <div>No questions available.</div>;
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const currentQuestion = comprehensionQuestions[currentIndex];
    const [userAnswers, setUserAnswers] = useState(new Array(comprehensionQuestions.length).fill(''));


    const [quizComplete, setQuizComplete] = useState(false);  
    const isAtLastQuestion = currentIndex === comprehensionQuestions.length - 1;


    if (quizComplete) {
        const correctAnswers = comprehensionQuestions.map(q => q.correctAnswer);
        const score = userAnswers.reduce((acc, answer, idx) => 
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

        return (
            <div className='evaluationContainer'>
                <h1 className='readingSummaryElement'>Reading Comprehension Summary</h1>

                <h3 className='th'>Correct Answers</h3>
                <h3 className='th'>Score %</h3>
                <h3 className='th'>Remark</h3>
                <h3 className='th'>Interpretation</h3>


                <h3 className='th'>  {score} / {totalQuestions} </h3>
                <h3 className='th'>{percentage}%</h3>
                <h3 className='th'>{remark}</h3>
                <h3 className='th'>{interpretation}</h3>


{/* 
                <h2>Quiz Complete!</h2>
                <p>Your Score: {score} / {comprehensionQuestions.length}</p> */}
            </div>
        );
    }

    
    return (
        <>
            <div className='quizWrapperContainer'>

                <h1>{title}</h1>
                <div className="questionNumber">
                    Question <span>{currentIndex + 1}</span> of <span>{comprehensionQuestions.length}</span>
                </div>
            
        
                <h3 className='question'>{currentQuestion.question}</h3>

                <div className='optionsContainer'>
                    {currentQuestion.options.map((option, index) =>
                        <button 
                        key={index} 
                        className='optionButton'
                        onClick={() => setSelectedAnswer(option)}
                        >
                            {option}
                        </button>
                    )}
                </div>
                
                <button  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}>Previous</button>
                <button 
                className='nextButton' 
                
                onClick={() => {    
                    setUserAnswers(prevAnswers => {
                    const newAnswers = [...prevAnswers];  
                    newAnswers[currentIndex] = selectedAnswer;  
                    return newAnswers;
                });

                if (isAtLastQuestion) {
                    setQuizComplete(true);
                }else{
                    setCurrentIndex(Math.min(comprehensionQuestions.length - 1, currentIndex + 1));
                }

                
                setCurrentIndex(Math.min(comprehensionQuestions.length - 1, currentIndex + 1));

                setSelectedAnswer('');
            /**    {isAtLastQuestion ? 'Finish Quiz' : 'Next'}; */ 
                }}
                
                
                >Next</button>
            </div>
        </>
    );
}

export default QuizWrapper;
