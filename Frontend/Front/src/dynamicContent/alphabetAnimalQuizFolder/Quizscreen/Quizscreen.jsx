import { useState, useEffect } from 'react';
import './QuizScreen.css';
import { getQuestionsByDifficulty } from '../../../services/alphabetService'

const QUESTION_COUNTS = { easy: 5, medium: 10, hard: 15 };

export default function QuizScreen({ difficulty, onComplete }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // const data = await getQuestionsByDifficulty(difficulty); // uncomment when backend ready
                const data = [
                    {
                        _id: '1',
                        questionText: 'Which animal belongs to the genus Loxodonta?',
                        options: ['Wolf', 'Elephant', 'Jaguar'],
                        correctAnswer: 'Elephant',
                        type: 'sci',
                        difficulty: 'hard',
                        animalName: 'Elephant',
                    },
                    {
                        _id: '2',
                        questionText: 'What do alligators primarily eat?',
                        options: ['Grass', 'Fish', 'Berries'],
                        correctAnswer: 'Fish',
                        type: 'fact',
                        difficulty: 'easy',
                        animalName: 'Alligator',
                    },
                    {
                        _id: '3',
                        questionText: 'Where do penguins naturally live?',
                        options: ['Arctic', 'Antarctic', 'Tropics'],
                        correctAnswer: 'Antarctic',
                        type: 'habitat',
                        difficulty: 'easy',
                        animalName: 'Penguin',
                    },
                    {
                        _id: '4',
                        questionText: 'Which animal is the fastest on land?',
                        options: ['Lion', 'Cheetah', 'Horse'],
                        correctAnswer: 'Cheetah',
                        type: 'funfact',
                        difficulty: 'easy',
                        animalName: 'Cheetah',
                    },
                    {
                        _id: '5',
                        questionText: 'What is a group of wolves called?',
                        options: ['Herd', 'Pack', 'Flock'],
                        correctAnswer: 'Pack',
                        type: 'fact',
                        difficulty: 'easy',
                        animalName: 'Wolf',
                    },
                ];
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

        const results = questions.map((q) => ({
            questionId: q._id,
            animalName: q.animalName,
            type: q.type,
            difficulty: q.difficulty,
            selectedAnswer: answers[q._id],
            correctAnswer: q.correctAnswer,
            isCorrect: answers[q._id] === q.correctAnswer,
        }));

        const correct = results.filter((r) => r.isCorrect).length;
        const wrong = results.length - correct;
        const accuracy = Math.round((correct / results.length) * 100);

        onComplete({
            difficulty,
            totalQuestions: results.length,
            correctAnswers: correct,
            wrongAnswers: wrong,
            accuracy,
            attempts: results,
        });
    };

    const answeredCount = Object.keys(answers).length;

    if (loading) return <div className="quiz-loading">Loading questions... 🐾</div>;
    if (error) return <div className="quiz-loading">{error}</div>;

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
                {questions.map((q, index) => (
                    <div
                        key={q._id}
                        className={`quiz-questionCard ${answers[q._id] ? 'quiz-answered' : ''}`}
                    >
                        <div className="quiz-questionHeader">
                            <span className="quiz-qNumber">Q{index + 1}</span>
                            <span className="quiz-typeBadge">{q.type}</span>
                        </div>

                        <p className="quiz-questionText">{q.questionText}</p>

                        <div className="quiz-options">
                            {q.options.map((option) => (
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
                ))}
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