import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/nivelService';
import NivelForm from 'components/Shared/Formularios/nivel/NivelForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const AgregarNivel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await store(formData);
      
      setAlert({ 
        type: 'success', 
        message: 'Nivel registrado exitosamente. Redirigiendo...' 
      });

      setTimeout(() => {
        navigate('/nivel/listar');
      }, 1500);

    } catch (error) {
      setAlert(handleApiError(error, 'Error al crear el nivel'));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Nuevo Nivel" icon={BuildingLibraryIcon} buttonText="Volver" buttonLink="/nivel/listar" />
      
      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <NivelForm data={formData} handleChange={handleChange} />
        
        <button 
            type="submit" 
            disabled={loading} 
            className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Registrar Nivel'}
        </button>
      </form>
    </div>
  );
};

export default AgregarNivel;