import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/mallaCurricularService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        grado_id: '', 
        gradoNombre: '', 
        curso_id: '',
        cursoNombre: '',
        horas_semanales: ''
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const loadMalla = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                
                setFormData({
                    grado_id: data.grado_id,
                    gradoNombre: data.grado?.nombre || '',
                    curso_id: data.curso_id,
                    cursoNombre: data.curso?.nombre || '',
                    horas_semanales: data.horas_semanales
                });

                if (data.tiene_data) setIsLocked(true);

            } catch (err) {
                setAlert(handleApiError(err , 'No se pudo cargar la información.'));
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            loadMalla();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setAlert(null);

        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Registro actualizado correctamente.' });
            
            setTimeout(() => navigate('/malla-curricular/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar el registro'));
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
        handleSubmit,
        navigate
    };
};