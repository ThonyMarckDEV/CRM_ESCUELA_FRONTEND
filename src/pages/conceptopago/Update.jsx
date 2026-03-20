import React from 'react';
import { useUpdate } from './hooks/useUpdate';
import ConceptoPagoForm from 'components/Shared/Formularios/conceptopago/ConceptoPagoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const {
        formData,
        setFormData,
        loading,
        saving,
        alert,
        setAlert,
        isContextClosed,
        hasPayments,
        lockReason,
        handleChange,
        handleSubmit,
        navigate
    } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Editar Concepto" icon={PencilSquareIcon} buttonText="Volver" buttonLink="/concepto-pago/listar" />
            
            {/* ALERTA DE BLOQUEO TOTAL (HISTÓRICO) */}
            {isContextClosed && (
                <div className="mb-6 bg-gray-100 border-l-4 border-gray-500 p-4 rounded shadow-sm flex items-start gap-3">
                    <LockClosedIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-gray-800">Archivo Histórico</h3>
                        <p className="text-sm text-gray-600">{lockReason} No se permiten modificaciones.</p>
                    </div>
                </div>
            )}

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 relative">
                    
                    <ConceptoPagoForm 
                        data={formData} 
                        handleChange={handleChange} 
                        setForm={setFormData} 
                        disabled={isContextClosed}       // Bloqueo total (gris)
                        bloqueoFinanciero={hasPayments}  // Bloqueo parcial (solo monto/fechas)
                    />
                    
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={() => navigate('/concepto-pago/listar')} 
                            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-200 transition-colors"
                        >
                            {isContextClosed ? 'Volver' : 'Cancelar'}
                        </button>
                        
                        {/* El botón Guardar solo se oculta si el contexto está cerrado. 
                            Si solo hay bloqueo financiero, se muestra para poder editar el nombre */}
                        {!isContextClosed && (
                            <button 
                                type="submit" 
                                disabled={saving} 
                                className="bg-black text-white px-8 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50"
                            >
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