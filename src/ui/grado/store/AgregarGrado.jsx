import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/gradoService';
import GradoForm from 'components/Shared/Formularios/grado/GradoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const AgregarGrado = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    nombre: '', 
    nivel_id: null, 
    nivelNombre: '' 
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (!formData.nivel_id) {
        setAlert({ type: 'error', message: 'Debes seleccionar un Nivel Educativo.' });
        setLoading(false);
        return;
    }

    try {
      await store(formData);
      
      setAlert({ 
        type: 'success', 
        message: 'Grado registrado exitosamente. Redirigiendo...' 
      });

      setTimeout(() => {
        navigate('/grado/listar');
      }, 1500);

    } catch (error) {
      setAlert(handleApiError(error, 'Error al crear el grado'));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Nuevo Grado" icon={AcademicCapIcon} buttonText="Volver" buttonLink="/grado/listar" />
      
      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        

        <GradoForm 
            data={formData} 
            handleChange={handleChange} 
            setForm={setFormData} 
        />
        
        <button 
            type="submit" 
            disabled={loading} 
            className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Registrar Grado'}
        </button>
      </form>
    </div>
  );
};

export default AgregarGrado;