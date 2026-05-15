// controllers/enrollmentController.js
const User = require('../models/User');

// POST /api/enrollment/join
// Body: { classCode }
// Auth: student JWT
const joinClass = async (req, res) => {
    try {
        const { classCode } = req.body;

        if (!classCode)
            return res.status(400).json({ success: false, message: 'Class code is required.' });

        // 1. Find teacher by code
        const teacher = await User.findOne({ classCode: classCode.toUpperCase(), role: 'teacher' });
        if (!teacher)
            return res.status(404).json({ success: false, message: 'Invalid class code. No class found.' });

        // 2. Load student
        const student = await User.findById(req.user.id);
        if (student.role !== 'student')
            return res.status(403).json({ success: false, message: 'Only students can enroll in a class.' });

        // 3. Already in this class?
        if (student.teacher?.toString() === teacher._id.toString())
            return res.status(409).json({ success: false, message: 'You are already enrolled in this class.' });

        // 4. Already in a different class?
        if (student.teacher)
            return res.status(409).json({ success: false, message: 'You are already enrolled in another class. Leave it first.' });

        // 5. Enroll
        student.teacher    = teacher._id;
        student.enrolledAt = new Date();
        await student.save();

        teacher.students.addToSet(student._id); // prevents duplicates
        await teacher.save();

        return res.status(200).json({
            success:     true,
            message:     'Successfully enrolled!',
            data: {
                teacherName: `${teacher.firstName} ${teacher.lastName}`,
                classCode:   teacher.classCode,
                enrolledAt:  student.enrolledAt,
            },
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/enrollment/leave
// Auth: student JWT
const leaveClass = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);

        if (!student.teacher)
            return res.status(400).json({ success: false, message: 'You are not enrolled in any class.' });

        // Remove student from teacher's list
        await User.findByIdAndUpdate(student.teacher, {
            $pull: { students: student._id },
        });

        // Clear student's enrollment
        student.teacher    = null;
        student.enrolledAt = null;
        await student.save();

        return res.status(200).json({ success: true, message: 'Successfully left the class.' });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { joinClass, leaveClass };