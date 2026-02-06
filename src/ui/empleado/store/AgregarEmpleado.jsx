import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/empleadoService';

// Componentes
import DatosPersonalesForm from 'components/Shared/Formularios/empleado/DatosPersonalesForm';
import UsuarioForm from 'components/Shared/Formularios/empleado/UsuarioForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const AgregarEmpleado = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    datos_empleado: {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        dni: '',
        fechaNacimiento: '',
        sexo: '',
        estadoCivil: '',
        direccion: '',
        telefono: ''
    },
    usuario: {
        username: '',
        password: ''
    },
    rol_id: '',
    rolNombre: ''
  });

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

    if (!formData.rol_id) {
        setAlert({ type: 'error', message: 'Por favor seleccione un Rol para el empleado.' });
        setLoading(false);
        return;
    }

    try {
      await store(formData);
      
      setAlert({ 
        type: 'success', 
        message: 'Empleado registrado exitosamente. Redirigiendo...' 
      });

      setTimeout(() => {
        navigate('/empleado/listar');
      }, 1500);

    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar empleado'));
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Nuevo Empleado" 
        icon={UserPlusIcon} 
        buttonText="Volver" 
        buttonLink="/empleado/listar" 
      />
      
      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details}
        onClose={() => setAlert(null)} 
      />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        
        {/* SECCIÓN 1: Datos Personales */}
        <DatosPersonalesForm 
            data={formData} 
            handleNestedChange={handleNestedChange} 
        />

        {/* SECCIÓN 2: Usuario y Rol */}
        <UsuarioForm 
            form={formData} 
            setForm={setFormData}
            handleNestedChange={handleNestedChange}
            isEditing={false}
        />

        <div className="mt-8 flex justify-end">
            <button 
                type="submit" 
                disabled={loading} 
                className="bg-black text-white px-8 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-lg"
            >
                {loading ? 'Guardando...' : 'Registrar Empleado'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarEmpleado;