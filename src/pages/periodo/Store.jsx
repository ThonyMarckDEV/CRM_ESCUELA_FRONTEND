import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/periodoService';
import PeriodoForm from 'components/Shared/Formularios/periodo/PeriodoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const Store = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    nombre: '', 
    fecha_inicio: '', 
    fecha_fin: '',
    anio_academico_id: '' // IMPORTANTE
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      await store(formData);
      setAlert({ type: 'success', message: 'Periodo registrado. Redirigiendo...' });
      setTimeout(() => navigate('/periodo/listar'), 1500);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al crear el periodo'));
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Nuevo Periodo" icon={CalendarDaysIcon} buttonText="Volver" buttonLink="/periodo/listar" />
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <PeriodoForm data={formData} handleChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} setFormData={setFormData} />
        <button type="submit" disabled={loading} className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50">
          {loading ? 'Guardando...' : 'Registrar Periodo'}
        </button>
      </form>
    </div>
  );
};

export default Store;