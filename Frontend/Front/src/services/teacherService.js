const BASE = 'http://localhost:5000/api';

const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getTeacherDashboard = async () => {
    const res = await fetch(`${BASE}/teacher/dashboard`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    const data = await res.json();
    return data;
};

export const enrollStudent = async (studentId) => {
    const res = await fetch(`${BASE}/teacher/enroll/${studentId}`, {
        method: 'POST',
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to enroll student');
    return res.json();
};

export const getClassCode = async () => {
    const res  = await fetch(`${BASE}/teacher/class-code`, { headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get class code');
    return data.classCode;
};

export const enrollByCode = async (classCode) => {
    const res  = await fetch(`${BASE}/teacher/enroll-by-code`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ classCode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid class code');
    return data;
};