import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/alumnoService';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

import DatosPersonalesForm from 'components/Shared/Formularios/alumno/DatosPersonalesForm';
import ContactosForm from 'components/Shared/Formularios/alumno/ContactosForm';
import UsuarioForm from 'components/Shared/Formularios/alumno/UsuarioForm';

const Store = () => {
  const navigate = useNavigate();
  
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
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

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
    setLoading(true);
    setAlert(null);

    try {
      await store(formData);
      
      setAlert({ 
        type: 'success', 
        message: 'Alumno registrado exitosamente. Redirigiendo...' 
      });

      setTimeout(() => {
        navigate('/alumno/listar');
      }, 1500);

    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar el alumno'));
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Nuevo Alumno" icon={UserPlusIcon} buttonText="Volver" buttonLink="/alumno/listar" />
      
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        
        <DatosPersonalesForm 
            data={formData} 
            handleNestedChange={handleNestedChange} 
        />

        <ContactosForm 
            data={formData} 
            handleNestedChange={handleNestedChange} 
        />

        <UsuarioForm 
            data={formData} 
            handleNestedChange={handleNestedChange}
            isEditing={false}
        />
        
        <div className="pt-4">
            <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-black text-white py-4 rounded-xl font-black uppercase text-lg hover:bg-zinc-800 transition-colors shadow-lg disabled:opacity-50"
            >
            {loading ? 'Guardando...' : 'Registrar Alumno Completo'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default Store;