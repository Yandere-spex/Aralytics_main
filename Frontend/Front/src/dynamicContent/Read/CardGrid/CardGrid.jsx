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

    const handleBackToCards = () => {
        if (onBack) {
            onBack();  // ✅ Call parent's back function
        }
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

        {/* {takeQUiz === false ? <div className='readingGrid'>

            <div className='readingGridTitle'>
                <h1 className='readingGridHeader'>{selectedCard.information.title}</h1>
            </div>

            <div className='readingImgTxt'>
                <div className='coverReadingChild'>
                    <img src={selectedCard.cover} className='coverReading' />
                </div>
                <div className='coverReadingChild'> 
                    {selectedCard.information.shortStory}
                </div>
            </div>


            <div className='readingTimerBtn'>
                        <TimerComponent 
                            ref={timerRef}
                            showControls={false}
                            onTimeUpdate={handleTimeUpdate}
                        />

                        <Button width='250px' type='button' style={start} onClick={handleStart}>
                            {start === false ?  'Start'  : 'Done'}    
                        </Button>
            </div> 

        </div> : 
        
        <QuizWrapper quizPackage={caterpillarQuiz}/>
        
        } */}
        </>

    /*
        <div className='readingGrid'>

            <div className='readingGridTitle'>
                <h1 className='readingGridHeader'>{selectedCard.title}</h1>
            </div>

            <div className='readingImgTxt'>
                <div className='coverReadingChild'>
                    <img src={selectedCard.cover} className='coverReading' />
                </div>
                <div className='coverReadingChild'> 
                    One Sunday morning, a tiny egg lay on a leaf. When the sun came up, a small and very hungry caterpillar came out. He started to look for some food.
                    On Monday, he ate one apple. On Tuesday, he ate two pears. On Wednesday, he ate three plums. On Thursday, he ate four strawberries. On Friday, he ate five oranges.
                    But he was still hungry!
                    On Saturday, he ate lots of food—cake, ice cream, cheese, and more! His stomach hurt, so he ate a green leaf. He felt better.
                On Sunday, he wasn’t hungry anymore. He built a small house called a cocoon. After two weeks, he came out as a beautiful butterfly.
                </div>
            </div>


            <div className='readingTimerBtn'>

                        <TimerComponent 
                            ref={timerRef}
                            showControls={false}
                            onTimeUpdate={handleTimeUpdate}
                        />

                        <button onClick={handleStart}>Start</button> 
                        <button onClick={handleStop}>Stop</button>
                        <button onClick={handleReset}>Reset</button>

                    <Button width='250px' type='button' style={start} onClick={handleStart}>
                        {start === false ?  'Start'  : 'Done'}    
                    </Button>



            </div> 

        </div>
        */
    ); 
}


        {/* <div>
            <Quiz
                question="What did the caterpillar eat on Monday?"
                options={[
                    "One apple",
                    "Two pears",
                    "Three plums",
                ]}
                correctAnswer="One apple"
                onAnswer={handleAnswer}
            />
        </div> */}













/*
function classifyReadingLevel(wpm, difficulty) {
    let level;

    switch (difficulty) {
        case "Easy":
        if (wpm <= 80) level = "Beginner";
        else if (wpm <= 120) level = "Developing";
        else if (wpm <= 160) level = "Fair";
        else if (wpm <= 220) level = "Fluent";
        else if (wpm <= 300) level = "Advanced";
        else level = "Invalid (Too Fast)";
        break;

        case "Medium":
        if (wpm <= 100) level = "Beginner";
        else if (wpm <= 150) level = "Developing";
        else if (wpm <= 200) level = "Fair";
        else if (wpm <= 260) level = "Fluent";
        else if (wpm <= 350) level = "Advanced";
        else level = "Invalid (Too Fast)";
        break;

        case "Hard":
        if (wpm <= 120) level = "Beginner";
        else if (wpm <= 180) level = "Developing";
        else if (wpm <= 230) level = "Fair";
        else if (wpm <= 300) level = "Fluent";
        else if (wpm <= 400) level = "Advanced";
        else level = "Invalid (Too Fast)";
        break;

        default:
        level = "Unknown Difficulty";
    }

    return level;
    }


*/

        
        // if (currentLevel === "easy") {
        //     expectedWPM = "150-250 WPM";
        //     if (wpm > 400) speedRemark = "⚠️ Too fast!";
        //     else if (wpm >= 200) speedRemark = "✅ Good pace!";
        //     else speedRemark = "📖 Steady pace";
        // } else if (currentLevel === "medium") {
        //     expectedWPM = "180-280 WPM";
        //     if (wpm > 450) speedRemark = "⚠️ Too fast!";
        //     else if (wpm >= 220) speedRemark = "✅ Good pace!";
        //     else speedRemark = "📖 Steady pace";
        // } else if (currentLevel === "hard") {
        //     expectedWPM = "200-300 WPM";
        //     if (wpm > 500) speedRemark = "⚠️ Too fast!";
        //     else if (wpm >= 240) speedRemark = "✅ Good pace!";
        //     else speedRemark = "📖 Careful reading";
        // }