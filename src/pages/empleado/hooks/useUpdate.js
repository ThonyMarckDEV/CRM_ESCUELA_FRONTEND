import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/empleadoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        const loadEmpleado = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                
                setFormData({
                    datos_empleado: {
                        nombre: data.nombre,
                        apellidoPaterno: data.apellidoPaterno,
                        apellidoMaterno: data.apellidoMaterno,
                        dni: data.dni,
                        fechaNacimiento: data.fechaNacimiento,
                        sexo: data.sexo,
                        estadoCivil: data.estadoCivil,
                        direccion: data.direccion,
                        telefono: data.telefono 
                    },
                    usuario: {
                        username: data.usuario?.username || '',
                        password: ''
                    },
                    rol_id: data.usuario?.rol_id || '',
                    rolNombre: data.usuario?.rol?.nombre || ''
                });

            } catch (err) {
                setAlert(handleApiError(err , 'No se pudo cargar la información del empleado.'));
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            loadEmpleado();
        }
    }, [id]);

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
        setSaving(true);
        setAlert(null);

        if (!formData.rol_id) {
            setAlert({ type: 'error', message: 'El empleado debe tener un rol asignado.' });
            setSaving(false);
            return;
        }

        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Empleado actualizado correctamente.' });
            
            setTimeout(() => navigate('/empleado/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar el empleado'));
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
        handleNestedChange,
        handleSubmit,
        navigate
    };
};