import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/matriculaService';
import MatriculaForm from 'components/Shared/Formularios/matricula/MatriculaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { IdentificationIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const AgregarMatricula = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    alumno_id: '', alumnoNombre: '',
    anio_academico_id: '', anioNombre: '',
    grado_id: '', gradoNombre: '',
    seccion_id: '', seccionNombre: '',
    estado: 0 // Por defecto Pendiente
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    // Validaciones manuales rápidas
    if (!formData.alumno_id || !formData.anio_academico_id || !formData.grado_id || !formData.seccion_id) {
        setAlert({ type: 'error', message: 'Todos los campos son obligatorios.' });
        setLoading(false);
        return;
    }

    try {
      await store(formData);
      setAlert({ type: 'success', message: 'Matrícula registrada exitosamente.' });
      setTimeout(() => navigate('/matricula/listar'), 1500);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar matrícula'));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Nueva Matrícula" icon={IdentificationIcon} buttonText="Volver" buttonLink="/matricula/listar" />
      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
      
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <MatriculaForm 
                data={formData} 
                handleChange={handleChange} 
                setForm={setFormData} 
            />
            <button type="submit" disabled={loading} className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg">
                {loading ? 'Guardando...' : 'Registrar Matrícula'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarMatricula;