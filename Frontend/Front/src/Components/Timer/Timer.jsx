import React, { useState, useEffect, useRef } from 'react';

const TimerComponent = ({
    autoStart = false,
    initialTime = 0,
    onTimeUpdate,
    showControls = true,
    format,
    style = {},
    interval = 1
    }) => {
    const [elapsedTime, setElapsedTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);

    const defaultFormat = (ms) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
    };

    const startTimer = () => {
        if (!isRunning) {
        setIsRunning(true);
        startTimeRef.current = Date.now() - elapsedTime;
        intervalRef.current = setInterval(() => {
            const newTime = Date.now() - startTimeRef.current;
            setElapsedTime(newTime);
            if (onTimeUpdate) onTimeUpdate(newTime);
        }, interval);
        }
    };

    const stopTimer = () => {
        if (isRunning) {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        }
    };

    const resetTimer = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setElapsedTime(initialTime);
    };

    // Auto-start if enabled
    useEffect(() => {
        if (autoStart) {
        startTimer();
        }
    }, [autoStart]);

    // Cleanup on unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    // Use custom format or default
    const displayTime = format ? format(elapsedTime) : defaultFormat(elapsedTime);

    return (
        <div>
            <h1>Timer</h1>
            <div style={{ fontSize: '2rem', marginBottom: '20px', ...style }}>
                {displayTime}
            </div>
            {showControls && (
                <div>
                    <button onClick={startTimer} disabled={isRunning}>Start</button>
                    <button onClick={stopTimer} disabled={!isRunning}>Stop</button>
                    <button onClick={resetTimer}>Reset</button>
                </div>
            )}
        </div>
    );
};

export default TimerComponent;