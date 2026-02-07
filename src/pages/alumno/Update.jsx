import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/alumnoService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import DatosPersonalesForm from 'components/Shared/Formularios/alumno/DatosPersonalesForm';
import ContactosForm from 'components/Shared/Formularios/alumno/ContactosForm';
import UsuarioForm from 'components/Shared/Formularios/alumno/UsuarioForm';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    datos_alumno: {},
    usuario: { username: '', password: '' },
    contactos: {}
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  
  useEffect(() => {
    const loadAlumno = async () => {
      try {
        const response = await show(id);
        const data = response.data || response;
        
        setFormData({
            datos_alumno: data,
            usuario: {
                username: data.usuario?.username || '',
                password: ''
            },
            contactos: {
                telefono: data.contacto?.telefono || '',
                correo: data.contacto?.correo || ''
            }
        });

      } catch (err) {
        setAlert(handleApiError(err , 'No se pudo cargar la información.'));
      } finally {
        setLoading(false);
      }
    };
    loadAlumno();
  }, [id]);

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
      setTimeout(() => navigate('/alumno/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Editar Alumno"
        subtitle={`Modificando: ${formData.datos_alumno.nombre} ${formData.datos_alumno.apellidoPaterno}`}
        icon={PencilSquareIcon}
        buttonText="← Volver"
        buttonLink="/alumno/listar"
      />

      <AlertMessage type={alert?.type} message={alert?.message}  details={alert?.details} onClose={() => setAlert(null)} />

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          
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
            isEditing={true}
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/alumno/listar')}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 uppercase text-sm"
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
    </div>
  );
};

export default Update;