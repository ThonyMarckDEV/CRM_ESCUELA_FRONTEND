import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/empleadoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        datos_empleado: {
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '',
            fechaNacimiento: '', sexo: '', estadoCivil: '', direccion: '', telefono: ''
        },
        usuario: { username: '', password: '' },
        rol_id: '',
        rolNombre: ''
    });

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        if (!formData.rol_id) {
            setAlert({ type: 'error', message: 'Por favor seleccione un Rol para el empleado.' });
            setLoading(false);
            return;
        }

        try {
            await store(formData);
            
            setAlert({ 
                type: 'success', 
                message: 'Empleado registrado exitosamente. Redirigiendo...' 
            });

            setTimeout(() => {
                navigate('/empleado/listar');
            }, 1500);

        } catch (err) {
            setAlert(handleApiError(err, 'Error al registrar empleado'));
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        loading,
        alert,
        setAlert,
        handleNestedChange,
        handleSubmit
    };
};