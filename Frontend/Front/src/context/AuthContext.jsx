import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    // ── Shared fetch logic (used by MainLayout + on page refresh) ─
    const fetchUserData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.data.user);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (err) {
            console.error('fetchUserData error:', err);
            setError('Cannot connect to server. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Restore session on page refresh ──────────────────────────
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // ── Called immediately after signup or login ──────────────────
    const login = useCallback((userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setLoading(false);
    }, []);

    // ── Logout ────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch('http://localhost:5000/api/auth/logout', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    }, []);

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        fetchUserData,       // ← this was missing from your saved version
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};