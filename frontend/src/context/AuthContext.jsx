// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ambil data user saat aplikasi pertama kali dimuat jika token ada
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axiosInstance.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error('Gagal mengambil data user:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    // Fungsi Login
    const login = async (username, password) => {
        const response = await axiosInstance.post('/auth/login', {
            username,
            password,
        });

        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        setUser(userData);
        return userData;
    };

    // Fungsi Logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);