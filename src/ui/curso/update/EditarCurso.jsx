import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/cursoService';
import CursoForm from 'components/Shared/Formularios/curso/CursoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const EditarCurso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ nombre: '' });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  
  useEffect(() => {
    const loadCurso = async () => {
      try {
        const response = await show(id);
        const data = response.data || response;
        
        setFormData({
          nombre: data.nombre || ''
        });
      } catch (e) {
        setAlert({ type: 'error', message: 'No se pudo cargar la información del curso.' });
      } finally {
        setLoading(false);
      }
    };
    loadCurso();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      await update(id, formData);
      setAlert({ type: 'success', message: 'Curso actualizado correctamente.' });
      
      setTimeout(() => navigate('/curso/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar el curso'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Editar Curso"
        subtitle={`Modificando: ${formData.nombre}`}
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/curso/listar"
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 uppercase tracking-tighter">
            📚 Datos del Curso
          </h2>

          <CursoForm data={formData} handleChange={handleChange} />

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/curso/listar')}
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

export default EditarCurso;