// src/pages/support/TicketQueue.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {
    ClipboardList,
    Clock,
    CheckCircle2,
    Hourglass,
    Search,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    FileText,
    Download,
    Paperclip
} from 'lucide-react';

const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://aditprayogs.tech/iticket-api' : 'http://localhost:5000/api')
).replace(/\/api$/, '');

const TicketQueue = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');

    // State Modal Update Status
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [updating, setUpdating] = useState(false);

    // State Modal Export PDF Laporan (Khusus IT Support)
    const [showExportModal, setShowExportModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [downloading, setDownloading] = useState(false);

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
        document.title = 'Antrean Tiket IT | ITicket';
    }, []);

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!selectedTicket) return;

        setUpdating(true);
        try {
            await axiosInstance.patch(`/tickets/${selectedTicket.id}/status`, {
                status: newStatus,
                resolution_notes: notes
            });
            setSelectedTicket(null);
            setNotes('');
            fetchTickets();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal memperbarui status tiket');
        } finally {
            setUpdating(false);
        }
    };

    // Fungsi Shortcut Tanggal Laporan (Hari Ini, 7 Hari, 30 Hari)
    const setQuickRange = (type) => {
        const today = new Date();
        const endStr = today.toISOString().split('T')[0];
        let start = new Date();

        if (type === 'today') {
            start = today;
        } else if (type === 'week') {
            start.setDate(today.getDate() - 7);
        } else if (type === 'month') {
            start.setMonth(today.getMonth() - 1);
        }

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(endStr);
    };

    // FUNGSI UNDUH LAPORAN PDF
    const handleDownloadPDF = async (e) => {
        e.preventDefault();
        setDownloading(true);

        try {
            const response = await axiosInstance.get('/reports/export-pdf', {
                params: { startDate, endDate },
                responseType: 'blob' // Unduh file binary PDF
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan_Tiket_IT_${startDate || 'Semua'}_s.d_${endDate || 'Semua'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setShowExportModal(false);
        } catch (err) {
            alert('Gagal mengunduh laporan PDF.');
        } finally {
            setDownloading(false);
        }
    };

    // Kalkulasi Statistik
    const totalTugas = tickets.length;
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
            (t.reporter_name && t.reporter_name.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchTab && matchSearch;
    });

    return (
        <div className="space-y-6">
            {/* HEADER PAGE DENGAN TOMBOL EXPORT LAPORAN */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Dashboard IT Support
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Daftar tiket dan laporan kendala perangkat yang sedang ditangani.
                    </p>
                </div>

                {/* TOMBOL EXPORT KHUSUS IT SUPPORT */}
                <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                    <FileText size={18} />
                    <span>Export Laporan PDF</span>
                </button>
            </div>

            {/* KARTU STATISTIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<ClipboardList size={22} className="text-blue-600 dark:text-blue-400" />}
                    iconBg="bg-blue-50 dark:bg-blue-950/50"
                    count={totalTugas}
                    label="Total Tugas"
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
                    label="Resolved"
                />
                <StatCard
                    icon={<Hourglass size={22} className="text-purple-600 dark:text-purple-400" />}
                    iconBg="bg-purple-50 dark:bg-purple-950/50"
                    count={waitingCount}
                    label="Waiting"
                />
            </div>

            {/* TABEL ANTREAN TIKET */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors">
                {/* FILTER TAB & SEARCH */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex gap-2 border-b-2 border-transparent">
                        {['Semua', 'In Progress', 'Waiting', 'Resolved'].map((tab) => {
                            const count =
                                tab === 'Semua'
                                    ? totalTugas
                                    : tab === 'In Progress'
                                        ? inProgressCount
                                        : tab === 'Waiting'
                                            ? waitingCount
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
                                placeholder="Cari nomor, judul, atau pelapor..."
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
                        Memuat antrean tiket...
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Tidak ada tiket yang sesuai kriteria.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <th className="py-3 px-4">No Tiket</th>
                                <th className="py-3 px-4">Judul / Masalah</th>
                                <th className="py-3 px-4">Pelapor</th>
                                <th className="py-3 px-4">Priority</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Lampiran</th>
                                <th className="py-3 px-4">Assigned</th>
                                <th className="py-3 px-4 text-center">Action</th>
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
                                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                                        {t.reporter_name}
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
                                                {t.assignee_name || 'Unassigned'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <button
                                            onClick={() => {
                                                setSelectedTicket(t);
                                                setNewStatus(t.status);
                                                setNotes(t.resolution_notes || '');
                                            }}
                                            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 cursor-pointer"
                                        >
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
                        Menampilkan {filteredTickets.length} dari {totalTugas} tiket
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

            {/* MODAL UPDATE STATUS TIKET */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Proses Tiket #{selectedTicket.ticket_number}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {selectedTicket.title}
                            </p>
                        </div>

                        <form onSubmit={handleUpdateStatus} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Ubah Status Tiket
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 transition-colors"
                                >
                                    <option value="Waiting">Waiting</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Catatan Perbaikan {newStatus === 'Resolved' && <span className="text-red-500">* (Wajib)</span>}
                                </label>
                                <textarea
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Isi catatan tindakan yang telah dilakukan..."
                                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 transition-colors resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTicket(null)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                    {updating ? 'Memproses...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL EXPORT PDF LAPORAN (UNTUK IT SUPPORT) */}
            {showExportModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center shrink-0">
                                <FileText size={22} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Export Laporan PDF</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Pilih rentang waktu laporan kinerja IT Support.</p>
                            </div>
                        </div>

                        {/* Filter Cepat (Harian / Mingguan / Bulanan) */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Pilihan Cepat Periode:</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setQuickRange('today')}
                                    className="px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    Hari Ini
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setQuickRange('week')}
                                    className="px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    7 Hari Lalu
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setQuickRange('month')}
                                    className="px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    30 Hari Lalu
                                </button>
                            </div>
                        </div>

                        {/* Form Input Tanggal */}
                        <form onSubmit={handleDownloadPDF} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Dari Tanggal</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-red-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sampai Tanggal</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:border-red-600"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowExportModal(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={downloading}
                                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                                >
                                    <Download size={14} />
                                    <span>{downloading ? 'Mengunduh...' : 'Unduh File PDF'}</span>
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

export default TicketQueue;