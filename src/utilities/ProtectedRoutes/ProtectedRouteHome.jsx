// src/utilities/ProtectedRoutes/ProtectedRouteHome.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

const ProtectedRouteHome = ({ element }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return element;
};

export default ProtectedRouteHome;