import React, { useEffect } from 'react';
import { FaMapMarkedAlt, FaArrowLeft } from 'react-icons/fa';

const NotFoundPage = () => {
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
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
        
        {/* Decoración de fondo (Círculos abstractos) */}
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-60"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-indigo-50 rounded-full blur-2xl opacity-60"></div>

        <div className="relative z-10 text-center">
          
          {/* Icono animado */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full mb-4 animate-float">
              <FaMapMarkedAlt className="text-5xl text-blue-600" />
            </div>
          </div>
          
          {/* Título */}
          <h1 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-7xl font-bold text-blue-900 mb-2">
            404
          </h1>
          
          <h2 className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-2xl font-semibold text-slate-800 mb-4">
            ¿Te has perdido en los pasillos?
          </h2>
          
          {/* Descripción */}
          <p className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out text-slate-500 mb-8 px-4 leading-relaxed">
             La página o recurso escolar que buscas no existe o ha sido movido. Verifica la URL.
          </p>
          
          {/* Botón */}
          <div className="animate-in opacity-0 translate-y-4 transition-all duration-700 ease-out">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg group"
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Regresar
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
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

export default NotFoundPage;