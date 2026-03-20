import React from 'react';
import { useUpdate } from './hooks/useUpdate';
import MatriculaForm from 'components/Shared/Formularios/matricula/MatriculaForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const {
        formData,
        setFormData,
        security,
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
            <PageHeader title="Editar Matrícula" icon={PencilSquareIcon} buttonText="Volver" buttonLink="/matricula/listar" />
            
            {/* AVISO DE AÑO CERRADO (Bloqueo Total) */}
            {security.isYearClosed && (
                <div className="mb-6 bg-gray-100 border-l-4 border-gray-500 p-4 rounded flex items-center gap-3">
                    <LockClosedIcon className="w-6 h-6 text-gray-500"/>
                    <div>
                        <h3 className="font-bold text-gray-700">Año Académico Cerrado</h3>
                        <p className="text-sm text-gray-600">Este registro es histórico y no puede ser modificado.</p>
                    </div>
                </div>
            )}

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 relative">
                    
                    <MatriculaForm 
                        data={formData} 
                        handleChange={handleChange} 
                        setForm={setFormData}
                        isEdit={true}
                        disabled={security.isYearClosed} 
                        security={security} 
                    />

                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
                        <button type="button" onClick={() => navigate('/matricula/listar')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-200 transition-colors">
                            {security.isYearClosed ? 'Volver' : 'Cancelar'}
                        </button>
                        
                        {!security.isYearClosed && (
                            <button type="submit" disabled={saving} className="bg-black text-white px-8 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 transition-colors">
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update;