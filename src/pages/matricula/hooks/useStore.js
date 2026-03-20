import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/matriculaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        alumno_id: '', alumnoNombre: '',
        anio_academico_id: '', anioNombre: '',
        grado_id: '', gradoNombre: '',
        seccion_id: '', seccionNombre: '',
        estado: 0 // Por defecto Pendiente
    });
    
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        if (!formData.alumno_id || !formData.anio_academico_id || !formData.grado_id || !formData.seccion_id) {
            setAlert({ type: 'error', message: 'Todos los campos son obligatorios.' });
            setLoading(false);
            return;
        }

        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Matrícula registrada exitosamente.' });
            setTimeout(() => navigate('/matricula/listar'), 1500);
        } catch (error) {
            setAlert(handleApiError(error, 'Error al registrar matrícula'));
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    return {
        formData,
        setFormData,
        loading,
        alert,
        setAlert,
        handleChange,
        handleSubmit
    };
};