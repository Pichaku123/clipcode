import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

//helps to maintain 1 state of user, so same logic is used everywhere
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const res = await client.get('/auth/me');
            setUser(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        const res = await client.post('/auth/login', { email, password });
        setUser(res.data);
        return res.data;
    };

    const register = async (email, password) => {
        const res = await client.post('/auth/register', { email, password });
        setUser(res.data);
        return res.data;
    };

    const logout = async () => {
        await client.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser: checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);    //directly call useAuth hook in components
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
