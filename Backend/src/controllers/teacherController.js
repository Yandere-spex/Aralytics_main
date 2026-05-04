//qconst User           = require('../models/User');
const ReadingSession = require('../models/ReadingSession');
//const QuizSession    = require('../models/QuizSession');

// ── Helper: build per-student summary ────────────────────────────
const buildStudentSummary = (student, sessions, quizzes) => {
    const avgWPM = sessions.length
    ? Math.round(sessions.reduce((a, b) => a + b.wpm, 0) / sessions.length)
    : null;

    const avgComp = sessions.length
    ? Math.round(sessions.reduce((a, b) => a + b.comprehensionPercentage, 0) / sessions.length)
    : null;

    const avgQuiz = quizzes.length
    ? Math.round(quizzes.reduce((a, b) => a + b.score, 0) / quizzes.length)
    : null;

    const fiveDaysAgo    = new Date(Date.now() - 5 * 86_400_000);
    const recentActivity = sessions.filter(s => new Date(s.completedAt) > fiveDaysAgo).length
                    + quizzes.filter(q => new Date(q.completedAt) > fiveDaysAgo).length;

    const flags = [];
    if (sessions.length > 0 && avgWPM !== null && avgWPM < 80)
        flags.push('Low reading speed');
    if (avgWPM > 250 && avgComp !== null && avgComp < 50)
        flags.push('Speed/comprehension gap');
    if (recentActivity === 0 && (sessions.length + quizzes.length) > 0)
        flags.push('Inactive 5+ days');
    if (sessions.length === 0 && quizzes.length === 0)
        flags.push('No activity yet');

    const status = flags.length >= 2  ? 'at-risk'
                : flags.length === 1  ? 'needs-attention'
                : avgWPM !== null     ? 'on-track'
                : 'inactive';

return {
    studentId:        student._id,
    name:             `${student.firstName} ${student.lastName}`,
    email:            student.email,
    totalStories:     sessions.length,
    totalQuizzes:     quizzes.length,
    avgWPM,
    avgComprehension: avgComp,
    avgQuizScore:     avgQuiz,
    status,
    flags,
    };
};

// ── GET /api/teacher/dashboard ────────────────────────────────────
exports.getTeacherDashboard = async (req, res) => {
    try {
    const teacherId = req.user._id;

    const students = await User.find(
        { teacher: teacherId, role: 'student' },
        'firstName lastName email createdAt'
        ).lean();

        if (students.length === 0) {
        return res.json({
            summary:        { totalStudents: 0 },
            classTrend:     [],
            attentionFlags: [],
            students:       [],
            topPerformers:  { readers: [], quizzers: [] },
        });
    }

    const studentIds = students.map(s => s._id);

    const [readingSessions, quizSessions] = await Promise.all([
        ReadingSession.find({ userId: { $in: studentIds } }).lean(),
        QuizSession.find({   userId: { $in: studentIds } }).lean(),
    ]);

    // Group sessions by student
    const sessionMap = {};
    const quizMap    = {};
    for (const s of students) {
        sessionMap[s._id.toString()] = [];
        quizMap[s._id.toString()]    = [];
    }
    for (const r of readingSessions) sessionMap[r.userId.toString()]?.push(r);
    for (const q of quizSessions)    quizMap[q.userId.toString()]?.push(q);

    // Build summaries
    const studentSummaries = students.map(s =>
        buildStudentSummary(s, sessionMap[s._id.toString()], quizMap[s._id.toString()])
    );

    // Class-wide stats
    const active   = studentSummaries.filter(s => s.avgWPM !== null);
    const quizTook = studentSummaries.filter(s => s.avgQuizScore !== null);

    const classAvgWPM  = active.length   ? Math.round(active.reduce((a,b) => a + b.avgWPM, 0)           / active.length)   : 0;
    const classAvgComp = active.length   ? Math.round(active.reduce((a,b) => a + b.avgComprehension, 0)  / active.length)   : 0;
    const classAvgQuiz = quizTook.length ? Math.round(quizTook.reduce((a,b) => a + b.avgQuizScore, 0)    / quizTook.length) : 0;

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

    // Class WPM trend — last 8 reading sessions across all students
    const classTrend = [...readingSessions]
        .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
        .slice(-8)
        .map((s, i) => ({ session: i + 1, wpm: s.wpm, comprehension: s.comprehensionPercentage }));

    const attentionFlags = studentSummaries
        .filter(s => s.flags.length > 0)
        .sort((a, b) => b.flags.length - a.flags.length)
        .slice(0, 5)
        .map(({ name, flags, status }) => ({ name, flags, status }));

    const topReaders  = [...studentSummaries].sort((a,b) => b.totalStories - a.totalStories).slice(0, 3);
    const topQuizzers = [...quizTook].sort((a,b) => b.avgQuizScore - a.avgQuizScore).slice(0, 3);

    res.json({
        summary: {
            totalStudents:             students.length,
            classAvgWPM,
            classAvgComprehension:     classAvgComp,
            classAvgQuizScore:         classAvgQuiz,
            speedDistribution:         speedDist,
            comprehensionDistribution: compDist,
        },
        classTrend,
        attentionFlags,
        students: studentSummaries,
        topPerformers: { readers: topReaders, quizzers: topQuizzers },
        });

    } catch (err) {
        console.error('Teacher dashboard error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ── POST /api/teacher/enroll/:studentId ───────────────────────────
exports.enrollStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.studentId);

        if (!student)
        return res.status(404).json({ success: false, message: 'Student not found' });
        if (student.role !== 'student')
        return res.status(400).json({ success: false, message: 'User is not a student' });
        if (student.teacher?.toString() === req.user._id.toString())
        return res.status(400).json({ success: false, message: 'Student already enrolled' });

        student.teacher = req.user._id;
        await student.save();

        res.json({ success: true, message: `${student.firstName} enrolled successfully` });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};