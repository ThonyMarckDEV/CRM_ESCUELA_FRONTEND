import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/horarioService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        anio_academico_id: '', anioNombre: '',
        docente_id: '', docenteNombre: '',
        seccion_id: '', seccionNombre: '',
        grado_id: '', gradoNombre: '', 
        malla_curricular_id: '', cursoNombre: '',
        dia_semana: '',
        hora_inicio: '',
        hora_fin: '',
        aula_fisica: ''
    });
    
    const [security, setSecurity] = useState({ hasAsistencia: false });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                
                setSecurity({
                    hasAsistencia: data.tiene_asistencias || false 
                });

                setFormData({
                    id: data.id,
                    anio_academico_id: data.anio_academico_id,
                    anioNombre: data.nombre_anio || '',
                    docente_id: data.docente_id,
                    docenteNombre: data.nombre_docente,
                    grado_id: data.grado_id,
                    gradoNombre: data.nombre_grado, 
                    seccion_id: data.seccion_id,
                    seccionNombre: data.nombre_seccion,
                    malla_curricular_id: data.malla_curricular_id,
                    cursoNombre: data.nombre_curso,
                    dia_semana: data.dia_semana,
                    hora_inicio: data.hora_inicio,
                    hora_fin: data.hora_fin,
                    aula_fisica: data.aula_fisica
                });
            } catch (err) {
                setAlert(handleApiError(err , 'No se pudo cargar el horario.'));
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            loadData();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setAlert(null);

        if (formData.hora_inicio >= formData.hora_fin) {
            setAlert({ type: 'error', message: 'La hora de fin debe ser mayor a la hora de inicio.' });
            setSaving(false);
            return;
        }

        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Horario actualizado correctamente.' });
            setTimeout(() => navigate('/horario/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar (posible cruce de horarios)'));
        } finally {
            setSaving(false);
        }
    };

    return {
        formData,
        setFormData,
        security,
        loading,
        saving,
        alert,
        setAlert,
        handleChange,
        handleSubmit,
        navigate
    };
};