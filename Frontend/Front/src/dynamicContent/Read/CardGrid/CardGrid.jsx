import './CardGrid.css';

export default function CardGrid({ selectedCard }) {
    return (
        <div className='parent'>
            <h1>
                Hello World{selectedCard.title}
            </h1>
        </div>
    );
}