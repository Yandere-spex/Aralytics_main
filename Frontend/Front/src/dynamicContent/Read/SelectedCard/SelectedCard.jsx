import './SelectedCard.css'
import { useState, useEffect } from 'react';
import littleRedRiding from '../../../assets/imageCover/THe little Red Riding Hood.jpg';
import coverLittle from '../../../assets/imageCover/The Little princess Cover.webp';
import coverpillar from '../../../assets/imageCover/The Very hungry caterpillar.webp';
import ReadCard from '../../../Components/ReadCard/ReadCard.jsx';
import CardGrid from '../CardGrid/CardGrid.jsx';
import { getAllStories } from '../../../services/storyService.js';


export default function SelectedCard(){

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

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



    const [selectedCard, setSelectedCard] = useState(null)


    const handleCardClick = (cardData) => {
        setSelectedCard(cardData);    
    };












    return(
        <>
                <div className={selectedCard === null ? 'mainRead' : ''}>
                {selectedCard === null
                    ? stories.map((card, index) => ( 
                        <ReadCard
                            key={card._id || index}  // FIXED: Use _id
                            cover={card.cover.url}  
                            title={card.information.title}  
                            onClick={() => handleCardClick(card)}
                        />
                    ))
                    : <CardGrid selectedCard={selectedCard} />
                }
            </div>

        </>
    )
}