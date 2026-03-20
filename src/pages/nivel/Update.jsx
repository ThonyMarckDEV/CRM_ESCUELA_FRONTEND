import React from 'react';
import { useUpdate } from './hooks/useUpdate';
import NivelForm from 'components/Shared/Formularios/nivel/NivelForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const {
        formData,
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
                title="Editar Nivel"
                subtitle={`Modificando: ${formData.nombre}`}
                icon={PencilSquareIcon}
                buttonText="← Volver al listado"
                buttonLink="/nivel/listar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 uppercase tracking-tighter">
                        🏫 Datos del Nivel
                    </h2>

                    <NivelForm data={formData} handleChange={handleChange} />

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate('/nivel/listar')}
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