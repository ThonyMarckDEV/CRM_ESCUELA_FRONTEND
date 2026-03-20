import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/periodoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        nombre: '', 
        fecha_inicio: '', 
        fecha_fin: '',
        anio_academico_id: '' 
    });
    
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Periodo registrado. Redirigiendo...' });
            setTimeout(() => navigate('/periodo/listar'), 1500);
        } catch (error) {
            setAlert(handleApiError(error, 'Error al crear el periodo'));
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