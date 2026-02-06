import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/periodoService';
import PeriodoForm from 'components/Shared/Formularios/periodo/PeriodoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const EditarPeriodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    nombre: '', 
    fecha_inicio: '', 
    fecha_fin: '', 
    anio_academico_id: '',
    anioNombre: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const loadPeriodo = async () => {
      try {
        const response = await show(id);
        const data = response.data || response;
        
        if (data.tiene_data) setIsLocked(true);
        
        setFormData({
          nombre: data.nombre || '',
          fecha_inicio: data.fecha_inicio || '',
          fecha_fin: data.fecha_fin || '',
          
          anio_academico_id: data.anio_academico_id || '',
          anioNombre: data.anioNombre || ''
        });

      } catch (e) {
        setAlert({ type: 'error', message: 'No se pudo cargar el periodo.' });
      } finally { 
        setLoading(false); 
      }
    };
    loadPeriodo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await update(id, formData);
      setAlert({ type: 'success', message: 'Actualizado correctamente.' });
      setTimeout(() => navigate('/periodo/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar'));
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Editar Periodo" subtitle={`Modificando: ${formData.nombre}`} icon={PencilSquareIcon} buttonText="← Volver" buttonLink="/periodo/listar" />
      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          
          <PeriodoForm 
            data={formData} 
            handleChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
            setFormData={setFormData} 
            isLocked={isLocked}
          />

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={() => navigate('/periodo/listar')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold uppercase text-sm border border-slate-200">Cancelar</button>
            <button type="submit" disabled={saving} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg disabled:opacity-50 text-sm">
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPeriodo;