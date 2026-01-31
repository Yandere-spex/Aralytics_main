import { useState } from 'react';
import './Read.css';
import Reading from './Reading/Reading.jsx';
import ReadCard from '../../Components/ReadCard/ReadCard.jsx';
import coverLittle from '../../../public/The Little princess Cover.webp';
import coverpillar from '../../../public/The Very hungry caterpillar.webp';
import CardGrid from './CardGrid/CardGrid.jsx';
import AliceAdventures from '../../../public/Alices Adventures in Wonderland.webp';

export default function Read(){

    const [cards, setCards] = useState([
        {
            title:"The Little Princess",
            cover: coverLittle
        },{
            title:"The Very Hungry Caterpillar",
            cover: coverpillar,
        },{
            title:"Alice in Adventures in Wonderland",
            cover: AliceAdventures,
        }   
        
    ]);
    const [selectedCard, setSelectedCard] = useState(null)


    const handleCardClick = (cardData) => {
        setSelectedCard(cardData); 
        console.log(selectedCard);
        
    };











    return(
        <div className='mainRead'>

            {selectedCard === null 
            ? cards.map((card, index) => ( 
                <ReadCard
                    key={card.id || index}  
                    cover={card.cover}
                    title={card.title}
                    onClick={() => handleCardClick(card)} 
                />
            ))
            : <CardGrid selectedCard={selectedCard} />
            }


        </div>
    )
}