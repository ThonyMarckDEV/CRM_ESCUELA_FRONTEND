import React from 'react';
import { useUpdate } from './hooks/useUpdate';
import AnioAcademicoForm from 'components/Shared/Formularios/anioacademico/AnioAcademicoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Update = () => {
    // Extraemos la lógica del hook
    const {
        formData,
        isLocked,
        loading,
        saving,
        alert,
        setAlert,
        handleChange,
        handleSubmit,
        navigate
    } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Editar Año Académico" icon={PencilSquareIcon} buttonText="Volver" buttonLink="/anio-academico/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    <AnioAcademicoForm data={formData} handleChange={handleChange} isLocked={isLocked} />
                    
                    {isLocked && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                            <LockClosedIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-800 font-medium">
                                <strong>Edición Protegida:</strong> Este año ya tiene movimientos. Solo puedes editar el nombre.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={() => navigate('/anio-academico/listar')} 
                            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors uppercase text-sm"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={saving} 
                            className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-all disabled:opacity-50 text-sm"
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