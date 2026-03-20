import React from 'react';
import { useStore } from './hooks/useStore';
import HorarioForm from 'components/Shared/Formularios/horario/HorarioForm';
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
            <PageHeader title="Nuevo Horario" icon={CalendarDaysIcon} buttonText="Volver" buttonLink="/horario/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    <HorarioForm 
                        data={formData} 
                        handleChange={handleChange} 
                        setForm={setFormData}
                    />
                    <button type="submit" disabled={loading} className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg">
                        {loading ? 'Validando y Guardando...' : 'Asignar Horarios'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Store;