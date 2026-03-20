import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/cursoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nombre: '' });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            await store(formData);
            
            setAlert({ 
                type: 'success', 
                message: 'Curso registrado exitosamente. Redirigiendo...' 
            });

            setTimeout(() => {
                navigate('/curso/listar');
            }, 1500);

        } catch (err) {
            setAlert(handleApiError(err, 'Error al crear el curso'));
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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