import { useState, useEffect } from 'react';
import './QuizScreen.css';
import { getQuestionsByDifficulty } from '../../../services/alphabetService';

const QUESTION_COUNTS = { easy: 5, medium: 10, hard: 15 };

export default function QuizScreen({ difficulty, onComplete }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startTime] = useState(Date.now()); // track total quiz time

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getQuestionsByDifficulty(difficulty);
                console.log('RAW QUESTIONS:', data);
                const shuffled = data.sort(() => Math.random() - 0.5);
                setQuestions(shuffled.slice(0, QUESTION_COUNTS[difficulty]));
            } catch (err) {
                setError('Failed to load questions.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [difficulty]);

    const handleAnswer = (questionId, option) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            alert('Please answer all questions before submitting!');
            return;
        }

        const timeTaken = Math.round((Date.now() - startTime) / 1000); // seconds

        const results = questions.map((q) => {
            // Support both index-based correctAnswer (Number) and string-based
            const correctAnswerText =
                typeof q.correctAnswer === 'number'
                    ? q.choices?.[q.correctAnswer] ?? q.correctAnswer
                    : q.correctAnswer;

            const selectedAnswer = answers[q._id];

            return {
                questionId:     q._id,
                animalName:     q.animalName,
                type:           q.type,
                difficulty:     q.difficulty,
                selectedAnswer,
                correctAnswer:  correctAnswerText,
                isCorrect:      selectedAnswer === correctAnswerText,
                timeTaken:      null, // per-question timing not tracked; total is in parent
            };
        });

        const correct  = results.filter((r) => r.isCorrect).length;
        const wrong    = results.length - correct;
        const accuracy = Math.round((correct / results.length) * 100);

        onComplete({
            difficulty,
            totalQuestions: results.length,
            correctAnswers: correct,
            wrongAnswers:   wrong,
            accuracy,
            timeTaken,
            attempts: results,
        });
    };

    const answeredCount = Object.keys(answers).length;

    if (loading) return <div className="quiz-loading">Loading questions... 🐾</div>;
    if (error)   return <div className="quiz-loading">{error}</div>;

    return (
        <div className="quiz-wrapper">
            <div className="quiz-header">
                <div className="quiz-headerLeft">
                    <span className="quiz-diffBadge" data-level={difficulty}>
                        {difficulty.toUpperCase()}
                    </span>
                    <h2 className="quiz-title">Animal Quiz</h2>
                </div>
                <span className="quiz-progress">
                    {answeredCount} / {questions.length} answered
                </span>
            </div>

            <div className="quiz-progressBar">
                <div
                    className="quiz-progressFill"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
            </div>

            <div className="quiz-questionList">
                {questions.map((q, index) => {
                    // Support both choices[] (new model) and options[] (old demo data)
                    const optionList = q.choices ?? q.options ?? [];

                    return (
                        <div
                            key={q._id}
                            className={`quiz-questionCard ${answers[q._id] ? 'quiz-answered' : ''}`}
                        >
                            <div className="quiz-questionHeader">
                                <span className="quiz-qNumber">Q{index + 1}</span>
                                <span className="quiz-typeBadge">{q.type}</span>
                            </div>

                            <p className="quiz-questionText">
                                {q.questionText ?? q.question}
                            </p>

                            <div className="quiz-options">
                                {optionList.map((option) => (
                                    <button
                                        key={option}
                                        className={`quiz-optionBtn ${answers[q._id] === option ? 'quiz-selected' : ''}`}
                                        onClick={() => handleAnswer(q._id, option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="quiz-footer">
                <p className="quiz-footerNote">
                    {answeredCount < questions.length
                        ? `${questions.length - answeredCount} questions remaining`
                        : '✅ All answered! Ready to submit.'}
                </p>
                <button
                    className="quiz-submitBtn"
                    onClick={handleSubmit}
                    disabled={answeredCount < questions.length}
                >
                    Submit Quiz →
                </button>
            </div>
        </div>
    );
}