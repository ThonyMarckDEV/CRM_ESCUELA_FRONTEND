import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/conceptoPagoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        nombre: '', 
        monto: '',
        periodo_id: null, 
        periodoNombre: '',
        anio_academico_id: '',
        anioNombre: '',
        es_matricula: false,
        es_pension: true
    });
    
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        // Validaciones
        if (!formData.es_matricula && !formData.es_pension) {
            setAlert({ type: 'error', message: 'Seleccione si es Matrícula o Pensión.' });
            setLoading(false);
            return;
        }

        if (formData.es_matricula) {
            if (!formData.anio_academico_id) {
                setAlert({ type: 'error', message: 'Para una Matrícula, debes seleccionar el Año Académico.' });
                setLoading(false);
                return;
            }
        } else {
            if (!formData.periodo_id) {
                setAlert({ type: 'error', message: 'Para una Pensión, debes seleccionar el Periodo (Bimestre).' });
                setLoading(false);
                return;
            }
        }

        // Envío a la API
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Registrado correctamente.' });
            setTimeout(() => navigate('/concepto-pago/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al crear'));
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return {
        formData,
        setFormData, // Lo exportamos porque tu ConceptoPagoForm lo requiere como setForm
        loading,
        alert,
        setAlert,
        handleChange,
        handleSubmit
    };
};