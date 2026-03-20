import React from 'react';
import { useStore } from './hooks/useStore';
import SeccionForm from 'components/Shared/Formularios/seccion/SeccionForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const Store = () => {
    const {
        formData,
        setFormData,
        loading,
        alert,
        setAlert,
        handleSubmit
    } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Nueva Sección" icon={Squares2X2Icon} buttonText="Volver" buttonLink="/seccion/listar" />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                
                <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 uppercase tracking-tighter">
                    🏫 Datos de la Sección
                </h2>

                <SeccionForm 
                    data={formData} 
                    setForm={setFormData} 
                />
                
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-lg"
                >
                    {loading ? 'Guardando...' : 'Registrar Sección'}
                </button>
            </form>
        </div>
    );
};

export default Store;