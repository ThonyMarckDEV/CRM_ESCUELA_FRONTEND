import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/seccionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
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
        
        if (id) {
            loadData();
        }
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

    return {
        formData,
        setFormData,
        isLocked,
        loading,
        saving,
        alert,
        setAlert,
        handleSubmit,
        navigate
    };
};