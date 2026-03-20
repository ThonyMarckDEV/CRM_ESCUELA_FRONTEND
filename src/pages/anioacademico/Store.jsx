import React from 'react';
import { useStore } from './hooks/useStore';
import AnioAcademicoForm from 'components/Shared/Formularios/anioacademico/AnioAcademicoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { CalendarIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const Store = () => {
    const {
        formData,
        loading,
        alert,
        setAlert,
        handleChange,
        handleSubmit
    } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Nuevo Año Académico" icon={CalendarIcon} buttonText="Volver" buttonLink="/anio-academico/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <AnioAcademicoForm data={formData} handleChange={handleChange} />
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Registrar Año'}
                </button>
            </form>
        </div>
    );
};

export default Store;