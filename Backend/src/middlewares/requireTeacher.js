module.exports = (req, res, next) => {
    if (req.user?.role !== 'teacher' && req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Teacher access only' });
    }
    next();
};