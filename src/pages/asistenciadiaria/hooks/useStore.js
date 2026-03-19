import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/asistenciaDiariaService';
import { index as getMatriculas } from 'services/matriculaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Nuevos estados para manejar las matrículas del alumno
    const [matriculasDisponibles, setMatriculasDisponibles] = useState([]);
    const [loadingMatriculas, setLoadingMatriculas] = useState(false);

    // Ampliamos el formData para soportar el componente AlumnoSearchSelect
    const [formData, setFormData] = useState({
        alumno_id: '',
        alumnoNombre: '',
        alumnoDni: '',
        matricula_id: '',
        fecha: new Date().toISOString().split('T')[0], // Hoy por defecto
        hora_ingreso: '',
        estado: '1', // Presente
        observacion: ''
    });

    // Efecto para cargar la matrícula automáticamente cuando se selecciona un alumno
    useEffect(() => {
        const fetchAlumnoMatriculas = async () => {
            if (!formData.alumno_id) {
                setMatriculasDisponibles([]);
                setFormData(prev => ({ ...prev, matricula_id: '' }));
                return;
            }

            setLoadingMatriculas(true);
            try {
                // Buscamos las matrículas activas del alumno usando su DNI en el buscador
                const response = await getMatriculas(1, { search: formData.alumnoDni, estado: 1 });
                const foundMatriculas = response.data || [];

                setMatriculasDisponibles(foundMatriculas);

                // Si el alumno tiene solo 1 matrícula activa, la autoseleccionamos para ahorrar tiempo
                if (foundMatriculas.length === 1) {
                    setFormData(prev => ({ ...prev, matricula_id: foundMatriculas[0].id }));
                } else {
                    setFormData(prev => ({ ...prev, matricula_id: '' }));
                }
            } catch (error) {
                setAlert(handleApiError(error, 'Error al buscar la matrícula del alumno.'));
            } finally {
                setLoadingMatriculas(false);
            }
        };

        fetchAlumnoMatriculas();
    }, [formData.alumno_id, formData.alumnoDni]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación extra por si acaso
        if (!formData.matricula_id) {
            setAlert({ type: 'error', message: 'Debes seleccionar una matrícula válida para el alumno.' });
            return;
        }

        setLoading(true);
        setAlert(null);

        // Formatear la hora si se ingresó
        const payload = {
            matricula_id: formData.matricula_id,
            fecha: formData.fecha,
            hora_ingreso: formData.hora_ingreso ? (formData.hora_ingreso.length === 5 ? `${formData.hora_ingreso}:00` : formData.hora_ingreso) : null,
            estado: formData.estado,
            observacion: formData.observacion
        };

        try {
            await store(payload);
            setAlert({ type: 'success', message: 'Asistencia registrada manualmente con éxito.' });
            setTimeout(() => navigate('/asistencia/diaria/listar'), 1500);
        } catch (error) {
            setAlert(handleApiError(error, 'Error al registrar la asistencia.'));
            setLoading(false);
        }
    };

    return { 
        formData, 
        setFormData, 
        loading, 
        loadingMatriculas, 
        matriculasDisponibles, 
        alert, 
        setAlert, 
        handleChange, 
        handleSubmit 
    };
};