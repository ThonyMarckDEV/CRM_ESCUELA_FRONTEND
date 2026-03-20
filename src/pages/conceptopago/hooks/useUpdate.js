import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/conceptoPagoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        nombre: '', 
        monto: '', 
        periodo_id: null, 
        periodoNombre: '',
        anio_academico_id: '', 
        anioNombre: '', 
        es_matricula: false, 
        es_pension: false
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
            setLoading(true);
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
        
        if (id) {
            loadData();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

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

    return {
        formData,
        setFormData,
        loading,
        saving,
        alert,
        setAlert,
        isContextClosed,
        hasPayments,
        lockReason,
        handleChange,
        handleSubmit,
        navigate
    };
};