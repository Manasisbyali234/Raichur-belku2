import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                // We don't have a specific /me endpoint that uses cookies only yet?
                // Actually /profile uses protect which checks cookie.
                // So calling /api/auth/profile will return user if cookie exists.
                const { data } = await axios.get('/api/auth/profile');
                setUser(data);
            } catch (error) {
                // Not logged in
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post('/api/auth/register', { name, email, password });
        setUser(data);
        return data;
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
