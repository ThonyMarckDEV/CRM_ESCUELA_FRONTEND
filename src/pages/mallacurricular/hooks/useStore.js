import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/mallaCurricularService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        grado_id: '', 
        gradoNombre: '',
        curso_id: '',
        cursoNombre: '',
        horas_semanales: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        if (!formData.grado_id || !formData.curso_id) {
            setAlert({ type: 'error', message: 'Debe seleccionar Grado y Curso.' });
            setLoading(false);
            return;
        }

        try {
            await store(formData);
            
            setAlert({ 
                type: 'success', 
                message: 'Curso asignado al grado exitosamente. Redirigiendo...' 
            });

            setTimeout(() => {
                navigate('/malla-curricular/listar');
            }, 1500);

        } catch (error) {
            setAlert(handleApiError(error, 'Error al registrar en la malla'));
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        loading,
        alert,
        setAlert,
        handleSubmit
    };
};