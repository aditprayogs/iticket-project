import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Ganti: import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { ShieldCheck, Search, RefreshCw, Clock, User, HardDrive } from 'lucide-react';

const AuditLogPage = () => {

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const fetchAuditLogs = async () => {
    setLoading(true);
    setError('');
    try {
      // Gunakan axiosInstance tanpa perlu manual set Header token
      const response = await axiosInstance.get('/admin/audit-logs');
      setLogs(response.data);
      setFilteredLogs(response.data);
    } catch (err) {
      console.error('Gagal mengambil data Audit Log:', err);
      setError('Gagal memuat log aktivitas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Filter pencarian berdasarkan Aksi, Deskripsi, Username, atau IP Address
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = logs.filter(
      (log) =>
        log.action.toLowerCase().includes(term) ||
        log.description.toLowerCase().includes(term) ||
        (log.username && log.username.toLowerCase().includes(term)) ||
        (log.ip_address && log.ip_address.includes(term))
    );
    setFilteredLogs(result);
  }, [searchTerm, logs]);

  // Badge Warna Berdasarkan Jenis Aksi (Action Type)
  const getActionBadge = (action) => {
    if (action.startsWith('AUTH_')) {
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
    } else if (action.startsWith('CREATE_') || action.startsWith('ADMIN_CREATE_')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
    } else if (action.startsWith('UPDATE_') || action.startsWith('ASSIGN_')) {
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300';
    } else if (action.startsWith('DELETE_')) {
      return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            Audit Trail & Activity Logs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pencatatan jejak audit aktivitas pengguna dan perubahan data sistem secara real-time.
          </p>
        </div>

        <button
          onClick={fetchAuditLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Log
        </button>
      </div>

      {/* Bar Pencarian */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan aksi, deskripsi, username, atau IP address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      {/* Pesan Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tabel Data Audit Logs */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="p-4">Waktu</th>
                <th className="p-4">Pengguna</th>
                <th className="p-4">Kategori Aksi</th>
                <th className="p-4">Deskripsi Aktivitas</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Memuat data audit log...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Tidak ada aktivitas yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {new Date(log.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {log.full_name ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-500" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {log.full_name}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              @{log.username} ({log.role})
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Sistem / Guest</span>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="p-4 text-gray-700 dark:text-gray-300">
                      {log.description}
                    </td>

                    <td className="p-4 whitespace-nowrap text-gray-500 dark:text-gray-400 font-mono text-xs">
                      <div className="flex items-center gap-1">
                        <HardDrive className="w-3.5 h-3.5 text-gray-400" />
                        {log.ip_address || '127.0.0.1'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;