import React from 'react';
import { useUpdate } from './hooks/useUpdate';
import PeriodoForm from 'components/Shared/Formularios/periodo/PeriodoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const {
        formData,
        setFormData,
        loading,
        saving,
        alert,
        setAlert,
        isLocked,
        handleChange,
        handleSubmit,
        navigate
    } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Editar Periodo" 
                subtitle={`Modificando: ${formData.nombre}`} 
                icon={PencilSquareIcon} 
                buttonText="← Volver" 
                buttonLink="/periodo/listar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    
                    <PeriodoForm 
                        data={formData} 
                        handleChange={handleChange} 
                        setFormData={setFormData} 
                        isLocked={isLocked}
                    />

                    <div className="flex justify-end gap-4 mt-8">
                        <button 
                            type="button" 
                            onClick={() => navigate('/periodo/listar')} 
                            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold uppercase text-sm border border-slate-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={saving} 
                            className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg disabled:opacity-50 text-sm"
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