// src/controllers/Dashboardcontroller.js
const asyncHandler     = require('../utils/asyncHandler');
const ApiError         = require('../utils/ApiError');
const ReadingResult    = require('../models/ReadingResult');
const dashboardService = require('../services/Dashboardservice');

// ── GET /api/dashboard ────────────────────────────────────────────
// Returns both reading + quiz stats for Dashboard.jsx
exports.getDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // ── Reading stats ──────────────────────────────────────────────
    const readingResults = await ReadingResult.find({ userId }).sort({ completedAt: -1 });

    let readingStats = {
        totalStoriesRead: 0,
        totalWordsRead: 0,
        avgWPM: 0,
        avgComprehension: 0,
        bestWPM: 0,
        bestComprehension: 0,
        recentStories: [],
        trend: [],
        speedDistribution: { slow: 0, normal: 0, fast: 0 },
        comprehensionDistribution: { excellent: 0, good: 0, needsWork: 0 },
    };

    if (readingResults.length > 0) {
        const n = readingResults.length;
        readingStats = {
            totalStoriesRead: n,
            totalWordsRead: readingResults.reduce((s, r) => s + r.wordCount, 0),
            avgWPM: Math.round(readingResults.reduce((s, r) => s + r.wpm, 0) / n),
            avgComprehension: Math.round(readingResults.reduce((s, r) => s + r.percentage, 0) / n),
            bestWPM: Math.max(...readingResults.map(r => r.wpm)),
            bestComprehension: Math.max(...readingResults.map(r => r.percentage)),
            recentStories: readingResults.slice(0, 5).map(r => ({
                storyTitle:  r.storyTitle,
                wpm:         r.wpm,
                percentage:  r.percentage,
                completedAt: r.completedAt,
            })),
            trend: readingResults.slice(0, 10).reverse().map((r, i) => ({
                session:       i + 1,
                wpm:           r.wpm,
                comprehension: r.percentage,
                label:         r.storyTitle,
            })),
            speedDistribution: {
                slow:   readingResults.filter(r => r.wpm < 150).length,
                normal: readingResults.filter(r => r.wpm >= 150 && r.wpm <= 250).length,
                fast:   readingResults.filter(r => r.wpm > 250).length,
            },
            comprehensionDistribution: {
                excellent: readingResults.filter(r => r.percentage >= 80).length,
                good:      readingResults.filter(r => r.percentage >= 60 && r.percentage < 80).length,
                needsWork: readingResults.filter(r => r.percentage < 60).length,
            },
        };
    }

    // ── Quiz stats ─────────────────────────────────────────────────
    const quizStats = await dashboardService.getQuizAnalytics(userId);

    res.status(200).json({
        success: true,
        data: {
            reading: readingStats,
            quiz:    quizStats,       // ← now included in the same response
        },
    });
});

// ── GET /api/dashboard/quiz-analytics ────────────────────────────
// Standalone endpoint (kept for backwards compat / direct access)
exports.getQuizAnalytics = asyncHandler(async (req, res) => {
    const data = await dashboardService.getQuizAnalytics(req.user._id);

    res.status(200).json({
        success: true,
        data,
    });
});