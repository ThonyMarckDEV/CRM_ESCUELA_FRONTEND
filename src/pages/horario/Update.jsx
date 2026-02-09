import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/horarioService';
import HorarioForm from 'components/Shared/Formularios/horario/HorarioForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    anio_academico_id: '', anioNombre: '',
    docente_id: '', docenteNombre: '',
    seccion_id: '', seccionNombre: '',
    grado_id: '', gradoNombre: '', 
    malla_curricular_id: '', cursoNombre: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
    aula_fisica: ''
  });
  
  const [security, setSecurity] = useState({ hasAsistencia: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
        try {
            const response = await show(id);
            const data = response.data || response;
            
            setSecurity({
                hasAsistencia: data.tiene_asistencias || false 
            });

           setFormData({
                id: data.id,
                anio_academico_id: data.anio_academico_id,
                anioNombre: data.nombre_anio || '',
                docente_id: data.docente_id,
                docenteNombre: data.nombre_docente,
                grado_id: data.grado_id,
                gradoNombre: data.nombre_grado, 
                seccion_id: data.seccion_id,
                seccionNombre: data.nombre_seccion,
                malla_curricular_id: data.malla_curricular_id,
                cursoNombre: data.nombre_curso,
                dia_semana: data.dia_semana,
                hora_inicio: data.hora_inicio,
                hora_fin: data.hora_fin,
                aula_fisica: data.aula_fisica
            });
        } catch (err) {
            setAlert(handleApiError(err , 'No se pudo cargar el horario.'));
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    if (formData.hora_inicio >= formData.hora_fin) {
        setAlert({ type: 'error', message: 'La hora de fin debe ser mayor a la hora de inicio.' });
        setSaving(false);
        return;
    }

    try {
      await update(id, formData);
      setAlert({ type: 'success', message: 'Horario actualizado correctamente.' });
      setTimeout(() => navigate('/horario/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar (posible cruce de horarios)'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Editar Horario" icon={PencilSquareIcon} buttonText="Volver" buttonLink="/horario/listar" />
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 relative">
            
            <HorarioForm 
                data={formData} 
                handleChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
                setForm={setFormData}
                isEdit={true}
                security={security} 
            />

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => navigate('/horario/listar')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-200 transition-colors">
                    Cancelar
                </button>
                
                <button type="submit" disabled={saving} className="bg-black text-white px-8 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 transition-colors">
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Update;