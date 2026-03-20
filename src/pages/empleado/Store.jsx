import React from 'react';
import { useStore } from './hooks/useStore';

import DatosPersonalesForm from 'components/Shared/Formularios/empleado/DatosPersonalesForm';
import UsuarioForm from 'components/Shared/Formularios/empleado/UsuarioForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const {
        formData,
        setFormData,
        loading,
        alert,
        setAlert,
        handleNestedChange,
        handleSubmit
    } = useStore();

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
                <DatosPersonalesForm 
                    data={formData} 
                    handleNestedChange={handleNestedChange} 
                />

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

export default Store;