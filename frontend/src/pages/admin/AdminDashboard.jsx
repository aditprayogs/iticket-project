// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {
    Users,
    Ticket,
    FolderTree,
    HardDrive,
    Plus,
    UserCheck,
    UserX
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalTickets: 0, totalUsers: 0, totalCategories: 0, totalAssets: 0 });
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [catName, setCatName] = useState('');
    const [catDesc, setCatDesc] = useState('');
    const [submittingCat, setSubmittingCat] = useState(false);

    const fetchData = async () => {
        try {
            const [resStats, resUsers] = await Promise.all([
                axiosInstance.get('/admin/stats'),
                axiosInstance.get('/admin/users')
            ]);
            setStats(resStats.data);
            setUsersList(Array.isArray(resUsers.data) ? resUsers.data : []);
        } catch (err) {
            console.error('Gagal memuat data admin:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // UsersPage.jsx
    useEffect(() => { document.title = 'Manajemen User | ITicket Admin'; }, []);

// CategoriesPage.jsx
    useEffect(() => { document.title = 'Kategori Masalah | ITicket Admin'; }, []);

// AssetsPage.jsx
    useEffect(() => { document.title = 'Data Aset IT | ITicket Admin'; }, []);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setSubmittingCat(true);
        try {
            await axiosInstance.post('/admin/categories', { name: catName, description: catDesc });
            setShowCategoryModal(false);
            setCatName('');
            setCatDesc('');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menambahkan kategori');
        } finally {
            setSubmittingCat(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER PAGE */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Admin Control Panel
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Kelola pengguna sistem, kategori masalah, dan inventaris aset perusahaan.
                    </p>
                </div>
                <button
                    onClick={() => setShowCategoryModal(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                    <Plus size={18} />
                    <span>Tambah Kategori</span>
                </button>
            </div>

            {/* STATISTIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Ticket size={22} className="text-blue-600 dark:text-blue-400" />}
                    iconBg="bg-blue-50 dark:bg-blue-950/50"
                    count={stats.totalTickets}
                    label="Total Tiket"
                />
                <StatCard
                    icon={<Users size={22} className="text-purple-600 dark:text-purple-400" />}
                    iconBg="bg-purple-50 dark:bg-purple-950/50"
                    count={stats.totalUsers}
                    label="Total Pengguna"
                />
                <StatCard
                    icon={<FolderTree size={22} className="text-amber-600 dark:text-amber-400" />}
                    iconBg="bg-amber-50 dark:bg-amber-950/50"
                    count={stats.totalCategories}
                    label="Total Kategori"
                />
                <StatCard
                    icon={<HardDrive size={22} className="text-emerald-600 dark:text-emerald-400" />}
                    iconBg="bg-emerald-50 dark:bg-emerald-950/50"
                    count={stats.totalAssets}
                    label="Total Aset Perangkat"
                />
            </div>

            {/* TABEL USER */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Daftar Pengguna Terdaftar
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
            Total {usersList.length} Pengguna
          </span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Memuat data pengguna...
                    </div>
                ) : usersList.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Belum ada data pengguna.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <th className="py-3 px-4">Nama Lengkap</th>
                                <th className="py-3 px-4">Username</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                            {usersList.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                                        {u.full_name}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                        {u.username}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                        {u.email}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <RolePill role={u.role} />
                                    </td>
                                    <td className="py-3.5 px-4">
                                        {u.is_active ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          <UserCheck size={14} /> Aktif
                        </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-[11px]">
                          <UserX size={14} /> Nonaktif
                        </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL KATEGORI */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Tambah Kategori Masalah Baru
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Masukkan kategori masalah IT baru yang dapat dipilih oleh karyawan saat mengajukan tiket.
                            </p>
                        </div>

                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nama Kategori
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                    placeholder="Contoh: Database & Server"
                                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-purple-600 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Deskripsi Singkat
                                </label>
                                <textarea
                                    rows={3}
                                    value={catDesc}
                                    onChange={(e) => setCatDesc(e.target.value)}
                                    placeholder="Deskripsi ruang lingkup kategori..."
                                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-purple-600 transition-colors resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryModal(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingCat}
                                    className="px-4 py-2 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                                >
                                    {submittingCat ? 'Menyimpan...' : 'Simpan Kategori'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, iconBg, count, label }) => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center gap-4 shadow-sm transition-colors">
        <div className={`w-11 h-11 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
            {icon}
        </div>
        <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {count}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
        </div>
    </div>
);

const RolePill = ({ role }) => {
    let style = 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400';
    if (role === 'Admin') {
        style = 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400';
    } else if (role === 'IT Support') {
        style = 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400';
    }

    return (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${style}`}>
      {role}
    </span>
    );
};

export default AdminDashboard;