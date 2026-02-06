import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/matriculaService';
import MatriculaForm from 'components/Shared/Formularios/matricula/MatriculaForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const EditarMatricula = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    alumno_id: '', alumnoNombre: '',
    anio_academico_id: '', anioNombre: '',
    grado_id: '', gradoNombre: '',
    seccion_id: '', seccionNombre: '',
    estado: ''
  });
  
  // ESTADOS DE SEGURIDAD
  const [security, setSecurity] = useState({
    isYearClosed: false, // Bloqueo Total
    hasPayments: false,  // Bloqueo Financiero
    hasGrades: false     // Bloqueo Académico
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
        try {
            const response = await show(id);
            const data = response.data || response;
            
            // 1. Configurar Banderas de Seguridad
            setSecurity({
                isYearClosed: data.anio_cerrado,
                hasPayments: data.tiene_pagos,
                hasGrades: data.tiene_notas
            });

            // 2. Cargar Datos
            setFormData({
                alumno_id: data.alumno_id,
                alumnoNombre: data.alumnoNombre,
                
                anio_academico_id: data.anio_academico_id,
                anioNombre: data.anioNombre,
                
                grado_id: data.grado_id,
                gradoNombre: data.gradoNombre,
                
                seccion_id: data.seccion_id,
                seccionNombre: data.seccionNombre,
                
                estado: data.estado
            });
        } catch (e) {
            setAlert({ type: 'error', message: 'No se pudo cargar la matrícula.' });
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (security.isYearClosed) return; // Doble check

    setSaving(true);
    setAlert(null);

    try {
      await update(id, formData);
      setAlert({ type: 'success', message: 'Matrícula actualizada correctamente.' });
      setTimeout(() => navigate('/matricula/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Editar Matrícula" icon={PencilSquareIcon} buttonText="Volver" buttonLink="/matricula/listar" />
      
      {/* AVISO DE AÑO CERRADO (Bloqueo Total) */}
      {security.isYearClosed && (
        <div className="mb-6 bg-gray-100 border-l-4 border-gray-500 p-4 rounded flex items-center gap-3">
            <LockClosedIcon className="w-6 h-6 text-gray-500"/>
            <div>
                <h3 className="font-bold text-gray-700">Año Académico Cerrado</h3>
                <p className="text-sm text-gray-600">Este registro es histórico y no puede ser modificado.</p>
            </div>
        </div>
      )}

      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
      
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 relative">
            
            {/* Si está cerrado el año, ponemos una capa invisible encima o usamos disabled global */}
            <MatriculaForm 
                data={formData} 
                handleChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
                setForm={setFormData}
                isEdit={true}
                
                // Pasamos las reglas de seguridad y el bloqueo total
                disabled={security.isYearClosed} 
                security={security} 
            />

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => navigate('/matricula/listar')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-200 transition-colors">
                    {security.isYearClosed ? 'Volver' : 'Cancelar'}
                </button>
                
                {!security.isYearClosed && (
                    <button type="submit" disabled={saving} className="bg-black text-white px-8 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 transition-colors">
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                )}
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditarMatricula;