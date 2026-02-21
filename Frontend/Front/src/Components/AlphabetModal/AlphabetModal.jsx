import { useState, useEffect, useRef } from 'react';
import './AlphabetModal.css';

export default function AlphabetModal({ letter, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const youtubePlayerRef = useRef(null);

    // useEffect(() => {
    //     // Automatically play sound when modal opens
    //     playSound();
    // }, []);

    const playSound = () => {
        if (letter.media.sound.youtubeUrl) {
        // If using YouTube, you'd need YouTube API or iframe
        playYouTubeSound();
        } else if (letter.media.sound.url) {
        // Play regular audio
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
        }
    };

    const playYouTubeSound = () => {
        // Extract YouTube video ID
        const videoId = extractYouTubeId(letter.media.sound.youtubeUrl);
        
        // Load YouTube iframe
        if (youtubePlayerRef.current) {
        youtubePlayerRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
        setIsPlaying(true);
        }
    };

    const extractYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
  };

    const handleAudioEnd = () => {
        setIsPlaying(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className="modal-close" onClick={onClose}>
            ✕
            </button>

            {/* Letter Header */}
            <div className="modal-header">
            <div className="modal-letter">{letter.letter}</div>
            <div className="modal-title">
                <h2>{letter.animal.name}</h2>
                <p className="scientific-name">{letter.animal.scientificName}</p>
            </div>
            </div>

            {/* Animated Image/GIF */}
            <div className="modal-media">
            {letter.media.animation ? (
                <img 
                src={letter.media.animation.url} 
                alt={`${letter.animal.name} animation`}
                className="animal-animation"
                />
            ) : (
                <img 
                src={letter.media.image.url} 
                alt={letter.media.image.alt}
                className="animal-image"
                />
            )}
            </div>

            {/* Animal Information */}
            <div className="modal-body">
            <div className="info-section">
                <h3>📖 Description</h3>
                <p>{letter.animal.description}</p>
            </div>

            <div className="info-section">
                <h3>🌍 Habitat</h3>
                <p>{letter.animal.habitat}</p>
            </div>

            <div className="info-section fun-fact">
                <h3>✨ Fun Fact</h3>
                <p>{letter.animal.funFact}</p>
            </div>
            </div>

            {/* Sound Controls */}
            <div className="sound-controls">
            <button 
                className={`sound-button ${isPlaying ? 'playing' : ''}`}
                onClick={playSound}
            >
                {isPlaying ? '🔊 Playing...' : '🔊 Play Sound'}
            </button>

            {/* Hidden Audio Element */}
            {letter.media.sound.url && (
                <audio
                ref={audioRef}
                src={letter.media.sound.url}
                onEnded={handleAudioEnd}
                />
            )}

            {/* YouTube Player */}
            {letter.media.sound.youtubeUrl && (
                <div className="youtube-player">
                <iframe
                    ref={youtubePlayerRef}
                    width="100%"
                    height="200"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                </div>
            )}
            </div>

            {/* Pronunciation */}
            <div className="pronunciation-section">
            <span className="pronunciation-label">Pronunciation:</span>
            <span className="pronunciation-text">{letter.pronunciation.phonetic}</span>
            {letter.pronunciation.audioUrl && (
                <button 
                className="pronunciation-button"
                onClick={() => {
                    const audio = new Audio(letter.pronunciation.audioUrl);
                    audio.play();
                }}
                >
                🔊
                </button>
            )}
            </div>
        </div>
        </div>
    );
}