import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/seccionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        grado_id: '', 
        gradoNombre: '',
        nombre: '',
        vacantes_maximas: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        if (!formData.grado_id) {
            setAlert({type: 'error' , message: 'Debe Seleccionar un Grado.'});
            setLoading(false);
            return;
        }

        try {
            await store(formData);
            
            setAlert({ 
                type: 'success', 
                message: 'Sección registrada exitosamente. Redirigiendo...' 
            });

            setTimeout(() => {
                navigate('/seccion/listar');
            }, 1500);

        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar la sección'));
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