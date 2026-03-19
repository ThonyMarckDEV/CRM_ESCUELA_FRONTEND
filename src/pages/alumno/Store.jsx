import React from 'react';
import { useStore } from './hooks/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

// Importación de los componentes del formulario
import DatosPersonalesForm from 'components/Shared/Formularios/alumno/DatosPersonalesForm';
import ContactosForm from 'components/Shared/Formularios/alumno/ContactosForm';
import UsuarioForm from 'components/Shared/Formularios/alumno/UsuarioForm';

const Store = () => {
  // Desestructuramos todo lo necesario desde el custom hook
  const {
    formData,
    loading,
    alert,
    setAlert,
    handleNestedChange,
    handleSubmit
  } = useStore();

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Nuevo Alumno" 
        icon={UserPlusIcon} 
        buttonText="Volver" 
        buttonLink="/alumno/listar" 
      />
      
      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

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
                className="w-full bg-black text-white py-4 rounded-xl font-black uppercase text-lg hover:bg-zinc-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {loading ? 'Guardando...' : 'Registrar Alumno Completo'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default Store;