// services/quizService.js

const BASE_URL = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

const headers = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
});

// ── QUESTIONS ─────────────────────────────────────────────────────

// GET /api/quiz/questions
export const getQuestions = async ({ letter, difficulty, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    if (letter)     params.append('letter', letter);
    if (difficulty) params.append('difficulty', difficulty);
    params.append('limit', limit);

    const res = await fetch(`${BASE_URL}/quiz/questions?${params}`, {
        headers: headers(),
    });
    if (!res.ok) throw new Error('Failed to fetch questions');
    const data = await res.json();
    return data.data;
};

// ── SESSIONS ──────────────────────────────────────────────────────

// POST /api/quiz/sessions — save completed quiz
export const saveQuizSession = async (payload) => {
    const res = await fetch(`${BASE_URL}/quiz/sessions`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to save quiz session');
    const data = await res.json();
    return data.data;
};

// GET /api/quiz/sessions
export const getMySessions = async () => {
    const res = await fetch(`${BASE_URL}/quiz/sessions`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch sessions');
    const data = await res.json();
    return data.data;
};

// ── ANALYTICS ─────────────────────────────────────────────────────

// GET /api/quiz/analytics
export const getQuizAnalytics = async () => {
    const res = await fetch(`${BASE_URL}/quiz/analytics`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    const data = await res.json();
    return data.data;
};