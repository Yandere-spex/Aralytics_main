import './CardGrid.css';
import Button from '../../../Components/Button/Button';
import TimerComponent from '../../../Components/Timer/Timer';
import ResultScreen from '../../../Components/ResultScreen/ResultScreen.jsx';
import StoryReader from '../../Read/StoryReader/StoryReader.jsx';
import QuizWrapper from '../../../Components/QuizWapper/QuizWrapper.jsx';
import { useState, useRef } from 'react';




export default function CardGrid({ selectedCard }) {

    //State Screen situation
    const [stage, setStage] = useState('reading');
    const [readingMetrics, setReadingMetrics] = useState(null);
    const [quizResults, setQuizResults] = useState(null);


    const timerRef = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [start, setStart] = useState(false);
    const [takeQUiz, setTakeQuiz] = useState(false);


    const handleStart = () => {
        if(start === false){
            setStart(true);
            timerRef.current?.start();
        }else{
            // timerRef.current?.stop();
            timerRef.current.reset();
            wordsPerMinute();
            setTakeQuiz(true);
        }
    };

    

    const handleTimeUpdate = (time) => {
        console.log('Time updated:', time);
        setCurrentTime(time);

    };

    const handleReadingComplete = (metrics) => {
        console.log('Reading complete:', metrics);
        setReadingMetrics(metrics);
        setStage('quiz'); 
    }

    const handleQuizComplete = (results) => {
        setQuizResults(results);
        setStage('results');
    };

    const handleRetry = () => {
        setReadingMetrics(null);
        setQuizResults(null);
        setStage('reading');
    };





    return (
        <>
            {stage === 'reading' && (
                <StoryReader 
                    quizPackage={selectedCard}
                    selectedCard={selectedCard}
                    onComplete={handleReadingComplete}
                    isBlurred={start}
                    timer={ 
                            <TimerComponent 
                            ref={timerRef}
                            showControls={false}
                            onTimeUpdate={handleTimeUpdate}
                        /> 
                    }
                    button={
                        <Button width='250px' type='button' style={start} onClick={handleStart}>
                            {start === false ?  'Start'  : 'Done'}    
                        </Button>
                        }
                />
            )}

            {/* Stage 2: Quiz */}
            {stage === 'quiz' && (
                <QuizWrapper 
                    quizPackage={selectedCard}
                    readingMetrics={readingMetrics}  // Pass reading data
                    onComplete={handleQuizComplete}
                />
            )}

            {/* Stage 3: Results */}
            {stage === 'results' && (
                <ResultScreen 
                    storyInfo={selectedCard.information}
                    readingMetrics={readingMetrics}
                    quizResults={quizResults}
                    onRetry={handleRetry}
                />
            )}
    </>
    )}