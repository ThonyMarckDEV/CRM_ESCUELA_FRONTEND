import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/anioAcademicoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ nombre: '', fecha_inicio: '', fecha_fin: '' });
    const [isLocked, setIsLocked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const loadAnio = async () => {
            setLoading(true);
            try {
                const response = await show(id);
                const data = response.data || response;
                
                setFormData({
                    nombre: data.nombre,
                    fecha_inicio: data.fecha_inicio,
                    fecha_fin: data.fecha_fin
                });
                
                if (data.tiene_data) setIsLocked(true);
            } catch (err) {
                setAlert(handleApiError(err , 'No se pudo cargar el año académico.'));
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            loadAnio();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Datos actualizados con éxito.' });
            setTimeout(() => navigate('/anio-academico/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar'));
        } finally {
            setSaving(false);
        }
    };

    return {
        formData,
        isLocked,
        loading,
        saving,
        alert,
        setAlert,
        handleChange,
        handleSubmit,
        navigate // Exportamos navigate por si la vista lo necesita para el botón "Cancelar"
    };
};