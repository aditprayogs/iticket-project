// src/pages/admin/CategoriesPage.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Plus, Trash2, FolderTree } from 'lucide-react';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get('/admin/categories');
            setCategories(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/admin/categories', { name, description });
            setShowModal(false);
            setName('');
            setDescription('');
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menambahkan kategori');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus kategori ini?')) return;
        try {
            await axiosInstance.delete(`/admin/categories/${id}`);
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus kategori');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Kategori Masalah</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Kelola daftar opsi kategori laporan untuk tiket IT.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                    <Plus size={18} /> Tambah Kategori
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Memuat data kategori...</div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Belum ada kategori terdaftar.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 uppercase">
                                <th className="py-3 px-4">Nama Kategori</th>
                                <th className="py-3 px-4">Deskripsi</th>
                                <th className="py-3 px-4 text-center">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                            {categories.map((c) => (
                                <tr key={c.id}>
                                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FolderTree size={16} className="text-purple-500" />
                                        <span>{c.name}</span>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{c.description || '-'}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 cursor-pointer p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tambah Kategori Baru</h3>
                        <form onSubmit={handleCreateCategory} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Nama Kategori (misal: Hardware)"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                            />
                            <textarea
                                placeholder="Deskripsi singkat..."
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 resize-none"
                            />
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 border rounded-lg">Batal</button>
                                <button type="submit" className="px-4 py-2 text-xs font-semibold bg-purple-600 text-white rounded-lg">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;