// src/controllers/teacherController.js
const User          = require('../models/User');
const ReadingResult = require('../models/ReadingResult');
const QuizSession   = require('../models/QuizSession');
const QuizAttempt   = require('../models/QuizAttempt');
const asyncHandler  = require('../utils/asyncHandler');
const ApiError      = require('../utils/ApiError');

// ── MILESTONES definition ─────────────────────────────────────────
const MILESTONES = [
    { id: 'first_story',     label: 'First Story Read',       icon: '📖', check: (r, q) => r.length >= 1 },
    { id: 'stories_5',       label: '5 Stories Read',         icon: '📚', check: (r, q) => r.length >= 5 },
    { id: 'stories_10',      label: '10 Stories Read',        icon: '🏆', check: (r, q) => r.length >= 10 },
    { id: 'first_quiz',      label: 'First Quiz Completed',   icon: '🐾', check: (r, q) => q.length >= 1 },
    { id: 'quiz_5',          label: '5 Quizzes Completed',    icon: '🎯', check: (r, q) => q.length >= 5 },
    { id: 'perfect_quiz',    label: 'Perfect Quiz Score',     icon: '⭐', check: (r, q) => q.some(s => s.score === 100) },
    { id: 'speed_reader',    label: 'Speed Reader (>200 WPM)',icon: '⚡', check: (r, q) => r.some(s => s.wpm > 200) },
    { id: 'comprehension_90',label: '90%+ Comprehension',     icon: '🧠', check: (r, q) => r.some(s => s.percentage >= 90) },
    { id: 'quiz_streak_3',   label: '3 Quizzes in a Row',     icon: '🔥', check: (r, q) => q.length >= 3 },
];

// ── Helper: compute milestones for a student ──────────────────────
const getMilestones = (readingResults, quizSessions) => {
    return MILESTONES.map(m => ({
        ...m,
        achieved: m.check(readingResults, quizSessions),
    }));
};

// ── Helper: estimate learning time (minutes) ──────────────────────
// Reading: avg 1 min per 150 words. Quiz: use timeTaken if available, else 2 min/session
const estimateLearningTime = (readingResults, quizSessions) => {
    const readingMins = readingResults.reduce((sum, r) => {
        return sum + (r.wordCount ? Math.round(r.wordCount / 150) : 2);
    }, 0);
    const quizMins = quizSessions.reduce((sum, q) => {
        return sum + (q.timeTaken ? Math.round(q.timeTaken / 60) : 2);
    }, 0);
    return readingMins + quizMins;
};

// ── Helper: build per-student summary ────────────────────────────
const buildStudentSummary = (student, readings, quizzes) => {
    const avgWPM = readings.length
        ? Math.round(readings.reduce((a, b) => a + (b.wpm ?? 0), 0) / readings.length)
        : null;

    const avgComp = readings.length
        ? Math.round(readings.reduce((a, b) => a + (b.percentage ?? 0), 0) / readings.length)
        : null;

    const avgQuiz = quizzes.length
        ? Math.round(quizzes.reduce((a, b) => a + (b.score ?? 0), 0) / quizzes.length)
        : null;

    const fiveDaysAgo    = new Date(Date.now() - 5 * 86_400_000);
    const recentActivity = readings.filter(r => new Date(r.completedAt) > fiveDaysAgo).length
                         + quizzes.filter(q => new Date(q.completedAt) > fiveDaysAgo).length;

    const flags = [];
    if (readings.length > 0 && avgWPM !== null && avgWPM < 80)   flags.push('Low reading speed');
    if (avgWPM > 250 && avgComp !== null && avgComp < 50)         flags.push('Speed/comprehension gap');
    if (recentActivity === 0 && (readings.length + quizzes.length) > 0) flags.push('Inactive 5+ days');
    if (readings.length === 0 && quizzes.length === 0)            flags.push('No activity yet');

    const status = flags.length >= 2 ? 'at-risk'
                 : flags.length === 1 ? 'needs-attention'
                 : avgWPM !== null    ? 'on-track'
                 : 'inactive';

    const milestones    = getMilestones(readings, quizzes);
    const learningTime  = estimateLearningTime(readings, quizzes);
    const achievedCount = milestones.filter(m => m.achieved).length;

    return {
        studentId:        student._id,
        name:             `${student.firstName} ${student.lastName}`,
        email:            student.email,
        totalStories:     readings.length,
        totalQuizzes:     quizzes.length,
        avgWPM,
        avgComprehension: avgComp,
        avgQuizScore:     avgQuiz,
        learningTime,     // minutes
        milestones,
        achievedCount,
        status,
        flags,
    };
};

