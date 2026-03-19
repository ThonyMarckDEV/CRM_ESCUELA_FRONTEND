import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/asistenciaDiariaService';
import { index as getMatriculas } from 'services/matriculaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import CryptoJS from 'crypto-js';

export const useStore = () => {
    useNavigate();
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

        try {
            // 1. Desencriptar el QR
            // Usamos la variable de entorno, o un fallback por si falla la carga del .env
            const secretKey = process.env.REACT_APP_QR_SECRET_KEY;
            const bytes = CryptoJS.AES.decrypt(detectedText.trim(), secretKey);
            const decryptedDNI = bytes.toString(CryptoJS.enc.Utf8);

            // Validamos que se haya podido desencriptar correctamente
            if (!decryptedDNI || decryptedDNI.length < 8) {
                setAlert({ type: 'error', message: 'QR Inválido o alterado. Acceso denegado.' });
                setLoading(false);
                return;
            }

            // 2. Buscar la matrícula activa de este DNI (reutilizamos getMatriculas)
            const responseMatricula = await getMatriculas(1, { search: decryptedDNI, estado: 1 });
            const matriculas = responseMatricula.data || [];

            if (matriculas.length === 0) {
                setAlert({ type: 'error', message: `No hay matrícula activa para el DNI: ${decryptedDNI}` });
                setLoading(false);
                return;
            }

            const matriculaValida = matriculas[0];

            // 3. Registrar la Asistencia
            const now = new Date();
            const payload = {
                matricula_id: matriculaValida.id, 
                fecha: now.toISOString().split('T')[0],
                hora_ingreso: now.toTimeString().split(' ')[0], 
                estado: parseInt(qrConfig.estado),
                observacion: qrConfig.observacion || null
            };

            await store(payload);
            setAlert({ 
                type: 'success', 
                message: `✅ Asistencia de ${matriculaValida.alumno_nombre || 'Alumno'} registrada a las ${payload.hora_ingreso.substring(0,5)}` 
            });
            
            // Limpiamos observación para el siguiente
            setQrConfig(prev => ({ ...prev, observacion: '' }));

        } catch (error) {
            // Si AES.decrypt falla catastróficamente por un formato erróneo
            if (error.message && error.message.includes('Malformed UTF-8 data')) {
                setAlert({ type: 'error', message: 'El código QR no pertenece a esta institución.' });
            } else {
                setAlert(handleApiError(error, 'Error al procesar la asistencia.'));
            }
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