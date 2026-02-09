import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/mallaCurricularService';
import MallaForm from 'components/Shared/Formularios/mallacurricular/MallaForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@heroicons/react/24/outline';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    grado_id: '', 
    gradoNombre: '', 
    curso_id: '',
    cursoNombre: '',
    horas_semanales: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const [isLocked, setIsLocked] = useState(false); // Estado bloqueo

  useEffect(() => {
    const loadMalla = async () => {
      try {
        const response = await show(id);
        const data = response.data || response;
        
        setFormData({
          grado_id: data.grado_id,
          gradoNombre: data.grado?.nombre || '',
          curso_id: data.curso_id,
          cursoNombre: data.curso?.nombre || '',
          horas_semanales: data.horas_semanales
        });

        if (data.tiene_data) setIsLocked(true);

      } catch (err) {
        setAlert(handleApiError(err , 'No se pudo cargar la información.'));
      } finally {
        setLoading(false);
      }
    };
    loadMalla();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      await update(id, formData);
      setAlert({ type: 'success', message: 'Registro actualizado correctamente.' });
      
      setTimeout(() => navigate('/malla-curricular/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar el registro'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Editar Asignación"
        subtitle="Modificar horas o curso del grado"
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/malla-curricular/listar"
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 uppercase tracking-tighter">
            ✏️ Editar Malla
          </h2>

          <MallaForm 
            data={formData} 
            setForm={setFormData}
            isLocked={isLocked}
          />

          {isLocked && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <LockClosedIcon className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                <div className="text-xs text-yellow-800">
                    <span className="font-bold block mb-1">Curso Bloqueado</span>
                    Este curso ya tiene notas o docentes asignados. 
                    <u>No puedes cambiar el Grado ni la Asignatura</u>, solo ajustar las Horas Semanales.
                </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/malla-curricular/listar')}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors uppercase text-sm border border-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;