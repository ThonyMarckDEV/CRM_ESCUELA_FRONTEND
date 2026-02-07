import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/conceptoPagoService';
import ConceptoPagoForm from 'components/Shared/Formularios/conceptopago/ConceptoPagoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    nombre: '', monto: '', periodo_id: null, periodoNombre: '',
    anio_academico_id: '', anioNombre: '', es_matricula: false, es_pension: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // ESTADOS DE SEGURIDAD
  const [isContextClosed, setIsContextClosed] = useState(false);
  const [hasPayments, setHasPayments] = useState(false);
  const [lockReason, setLockReason] = useState('');

  useEffect(() => {
    const loadData = async () => {
        try {
            const response = await show(id);
            const data = response.data || response;
            
            const isMatricula = data.tipo === 1;
            const isPension = data.tipo === 2;

            // DETECTAR SI TIENE PAGOS
            const pagosExistentes = data.pagos_count > 0;
            setHasPayments(pagosExistentes);

            // DETECTAR SI EL CONTEXTO ESTÁ CERRADO
            let contextClosed = false;
            let reason = '';

            // Verificar Año Académico (Padre Supremo)
            const anioCerrado = data.anio_academico && !data.anio_academico.estado;
            
            if (anioCerrado) {
                contextClosed = true;
                reason = `El Año Académico ${data.anio_academico.nombre} está CERRADO.`;
            } else if (isPension && data.periodo && !data.periodo.estado) {
                // Si es pensión y el año está abierto, verificar periodo
                contextClosed = true;
                reason = `El Periodo ${data.periodo.nombre} está CERRADO.`;
            }

            setIsContextClosed(contextClosed);
            setLockReason(reason);

            // Carga de datos
            setFormData({
                nombre: data.nombre,
                monto: data.monto,
                periodo_id: data.periodo_id || null,
                periodoNombre: data.periodo ? data.periodo.nombre : '',
                anio_academico_id: data.anio_academico_id || '',
                anioNombre: data.anio_academico ? data.anio_academico.nombre : '', 
                es_matricula: isMatricula,
                es_pension: isPension
            });

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
    if (isContextClosed) return; // Seguridad extra

    setSaving(true);
    setAlert(null);

    try {
      await update(id, formData);
      setAlert({ type: 'success', message: 'Actualizado correctamente.' });
      setTimeout(() => navigate('/concepto-pago/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Editar Concepto" icon={PencilSquareIcon} buttonText="Volver" buttonLink="/concepto-pago/listar" />
      
      {/* ALERTA DE BLOQUEO TOTAL (HISTÓRICO) */}
      {isContextClosed && (
        <div className="mb-6 bg-gray-100 border-l-4 border-gray-500 p-4 rounded shadow-sm flex items-start gap-3">
            <LockClosedIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-gray-800">Archivo Histórico</h3>
                <p className="text-sm text-gray-600">{lockReason} No se permiten modificaciones.</p>
            </div>
        </div>
      )}

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 relative">
          
          <ConceptoPagoForm 
            data={formData} 
            handleChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
            setForm={setFormData} 
            disabled={isContextClosed}       // Bloqueo total (gris)
            bloqueoFinanciero={hasPayments}  // Bloqueo parcial (solo monto/fechas)
          />
          
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
            <button 
                type="button" 
                onClick={() => navigate('/concepto-pago/listar')} 
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-200 transition-colors"
            >
                {isContextClosed ? 'Volver' : 'Cancelar'}
            </button>
            
            {/* El botón Guardar solo se oculta si el contexto está cerrado. 
                Si solo hay bloqueo financiero, se muestra para poder editar el nombre */}
            {!isContextClosed && (
                <button 
                    type="submit" 
                    disabled={saving} 
                    className="bg-black text-white px-8 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50"
                >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;