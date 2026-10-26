// src/layouts/MainLayout.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { Ticket, LogOut, User } from 'lucide-react';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif' }}>
            {/* Header / Navbar */}
            <nav style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'rgba(37, 99, 235, 0.2)', borderRadius: '8px' }}>
                        <Ticket color="#3b82f6" size={24} />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>ITicket Portal</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid #334155' }}>
                        <User size={16} color="#94a3b8" />
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user?.full_name}</span>
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>{user?.role}</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '600' }}
                    >
                        <LogOut size={18} />
                        <span>Keluar</span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;