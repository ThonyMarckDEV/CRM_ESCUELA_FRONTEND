import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingScreen from 'components/Shared/LoadingScreen';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import authService from 'services/authService';
import { useAuth } from 'context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

 const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await authService.login(username, password, rememberMe);
      const { access_token } = result;
      
      document.cookie = `access_token=${access_token}; path=/; Secure; SameSite=Strict`;

      login(); 

      navigate('/home'); 

      toast.success(`Bienvenido al sistema`);
      
    } catch (error) {
      const msg = error.response?.data?.message || 'Credenciales inválidas';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => { /* lógica genérica */ };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      
      {/* Contenedor Principal */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100">
        
        {/* Header Genérico */}
        <div className="flex flex-col items-center mb-6">
          {/* Logo Placeholder: Cuadrado negro simple */}
          <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-4 shadow-lg">
             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
             </svg>
          </div>
          <h1 className="text-sm font-bold text-gray-400 tracking-widest uppercase">
            Sistema de Gestión Integral
          </h1>
        </div>

        <div>
          {loading ? (
             <div className="flex justify-center items-center h-64">
              <LoadingScreen />
            </div>
          ) : showForgotPassword ? (
            <ForgotPasswordForm
              dni={dni}
              setDni={setDni}
              handleForgotPassword={handleForgotPassword}
              setShowForgotPassword={setShowForgotPassword}
            />
          ) : (
            <LoginForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              setShowForgotPassword={setShowForgotPassword}
            />
          )}
        </div>
        
        {/* Footer simple */}
        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Empresa S.A.C. Todos los derechos reservados.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;