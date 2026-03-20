import React from 'react';
import { useUpdate } from './hooks/useUpdate';

import DatosPersonalesForm from 'components/Shared/Formularios/empleado/DatosPersonalesForm';
import UsuarioForm from 'components/Shared/Formularios/empleado/UsuarioForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const {
        formData,
        setFormData,
        loading,
        saving,
        alert,
        setAlert,
        handleNestedChange,
        handleSubmit,
        navigate
    } = useUpdate();

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