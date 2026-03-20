import React from 'react';
import { useStore } from './hooks/useStore';
import ConceptoPagoForm from 'components/Shared/Formularios/conceptopago/ConceptoPagoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { BanknotesIcon } from '@heroicons/react/24/outline';
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
            <PageHeader title="Nuevo Concepto" icon={BanknotesIcon} buttonText="Volver" buttonLink="/concepto-pago/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    <ConceptoPagoForm 
                        data={formData} 
                        handleChange={handleChange} 
                        setForm={setFormData} 
                    />
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-lg"
                    >
                        {loading ? 'Guardando...' : 'Registrar Concepto'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Store;