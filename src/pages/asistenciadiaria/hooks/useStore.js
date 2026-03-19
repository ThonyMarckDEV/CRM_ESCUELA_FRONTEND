import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/asistenciaDiariaService';
import { index as getMatriculas } from 'services/matriculaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // --- ESTADO DE PESTAÑAS ---
    const [activeTab, setActiveTab] = useState('qr'); 

    // --- ESTADO DE ERRORES DE CÁMARA ---
    const [cameraError, setCameraError] = useState(null);

    // --- LÓGICA DEL ESCÁNER QR ---
    const [qrConfig, setQrConfig] = useState({
        estado: '1', 
        observacion: ''
    });

    const handleQrConfigChange = (e) => {
        const { name, value } = e.target;
        setQrConfig(prev => ({ ...prev, [name]: value }));
    };

    // Función para manejar errores de la cámara
    const handleQrError = (error) => {
        console.error("Error de cámara:", error);
        if (error?.name === 'NotFoundError' || error?.message?.includes('device not found')) {
            setCameraError('No se encontró ninguna cámara conectada al dispositivo.');
        } else if (error?.name === 'NotAllowedError' || error?.message?.includes('Permission denied')) {
            setCameraError('Permiso denegado. Activa el acceso a la cámara en tu navegador.');
        } else {
            setCameraError('Ocurrió un error al intentar iniciar la cámara.');
        }
    };

    const handleQrScan = async (detectedText) => {
        if (!detectedText || loading) return;

        setLoading(true);
        setAlert(null);

        const now = new Date();
        const payload = {
            matricula_id: detectedText.trim(), 
            fecha: now.toISOString().split('T')[0],
            hora_ingreso: now.toTimeString().split(' ')[0], 
            estado: parseInt(qrConfig.estado),
            observacion: qrConfig.observacion || null
        };

        try {
            await store(payload);
            setAlert({ 
                type: 'success', 
                message: `✅ Asistencia registrada (Matrícula #${payload.matricula_id}) a las ${payload.hora_ingreso.substring(0,5)}` 
            });
            setQrConfig(prev => ({ ...prev, observacion: '' }));
        } catch (error) {
            setAlert(handleApiError(error, 'Error al registrar asistencia por QR.'));
        } finally {
            setLoading(false);
        }
    };


    // --- LÓGICA DEL REGISTRO MANUAL ---
    const [matriculasDisponibles, setMatriculasDisponibles] = useState([]);
    const [loadingMatriculas, setLoadingMatriculas] = useState(false);

    const [formData, setFormData] = useState({
        alumno_id: '', alumnoNombre: '', alumnoDni: '', matricula_id: '',
        fecha: new Date().toISOString().split('T')[0], 
        hora_ingreso: '', estado: '1', observacion: ''
    });

    useEffect(() => {
        const fetchAlumnoMatriculas = async () => {
            if (!formData.alumno_id) {
                setMatriculasDisponibles([]);
                setFormData(prev => ({ ...prev, matricula_id: '' }));
                return;
            }

            setLoadingMatriculas(true);
            try {
                const response = await getMatriculas(1, { search: formData.alumnoDni, estado: 1 });
                const foundMatriculas = response.data || [];
                setMatriculasDisponibles(foundMatriculas);

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

        if (activeTab === 'manual') {
            fetchAlumnoMatriculas();
        }
    }, [formData.alumno_id, formData.alumnoDni, activeTab]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();

        if (!formData.matricula_id) {
            setAlert({ type: 'error', message: 'Debes seleccionar una matrícula válida para el alumno.' });
            return;
        }

        setLoading(true);
        setAlert(null);

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
            setFormData(prev => ({ 
                ...prev, alumno_id: '', alumnoNombre: '', alumnoDni: '', matricula_id: '', observacion: '' 
            }));
            
        } catch (error) {
            setAlert(handleApiError(error, 'Error al registrar la asistencia manual.'));
        } finally {
            setLoading(false);
        }
    };

    return { 
        activeTab, setActiveTab,
        qrConfig, handleQrConfigChange, handleQrScan, handleQrError, cameraError,
        formData, setFormData, loading, loadingMatriculas, matriculasDisponibles, 
        alert, setAlert, handleChange, handleManualSubmit 
    };
};