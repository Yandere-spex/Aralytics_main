import './CardGrid.css';
import Button from '../../../Components/Button/Button';
import TimerComponent from '../../../Components/Timer/Timer';
import { useState, useRef } from 'react';


export default function CardGrid({ selectedCard }) {

    const timerRef = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [start, setStart] = useState(false);


    const handleStart = () => {
        if(start === false){
            setStart(true);
            timerRef.current?.start();
        }else{
            timerRef.current?.stop();
            wordsPerMinute();
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
        setSeconds(totalSeconds); // This updates state for later use
        
        // Use totalSeconds directly, NOT seconds state
        const reading_speed_wpm = (120 / totalSeconds) * 60;
        
        alert(`The result is ${reading_speed_wpm} WPM. Total seconds: ${totalSeconds}, milliseconds: ${currentTime}`);
    }


    return (
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

                        {/* <button onClick={handleStart}>Start</button> */}
                        <button onClick={handleStop}>Stop</button>
                        <button onClick={handleReset}>Reset</button>

                    <Button width='250px' type='button' style={start} onClick={handleStart}>
                        {start === false ?  'Start'  : 'Done'}    
                    </Button>


            </div>

        </div>
    );
}