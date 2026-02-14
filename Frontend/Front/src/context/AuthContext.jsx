import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Fetch function - only runs when called
    const fetchUserData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.log('No token found');
                setUser(null);
                setLoading(false);
                return;
            }

            console.log('🔍 Fetching user data...');

            const response = await fetch('http://localhost:5000/api/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ User data fetched:', data.data.user);
                setUser(data.data.user);
            } else {
                console.log('❌ Token invalid, clearing storage');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (err) {
            console.error('❌ Error fetching user:', err);
            
            if (err.message === 'Failed to fetch') {
                setError('Cannot connect to server. Please check if the backend is running.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
            console.log('Loading complete');
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (token) {
                await fetch('http://localhost:5000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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
        logout,
        fetchUserData,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};