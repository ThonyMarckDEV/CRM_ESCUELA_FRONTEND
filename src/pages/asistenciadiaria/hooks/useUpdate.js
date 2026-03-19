import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/asistenciaDiariaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);
    const [alert, setAlert]       = useState(null);
    const [alumnoNombre, setAlumnoNombre] = useState('');

    // ✅ FIX 1: formData con estado inicial (faltaba useState)
    const [formData, setFormData] = useState({
        matricula_id: '',
        fecha: '',
        hora_ingreso: '',
        estado: '1',
        observacion: ''
    });

    const loadAsistencia = useCallback(async () => {
        try {
            const response = await show(id);
            const data = response.data || response;

            const nombreCompleto = data.matricula?.alumno
                ? `${data.matricula.alumno.nombre} ${data.matricula.alumno.apellidoPaterno}`
                : `Matrícula #${data.matricula_id}`;

            setAlumnoNombre(nombreCompleto);

            // ✅ FIX 2: fechaLimpia DENTRO de loadAsistencia, donde data ya existe
            const fechaLimpia = data.fecha ? data.fecha.split('T')[0] : '';

            setFormData({
                matricula_id: data.matricula_id,
                fecha:        fechaLimpia,
                hora_ingreso: data.hora_ingreso ? data.hora_ingreso.substring(0, 5) : '',
                estado:       data.estado ? data.estado.toString() : '1',
                observacion:  data.observacion || ''
            });

        } catch (err) {
            setAlert(handleApiError(err, 'No se pudo cargar la asistencia.'));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadAsistencia(); }, [loadAsistencia]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setAlert(null);

        const payload = { ...formData };
        if (payload.hora_ingreso && payload.hora_ingreso.length === 5) {
            payload.hora_ingreso = `${payload.hora_ingreso}:00`;
        }

        try {
            await update(id, payload);
            setAlert({ type: 'success', message: 'Registro actualizado correctamente.' });
            setTimeout(() => navigate('/asistencia/diaria/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar'));
            setSaving(false);
        }
    };

    return { formData, loading, saving, alert, alumnoNombre, setAlert, handleChange, handleSubmit };
};