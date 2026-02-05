import './CardGrid.css';
import Button from '../../../Components/Button/Button';
import TimerComponent from '../../../Components/Timer/Timer';
import { useState, useRef } from 'react';

import Quiz from '../../../Components/Quiz/Quiz';


export default function CardGrid({ selectedCard }) {

    const timerRef = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [start, setStart] = useState(false);
    const [takeQUiz, setTakeQuiz] = useState(false)


    const handleStart = () => {
        if(start === false){
            setStart(true);
            timerRef.current?.start();
        }else{
            timerRef.current?.stop();
            wordsPerMinute();
            setTakeQuiz(true);
        }
    };

    const handleTimeUpdate = (time) => {
        console.log('Time updated:', time);
        setCurrentTime(time);

    };
    const handleStop = () => {
        timerRef.current?.stop();
    };

    const handleReset = () => {
        timerRef.current?.reset();
    };

    const wordsPerMinute = () => {
        const totalSeconds = Math.floor(currentTime / 1000);
        setSeconds(totalSeconds); 
        const reading_speed_wpm = ((120 / totalSeconds) * 60);
        const wpm = ((120 / totalSeconds) * 60).toFixed(2);
        alert(`The result is ${wpm} WPM. Total seconds: ${totalSeconds}, milliseconds: ${currentTime}`);    
    }

    const handleAnswer = (result) => {
        console.log('Answer submitted:', result);
    };

    return (
        <>
        {takeQUiz === false ? <div className='readingGrid'>

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

        </div> : <div>
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
        </div>}
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