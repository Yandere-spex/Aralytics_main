// src/services/dashboardService.js
const QuizSession = require('../models/Quizsession');
const QuizAttempt = require('../models/Quizattempt');

const dashboardService = {

  // ══════════════════════════════════════════════════════════════════
  // QUIZ ANALYTICS
  // Returns the exact `quiz` shape consumed by Dashboard.jsx
  // userId is a Mongoose ObjectId (from req.user._id)
  // ══════════════════════════════════════════════════════════════════
  async getQuizAnalytics(userId) {
    // fetch sessions oldest→newest for correct trend numbering
    const [sessions, attempts] = await Promise.all([
      QuizSession.find({ userId }).sort({ completedAt: 1 }).lean(),
      QuizAttempt.find({ userId }).lean(),
    ]);

    if (sessions.length === 0) return emptyQuizAnalytics();

    // ── session-level ──────────────────────────────────────────────
    const totalSessions = sessions.length;
    const scores        = sessions.map(s => s.score ?? 0);
    const avgScore      = Math.round(scores.reduce((a, b) => a + b, 0) / totalSessions);
    const bestScore     = Math.max(...scores);
    const totalPoints   = sessions.reduce((a, s) => a + (s.pointsEarned ?? 0), 0);

    const timings      = sessions.filter(s => s.timeTaken != null).map(s => s.timeTaken);
    const avgTimeTaken = timings.length
      ? Math.round(timings.reduce((a, b) => a + b, 0) / timings.length)
      : 0;

    const streakCurrent = calcStreak(sessions);

    // recent 5 sessions, newest first
    const recentSessions = [...sessions]
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5)
      .map(s => ({
        correctCount:   s.correctCount   ?? 0,
        totalQuestions: s.totalQuestions ?? 0,
        mode:           s.difficulty     ?? s.mode ?? 'easy',
        score:          s.score          ?? 0,
        pointsEarned:   s.pointsEarned   ?? 0,
        completedAt:    s.completedAt,
      }));

    // trend — chronological, numbered 1…N
    const trend = sessions.map((s, i) => ({
      session:  i + 1,
      score:    s.score    ?? 0,
      accuracy: s.accuracy ?? s.score ?? 0,
    }));

    // ── attempt-level ──────────────────────────────────────────────
    const totalQuestionsAnswered = attempts.length;
    const totalCorrect           = attempts.filter(a => a.correct === true).length;
    const totalWrong             = totalQuestionsAnswered - totalCorrect;
    const avgAccuracy            = totalQuestionsAnswered > 0
      ? Math.round((totalCorrect / totalQuestionsAnswered) * 100)
      : 0;

    const difficultyBreakdown = calcAccuracyByField(attempts, 'difficulty', ['easy', 'medium', 'hard']);
    const typeBreakdown       = calcAccuracyByField(attempts, 'type', ['sci', 'fact', 'funfact', 'habitat']);
    const weakestType         = findWeakest(typeBreakdown);

    return {
      totalSessions,
      avgScore,
      bestScore,
      totalQuestionsAnswered,
      totalCorrect,
      totalWrong,
      avgAccuracy,
      totalPoints,
      avgTimeTaken,
      streakCurrent,
      weakestType,
      difficultyBreakdown,
      typeBreakdown,
      trend,
      recentSessions,
    };
  },

};

// ════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════

function calcAccuracyByField(attempts, field, keys) {
  const map = {};
  for (const key of keys) map[key] = { correct: 0, total: 0, accuracy: 0 };

  for (const a of attempts) {
    const key = a[field];
    if (!map[key]) continue;
    map[key].total++;
    if (a.correct) map[key].correct++;
  }

  for (const key of keys) {
    const { correct, total } = map[key];
    map[key].accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  }
  return map;
}

function findWeakest(breakdown) {
  let weakest = null, min = Infinity;
  for (const [key, val] of Object.entries(breakdown)) {
    if (val.total > 0 && val.accuracy < min) {
      min     = val.accuracy;
      weakest = key;
    }
  }
  return weakest;
}

function calcStreak(sessions) {
  const daySet = new Set(
    sessions.map(s => new Date(s.completedAt).toISOString().slice(0, 10))
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (daySet.has(d.toISOString().slice(0, 10))) streak++;
    else break;
  }
  return streak;
}

function emptyQuizAnalytics() {
  return {
    totalSessions:          0,
    avgScore:               0,
    bestScore:              0,
    totalQuestionsAnswered: 0,
    totalCorrect:           0,
    totalWrong:             0,
    avgAccuracy:            0,
    totalPoints:            0,
    avgTimeTaken:           0,
    streakCurrent:          0,
    weakestType:            null,
    difficultyBreakdown:    { easy: { accuracy: 0 }, medium: { accuracy: 0 }, hard: { accuracy: 0 } },
    typeBreakdown:          { sci: { accuracy: 0 }, fact: { accuracy: 0 }, funfact: { accuracy: 0 }, habitat: { accuracy: 0 } },
    trend:                  [],
    recentSessions:         [],
  };
}

module.exports = dashboardService;