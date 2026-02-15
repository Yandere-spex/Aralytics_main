import './ReadCard.css';

export default function ReadCard({ stories ,onClick }) {
    
    // Capitalize difficulty level for display
    


    return (
        <div className='readCardContainer'>
            <img 
                className='coverReadCard' 
                src={stories.cover.url} 
                alt={stories.information.title || 'Story cover'}
            />
            
            <div> 
                <h4>{stories.information.title || 'Untitled Story'}</h4>

                <div className='forDifficultAndHeart'> 
                    <span className='textMode'>
                        Difficulty: {stories.level}
                    </span>
                    <span> 
                        <i className="fa-regular fa-heart"></i>
                    </span>
                </div>
            </div>
            
            <button className='readBtn' onClick={() => onClick(stories)}>
                Start Your Journey
            </button>
        </div>
    );
}