// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Memuat sesi...</div>;
    }

    // JIKA BELUM LOGIN: Lempar balik ke halaman login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // JIKA ROLE TIDAK SESUAI: Lempar ke halaman 403
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
