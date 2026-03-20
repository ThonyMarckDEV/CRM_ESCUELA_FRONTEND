import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/pagoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const initialState = { 
        alumno_id: '', alumnoNombre: '', alumnoDni: '', 
        matricula_id: '',
        concepto_id: '',
        monto: '',
        fecha_pago: today,
        metodo_pago: 'Efectivo',
        nro_operacion: '',
        observaciones: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [pdfUrl, setPdfUrl] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        if (!formData.matricula_id) {
            setAlert({ type: 'error', message: 'Seleccione un alumno con matrícula activa.' });
            setLoading(false);
            return;
        }

        try {
            const pdfBlob = await store(formData);
            
            const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
            setPdfUrl(url);
            
            setShowModal(true);
            setAlert({ type: 'success', message: '¡Pago registrado! Abriendo ticket...' });

        } catch (error) {
            setAlert(handleApiError(error, 'Error al procesar el pago'));
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData(initialState);
        setAlert(null);
        
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
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
        pdfUrl,
        showModal,
        handleSubmit,
        handleCloseModal,
        handleChange,
        navigate
    };
};