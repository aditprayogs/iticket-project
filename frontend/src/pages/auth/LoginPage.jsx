// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, Ticket, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user, login } = useAuth();
    const navigate = useNavigate();

    // PREFIX / GUARD: Jika sudah login, paksa redirect ke dashboard role-nya (wajib logout dulu untuk ke /login)
    useEffect(() => {
        if (user) {
            if (user.role === 'Admin') {
                navigate('/admin/dashboard', { replace: true });
            } else if (user.role === 'IT Support') {
                navigate('/support/queue', { replace: true });
            } else {
                navigate('/employee/dashboard', { replace: true });
            }
        }
        document.title = 'Login | ITicket Portal';
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const loggedInUser = await login(username, password);

            if (loggedInUser.role === 'Admin') {
                navigate('/admin/dashboard', { replace: true });
            } else if (loggedInUser.role === 'IT Support') {
                navigate('/support/queue', { replace: true });
            } else {
                navigate('/employee/dashboard', { replace: true });
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 'Username atau password yang Anda masukkan salah.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-slate-900 p-6 relative font-sans">
            <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl z-10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                        <Ticket size={24} className="text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight">ITicket System</h1>
                    <p className="text-xs text-slate-400 mt-1">Masukkan kredensial akun untuk mengakses portal IT Support</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg text-xs mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
                        <div className="relative flex items-center">
                            <User size={18} className="absolute left-3 text-slate-500" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Masukkan username Anda"
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                        <div className="relative flex items-center">
                            <Lock size={18} className="absolute left-3 text-slate-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <span>Masuk ke Akun</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-5 border-t border-slate-700 text-center text-[11px] text-slate-500">
                    Lupa kredensial? Hubungi Tim Admin IT Support.
                </div>
            </div>
        </div>
    );
};

export default LoginPage;