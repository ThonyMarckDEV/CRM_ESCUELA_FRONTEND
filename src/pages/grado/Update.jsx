import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/gradoService';
import GradoForm from 'components/Shared/Formularios/grado/GradoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    nombre: '', 
    nivel_id: null, 
    nivelNombre: '' 
  });
  
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  
  useEffect(() => {
    const loadGrado = async () => {
      try {
        const response = await show(id);
        const data = response.data || response;
        
        setFormData({
          nombre: data.nombre || '',
          nivel_id: data.nivel_id || null,
          nivelNombre: data.nivel ? data.nivel.nombre : '', 
        });

        if (data.tiene_dependencias) {
            setIsLocked(true);
        }

      } catch (e) {
        setAlert({ type: 'error', message: 'No se pudo cargar la información del grado.' });
      } finally {
        setLoading(false);
      }
    };
    loadGrado();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    if (!formData.nivel_id) {
        setAlert({ type: 'error', message: 'Debes seleccionar un Nivel Educativo.' });
        setSaving(false);
        return;
    }

    try {
      await update(id, formData);
      setAlert({ type: 'success', message: 'Grado actualizado correctamente.' });
      setTimeout(() => navigate('/grado/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar el grado'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Editar Grado"
        subtitle={`Modificando: ${formData.nombre}`}
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/grado/listar"
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 uppercase tracking-tighter">
            🎓 Datos del Grado
          </h2>

          <GradoForm 
            data={formData} 
            handleChange={handleChange} 
            setForm={setFormData}
            isLevelLocked={isLocked}
          />

          {isLocked && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <LockClosedIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                    <span className="font-bold block mb-1">Cambio de Nivel Bloqueado</span>
                    Este grado ya tiene <strong>Secciones</strong> creadas. 
                    No se puede mover de Nivel (ej: Primaria a Secundaria) para mantener la integridad académica.
                </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/grado/listar')}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors uppercase text-sm border border-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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