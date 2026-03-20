import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/matriculaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ 
        alumno_id: '', alumnoNombre: '',
        anio_academico_id: '', anioNombre: '',
        grado_id: '', gradoNombre: '',
        seccion_id: '', seccionNombre: '',
        estado: ''
    });
    
    // ESTADOS DE SEGURIDAD
    const [security, setSecurity] = useState({
        isYearClosed: false, // Bloqueo Total
        hasPayments: false,  // Bloqueo Financiero
        hasGrades: false     // Bloqueo Académico
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                
                setSecurity({
                    isYearClosed: data.anio_cerrado,
                    hasPayments: data.tiene_pagos,
                    hasGrades: data.tiene_notas
                });

                setFormData({
                    alumno_id: data.alumno_id,
                    alumnoNombre: data.alumnoNombre,
                    anio_academico_id: data.anio_academico_id,
                    anioNombre: data.anioNombre,
                    grado_id: data.grado_id,
                    gradoNombre: data.gradoNombre,
                    seccion_id: data.seccion_id,
                    seccionNombre: data.seccionNombre,
                    estado: data.estado
                });
            } catch (err) {
                setAlert(handleApiError(err , 'No se pudo cargar la matrícula.'));
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
        if (security.isYearClosed) return; // Doble check

        setSaving(true);
        setAlert(null);

        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Matrícula actualizada correctamente.' });
            setTimeout(() => navigate('/matricula/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar'));
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