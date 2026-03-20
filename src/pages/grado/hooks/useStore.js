import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/gradoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        nombre: '', 
        nivel_id: null, 
        nivelNombre: '' 
    });
    
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        if (!formData.nivel_id) {
            setAlert({ type: 'error', message: 'Debes seleccionar un Nivel Educativo.' });
            setLoading(false);
            return;
        }

        try {
            await store(formData);
            
            setAlert({ 
                type: 'success', 
                message: 'Grado registrado exitosamente. Redirigiendo...' 
            });

            setTimeout(() => {
                navigate('/grado/listar');
            }, 1500);

        } catch (error) {
            setAlert(handleApiError(error, 'Error al crear el grado'));
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