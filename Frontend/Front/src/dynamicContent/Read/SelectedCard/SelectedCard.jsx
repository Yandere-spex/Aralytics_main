import './SelectedCard.css';

import { useState, useEffect, useRef  } from 'react';
import ReadCard from '../../../Components/ReadCard/ReadCard.jsx';
import StoryReader from '../../Read/StoryReader/StoryReader.jsx';
import QuizWrapper from '../../../Components/QuizWapper/QuizWrapper.jsx';
import ResultScreen from '../../../Components/ResultScreen/ResultScreen.jsx';
import Button from '../../../Components/Button/Button';
import TimerComponent from '../../../Components/Timer/Timer';
import { getAllStories } from '../../../services/storyService.js';


export default function SelectedCard(){

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    //stage management
    const [stage, setStage] = useState('select');

    const [selectedStory, setSelectedStory] = useState(null);

    const [onBackToStoriesState, setOnBackStoriesState] = useState(true);

    //reading metrics and quiz result
    const [readingMetrics, setReadingMetrics] = useState(null);
    const [quizResults, setQuizResults] = useState(null);

    

    //timerState
    const timerRef = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [seconds, setSeconds] = useState(0);



    //quiz wrapper state
    const [start, setStart] = useState(false);
    const [takeQUiz, setTakeQuiz] = useState(false);






    useEffect(() => {
    const fetchStories = async () => {
        try {
            const data = await getAllStories();
            setStories(data);
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
        }
        };
        
        fetchStories();
    }, []);



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


    const handleStorySelect = (story) => {
        setSelectedStory(story);
        console.log(selectedStory);
        setStage('reading') 
            
    }

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

    const onAnotherStory = () => {
    // Reset all states
    setSelectedStory(null);
    setReadingMetrics(null);
    setQuizResults(null);
    setStart(false);
    setTakeQuiz(false);
    setCurrentTime(0);
    
    // Reset timer if it exists
    if (timerRef.current) {
        timerRef.current.reset();
    }
    
    // Go back to select stage
    setStage('select');
    
    console.log('Returning to story selection...');
}






//     const renderStep = (step) => {
//     switch (step) {
//         case 'select':
//         return (
//                 <div className="mainRead">
//                         {loading ? (
//                             <div className="loading fade-in">Loading stories...</div>
//                         ) : stories.length === 0 ? (
//                             <p className="fade-in">No stories available</p>
//                         ) : (
//                             stories.map((card, idx) => (
//                                 <div 
//                                     key={card._id ?? idx}
//                                     className={`card-wrapper stagger-${Math.min(idx + 1, 5)}`}
//                                 >
//                                     <ReadCard
//                                         stories={card}
//                                         onClick={() => handleStorySelect(card)}
//                                     />
//                                 </div>
//                             ))
//                         )}
//                     </div>
//         );


//         case 'reading': 
//         return(
//             <StoryReader 
//                     quizPackage={selectedStory}
//                     selectedCard={selectedStory}
//                     onComplete={handleReadingComplete}
//                     isBlurred={start}
//                     timer={ 
//                             <TimerComponent 
//                             ref={timerRef}
//                             showControls={false}
//                             onTimeUpdate={handleTimeUpdate}
//                         /> 
//                     }
//                     button={
//                         <Button width='250px' type='button' style={start} onClick={handleStart}>
//                             {start === false ?  'Start'  : 'Done'}    
//                         </Button>
//                         }
//                 />
//         )
//         case 'quiz':  
//         return(
//         <QuizWrapper 
//                     quizPackage={selectedStory}
//                     readingMetrics={readingMetrics}  // Pass reading data
//                     onComplete={handleQuizComplete}
//                 />

//         );

//         case 'results':  
//         return(
//             <ResultScreen 
//                     storyInfo={selectedStory.information}
//                     readingMetrics={readingMetrics}
//                     quizResults={quizResults}
//                     onRetry={handleRetry}
//                     onAnotherStory={onAnotherStory}
//                 />
//         );
//         default:        return <h1>Error</h1>;
//     }
// };
const renderStep = (step) => {
    switch (step) {
        case 'select':
            return (
                <div className="mainRead">
                    {loading ? (
                        <div className="loading">Loading stories...</div>
                    ) : stories.length === 0 ? (
                        <p>No stories available</p>
                    ) : (
                        stories.map((card, idx) => (
                            <div 
                                key={card._id ?? idx}
                                className="card-wrapper"
                            >
                                <ReadCard
                                    stories={card}
                                    onClick={() => handleStorySelect(card)}
                                />
                            </div>
                        ))
                    )}
                </div>
            );

        case 'reading': 
            return (
                <div className="stage-reading"> {/* Add this wrapper */}
                    <StoryReader 
                        quizPackage={selectedStory}
                        selectedCard={selectedStory}
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
                            <Button 
                                width='250px' 
                                type='button' 
                                style={start} 
                                onClick={handleStart}
                            >
                                {start === false ? 'Start' : 'Done'}    
                            </Button>
                        }
                    />
                </div>
            );

        case 'quiz':  
            return (
                <div className="stage-quiz"> {/* Add this wrapper */}
                    <QuizWrapper 
                        quizPackage={selectedStory}
                        readingMetrics={readingMetrics}
                        onComplete={handleQuizComplete}
                    />
                </div>
            );

        case 'results':  
            return (
                <div className="stage-results"> {/* Add this wrapper */}
                    <ResultScreen 
                        storyInfo={selectedStory?.information}
                        readingMetrics={readingMetrics}
                        quizResults={quizResults}
                        onRetry={handleRetry}
                        onAnotherStory={onAnotherStory}
                    />
                </div>
            );

        default:        
            return <h1>Error: Invalid stage "{step}"</h1>;
    }
};




    return(
        <>

{/*         
        {onBackToStoriesState && ( 
            <div className={selectedCard === null ? 'mainRead' : ''}>
                {selectedStory === null
                    ? stories.map((card, index) => (
                        <ReadCard
                            key={card._id || index}
                            stories={card}
                            onClick={handleStorySelect}
                        />
                    ))
                    : (
                    <CardGrid 
                        selectedCard={selectedStory}
                        onBackToStories={onBackToStories}
                    />
                )}

            </div>
        )}
            
         */}


        {renderStep(stage)}











        </>
    )
}