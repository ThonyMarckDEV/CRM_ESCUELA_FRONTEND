import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/anioAcademicoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        nombre: '', 
        fecha_inicio: '', 
        fecha_fin: '',
        estado: true 
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Año académico creado con éxito. Redirigiendo...' });
            setTimeout(() => navigate('/anio-academico/listar'), 1500);
        } catch (error) {
            setAlert(handleApiError(error, 'Error al crear el año'));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({ 
            ...prevData, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    return {
        formData,
        loading,
        alert,
        setAlert,
        handleChange,
        handleSubmit
    };
};