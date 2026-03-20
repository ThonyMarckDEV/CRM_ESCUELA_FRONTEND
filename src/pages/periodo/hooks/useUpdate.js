import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/periodoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
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

            } catch (err) {
                setAlert(handleApiError(err , 'No se pudo cargar el periodo.'));
            } finally { 
                setLoading(false); 
            }
        };
        
        if (id) {
            loadPeriodo();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Actualizado correctamente.' });
            setTimeout(() => navigate('/periodo/listar'), 1500);
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
        isLocked,
        handleChange,
        handleSubmit,
        navigate
    };
};