import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/horarioService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        anio_academico_id: '', 
        docente_id: '', 
        seccion_id: '', seccionNombre: '',
        grado_id: '', gradoNombre: '',
        malla_curricular_id: '', 
        horariosMatrix: {},
        aula_fisica: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        if (!formData.docente_id || !formData.malla_curricular_id || !formData.seccion_id) {
            setAlert({ type: 'error', message: 'Complete los campos generales.' });
            setLoading(false);
            return;
        }

        const horariosArray = Object.entries(formData.horariosMatrix).map(([diaId, horas]) => ({
            dia_semana: parseInt(diaId),
            hora_inicio: horas.hora_inicio,
            hora_fin: horas.hora_fin
        }));

        if (horariosArray.length === 0) {
            setAlert({ type: 'error', message: 'Seleccione al menos un día.' });
            setLoading(false);
            return;
        }

        const horarioIncompleto = horariosArray.find(h => !h.hora_inicio || !h.hora_fin);
        if (horarioIncompleto) {
            setAlert({ type: 'error', message: 'Complete las horas de inicio y fin para todos los días seleccionados.' });
            setLoading(false);
            return;
        }

        const payload = {
            ...formData,
            horarios: horariosArray
        };

        try {
            await store(payload);
            setAlert({ type: 'success', message: 'Horarios asignados exitosamente.' });
            setTimeout(() => navigate('/horario/listar'), 1500);
        } catch (error) {
            setAlert(handleApiError(error, 'Error al registrar'));
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