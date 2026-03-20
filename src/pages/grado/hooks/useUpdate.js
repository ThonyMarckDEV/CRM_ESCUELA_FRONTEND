import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/gradoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
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
        
        if (id) {
            loadGrado();
        }
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

    return {
        formData,
        setFormData,
        isLocked,
        loading,
        saving,
        alert,
        setAlert,
        handleChange,
        handleSubmit,
        navigate
    };
};