import React from 'react';
import { useStore } from './hooks/useStore';
import GradoForm from 'components/Shared/Formularios/grado/GradoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const Store = () => {
    const {
        formData,
        setFormData,
        loading,
        alert,
        setAlert,
        handleChange,
        handleSubmit
    } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Nuevo Grado" icon={AcademicCapIcon} buttonText="Volver" buttonLink="/grado/listar" />
            
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <GradoForm 
                    data={formData} 
                    handleChange={handleChange} 
                    setForm={setFormData} 
                />
                
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Registrar Grado'}
                </button>
            </form>
        </div>
    );
};

export default Store;