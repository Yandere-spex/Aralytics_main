import './ResultScreen.css';

export default function ResultScreen({ storyInfo, readingMetrics, quizResults, onRetry, onAnotherStory }) {
    return (
        <div className="results-screen">
            <h1>🎉 Assessment Complete!</h1>

            {/* Story Info */}
            <div className="story-info">
                <h2>{storyInfo.title}</h2>
                <p>Level: {storyInfo.level} | Words: {storyInfo.wordCount}</p>
            </div>

            {/* Reading Speed */}
            <div className="reading-speed">
                <h3>📖 Reading Speed</h3>
                <p className="wpm-display" style={{ color: readingMetrics.speedColor }}>
                    {readingMetrics.wpm} WPM
                </p>
                <p className="speedRemark">{readingMetrics.speedRemark}</p>
                <p className="timeDetails">
                    Time: {readingMetrics.totalSeconds}s | Expected: {readingMetrics.expectedWPM}
                </p>
            </div>

            {/* Comprehension Score */}
            <div className="comprehension-score">
                <h3>📊 Comprehension Score</h3>
                <div className="score-display">
                    <span className="score">
                        {quizResults.score}/{quizResults.totalQuestions}
                    </span>
                    <span className="percentage">({quizResults.percentage}%)</span>
                </div>
                <p className="remark">{quizResults.remark}</p>
                <p className="interpretation">{quizResults.interpretation}</p>
            </div>

            {/* Question Review */}
            <div className="question-review">
                <h3>📝 Answer Review</h3>
                {quizResults.questionResults.map((q, idx) => (
                    <div key={idx} className={`review-item ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                        <p><strong>Q{idx + 1}:</strong> {q.question}</p>
                        <p>
                            Your answer: <strong>{q.userAnswer}</strong> 
                            {q.isCorrect ? ' ✓' : ' ✗'}
                        </p>
                        {!q.isCorrect && (
                            <p className="correct-answer">Correct answer: {q.correctAnswer}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="actions">
                <button onClick={onRetry}>🔄 Try Again</button>
                <button onClick={onAnotherStory}>📚 Choose Another Story</button>
            </div>
        </div>
    );
}