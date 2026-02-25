const ReadingResult = require('../models/ReadingResult');

// @route  POST /api/reading-results
// @desc   Save a reading result (WPM + comprehension combined)
const saveReadingResult = async (req, res) => {
    try {
        const result = await ReadingResult.create({
            userId: req.user._id, // from auth middleware
            ...req.body,
        });
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @route  GET /api/reading-results
// @desc   Get all results for the logged-in user
const getMyResults = async (req, res) => {
    try {
        const results = await ReadingResult
            .find({ userId: req.user._id })
            .sort({ completedAt: -1 }); // newest first
        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route  GET /api/reading-results/stats
// @desc   Get general average stats for the logged-in user
const getMyStats = async (req, res) => {
    try {
        const results = await ReadingResult.find({ userId: req.user._id });

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    totalStoriesRead: 0,
                    totalWordsRead: 0,
                    avgWPM: 0,
                    avgComprehension: 0,
                    avgScore: 0,
                    bestWPM: 0,
                    bestComprehension: 0,
                    recentResults: [],
                    wpmTrend: [],
                    comprehensionTrend: [],
                }
            });
        }

        const totalStoriesRead = results.length;
        const totalWordsRead = results.reduce((sum, r) => sum + r.wordCount, 0);

        // Averages
        const avgWPM = Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / totalStoriesRead);
        const avgComprehension = Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalStoriesRead);
        const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalStoriesRead * 10) / 10;

        // Bests
        const bestWPM = Math.max(...results.map(r => r.wpm));
        const bestComprehension = Math.max(...results.map(r => r.percentage));

        // Recent 5
        const recentResults = results.slice(0, 5).map(r => ({
            storyTitle: r.storyTitle,
            wpm: r.wpm,
            percentage: r.percentage,
            completedAt: r.completedAt,
        }));

        // Trend data — last 10 sessions for charts
        const trend = results.slice(0, 10).reverse().map((r, i) => ({
            session: i + 1,
            wpm: r.wpm,
            comprehension: r.percentage,
            storyTitle: r.storyTitle,
        }));

        // Speed classification distribution
        const speedDistribution = {
            slow: results.filter(r => r.wpm < 150).length,
            normal: results.filter(r => r.wpm >= 150 && r.wpm <= 250).length,
            fast: results.filter(r => r.wpm > 250).length,
        };

        // Comprehension distribution
        const comprehensionDistribution = {
            excellent: results.filter(r => r.percentage >= 80).length,  // 80-100%
            good: results.filter(r => r.percentage >= 60 && r.percentage < 80).length,
            needsWork: results.filter(r => r.percentage < 60).length,
        };

        res.status(200).json({
            success: true,
            data: {
                totalStoriesRead,
                totalWordsRead,
                avgWPM,
                avgComprehension,
                avgScore,
                bestWPM,
                bestComprehension,
                recentResults,
                trend,
                speedDistribution,
                comprehensionDistribution,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { saveReadingResult, getMyResults, getMyStats };