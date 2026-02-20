import { useState, useRef } from 'react';
import TimerComponent from '../../../Components/Timer/Timer';
import Button from '../../../Components/Button/Button';
import './StoryReader.css';


export default function StoryReader({ quizPackage, onComplete }){
    
    const timerRef = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [isReading, setIsReading] = useState(false);

    const handleStart = () => {
        setIsReading(true);
        timerRef.current?.start();
    };

    const handleDone = () => {
        timerRef.current?.stop();
        const metrics = calculateReadingMetrics();
        onComplete(metrics);
    };

    const calculateReadingMetrics = () => {
        const totalSeconds = Math.floor(currentTime / 1000);
        const wordCount = quizPackage.information.wordCount;
        const wpm = Math.round((wordCount / totalSeconds) * 60);
        
        const speedEval = evaluateSpeed(wpm, quizPackage.information.level);
        
        return {
            totalSeconds,
            totalMilliseconds: currentTime,
            wpm,
            wordCount,
            ...speedEval,
            storyTitle: quizPackage.information.title,
            level: quizPackage.information.level,
            completedAt: new Date()
        };
    };

    const evaluateSpeed = (wpm, level) => {
        const ranges = {
            'Easy': { min: 150, max: 250, fast: 400 },
            'Medium': { min: 180, max: 280, fast: 450 },
            'Hard': { min: 200, max: 300, fast: 500 }
        };

        const range = ranges[level] || ranges['Easy'];
        
        let speedRemark, speedColor;
        if (wpm > range.fast) {
            speedRemark = '⚠️ Too fast!';
            speedColor = '#f59e0b';
        } else if (wpm >= range.min) {
            speedRemark = '✅ Good pace!';
            speedColor = '#22c55e';
        } else {
            speedRemark = '📖 Steady pace';
            speedColor = '#3b82f6';
        }

        return {
            speedRemark,
            speedColor,
            expectedWPM: `${range.min}-${range.max} WPM`
        };
    };

    return(
        <>

            <div className="readingGrid">
                <div className="readingGridTitle">
                    <h1>{quizPackage.information.title}</h1>
                </div>

            <div className="readingImgTxt">
                <div className="coverReadingChild">
                    <img 
                        src={quizPackage.cover.url} 
                        alt={quizPackage.information.title}
                        className="coverReading"
                    />
                </div>

                <div className="coveReadingChild blur">
                    <p className='readingImgTxtChild2'
                    style={{ filter: isReading === false ? 'blur(5px)' : 'none' }}
                    > {quizPackage.information.shortStory}  </p>
                </div>
            </div>

            <div className="readingTimerBtn">
                
                <TimerComponent 
                    ref={timerRef}
                    showControls={false}
                    onTimeUpdate={setCurrentTime}
                />

                <Button 
                    width="250px"
                    onClick={isReading ? handleDone : handleStart}
                >
                    {isReading ? 'Done Reading' : 'Start Reading'}
                </Button>
            </div>
        </div>

        </>
    )
}