// src/services/teacherService.js

const BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type':  'application/json',
});

// GET /api/teacher/dashboard
export const getTeacherDashboard = async () => {
    const res  = await fetch(`${BASE_URL}/teacher/dashboard`, { headers: headers() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load dashboard');
    return data.data;
};

// GET /api/teacher/class-code
export const getClassCode = async () => {
    const res  = await fetch(`${BASE_URL}/teacher/class-code`, { headers: headers() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get class code');
    return data.classCode;
};

// POST /api/teacher/enroll/:studentId  (teacher enrolls by ID)
export const enrollStudent = async (studentId) => {
    const res  = await fetch(`${BASE_URL}/teacher/enroll/${studentId}`, {
        method: 'POST',
        headers: headers(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to enroll student');
    return data;
};

// POST /api/teacher/enroll-by-code  (student self-enrolls)
export const enrollByCode = async (classCode) => {
    const res  = await fetch(`${BASE_URL}/teacher/enroll-by-code`, {
        method:  'POST',
        headers: headers(),
        body:    JSON.stringify({ classCode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid class code');
    return data;
};