// ── GET /api/teacher/dashboard ────────────────────────────────────
exports.getTeacherDashboard = asyncHandler(async (req, res) => {
    const teacherId = req.user._id;

    const students = await User.find(
        { teacher: teacherId, role: 'student' },
        'firstName lastName email createdAt'
    ).lean();

    if (students.length === 0) {
        return res.json({
            success: true,
            data: {
                summary:        { totalStudents: 0, classAvgWPM: 0, classAvgComprehension: 0, classAvgQuizScore: 0, totalLearningTime: 0, speedDistribution: { fast: 0, normal: 0, slow: 0 }, comprehensionDistribution: { excellent: 0, good: 0, needsWork: 0 } },
                classTrend:     [],
                attentionFlags: [],
                students:       [],
                topPerformers:  { readers: [], quizzers: [], timeLearners: [] },
                classCode:      req.user.classCode ?? null,
            },
        });
    }

    const studentIds = students.map(s => s._id);

    const [readingResults, quizSessions] = await Promise.all([
        ReadingResult.find({ userId: { $in: studentIds } }).lean(),
        QuizSession.find({   userId: { $in: studentIds } }).lean(),
    ]);

    // Group by student
    const readingMap = {};
    const quizMap    = {};
    for (const s of students) {
        readingMap[s._id.toString()] = [];
        quizMap[s._id.toString()]    = [];
    }
    for (const r of readingResults) {
        if (readingMap[r.userId.toString()]) readingMap[r.userId.toString()].push(r);
    }
    for (const q of quizSessions) {
        if (quizMap[q.userId.toString()]) quizMap[q.userId.toString()].push(q);
    }

    // Build summaries
    const studentSummaries = students.map(s =>
        buildStudentSummary(s, readingMap[s._id.toString()], quizMap[s._id.toString()])
    );

    // Class-wide stats
    const active   = studentSummaries.filter(s => s.avgWPM !== null);
    const quizTook = studentSummaries.filter(s => s.avgQuizScore !== null);

    const classAvgWPM  = active.length   ? Math.round(active.reduce((a, b) => a + b.avgWPM, 0) / active.length) : 0;
    const classAvgComp = active.length   ? Math.round(active.reduce((a, b) => a + b.avgComprehension, 0) / active.length) : 0;
    const classAvgQuiz = quizTook.length ? Math.round(quizTook.reduce((a, b) => a + b.avgQuizScore, 0) / quizTook.length) : 0;
    const totalLearningTime = studentSummaries.reduce((a, b) => a + b.learningTime, 0);

    const speedDist = {
        fast:   active.filter(s => s.avgWPM > 250).length,
        normal: active.filter(s => s.avgWPM >= 150 && s.avgWPM <= 250).length,
        slow:   active.filter(s => s.avgWPM < 150).length,
    };
    const compDist = {
        excellent: active.filter(s => s.avgComprehension >= 80).length,
        good:      active.filter(s => s.avgComprehension >= 60 && s.avgComprehension < 80).length,
        needsWork: active.filter(s => s.avgComprehension < 60).length,
    };

    // Class trend — last 8 reading results across all students
    const classTrend = [...readingResults]
        .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
        .slice(-8)
        .map((r, i) => ({ session: i + 1, wpm: r.wpm, comprehension: r.percentage }));

    const attentionFlags = studentSummaries
        .filter(s => s.flags.length > 0)
        .sort((a, b) => b.flags.length - a.flags.length)
        .slice(0, 5)
        .map(({ name, flags, status }) => ({ name, flags, status }));

    const topReaders     = [...studentSummaries].sort((a, b) => b.totalStories - a.totalStories).slice(0, 3);
    const topQuizzers    = [...quizTook].sort((a, b) => b.avgQuizScore - a.avgQuizScore).slice(0, 3);
    const topTimeLearners = [...studentSummaries].sort((a, b) => b.learningTime - a.learningTime).slice(0, 3);

    res.json({
        success: true,
        data: {
            summary: {
                totalStudents:             students.length,
                classAvgWPM,
                classAvgComprehension:     classAvgComp,
                classAvgQuizScore:         classAvgQuiz,
                totalLearningTime,
                speedDistribution:         speedDist,
                comprehensionDistribution: compDist,
            },
            classTrend,
            attentionFlags,
            students: studentSummaries,
            topPerformers: {
                readers:      topReaders,
                quizzers:     topQuizzers,
                timeLearners: topTimeLearners,
            },
            classCode: req.user.classCode ?? null,
        },
    });
});

// ── POST /api/teacher/enroll/:studentId ───────────────────────────
exports.enrollStudent = asyncHandler(async (req, res) => {
    const student = await User.findById(req.params.studentId);

    if (!student)
        throw new ApiError(404, 'Student not found');
    if (student.role !== 'student')
        throw new ApiError(400, 'User is not a student');
    if (student.teacher?.toString() === req.user._id.toString())
        throw new ApiError(400, 'Student already enrolled');

    student.teacher = req.user._id;
    await student.save();

    res.json({ success: true, message: `${student.firstName} enrolled successfully` });
});

// ── POST /api/teacher/enroll-by-code ─────────────────────────────
// Student calls this with their teacher's class code to self-enroll
exports.enrollByCode = asyncHandler(async (req, res) => {
    const { classCode } = req.body;
    if (!classCode) throw new ApiError(400, 'classCode is required');

    const teacher = await User.findOne({ classCode: classCode.toUpperCase(), role: 'teacher' });
    if (!teacher) throw new ApiError(404, 'Invalid class code');

    const student = await User.findById(req.user._id);
    if (student.teacher?.toString() === teacher._id.toString())
        throw new ApiError(400, 'Already enrolled in this class');

    student.teacher = teacher._id;
    await student.save();

    res.json({ success: true, message: `Enrolled in ${teacher.firstName}'s class!` });
});

// ── GET /api/teacher/class-code ───────────────────────────────────
// Returns teacher's class code (auto-generates one if missing)
exports.getClassCode = asyncHandler(async (req, res) => {
    const teacher = await User.findById(req.user._id);

    if (!teacher.classCode) {
        teacher.classCode = generateCode();
        await teacher.save();
    }

    res.json({ success: true, classCode: teacher.classCode });
});

// ── Helper: generate a random 6-char class code ───────────────────
function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}