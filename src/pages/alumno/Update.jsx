import React from 'react';
import { useUpdate } from './hooks/useUpdate'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

// Formularios
import DatosPersonalesForm from 'components/Shared/Formularios/alumno/DatosPersonalesForm';
import ContactosForm from 'components/Shared/Formularios/alumno/ContactosForm';
import UsuarioForm from 'components/Shared/Formularios/alumno/UsuarioForm';

const Update = () => {
  const {
    formData,
    loading,
    saving,
    alert,
    setAlert,
    handleNestedChange,
    handleSubmit,
    handleCancel
  } = useUpdate();

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Editar Alumno"
        subtitle={`Modificando: ${formData.datos_alumno.nombre || ''} ${formData.datos_alumno.apellidoPaterno || ''}`}
        icon={PencilSquareIcon}
        buttonText="← Volver"
        buttonLink="/alumno/listar"
      />

      <AlertMessage 
        type={alert?.type} 
        message={alert?.message}  
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

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
              onClick={handleCancel}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 uppercase text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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