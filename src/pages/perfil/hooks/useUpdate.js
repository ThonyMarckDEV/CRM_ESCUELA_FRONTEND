import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { index, update } from 'services/perfilService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);
    const [perfil, setPerfil] = useState(null);

    const [formData, setFormData] = useState({
        direccion: '',
        telefono: '',
        telefono_apoderado: '',
        estadoCivil: ''
    });

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const response = await index();
                const data = response.data || response;
                setPerfil(data);
                
                setFormData({
                    direccion: data.datos.direccion || '',
                    telefono: data.tipo === 'empleado' ? (data.datos.telefono || '') : '',
                    telefono_apoderado: data.tipo === 'alumno' ? (data.datos.telefono_apoderado || '') : '',
                    estadoCivil: data.tipo === 'empleado' ? (data.datos.estadoCivil || '') : ''
                });
            } catch (err) {
                setAlert(handleApiError(err, 'Error al cargar datos.'));
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setAlert(null);

        try {
            await update(formData);
            setAlert({ type: 'success', message: 'Perfil actualizado correctamente.' });
            setTimeout(() => navigate('/perfil'), 1500);
        } catch (error) {
            setAlert(handleApiError(error, 'Error al actualizar perfil.'));
            setSaving(false);
        }
    };

    return { formData, perfil, loading, saving, alert, setAlert, handleChange, handleSubmit };
};