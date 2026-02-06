// src/utilities/ProtectedRoutes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { isAuthenticated, role, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; 

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/401" replace />;
    }

    return element ? element : <Outlet />;
};

export default ProtectedRoute;