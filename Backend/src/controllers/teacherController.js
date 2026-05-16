const User          = require('../models/User');
const ReadingResult = require('../models/ReadingResult');
const asyncHandler  = require('../utils/asyncHandler');
const ApiError      = require('../utils/ApiError');
const ApiResponse   = require('../utils/ApiResponse');

// ── Helpers ───────────────────────────────────────────────────────

function buildMilestones(results) {
    const total   = results.length;
    const avgComp = total > 0
        ? results.reduce((a, r) => a + (r.comprehensionResults?.percentage ?? 0), 0) / total
        : 0;
    const maxWPM  = total > 0
        ? Math.max(...results.map(r => r.readingMetrics?.readingSpeed?.wpm ?? 0))
        : 0;

    return [
        { id: 1, label: 'First Story',   icon: '📘', achieved: total >= 1    },
        { id: 2, label: 'Quiz Master',   icon: '🏆', achieved: avgComp >= 80 },
        { id: 3, label: 'Speed Reader',  icon: '⚡', achieved: maxWPM >= 250 },
        { id: 4, label: '10 Stories',    icon: '🌟', achieved: total >= 10   },
        { id: 5, label: 'Perfect Score', icon: '💯', achieved: results.some(r => (r.comprehensionResults?.percentage ?? 0) === 100) },
    ];
}

function buildStudentRecord(student, results) {
    const total = results.length;

    if (total === 0) {
        return {
            name:             `${student.firstName} ${student.lastName}`,
            email:            student.email,
            avgWPM:           0,
            avgComprehension: 0,
            avgQuizScore:     0,
            totalStories:     0,
            learningTime:     0,
            status:           'inactive',
            achievedCount:    0,
            bestWPM:          0,
            bestComp:         0,
            flags:            ['No activity yet'],
            speedDist:        { slow: 0, normal: 0, fast: 0 },
            compDist:         { excellent: 0, good: 0, needsWork: 0 },
            stories:          [],
            milestones:       buildMilestones([]),
        };
    }

    // ── Averages — safe access ────────────────────────────────────
    const wpms = results
        .filter(r => r.readingMetrics?.readingSpeed?.wpm != null)
        .map(r => r.readingMetrics.readingSpeed.wpm);

    const comps = results
        .filter(r => r.comprehensionResults?.percentage != null)
        .map(r => r.comprehensionResults.percentage);

    const avgWPM  = wpms.length
        ? Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length)
        : 0;
    const avgComp = comps.length
        ? Math.round(comps.reduce((a, b) => a + b, 0) / comps.length)
        : 0;

    const learningTime = Math.round(
        results.reduce((a, r) => a + (r.readingMetrics?.totalTimeSeconds ?? 0), 0) / 60
    );

    const bestWPM  = wpms.length  ? Math.max(...wpms)  : 0;
    const bestComp = comps.length ? Math.max(...comps) : 0;

    // ── Distributions — safe access ───────────────────────────────
    const speedDist = { slow: 0, normal: 0, fast: 0 };
    const compDist  = { excellent: 0, good: 0, needsWork: 0 };

    results.forEach(r => {
        const w = r.readingMetrics?.readingSpeed?.wpm;
        if (w != null) {
            if      (w < 150)  speedDist.slow++;
            else if (w <= 250) speedDist.normal++;
            else               speedDist.fast++;
        }

        const c = r.comprehensionResults?.percentage;
        if (c != null) {
            if      (c >= 80) compDist.excellent++;
            else if (c >= 60) compDist.good++;
            else              compDist.needsWork++;
        }
    });

    // ── Status & flags — safe access ──────────────────────────────
    const lastResult      = results[results.length - 1];
    const daysSinceActive = lastResult?.createdAt
        ? Math.floor((Date.now() - new Date(lastResult.createdAt)) / (1000 * 60 * 60 * 24))
        : 999;

    const flags = [];
    if (daysSinceActive >= 5) flags.push('Inactive 5+ days');
    if (avgComp < 60)         flags.push('Low comprehension');
    if (avgWPM  < 150)        flags.push('Low reading speed');

    let status = 'on-track';
    if (flags.length >= 2 || (flags.includes('Inactive 5+ days') && flags.length >= 1)) {
        status = 'at-risk';
    } else if (flags.length === 1) {
        status = 'needs-attention';
    }

    // ── Recent stories (last 3, newest first) — safe access ──────
    const stories = results.slice(-3).reverse().map(r => ({
        title: r.storyTitle ?? 'Unknown',
        wpm:   r.readingMetrics?.readingSpeed?.wpm ?? 0,
        comp:  r.comprehensionResults?.percentage  ?? 0,
        date:  r.createdAt
            ? new Date(r.createdAt).toLocaleDateString('en-US', {
                month: 'numeric', day: 'numeric', year: 'numeric',
              })
            : '—',
    }));

    // ── Milestones ────────────────────────────────────────────────
    const milestones    = buildMilestones(results);
    const achievedCount = milestones.filter(m => m.achieved).length;

    return {
        name:             `${student.firstName} ${student.lastName}`,
        email:            student.email,
        avgWPM,
        avgComprehension: avgComp,
        avgQuizScore:     avgComp,
        totalStories:     total,
        learningTime,
        status,
        achievedCount,
        bestWPM,
        bestComp,
        flags,
        speedDist,
        compDist,
        stories,
        milestones,
    };
}

