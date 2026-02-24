import { useState, useEffect } from 'react';
import { getAllLetters } from '../../services/alphabetService.js';
import AlphabetCard from '../../Components/AlphabetCard/AlphabetCard.jsx';
import AlphabetModal from '../../Components/AlphabetModal/AlphabetModal.jsx';
import './AlphabetGrid.css';

export default function AlphabetGrid() {
    const [letters, setLetters] = useState([]);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLetters = async () => {
        try {
            const data = await getAllLetters();
            setLetters(data);
            console.log(data);
            
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchLetters();
    }, []);

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
    };

    const handleCloseModal = () => {
        setSelectedLetter(null);
    };

    if (loading) {
        return <div className="loading">Loading alphabet...</div>;
    }

    return (
    <>
        <div className="alphabet-container">
            <h1 className="alphabet-title">Learn the Alphabet and Animal ! 🎉</h1>
            <p className="alphabet-subtitle">Click on any letter to discover an animal!</p>
            
            <div className="alphabet-grid">
            {letters.map((letter, index) => (
                <AlphabetCard
                key={letter._id}
                letter={letter}
                index={index}
                onClick={() => handleLetterClick(letter)}
                />
            ))}
            </div>
        </div>

        {selectedLetter && (
            <AlphabetModal
            letter={selectedLetter}
            onClose={handleCloseModal}
            />
        )}
    </>
    );
}