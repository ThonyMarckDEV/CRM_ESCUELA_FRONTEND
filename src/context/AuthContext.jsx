import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from 'services/authService'; 
import jwtUtils from 'utilities/Token/jwtUtils'; 
import { logout as logoutAction } from 'js/logout';
import LoadingScreen from 'components/Shared/LoadingScreen';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = jwtUtils.getAccessTokenFromCookie();
        
        if (!token) {
            setUser(null);
            setRole(null);
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        try {
            const userData = await authService.verifySession();

            setUser(userData); 
            
            const userRole = userData.data.rol.nombre;
            
            setRole(userRole);
            setIsAuthenticated(true);

        } catch (error) {
            console.error("Sesión no válida:", error);
            logoutAction(); 
            setUser(null);
            setRole(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async () => {
        setLoading(true);
        await checkAuth();
    };

    const logout = () => {
        logoutAction();
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            role, 
            isAuthenticated, 
            loading, 
            login, 
            logout 
        }}>
            {loading ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);