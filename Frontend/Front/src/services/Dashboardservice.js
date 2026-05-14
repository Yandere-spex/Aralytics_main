// frontend/src/services/dashboardService.js

const BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
});

// GET /api/dashboard — combined reading + quiz stats
export const getDashboard = async () => {
    const res = await fetch(`${BASE_URL}/dashboard`, { headers: headers() });
    const data = await res.json();
    return data.data;
};

// POST /api/reading-results — save a reading result
export const saveReadingResult = async (payload) => {
    const res = await fetch(`${BASE_URL}/reading-results`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.data;
};

// GET /api/reading-results — get all results
export const getMyReadingResults = async () => {
    const res = await fetch(`${BASE_URL}/reading-results`, { headers: headers() });
    const data = await res.json();
    return data.data;
};

// GET /api/reading-results/stats — get reading stats only
export const getMyReadingStats = async () => {
    const res = await fetch(`${BASE_URL}/reading-results/stats`, { headers: headers() });
    const data = await res.json();
    return data.data;
};

// POST /api/quiz/complete — save full quiz session + all attempts in one call
// payload shape:
// {
//   difficulty, totalQuestions, correctCount, wrongCount,
//   score, accuracy, pointsEarned, timeTaken,
//   attempts: [{ questionId, animalName, type, difficulty, correct, timeTaken }]

// POST /api/quiz/complete — save full quiz session + all attempts in one call
export const saveQuizComplete = async (payload) => {
    const res = await fetch(`${BASE_URL}/quiz/complete`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save quiz');
    return data;
};