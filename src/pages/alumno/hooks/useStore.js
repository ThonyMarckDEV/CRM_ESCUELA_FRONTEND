import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/alumnoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Estado inicial del formulario estructurado
  const [formData, setFormData] = useState({ 
    datos_alumno: {
      codigo_estudiante: '', dni: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '',
      fechaNacimiento: '', sexo: '', direccion: '', nombre_apoderado: '', telefono_apoderado: ''
    },
    usuario: {
      username: '', 
      password: '',
      password_confirmation: ''
    },
    contactos: {
      telefono: '', correo: ''
    }
  });

  // Manejador genérico para actualizar campos anidados
  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Función para procesar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await store(formData);
      
      setAlert({ 
        type: 'success', 
        message: 'Alumno registrado exitosamente. Redirigiendo...' 
      });

      // Redirigir después de un breve delay para que el usuario lea el mensaje
      setTimeout(() => {
        navigate('/alumno/listar');
      }, 1500);

    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar el alumno'));
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    alert,
    setAlert,
    handleNestedChange,
    handleSubmit
  };
};