import React, { useEffect } from 'react';
import { FaUserLock, FaShieldAlt } from 'react-icons/fa';

const UnauthorizedPage = () => {
  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll('.animate-in');
    elementsToAnimate.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-show');
      }, 150 * index);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 font-sans">
      
      {/* Tarjeta Central */}
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl border-t-4 border-orange-500 relative">
        
        <div className="relative z-10 text-center">
          
          {/* Icono con animación de pulso sutil */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-6">
            <div className="relative inline-block">
                <FaShieldAlt className="text-8xl text-orange-100 absolute top-0 left-0 transform -translate-x-1 -translate-y-1" />
                <FaUserLock className="text-6xl text-orange-500 relative z-10 mt-4" />
            </div>
          </div>
          
          {/* Título */}
          <h1 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-5xl font-bold text-slate-800 mb-2">
            401
          </h1>
          
          <h2 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-xl font-bold text-orange-600 uppercase tracking-wide mb-4">
            Acceso Restringido
          </h2>
          
          {/* Texto explicativo */}
          <p className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-slate-500 mb-8 leading-relaxed">
             Lo sentimos, no tienes los permisos necesarios para acceder a esta sección del sistema escolar. Si crees que es un error, contacta al administrador.
          </p>
          
          {/* Botones de acción */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition-colors shadow-lg"
            >
              Ir al Inicio
            </a>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 0;
          transform: translateY(20px);
        }
        .animate-show {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default UnauthorizedPage;