// src/pages/employee/EmployeeDashboard.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {
    Ticket,
    Clock,
    CheckCircle2,
    Hourglass,
    Plus,
    Search,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Upload,
    Paperclip
} from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');

const EmployeeDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    // State Modal Buat Tiket
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchTickets = async () => {
        try {
            const res = await axiosInstance.get('/tickets');
            setTickets(res.data);
        } catch (err) {
            console.error('Gagal mengambil data tiket:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
        axiosInstance
            .get('/tickets/categories')
            .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
            .catch((err) => console.error('Gagal memuat kategori:', err));
        document.title = 'Dashboard Tiket Saya | ITicket';
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // HANDLER SUBMIT TIKET DENGAN UPLOAD FILE (MULTIPART/FORM-DATA)
    const handleCreateTicket = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category_id', categoryId);
        formData.append('priority', priority);

        if (selectedFile) {
            formData.append('attachment', selectedFile);
        }

        try {
            await axiosInstance.post('/tickets', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowModal(false);
            setTitle('');
            setDescription('');
            setCategoryId('');
            setPriority('Medium');
            setSelectedFile(null);
            fetchTickets();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal membuat tiket');
        } finally {
            setSubmitting(false);
        }
    };

    // Kalkulasi Statistik
    const totalTicket = tickets.length;
    const waitingCount = tickets.filter((t) => t.status === 'Waiting').length;
    const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
    const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

    // Filter Data Tiket
    const filteredTickets = tickets.filter((t) => {
        const matchTab =
            activeTab === 'Semua'
                ? true
                : activeTab === 'Waiting'
                    ? t.status === 'Waiting'
                    : activeTab === 'In Progress'
                        ? t.status === 'In Progress'
                        : t.status === 'Resolved' || t.status === 'Closed';

        const matchSearch =
            t.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchTab && matchSearch;
    });

    return (
        <div className="space-y-6">
            {/* HEADER PAGE */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Dashboard Laporan IT
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Pantau status pengajuan perbaikan dan kendala perangkat Anda.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                    <Plus size={18} />
                    <span>Buat Tiket Baru</span>
                </button>
            </div>

            {/* KARTU STATISTIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Ticket size={22} className="text-blue-600 dark:text-blue-400" />}
                    iconBg="bg-blue-50 dark:bg-blue-950/50"
                    count={totalTicket}
                    label="Total Tiket Saya"
                />
                <StatCard
                    icon={<Hourglass size={22} className="text-purple-600 dark:text-purple-400" />}
                    iconBg="bg-purple-50 dark:bg-purple-950/50"
                    count={waitingCount}
                    label="Waiting"
                />
                <StatCard
                    icon={<Clock size={22} className="text-amber-600 dark:text-amber-400" />}
                    iconBg="bg-amber-50 dark:bg-amber-950/50"
                    count={inProgressCount}
                    label="In Progress"
                />
                <StatCard
                    icon={<CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" />}
                    iconBg="bg-emerald-50 dark:bg-emerald-950/50"
                    count={resolvedCount}
                    label="Selesai (Resolved)"
                />
            </div>

            {/* TABEL TIKET */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                {/* FILTER TAB & SEARCH */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex gap-2 border-b-2 border-transparent">
                        {['Semua', 'Waiting', 'In Progress', 'Resolved'].map((tab) => {
                            const count =
                                tab === 'Semua'
                                    ? totalTicket
                                    : tab === 'Waiting'
                                        ? waitingCount
                                        : tab === 'In Progress'
                                            ? inProgressCount
                                            : resolvedCount;

                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3.5 py-2 text-sm font-medium transition-colors border-b-2 -mb-4 cursor-pointer ${
                                        isActive
                                            ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                                >
                                    {tab} ({count})
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm w-full md:w-64">
                            <Search size={16} className="text-slate-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Cari tiket atau judul..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 text-xs w-full placeholder-slate-400"
                            />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 shrink-0">
                            <ArrowUpDown size={14} className="text-slate-400" />
                            <span>Terbaru</span>
                        </div>
                    </div>
                </div>

                {/* KONTEN TABEL */}
                {loading ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Memuat data tiket...
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Belum ada tiket yang cocok.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <th className="py-3 px-4">No Tiket</th>
                                <th className="py-3 px-4">Judul Kendala</th>
                                <th className="py-3 px-4">Kategori</th>
                                <th className="py-3 px-4">Prioritas</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Lampiran</th>
                                <th className="py-3 px-4">Petugas IT</th>
                                <th className="py-3 px-4 text-center">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                            {filteredTickets.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                                        {t.ticket_number}
                                    </td>
                                    <td className="py-3.5 px-4 max-w-xs">
                                        <div className="font-bold text-slate-900 dark:text-white truncate">
                                            {t.title}
                                        </div>
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                            {t.description}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                        {t.category_name || '-'}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <PriorityPill priority={t.priority} />
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <StatusPill status={t.status} />
                                    </td>
                                    <td className="py-3.5 px-4">
                                        {t.attachment_url ? (
                                            <a
                                                href={`${API_BASE}${t.attachment_url}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                            >
                                                <Paperclip size={14} /> File
                                            </a>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center">
                                                {t.assignee_name ? t.assignee_name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300">
                                                {t.assignee_name || 'Menunggu IT'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* FOOTER TABEL */}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                        Menampilkan {filteredTickets.length} dari {totalTicket} tiket
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded cursor-pointer">
                            1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL BUAT TIKET */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Buat Tiket Masalah Baru
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Isi formulir di bawah ini agar tim IT Support dapat segera memproses kendala Anda.
                            </p>
                        </div>

                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Judul Masalah
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Contoh: Laptop mati total saat dinyalakan"
                                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kategori
                                    </label>
                                    <select
                                        required
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 transition-colors"
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Prioritas
                                    </label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 transition-colors"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Deskripsi Detail
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Jelaskan kronologi dan dampak masalah..."
                                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 transition-colors resize-none"
                                />
                            </div>

                            {/* UPLOAD FILE LAMPIRAN */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Lampirkan Foto Error / Dokumen (Opsional)
                                </label>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                        <Upload size={14} />
                                        <span>Pilih File</span>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*,.pdf,.doc,.docx,.zip"
                                            className="hidden"
                                        />
                                    </label>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                                        {selectedFile ? selectedFile.name : 'Belum ada file dipilih'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedFile(null);
                                    }}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                    {submitting ? 'Mengirim...' : 'Kirim Tiket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// HELPER COMPONENTS
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

const PriorityPill = ({ priority }) => {
    let style = 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400';
    if (priority === 'High' || priority === 'Critical') {
        style = 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400';
    } else if (priority === 'Medium') {
        style = 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400';
    } else if (priority === 'Low') {
        style = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400';
    }

    return (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${style}`}>
            {priority}
        </span>
    );
};

const StatusPill = ({ status }) => {
    let style = 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400';
    let icon = <Clock size={12} />;

    if (status === 'Waiting') {
        style = 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400';
        icon = <Hourglass size={12} />;
    } else if (status === 'Resolved' || status === 'Closed') {
        style = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400';
        icon = <CheckCircle2 size={12} />;
    }

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${style}`}>
            {icon}
            <span>{status}</span>
        </div>
    );
};

export default EmployeeDashboard;