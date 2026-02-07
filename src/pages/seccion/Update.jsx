import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/seccionService';
import SeccionForm from 'components/Shared/Formularios/seccion/SeccionForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Udpate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    grado_id: '', 
    gradoNombre: '', 
    nombre: '',
    vacantes_maximas: ''
  });
  
  const [isLocked, setIsLocked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await show(id);
        const data = response.data || response; 
        
        setFormData({
          grado_id: data.grado_id,
          gradoNombre: data.grado?.nombre || '', 
          nombre: data.nombre,
          vacantes_maximas: data.vacantes_maximas
        });

        if (data.tiene_historial) {
            setIsLocked(true);
        }

      } catch (err) {
        setAlert(handleApiError(err , 'No se pudo cargar la información.'));
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

    try {
      await update(id, formData);
      setAlert({ type: 'success', message: 'Sección actualizada correctamente.' });
      
      setTimeout(() => navigate('/seccion/listar'), 1500);
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
        title="Editar Sección"
        subtitle={`Modificando: Sección ${formData.nombre}`}
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/seccion/listar"
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 uppercase tracking-tighter">
            ✏️ Editar Datos
          </h2>

          <SeccionForm 
            data={formData} 
            setForm={setFormData}
            isGradeLocked={isLocked} 
          />

          {isLocked && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <LockClosedIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                    <span className="font-bold block mb-1">Cambio de Grado Bloqueado</span>
                    Esta sección ya tiene alumnos matriculados (actuales o históricos). 
                    Por seguridad académica, no se puede mover a otro grado.
                </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/seccion/listar')}
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

export default Udpate;