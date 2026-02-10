import './SelectedCard.css'
import { useState } from 'react';
import littleRedRiding from '../../../assets/imageCover/THe little Red Riding Hood.jpg';
import coverLittle from '../../../assets/imageCover/The Little princess Cover.webp';
import coverpillar from '../../../assets/imageCover/The Very hungry caterpillar.webp';
import ReadCard from '../../../Components/ReadCard/ReadCard.jsx';
import CardGrid from '../CardGrid/CardGrid.jsx';


export default function SelectedCard(){

    const [quizzesCards, setQuizzesCards] = useState([
        {
            _id: "story_001",
            category: "animals",
            ageRange: "5-7",
            cover: coverpillar,
            information: {
                title: "The Very Hungry Caterpillar",
                level: "Easy",
                wordCount: 120,
                shortStory: "One Sunday morning, a tiny egg lay on a leaf. When the sun came up, a small and very hungry caterpillar came out. He started to look for some food. On Monday, he ate one apple. On Tuesday, he ate two pears. On Wednesday, he ate three plums. On Thursday, he ate four strawberries. On Friday, he ate five oranges. But he was still hungry! On Saturday, he ate lots of food—cake, ice cream, cheese, and more! His stomach hurt, so he ate a green leaf. He felt better. On Sunday, he wasn't hungry anymore. He built a small house called a cocoon. After two weeks, he came out as a beautiful butterfly.",
                estimatedReadingTime: "1-2 minutes",
                author: "Eric Carle",
                theme: "Growth and transformation"
            },
            comprehensionQuestions: [
                {
                    id: "q1",
                    question: "What did the caterpillar eat on Monday?",
                    options: ["One apple", "Two pears", "Three plums"],
                    correctAnswer: "One apple",
                    difficulty: "easy",
                    skill: "recall"
                },
                {
                    id: "q2",
                    question: "Why did the caterpillar feel sick?",
                    options: ["He ate too much food", "He was sleepy", "He didn't eat anything"],
                    correctAnswer: "He ate too much food",
                    difficulty: "medium",
                    skill: "inference"
                },
                {
                    id: "q3",
                    question: "What did the caterpillar become in the end?",
                    options: ["A worm", "A butterfly", "A bee"],
                    correctAnswer: "A butterfly",
                    difficulty: "easy",
                    skill: "recall"
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            completionCount: 0
        },
        {
            _id: "story_002",
            category: "fairy tales",
            ageRange: "4-6",
            cover: littleRedRiding,
            information: {
                title: "Little Red Riding Hood",
                level: "Easy",
                wordCount: 150,
                shortStory: "Once upon a time, there was a little girl named Little Red Riding Hood. She wore a red hood and loved to visit her grandmother. One day, her mother asked her to take a basket of food to her grandmother's house in the woods. On the way, she met a wolf who tricked her into telling him where her grandmother lived. The wolf went to the grandmother's house and ate her. When Little Red arrived, the wolf pretended to be the grandmother. But a woodsman heard the wolf and saved them. The wolf was punished, and Little Red learned to be careful in the woods.",
                estimatedReadingTime: "1-5 minutes",
                author: "Traditional",
                theme: "Caution and safety"
            },
            comprehensionQuestions: [
                {
                    id: "q1",
                    question: "What did Little Red Riding Hood take to her grandmother?",
                    options: ["A basket of food", "A red hood", "Flowers"],
                    correctAnswer: "A basket of food",
                    difficulty: "easy",
                    skill: "recall"
                },
                {
                    id: "q2",
                    question: "Who saved Little Red and her grandmother?",
                    options: ["The wolf", "A woodsman", "Her mother"],
                    correctAnswer: "A woodsman",
                    difficulty: "medium",
                    skill: "recall"
                },
                {
                    id: "q3",
                    question: "What did Little Red learn?",
                    options: ["To wear a red hood", "To be careful in the woods", "To talk to strangers"],
                    correctAnswer: "To be careful in the woods",
                    difficulty: "medium",
                    skill: "inference"
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            completionCount: 0
        },
                {
            _id: "story_003",
            category: "fairy tales",
            ageRange: "5-8",
            cover: coverLittle, // Hardcoded for testing; replace with actual path or import
            information: {
                title: "The Little Princess",
                level: "Easy",
                wordCount: 180,
                shortStory: "Once upon a time, there was a little girl named Sara Crewe. She was sent to a boarding school in London by her rich father. Sara was kind and imaginative, and she loved telling stories to the other girls. But when her father died and his money was lost, Sara became poor. She had to work as a servant in the school. Despite her hardships, Sara remained brave and kind. She believed in magic and happy endings. One day, her father's friend found her and restored her fortune. Sara became a princess again, and she shared her happiness with everyone.",
                estimatedReadingTime: "3-4 minutes",
                author: "Frances Hodgson Burnett",
                theme: "Resilience and kindness"
            },
            comprehensionQuestions: [
                {
                    id: "q1",
                    question: "What was Sara's father's name?",
                    options: ["Captain Crewe", "Mr. Carrisford", "Mr. Barrow"],
                    correctAnswer: "Captain Crewe",
                    difficulty: "easy",
                    skill: "recall"
                },
                {
                    id: "q2",
                    question: "Why did Sara have to work as a servant?",
                    options: ["She was naughty", "Her father died and lost his money", "She wanted to help others"],
                    correctAnswer: "Her father died and lost his money",
                    difficulty: "medium",
                    skill: "inference"
                },
                {
                    id: "q3",
                    question: "What did Sara believe in despite her hardships?",
                    options: ["Magic and happy endings", "Being rich", "Being alone"],
                    correctAnswer: "Magic and happy endings",
                    difficulty: "medium",
                    skill: "inference"
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            completionCount: 0
        }
    ]);




    const [selectedCard, setSelectedCard] = useState(null)


    const handleCardClick = (cardData) => {
        setSelectedCard(cardData);    
    };












    return(
        <>
            {/* <div className={selectedCard === null ? 'mainRead' : ''}>

                {selectedCard === null 
                ? cards.map((card, index) => ( 
                    <ReadCard
                        key={card.id || index}  
                        cover={card.cover}
                        title={card.title}
                        onClick={() => handleCardClick(card)} 
                    />
                ))
                : <CardGrid selectedCard={selectedCard}/>
                }
            </div> */}

                <div className={selectedCard === null ? 'mainRead' : ''}>
                {selectedCard === null
                    ? quizzesCards.map((card, index) => (  // FIXED: Use quizzes instead of cards
                        <ReadCard
                            key={card._id || index}  // FIXED: Use _id
                            cover={card.cover}  // FIXED: Now exists in the object
                            title={card.information.title}  // FIXED: Access nested title
                            onClick={() => handleCardClick(card)}
                        />
                    ))
                    : <CardGrid selectedCard={selectedCard} />
                }
            </div>

        </>
    )
}