// ── Controller ────────────────────────────────────────────────────

// @desc   Get teacher dashboard data
// @route  GET /api/teacher/dashboard
// @access Private (teacher)
exports.getDashboard = asyncHandler(async (req, res) => {

    // 1. Load teacher + enrolled students
    const teacher = await User
        .findById(req.user.id)
        .populate('students', 'firstName lastName email isActive enrolledAt');

    if (!teacher || teacher.role !== 'teacher') {
        throw new ApiError(403, 'Access denied. Teacher role required.');
    }

    const students   = teacher.students ?? [];
    const studentIds = students.map(s => s._id);

    // 2. Fetch all reading results for enrolled students
    const allResults = await ReadingResult
        .find({ userId: { $in: studentIds } })
        .sort({ createdAt: 1 })
        .lean();

    // 3. Group results by student ID
    const resultsByStudent = {};
    studentIds.forEach(id => { resultsByStudent[id.toString()] = []; });
    allResults.forEach(r => {
        const key = r.userId.toString();
        if (resultsByStudent[key]) resultsByStudent[key].push(r);
    });

    // 4. Build per-student records
    const studentData = students.map(s =>
        buildStudentRecord(s, resultsByStudent[s._id.toString()] ?? [])
    );

    // 5. Class-wide summary
    const totalStudents  = students.length;
    const activeStudents = studentData.filter(s => s.totalStories > 0);

    const classAvgWPM = activeStudents.length
        ? Math.round(activeStudents.reduce((a, s) => a + s.avgWPM, 0) / activeStudents.length)
        : 0;
    const classAvgComp = activeStudents.length
        ? Math.round(activeStudents.reduce((a, s) => a + s.avgComprehension, 0) / activeStudents.length)
        : 0;
    const totalLearningTime = studentData.reduce((a, s) => a + s.learningTime, 0);

    const speedDistribution         = { fast: 0, normal: 0, slow: 0 };
    const comprehensionDistribution = { excellent: 0, good: 0, needsWork: 0 };

    studentData.forEach(s => {
        if      (s.avgWPM > 250)  speedDistribution.fast++;
        else if (s.avgWPM >= 150) speedDistribution.normal++;
        else                      speedDistribution.slow++;

        if      (s.avgComprehension >= 80) comprehensionDistribution.excellent++;
        else if (s.avgComprehension >= 60) comprehensionDistribution.good++;
        else                               comprehensionDistribution.needsWork++;
    });

    // 6. Class WPM trend — safe access ────────────────────────────
    const trendMap = {};
    allResults.slice(-30).forEach(r => {
        const wpm = r.readingMetrics?.readingSpeed?.wpm;
        if (wpm == null) return; // skip malformed records
        const day = new Date(r.createdAt).toISOString().split('T')[0];
        if (!trendMap[day]) trendMap[day] = [];
        trendMap[day].push(wpm);
    });

    const classTrend = Object.entries(trendMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-5)
        .map(([, wpms], i) => ({
            session: i + 1,
            wpm:     Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length),
        }));

    // 7. Attention flags
    const attentionFlags = studentData
        .filter(s => s.status !== 'on-track' && s.flags.length > 0)
        .sort((a, b) => (b.status === 'at-risk' ? 1 : -1))
        .map(s => ({ name: s.name, status: s.status, flags: s.flags }));

    // 8. Leaderboard
    const ranked = [...studentData].filter(s => s.totalStories > 0);
    const topPerformers = {
        readers: [...ranked]
            .sort((a, b) => b.totalStories - a.totalStories)
            .slice(0, 3)
            .map(s => ({ name: s.name, totalStories: s.totalStories })),
        quizzers: [...ranked]
            .sort((a, b) => b.avgQuizScore - a.avgQuizScore)
            .slice(0, 3)
            .map(s => ({ name: s.name, avgQuizScore: s.avgQuizScore })),
        timeLearners: [...ranked]
            .sort((a, b) => b.learningTime - a.learningTime)
            .slice(0, 3)
            .map(s => ({ name: s.name, learningTime: s.learningTime })),
    };

    return res.status(200).json(
        new ApiResponse(200, {
            summary: {
                totalStudents,
                classAvgWPM,
                classAvgComprehension: classAvgComp,
                classAvgQuizScore:     classAvgComp,
                totalLearningTime,
                speedDistribution,
                comprehensionDistribution,
            },
            classTrend,
            attentionFlags,
            students:     studentData,
            topPerformers,
            classCode:    teacher.classCode,
        }, 'Dashboard loaded successfully')
    );
});