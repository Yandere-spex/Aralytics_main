import { useState, useRef } from 'react';
import './AlphabetModal.css';

const isYouTube = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
};

const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

export default function AlphabetModal({ letter, onClose }) {
    const [soundPlaying, setSoundPlaying] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const audioRef = useRef(null);

    const { animal, media, pronunciation } = letter;

    const videoUrl = media.video?.url;
    const youTube = isYouTube(videoUrl);
    const videoId = media.video?.videoId || extractYouTubeId(videoUrl);

    const handlePlaySound = () => {
        if (audioRef.current) {
            if (soundPlaying) {
                audioRef.current.pause();
                setSoundPlaying(false);
            } else {
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

                    {/* Video — iframe for YouTube, <video> for direct file URLs */}
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

                                    {youTube && videoId ? (
                                        // YouTube URL → embed iframe
                                        <iframe
                                            width="100%"
                                            height="220"
                                            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1`}
                                            title={media.video?.title || animal.name}
                                            frameBorder="0"
                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        // Direct file (webm, mp4, ogv) → video tag
                                        <video
                                            width="100%"
                                            height="220"
                                            controls
                                            src={videoUrl}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
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