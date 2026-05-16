const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type:      String,
        required:  [true, 'Please add your first name'],
        trim:      true,
        maxlength: [50, 'First name cannot be more than 50 characters'],
    },
    lastName: {
        type:      String,
        required:  [true, 'Please add your last name'],
        trim:      true,
        maxlength: [50, 'Last name cannot be more than 50 characters'],
    },
    email: {
        type:      String,
        required:  [true, 'Please add an email'],
        unique:    true,
        lowercase: true,
        match:     [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    password: {
        type:      String,
        required:  [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select:    false,
    },
    role: {
        type:    String,
        enum:    ['user', 'student', 'teacher', 'admin'],
        default: 'student',
    },
    isActive: {
        type:    Boolean,
        default: true,
    },

    // ── Student-only ─────────────────────────────────────────────
    teacher: {
        type:    mongoose.Schema.Types.ObjectId,
        ref:     'User',
        default: null,
    },
    enrolledAt: {
        type:    Date,
        default: null,
    },

    // ── Teacher-only ─────────────────────────────────────────────
    classCode: {
        type:   String,
        sparse: true,
        unique: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:  'User',
    }],

}, { timestamps: true });

// ── Hooks & methods ───────────────────────────────────────────────
userSchema.pre('save', async function () {       // ← no next parameter
    if (!this.isModified('password')) return;    // ← no next() call
    const salt    = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
                                                 // ← no next() at end
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

module.exports = mongoose.model('User', userSchema);