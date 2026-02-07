import './CardGrid.css';
import Button from '../../../Components/Button/Button';
import TimerComponent from '../../../Components/Timer/Timer';
import QuizWrapper from '../../../Components/QuizWapper/QuizWrapper.jsx';
import { useState, useRef } from 'react';



export default function CardGrid({ selectedCard }) {


    const caterpillarQuiz = {

    _id: "story_001", 
    category: "animals",  
    ageRange: "5-7",  
    
    information: {
        title: "The Very Hungry Caterpillar",
        level: "Easy",  // or use: "easy" (lowercase for consistency)
        wordCount: 120,
        shortStory: "One Sunday morning, a tiny egg lay on a leaf. When the sun came up, a small and very hungry caterpillar came out. He started to look for some food. On Monday, he ate one apple. On Tuesday, he ate two pears. On Wednesday, he ate three plums. On Thursday, he ate four strawberries. On Friday, he ate five oranges. But he was still hungry! On Saturday, he ate lots of food—cake, ice cream, cheese, and more! His stomach hurt, so he ate a green leaf. He felt better. On Sunday, he wasn't hungry anymore. He built a small house called a cocoon. After two weeks, he came out as a beautiful butterfly.",
        estimatedReadingTime: "1-2 minutes",  // Optional: helpful for teachers
        author: "Eric Carle",  // Optional: credit the author
        theme: "Growth and transformation"  // Optional: educational theme
    },
    
    comprehensionQuestions: [
        {
            id: "q1",  // Add IDs for each question
            question: "What did the caterpillar eat on Monday?",
            options: ["One apple", "Two pears", "Three plums"],
            correctAnswer: "One apple",
            difficulty: "easy",  // Optional: question difficulty
            skill: "recall"  // Optional: comprehension skill being tested
        },
        {
            id: "q2",
            question: "Why did the caterpillar feel sick?",
            options: ["He ate too much food", "He was sleepy", "He didn't eat anything"],
            correctAnswer: "He ate too much food",
            difficulty: "medium",
            skill: "inference"
        },
        {
            id: "q3",
            question: "What did the caterpillar become in the end?",
            options: ["A worm", "A butterfly", "A bee"],
            correctAnswer: "A butterfly",
            difficulty: "easy",
            skill: "recall"
        }
    ],
    
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,  
    completionCount: 0 
};







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
            



            // timerRef.current?.stop();
            timerRef.current.reset();
            wordsPerMinute();
            // setTakeQuiz(true);
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
        const wpm = ((120 / totalSeconds) * 60).toFixed(2);

        let speedRemark = "";
        let expectedWPM = "";
        
        if (caterpillarQuiz.information.level === "Easy") {
            expectedWPM = "150-250 WPM";
            if (wpm > 400) speedRemark = "⚠️ Too fast!";
            else if (wpm >= 200) speedRemark = "✅ Good pace!";
            else speedRemark = "📖 Steady pace";
        } else if (caterpillarQuiz.information.level === "Medium") {
            expectedWPM = "180-280 WPM";
            if (wpm > 450) speedRemark = "⚠️ Too fast!";
            else if (wpm >= 220) speedRemark = "✅ Good pace!";
            else speedRemark = "📖 Steady pace";
        } else if (caterpillarQuiz.information.level === "Hard") {
            expectedWPM = "200-300 WPM";
            if (wpm > 500) speedRemark = "⚠️ Too fast!";
            else if (wpm >= 240) speedRemark = "✅ Good pace!";
            else speedRemark = "📖 Careful reading";
        }

        alert(`Wpm: ${wpm} seconds: ${totalSeconds} milliseconds: ${currentTime} ${speedRemark}`);    
    }

    const handleAnswer = (result) => {
        console.log('Answer submitted:', result);
    };

    return (
        <>
        {takeQUiz === false ? <div className='readingGrid'>

            <div className='readingGridTitle'>
                <h1 className='readingGridHeader'>{caterpillarQuiz.information.title}</h1>
            </div>

            <div className='readingImgTxt'>
                <div className='coverReadingChild'>
                    <img src={selectedCard.cover} className='coverReading' />
                </div>
                <div className='coverReadingChild'> 
                    {caterpillarQuiz.information.shortStory}
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
        
        }
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