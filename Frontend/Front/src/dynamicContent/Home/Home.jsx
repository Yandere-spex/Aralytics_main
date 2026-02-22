import './Home.css';
import { useState } from 'react';
import AlphabetCard from '../../Components/AlphabetCard/AlphabetCard';
import AlphabetModal from '../../Components/AlphabetModal/AlphabetModal';

export default function Home() {

    const [selectedLetter, setSelectedLetter] = useState(null);

    const letterE = {
    "_id": {
        "$oid": "699acc2bac68209fd83ad4c9"
    },
    "letter": "E",
    "order": 5,
    "animal": {
        "name": "Elephant",
        "scientificName": "Loxodonta",
        "description": "Elephants are the largest land mammals on Earth, known for their intelligence, long trunks, and strong social bonds. They use their trunks for communication, feeding, and interacting with their environment.",
        "funFact": "An elephant’s trunk has more than 40,000 muscles and can pick up objects as small as a grain of rice or as large as a tree branch.",
        "habitat": "Savannas, forests, deserts, and marshes across Africa and Asia"
    },
    "media": {
        "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/640px-African_Bush_Elephant.jpg",
            "alt": "Elephant walking through the savanna"
        },
        "animation": {
            "url": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2Q1bndtNDluYW55ODl0YWQwYWVmNmc2ajRucXR2YTR2d3hwMHMzcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SWKyABQ08mbXW/giphy.gif",
            "type": "gif"
        },
        "video": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c5/Indian_elephant_in_Kaziranga_National_Park_March_2025_by_Tisha_Mukherjee_01.mpg/Indian_elephant_in_Kaziranga_National_Park_March_2025_by_Tisha_Mukherjee_01.mpg.240p.vp9.webm",
            "videoId": "",
            "title": "Elephants: Gentle Giants of the Wild"
        },
        "sound": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/4/40/Elephant_voice_-_trumpeting.ogg",
            "duration": 5,
            "format": "mp3"
        }
    },
    "pronunciation": {
        "phonetic": "/ˈɛl.ɪ.fənt/",
        "audioUrl": ""
    },
    "statistics": {
        "viewCount": 0,
        "playCount": 0,
        "lastViewed": {
            "$date": "2025-01-01T00:00:00.000Z"
        }
    },
    "isActive": true,
    "createdBy": {
        "$oid": "000000000000000000000000"
    },
    "createdAt": {
        "$date": "2025-01-01T00:00:00.000Z"
    },
    "updatedAt": {
        "$date": "2025-01-01T00:00:00.000Z"
    }
};

    const handleCardClick = () => {
        setSelectedLetter(letterB);
    };

    const handleCloseModal = () => {
        setSelectedLetter(null);
    };

    return (
        <>
           
            
        </>
    );
}