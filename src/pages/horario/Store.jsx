import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/horarioService';
import HorarioForm from 'components/Shared/Formularios/horario/HorarioForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const Store = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    anio_academico_id: '', anioNombre: '',
    docente_id: '', docenteNombre: '',
    seccion_id: '', seccionNombre: '',
    grado_id: '',
    malla_curricular_id: '', cursoNombre: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
    aula_fisica: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    // Validaciones manuales básicas antes de enviar
    if (!formData.docente_id || !formData.malla_curricular_id || !formData.seccion_id || !formData.dia_semana || !formData.hora_inicio || !formData.hora_fin) {
        setAlert({ type: 'error', message: 'Complete los campos obligatorios (*).' });
        setLoading(false);
        return;
    }

    // Validación de horas lógica
    if (formData.hora_inicio >= formData.hora_fin) {
        setAlert({ type: 'error', message: 'La hora de fin debe ser mayor a la hora de inicio.' });
        setLoading(false);
        return;
    }

    try {
      await store(formData);
      setAlert({ type: 'success', message: 'Horario asignado exitosamente.' });
      setTimeout(() => navigate('/horario/listar'), 1500);
    } catch (error) {
      // Aquí el backend devuelve 409 si hay cruce, handleApiError lo maneja
      setAlert(handleApiError(error, 'Error al registrar horario'));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Nuevo Horario" icon={CalendarDaysIcon} buttonText="Volver" buttonLink="/horario/listar" />
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <HorarioForm 
                data={formData} 
                handleChange={handleChange} 
                setForm={setFormData} 
            />
            <button type="submit" disabled={loading} className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg">
                {loading ? 'Validando y Guardando...' : 'Asignar Horario'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default Store;