import React from 'react';
import { useUpdate } from './hooks/useUpdate';
import GradoForm from 'components/Shared/Formularios/grado/GradoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const {
        formData,
        setFormData,
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
            <PageHeader
                title="Editar Grado"
                subtitle={`Modificando: ${formData.nombre}`}
                icon={PencilSquareIcon}
                buttonText="← Volver al listado"
                buttonLink="/grado/listar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 uppercase tracking-tighter">
                        🎓 Datos del Grado
                    </h2>

                    <GradoForm 
                        data={formData} 
                        handleChange={handleChange} 
                        setForm={setFormData}
                        isLevelLocked={isLocked}
                    />

                    {isLocked && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                            <LockClosedIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-yellow-800">
                                <span className="font-bold block mb-1">Cambio de Nivel Bloqueado</span>
                                Este grado ya tiene <strong>Secciones</strong> creadas. 
                                No se puede mover de Nivel (ej: Primaria a Secundaria) para mantener la integridad académica.
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate('/grado/listar')}
                            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors uppercase text-sm border border-slate-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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