import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/cursoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ nombre: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);
    
    useEffect(() => {
        const loadCurso = async () => {
            setLoading(true);
            try {
                const response = await show(id);
                const data = response.data || response;
                
                setFormData({
                    nombre: data.nombre || ''
                });
            } catch (err) {
                setAlert(handleApiError(err , 'No se pudo cargar la información del curso.'));
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            loadCurso();
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

    return {
        formData,
        loading,
        saving,
        alert,
        setAlert,
        handleChange,
        handleSubmit,
        navigate
    };
};