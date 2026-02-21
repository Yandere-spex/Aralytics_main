import './AlphabetCard.css';

export default function AlphabetCard({ letter, index, onClick }) {
  const animationDelay = `${index * 0.05}s`;

    return (
    <div 
        className="alphabet-card"
        style={{ animationDelay }}
        onClick={onClick}
        >
        {/* Large Letter */}
        <div className="letter-display">
            <span className="letter-upper">{letter.letter}</span>
            <span className="letter-lower">{letter.letter.toLowerCase()}</span>
        </div>

        {/* Animal Image */}
        <div className="animal-preview">
            <img 
            src={letter.media.image.url} 
            alt={letter.media.image.alt}
            loading="lazy"
            />
        </div>

        {/* Animal Name */}
        <div className="animal-name">
            <span className="name-text">{letter.animal.name}</span>
            <span className="name-phonetic">{letter.pronunciation.phonetic}</span>
        </div>

        {/* Hover Effect */}
        <div className="card-overlay">
            <span className="click-hint">Click to explore! 🔍</span>
        </div>
        </div>
    );
}