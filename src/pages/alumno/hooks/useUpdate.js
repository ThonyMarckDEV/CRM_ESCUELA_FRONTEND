import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/alumnoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({ 
    datos_alumno: {},
    usuario: { username: '', password: '' },
    contactos: {}
  });

  // Usamos useCallback para evitar que la función se re-cree en cada render
  const loadAlumno = useCallback(async () => {
    try {
      const response = await show(id);
      const data = response.data || response;
      
      setFormData({
        datos_alumno: data,
        usuario: {
          username: data.usuario?.username || '',
          password: '' // La contraseña siempre se envía vacía por defecto al editar
        },
        contactos: {
          telefono: data.contacto?.telefono || '',
          correo: data.contacto?.correo || ''
        }
      });
    } catch (err) {
      setAlert(handleApiError(err, 'No se pudo cargar la información.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAlumno();
  }, [loadAlumno]);

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      await update(id, formData);
      setAlert({ type: 'success', message: 'Alumno actualizado correctamente.' });
      
      setTimeout(() => {
        navigate('/alumno/listar');
      }, 1500);

    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar'));
      setSaving(false); // Solo detenemos el saving si hay error, si es éxito se desmontará
    }
  };

  const handleCancel = () => {
    navigate('/alumno/listar');
  };

  return {
    formData,
    loading,
    saving,
    alert,
    setAlert,
    handleNestedChange,
    handleSubmit,
    handleCancel
  };
};