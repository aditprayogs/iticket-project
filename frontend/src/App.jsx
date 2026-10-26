// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import AppLayout from './layouts/AppLayout';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

// Import Halaman Utama
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import TicketQueue from './pages/support/TicketQueue';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UsersPage from './pages/admin/UsersPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import AssetsPage from './pages/admin/AssetsPage';


const UnauthorizedPage = () => (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-8">
        <h1 className="text-4xl font-extrabold text-red-500 mb-2">403</h1>
        <h2 className="text-xl font-bold mb-4">Akses Ditolak</h2>
    </div>
);

function App() {
    return (
        <AuthProvider>
            {/* Tambahkan basename="/iticket" di sini */}
            <Router basename="/iticket">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Protected Routes dengan Master Layout */}
                    <Route element={<AppLayout />}>
                        {/* Employee */}
                        <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
                            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                        </Route>

                        {/* IT Support */}
                        <Route element={<ProtectedRoute allowedRoles={['IT Support']} />}>
                            <Route path="/support/queue" element={<TicketQueue />} />
                        </Route>

                        {/* Admin */}
                        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<UsersPage />} />
                            <Route path="/admin/categories" element={<CategoriesPage />} />
                            <Route path="/admin/assets" element={<AssetsPage />} />
                        </Route>
                        <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
                        <Route path="/support/analytics" element={<AnalyticsDashboard />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;