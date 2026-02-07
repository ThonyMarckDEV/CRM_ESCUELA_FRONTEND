import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/empleadoService';

import DatosPersonalesForm from 'components/Shared/Formularios/empleado/DatosPersonalesForm';
import UsuarioForm from 'components/Shared/Formularios/empleado/UsuarioForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import {PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    datos_empleado: {
        nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '',
        fechaNacimiento: '', sexo: '', estadoCivil: '', direccion: '', telefono: ''
    },
    usuario: { username: '', password: '' },
    rol_id: '',
    rolNombre: ''
  });

  // Cargar datos
  useEffect(() => {
    const loadEmpleado = async () => {
      try {
        const response = await show(id);
        const data = response.data || response;
        
        setFormData({
            datos_empleado: {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoPaterno,
                apellidoMaterno: data.apellidoMaterno,
                dni: data.dni,
                fechaNacimiento: data.fechaNacimiento,
                sexo: data.sexo,
                estadoCivil: data.estadoCivil,
                direccion: data.direccion,
                telefono: data.telefono 
            },
            usuario: {
                username: data.usuario?.username || '',
                password: ''
            },
            rol_id: data.usuario?.rol_id || '',
            rolNombre: data.usuario?.rol?.nombre || ''
        });

      } catch (err) {
        setAlert(handleApiError(err , 'No se pudo cargar la información del empleado.'));
      } finally {
        setLoading(false);
      }
    };
    loadEmpleado();
  }, [id]);

  // Manejador de cambios anidados
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

    // Validación básica de rol
    if (!formData.rol_id) {
        setAlert({ type: 'error', message: 'El empleado debe tener un rol asignado.' });
        setSaving(false);
        return;
    }

    try {
      await update(id, formData);
      setAlert({ type: 'success', message: 'Empleado actualizado correctamente.' });
      
      setTimeout(() => navigate('/empleado/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar el empleado'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Editar Empleado"
        subtitle={`Editando a: ${formData.datos_empleado.nombre} ${formData.datos_empleado.apellidoPaterno}`}
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/empleado/listar"
      />

      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        
        <DatosPersonalesForm 
            data={formData} 
            handleNestedChange={handleNestedChange} 
        />

        <UsuarioForm 
            form={formData} 
            setForm={setFormData}
            handleNestedChange={handleNestedChange}
            isEditing={true}
        />

        <div className="flex justify-end gap-4 mt-8">
            <button
                type="button"
                onClick={() => navigate('/empleado/listar')}
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors uppercase text-sm"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={saving}
                className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default Update;