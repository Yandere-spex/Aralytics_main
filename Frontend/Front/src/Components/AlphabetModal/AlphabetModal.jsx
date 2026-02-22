import { useState, useRef } from 'react';
import './AlphabetModal.css';

export default function AlphabetModal({ letter, onClose }) {
    const [soundPlaying, setSoundPlaying] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const audioRef = useRef(null);

    console.log(letter);
    
    const { animal, media, pronunciation } = letter;

    const videoUrl = media.video?.url;

    const handlePlaySound = () => {
    if (audioRef.current) {
        if (soundPlaying) {
            // Pause
            audioRef.current.pause();
            setSoundPlaying(false);
        } else {
            // Play
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setSoundPlaying(true);
        }
    }
};

    const handleAudioEnd = () => setSoundPlaying(false);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Close Button */}
                <button className="modal-close" onClick={onClose}>✕</button>

                {/* Letter Header */}
                <div className="modal-header">
                    <div className="modal-letter">{letter.letter}</div>
                    <div className="modal-title">
                        <h2>{animal.name}</h2>
                        <p className="scientific-name">{animal.scientificName}</p>
                    </div>
                </div>

                {/* Media: animation GIF takes priority over static image */}
                <div className="modal-media">
                    {media.animation?.url ? (
                        <img
                            src={media.animation.url}
                            alt={`${animal.name} animation`}
                            className="animal-animation"
                        />
                    ) : media.image?.url ? (
                        <img
                            src={media.image.url}
                            alt={media.image.alt || animal.name}
                            className="animal-image"
                        />
                    ) : null}
                </div>

                {/* Animal Information */}
                <div className="modal-body">
                    <div className="info-section">
                        <h3>📖 Description</h3>
                        <p>{animal.description}</p>
                    </div>

                    <div className="info-section">
                        <h3>🌍 Habitat</h3>
                        <p>{animal.habitat}</p>
                    </div>

                    <div className="info-section fun-fact">
                        <h3>✨ Fun Fact</h3>
                        <p>{animal.funFact}</p>
                    </div>
                </div>

                {/* Sound + Video Controls */}
                <div className="sound-controls">

                    {/* Animal sound — only renders if url exists and is not empty */}
                    {media.sound?.url ? (
                        <>
                            <button
                                    className={`sound-button ${soundPlaying ? 'playing' : ''}`}
                                    onClick={handlePlaySound}
                                    >
                                    {soundPlaying ? '⏸ Pause Sound' : '▶ Play Sound'}
                            </button>

                            <audio
                                ref={audioRef}
                                src={media.sound.url}
                                onEnded={handleAudioEnd}
                            />
                        </>
                    ) : null}

                    {/* Wikimedia video — only loads <video> after user clicks */}
                    {videoUrl && (
                        <div className="video-section">
                            {!showVideo ? (
                                <button
                                    className="sound-button video-button"
                                    onClick={() => setShowVideo(true)}
                                >
                                    ▶ Watch Video
                                </button>
                            ) : (
                                <div className="youtube-player">
                                    <button
                                        className="close-video"
                                        onClick={() => setShowVideo(false)}
                                    >
                                        ✕ Close Video
                                    </button>

                                    <video
                                        width="100%"
                                        height="220"
                                        controls
                                        src={videoUrl}
                                        type="video/webm"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pronunciation */}
                {pronunciation && (
                    <div className="pronunciation-section">
                        <span className="pronunciation-label">Pronunciation:</span>
                        <span className="pronunciation-text">{pronunciation.phonetic}</span>
                        {pronunciation.audioUrl && (
                            <button
                                className="pronunciation-button"
                                onClick={() => new Audio(pronunciation.audioUrl).play()}
                            >
                                🔊
                            </button>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}