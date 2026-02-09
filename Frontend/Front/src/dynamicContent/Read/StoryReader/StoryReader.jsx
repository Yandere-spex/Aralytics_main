export default function StoryReader({ quizPackage,  timer, button, selectedCard }){
    return(
        <>
            <div className="readingGrid">

                <div className='readingGridTitle'>
                    <h1 className='readingGridHeader'>{quizPackage.information.title}</h1>
                </div>

                <div className='readingImgTxt'>

                    <div className='coverReadingChild'>
                        <img src={selectedCard.cover} className='coverReading' />
                    </div>

                    <div className='coverReadingChild'> 
                        {quizPackage.information.shortStory}
                    </div>

                </div>

                <div className='readingTimerBtn'>
                        {timer}
                        {button}

                </div>
            </div>
        </>
    )
}