// src/pages/admin/UsersPage.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Plus, Trash2, UserCheck, UserX, Search } from 'lucide-react';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Employee');

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/admin/users', { full_name: fullName, username, email, password, role });
            setShowModal(false);
            setFullName(''); setUsername(''); setEmail(''); setPassword('');
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menambahkan user');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await axiosInstance.patch(`/admin/users/${id}`, { is_active: !currentStatus });
            fetchUsers();
        } catch (err) {
            alert('Gagal mengubah status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
        try {
            await axiosInstance.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Manajemen User</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Kelola pengguna, peranan (role), dan hak akses sistem.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer">
                    <Plus size={18} /> Tambah User
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Memuat data...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 uppercase">
                                <th className="py-3 px-4">Nama Lengkap</th>
                                <th className="py-3 px-4">Username</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-center">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{u.full_name}</td>
                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{u.username}</td>
                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                                    <td className="py-3.5 px-4"><span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">{u.role}</span></td>
                                    <td className="py-3.5 px-4">
                                        <button onClick={() => handleToggleStatus(u.id, u.is_active)} className="cursor-pointer">
                                            {u.is_active ? <span className="text-emerald-600 font-bold inline-flex items-center gap-1"><UserCheck size={14}/> Aktif</span> : <span className="text-red-500 font-bold inline-flex items-center gap-1"><UserX size={14}/> Nonaktif</span>}
                                        </button>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 cursor-pointer p-1"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL USER */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tambah User Baru</h3>
                        <form onSubmit={handleCreateUser} className="space-y-3">
                            <input type="text" placeholder="Nama Lengkap" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100" />
                            <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100" />
                            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100" />
                            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100" />
                            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100">
                                <option value="Employee">Employee</option>
                                <option value="IT Support">IT Support</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 border rounded-lg">Batal</button>
                                <button type="submit" className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;