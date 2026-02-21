import './Home.css';
import { useState } from 'react';
import AlphabetCard from '../../Components/AlphabetCard/AlphabetCard';
import AlphabetModal from '../../Components/AlphabetModal/AlphabetModal';

export default function Home() {

    const [selectedLetter, setSelectedLetter] = useState(null);

    const letterA = {
        letter: "A", order: 1,
        animal: {
            name: "Alligator",
            scientificName: "Alligator mississippiensis",
            description: "A large reptile with powerful jaws and a long tail. Alligators are excellent swimmers and can hold their breath underwater for long periods.",
            funFact: "Alligators can live up to 50 years in the wild and have been around for millions of years, even surviving the extinction of the dinosaurs!",
            habitat: "Swamps, rivers, and freshwater lakes"
        },
        media: {
            image: {
                url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.dolBZIqD7PKrMHQWv1PtNgHaE8%3Fpid%3DApi&f=1&ipt=db717d75091dbfbef2dc07137949f99c28b3b09508d1dcbbc2f705709157326e&ipo=images",
                alt: "Alligator basking in the sun"
            },
            animation: {
                url: "https://media3.giphy.com/media/cCEdVDtDeSGKecufGv/giphy.gif",
                type: "gif"
            },
            sound: {
                url: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Alligator_mississippiensis_sound.ogg",
                duration: 4,
                youtubeUrl: "https://www.youtube.com/embed/GMsGKwbj9Ys"
            }
        },
        pronunciation: {
            phonetic: "/ˈæl.ɪ.ɡeɪ.tər/",
            audioUrl: "https://ssl.gstatic.com/dictionary/static/sounds/20200429/alligator--_us_1.mp3"
        }
    }

    const handleCardClick = () => {
        setSelectedLetter(letterA);
    };

    const handleCloseModal = () => {
        setSelectedLetter(null);
    };

    return (
        <>
            <div className="home-container">
                <h1 className="home-title">Learn the Alphabet! 🎉</h1>
                <p className="home-subtitle">Click on the card to explore!</p>

                <div className="card-test-wrapper">
                    <AlphabetCard 
                        letter={letterA} 
                        index={0}
                        onClick={handleCardClick}
                    />
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