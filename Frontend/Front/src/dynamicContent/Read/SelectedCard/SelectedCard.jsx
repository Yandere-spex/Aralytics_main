import './SelectedCard.css'
import { useState, useEffect } from 'react';
import littleRedRiding from '../../../assets/imageCover/THe little Red Riding Hood.jpg';
import coverLittle from '../../../assets/imageCover/The Little princess Cover.webp';
import coverpillar from '../../../assets/imageCover/The Very hungry caterpillar.webp';
import ReadCard from '../../../Components/ReadCard/ReadCard.jsx';
import CardGrid from '../CardGrid/CardGrid.jsx';
import { getAllStories, getStoryById } from '../../../services/storyService.js';


export default function SelectedCard(){

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState(null);


    useEffect(() => {
    const fetchStories = async () => {
        try {
            const data = await getAllStories();
            setStories(data);
            console.log(data);
            
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
        }
        };
        
        fetchStories();
    }, []);



    const [selectedCard, setSelectedCard] = useState(null)


    const handleCardClick = (cardData) => {
        setSelectedCard(cardData);    
    };

    const handleStorySelect = (story) => {
        setSelectedStory(story);    
    }










    return(
        <>
                <div className={selectedCard === null ? 'mainRead' : ''}>
                {selectedStory === null
                    ? stories.map((card, index) => ( 
                        <ReadCard
                            key={card._id || index}  // FIXED: Use _id
                            stories={card}
                            onClick={handleStorySelect} 
                        />
                        
                        
                    ))
                    : <CardGrid selectedCard={selectedStory} />
                }
            </div>

        </>
    )
}