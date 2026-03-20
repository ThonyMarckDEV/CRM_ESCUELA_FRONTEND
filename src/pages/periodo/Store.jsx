import React from 'react';
import { useStore } from './hooks/useStore';
import PeriodoForm from 'components/Shared/Formularios/periodo/PeriodoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
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
            <PageHeader title="Nuevo Periodo" icon={CalendarDaysIcon} buttonText="Volver" buttonLink="/periodo/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <PeriodoForm 
                    data={formData} 
                    handleChange={handleChange} 
                    setFormData={setFormData} 
                />
                
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Registrar Periodo'}
                </button>
            </form>
        </div>
    );
};

export default Store;