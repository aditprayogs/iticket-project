// src/layouts/AppLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

import { BarChart3 } from 'lucide-react'; // Tambahkan icon ini di bagian import lucide-react

import {
    Ticket,
    LayoutDashboard,
    ClipboardList,
    Users,
    FolderTree,
    HardDrive,
    Sun,
    Moon,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const AppLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Sidebar mobile
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Sidebar desktop
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Dark mode
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // State Notifikasi
    const [notifications, setNotifications] = useState([]);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);

    // Fetch Notifikasi dari Backend
    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get('/notifications');
            setNotifications(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Gagal mengambil notifikasi:', err);
        }
    };

    // Polling Notifikasi Setiap 10 Detik
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    // Hitung Notifikasi Belum Dibaca
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    // Toggle Dropdown Notifikasi & Tandai Dibaca
    const handleToggleNotifications = async () => {
        setShowNotifDropdown((prev) => !prev);
        if (unreadCount > 0) {
            try {
                await axiosInstance.patch('/notifications/read');
                setNotifications((prev) =>
                    prev.map((n) => ({ ...n, is_read: 1 }))
                );
            } catch (err) {
                console.error('Gagal memperbarui status notifikasi:', err);
            }
        }
    };

    // Terapkan dark mode
    useEffect(() => {
        const root = document.documentElement;

        root.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Tutup sidebar mobile & dropdown notifikasi ketika pindah halaman
    useEffect(() => {
        setIsMobileSidebarOpen(false);
        setShowNotifDropdown(false);
    }, [location.pathname]);

    // Tutup sidebar mobile dengan tombol Escape
    useEffect(() => {
        if (!isMobileSidebarOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsMobileSidebarOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMobileSidebarOpen]);

    // Cegah scroll background saat sidebar mobile terbuka
    useEffect(() => {
        if (!isMobileSidebarOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileSidebarOpen]);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    const handleLogout = () => {
        setIsMobileSidebarOpen(false);
        logout();
        navigate('/login');
    };

    const getNavItems = () => {
        if (user?.role === 'Admin') {
            return [
                { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
                { label: 'Analitik & SLA', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
                { label: 'Manajemen User', path: '/admin/users', icon: <Users size={18} /> },
                { label: 'Kategori Masalah', path: '/admin/categories', icon: <FolderTree size={18} /> },
                { label: 'Data Aset', path: '/admin/assets', icon: <HardDrive size={18} /> },
            ];
        }

        if (user?.role === 'IT Support') {
            return [
                { label: 'Dashboard IT', path: '/support/queue', icon: <LayoutDashboard size={20} /> },
                { label: 'Analitik & SLA', path: '/support/analytics', icon: <BarChart3 size={20} /> },
                { label: 'Antrean Tiket', path: '/support/queue', icon: <ClipboardList size={20} /> },
            ];
        }

        return [
            { label: 'Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={20} /> },
            { label: 'Tiket Saya', path: '/employee/dashboard', icon: <Ticket size={20} /> },
        ];
    };

    const navItems = getNavItems();

    // Komponen sidebar digunakan untuk desktop dan mobile
    const renderSidebarContent = (isMobile = false) => (
        <>
            {/* Logo */}
            <div
                className={`flex items-center ${
                    isSidebarCollapsed && !isMobile
                        ? 'justify-center'
                        : 'gap-3'
                } px-2 mb-8`}
            >
                <div className="w-10 h-10 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
                    <Ticket size={22} />
                </div>

                {(!isSidebarCollapsed || isMobile) && (
                    <div className="min-w-0">
                        <h2 className="font-bold text-base text-slate-900 dark:text-white">
                            ITicket
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user?.role} Portal
                        </p>
                    </div>
                )}
            </div>

            {/* Navigasi */}
            <nav className="flex flex-col gap-1.5">
                {navItems.map((item, idx) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <button
                            key={`${item.label}-${idx}`}
                            type="button"
                            title={
                                isSidebarCollapsed && !isMobile
                                    ? item.label
                                    : undefined
                            }
                            onClick={() => navigate(item.path)}
                            className={`flex items-center ${
                                isSidebarCollapsed && !isMobile
                                    ? 'justify-center'
                                    : 'gap-3'
                            } w-full px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <span className="shrink-0">{item.icon}</span>

                            {(!isSidebarCollapsed || isMobile) && (
                                <span className="truncate text-left">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Pengaturan dan logout */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                <button
                    type="button"
                    onClick={toggleDarkMode}
                    title={
                        isSidebarCollapsed && !isMobile
                            ? isDarkMode
                                ? 'Light Mode'
                                : 'Dark Mode'
                            : undefined
                    }
                    className={`flex items-center ${
                        isSidebarCollapsed && !isMobile
                            ? 'justify-center'
                            : 'justify-between'
                    } w-full px-3.5 py-3 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50`}
                >
                    <span className="flex items-center gap-3">
                        {isDarkMode ? (
                            <Sun size={19} className="text-amber-400 shrink-0" />
                        ) : (
                            <Moon size={19} className="shrink-0" />
                        )}

                        {(!isSidebarCollapsed || isMobile) && (
                            <span>
                                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        )}
                    </span>

                    {(!isSidebarCollapsed || isMobile) && (
                        <span
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                                isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                        >
                            <span
                                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                                    isDarkMode ? 'translate-x-4' : 'translate-x-0'
                                }`}
                            />
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={handleLogout}
                    title={
                        isSidebarCollapsed && !isMobile
                            ? 'Keluar'
                            : undefined
                    }
                    className={`flex items-center ${
                        isSidebarCollapsed && !isMobile
                            ? 'justify-center'
                            : 'gap-3'
                    } w-full px-3.5 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors`}
                >
                    <LogOut size={19} className="shrink-0" />

                    {(!isSidebarCollapsed || isMobile) && (
                        <span>Keluar</span>
                    )}
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Overlay mobile */}
            {isMobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Tutup sidebar"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
                />
            )}

            {/* Sidebar mobile */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col justify-between overflow-y-auto bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-5 transition-transform duration-300 ease-in-out md:hidden ${
                    isMobileSidebarOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                }`}
                aria-label="Navigasi mobile"
                aria-hidden={!isMobileSidebarOpen}
            >
                <div>
                    <div className="flex justify-end mb-3">
                        <button
                            type="button"
                            onClick={() => setIsMobileSidebarOpen(false)}
                            aria-label="Tutup menu"
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {renderSidebarContent(true)}
                </div>
            </aside>

            {/* Layout desktop */}
            <div className="flex min-h-screen w-full">
                <aside
                    className={`hidden md:flex flex-col justify-between shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 transition-[width] duration-300 ${
                        isSidebarCollapsed ? 'w-[76px]' : 'w-60'
                    }`}
                >
                    <div>{renderSidebarContent(false)}</div>

                    <button
                        type="button"
                        onClick={() =>
                            setIsSidebarCollapsed((prev) => !prev)
                        }
                        aria-label={
                            isSidebarCollapsed
                                ? 'Perbesar sidebar'
                                : 'Perkecil sidebar'
                        }
                        title={
                            isSidebarCollapsed
                                ? 'Perbesar sidebar'
                                : 'Perkecil sidebar'
                        }
                        className="mt-4 flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        {isSidebarCollapsed ? (
                            <ChevronRight size={20} />
                        ) : (
                            <ChevronLeft size={20} />
                        )}
                    </button>
                </aside>

                {/* Area konten */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className="sticky top-0 z-30 h-16 shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Hamburger mobile */}
                            <button
                                type="button"
                                onClick={() =>
                                    setIsMobileSidebarOpen(true)
                                }
                                aria-label="Buka menu"
                                aria-expanded={isMobileSidebarOpen}
                                className="md:hidden shrink-0 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                <Menu size={22} />
                            </button>

                            {/* Search desktop/tablet */}
                            <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg w-48 md:w-64 lg:w-80 min-w-0">
                                <Search
                                    size={16}
                                    className="text-slate-400 shrink-0"
                                />
                                <input
                                    type="text"
                                    placeholder="Cari di portal ITicket..."
                                    aria-label="Cari di portal ITicket"
                                    className="bg-transparent border-none outline-none text-xs text-slate-900 dark:text-slate-100 w-full min-w-0 placeholder-slate-400"
                                />
                            </div>

                            {/* Identitas mobile */}
                            <div className="sm:hidden flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 shrink-0 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                    <Ticket size={18} />
                                </div>

                                <span className="font-bold text-sm truncate">
                                    ITicket
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-5">
                            {/* NOTIFIKASI LONCENG INTERAKTIF */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={handleToggleNotifications}
                                    aria-label="Notifikasi"
                                    className="relative shrink-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                >
                                    <Bell
                                        size={19}
                                        className="text-slate-500 dark:text-slate-400"
                                    />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* DROPDOWN NOTIFIKASI */}
                                {showNotifDropdown && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden">
                                        <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Notifikasi
                                            </h4>
                                            <span className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">
                                                {notifications.length} Terbaru
                                            </span>
                                        </div>

                                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-xs text-slate-400">
                                                    Tidak ada notifikasi
                                                </div>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        className={`p-3 text-xs transition-colors ${
                                                            !n.is_read
                                                                ? 'bg-blue-50/50 dark:bg-blue-950/20'
                                                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                                                        }`}
                                                    >
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            {n.title}
                                                        </p>
                                                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                                                            {n.message}
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 mt-1 block">
                                                            {new Date(
                                                                n.created_at
                                                            ).toLocaleTimeString(
                                                                'id-ID',
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profil */}
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <div className="w-9 h-9 shrink-0 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full flex items-center justify-center font-bold text-sm">
                                    {user?.full_name
                                        ? user.full_name.charAt(0).toUpperCase()
                                        : 'U'}
                                </div>

                                <div className="hidden sm:block min-w-0">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-32">
                                        {user?.full_name}
                                    </div>

                                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {user?.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Konten halaman */}
                    <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AppLayout;