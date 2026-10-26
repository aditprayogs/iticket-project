// src/pages/admin/AssetsPage.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Plus, Trash2, HardDrive } from 'lucide-react';

const AssetsPage = () => {
    const [assets, setAssets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [assetCode, setAssetCode] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Laptop');
    const [serialNumber, setSerialNumber] = useState('');
    const [userId, setUserId] = useState('');

    const fetchData = async () => {
        try {
            const [resAssets, resUsers] = await Promise.all([
                axiosInstance.get('/admin/assets'),
                axiosInstance.get('/admin/users')
            ]);
            setAssets(Array.isArray(resAssets.data) ? resAssets.data : []);
            setUsers(Array.isArray(resUsers.data) ? resUsers.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateAsset = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/admin/assets', {
                asset_code: assetCode,
                name,
                category,
                serial_number: serialNumber,
                user_id: userId || null
            });
            setShowModal(false);
            setAssetCode(''); setName(''); setSerialNumber(''); setUserId('');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menambahkan aset');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus aset ini?')) return;
        try {
            await axiosInstance.delete(`/admin/assets/${id}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus aset');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Data Aset Perangkat</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Pendataan inventaris perangkat keras perusahaan.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                    <Plus size={18} /> Tambah Aset
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Memuat data aset...</div>
                ) : assets.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Belum ada aset terdaftar.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 uppercase">
                                <th className="py-3 px-4">Kode Aset</th>
                                <th className="py-3 px-4">Nama Perangkat</th>
                                <th className="py-3 px-4">Kategori</th>
                                <th className="py-3 px-4">Serial Number</th>
                                <th className="py-3 px-4">Pemegang (User)</th>
                                <th className="py-3 px-4 text-center">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                            {assets.map((a) => (
                                <tr key={a.id}>
                                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">{a.asset_code}</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <HardDrive size={16} className="text-slate-400" />
                                        <span>{a.name}</span>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{a.category}</td>
                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{a.serial_number || '-'}</td>
                                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-200">{a.user_name || 'Tersedia (Unassigned)'}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-700 cursor-pointer p-1">
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
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tambah Aset Baru</h3>
                        <form onSubmit={handleCreateAsset} className="space-y-3">
                            <input type="text" placeholder="Kode Aset (misal: AST-2026-001)" required value={assetCode} onChange={(e) => setAssetCode(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100" />
                            <input type="text" placeholder="Nama Perangkat (misal: MacBook Pro M2)" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100" />

                            <div className="grid grid-cols-2 gap-2">
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100">
                                    <option value="Laptop">Laptop</option>
                                    <option value="PC Desktop">PC Desktop</option>
                                    <option value="Monitor">Monitor</option>
                                    <option value="Printer">Printer</option>
                                    <option value="Jaringan">Jaringan</option>
                                </select>
                                <input type="text" placeholder="Serial Number" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Pemegang Perangkat</label>
                                <select value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100">
                                    <option value="">-- Belum Di-assign (Stok) --</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 border rounded-lg">Batal</button>
                                <button type="submit" className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetsPage;