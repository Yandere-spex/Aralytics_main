// utils/generateClassCode.js
const generateClassCode = () => {
    const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const suffix = Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    return `ARAL-${suffix}`;
};

module.exports = generateClassCode;