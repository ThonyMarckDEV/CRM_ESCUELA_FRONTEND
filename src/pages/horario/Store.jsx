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
    anio_academico_id: '', 
    docente_id: '', 
    seccion_id: '', seccionNombre: '',
    grado_id: '', gradoNombre: '',
    malla_curricular_id: '', 
    horariosMatrix: {},
    aula_fisica: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (!formData.docente_id || !formData.malla_curricular_id || !formData.seccion_id) {
        setAlert({ type: 'error', message: 'Complete los campos generales.' });
        setLoading(false);
        return;
    }

    const horariosArray = Object.entries(formData.horariosMatrix).map(([diaId, horas]) => ({
        dia_semana: parseInt(diaId),
        hora_inicio: horas.hora_inicio,
        hora_fin: horas.hora_fin
    }));

    if (horariosArray.length === 0) {
        setAlert({ type: 'error', message: 'Seleccione al menos un día.' });
        setLoading(false);
        return;
    }

    const horarioIncompleto = horariosArray.find(h => !h.hora_inicio || !h.hora_fin);
    if (horarioIncompleto) {
        setAlert({ type: 'error', message: 'Complete las horas de inicio y fin para todos los días seleccionados.' });
        setLoading(false);
        return;
    }

    const payload = {
        ...formData,
        horarios: horariosArray
    };

    try {
      await store(payload);
      setAlert({ type: 'success', message: 'Horarios asignados exitosamente.' });
      setTimeout(() => navigate('/horario/listar'), 1500);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar'));
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
                {loading ? 'Validando y Guardando...' : 'Asignar Horarios'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default Store;