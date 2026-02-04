import './CardGrid.css';
import Button from '../../../Components/Button/Button';
import TimerComponent from '../../../Components/Timer/Timer';
import { useState } from 'react';

export default function CardGrid({ selectedCard }) {

    const [start, setStart] = useState(false);
    const [stop, setStop] = useState(false);
    const [reset, setReset] = useState(false);

    const handleStart = () => {
        setStart(true);
        setTimeout(() => setStart(false), 0); // Reset prop after triggering
    };

    const handleStop = () => {
        setStop(true);
        setTimeout(() => setStop(false), 0);
    };

    const handleReset = () => {
        setReset(true);
        setTimeout(() => setReset(false), 0);
    };

    const handleTimeUpdate = (time) => {
    console.log(`Elapsed time: ${time} ms`);
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


                <TimerComponent
                autoStart={false}
                showControls={false}
                onTimeUpdate={handleTimeUpdate}
                style={{ color: 'red', fontWeight: 'bold' }}


                />
            

                <Button type='button' width='250px' onClick={handleStart} style= {start}>
                    {start === false ? 'Start' : 'Done'}
                </Button>


        </div>
    );
}