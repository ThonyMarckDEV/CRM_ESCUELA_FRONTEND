import React from 'react';
import { useStore } from './hooks/useStore';

import PagoForm from 'components/Shared/Formularios/pago/PagoForm';
import PdfModal from 'components/Shared/Modals/PdfModal';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

import { 
    BanknotesIcon, 
    ArrowLeftIcon,
    PrinterIcon,
    ShieldCheckIcon,
    ReceiptPercentIcon
} from '@heroicons/react/24/outline';

const Store = () => {
    const {
        formData,
        setFormData,
        loading,
        alert,
        setAlert,
        pdfUrl,
        showModal,
        handleSubmit,
        handleCloseModal,
        handleChange,
        navigate
    } = useStore();

    return (
        <div className="container mx-auto p-4 lg:p-8 min-h-screen">
            
            <PdfModal 
                isOpen={showModal}
                onClose={handleCloseModal}
                title="Comprobante de Pago"
                pdfUrl={pdfUrl}
            />

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={() => navigate('/pago/listar')} className="p-2 hover:bg-white rounded-full transition-colors">
                        <ArrowLeftIcon className="w-5 h-5 text-slate-500" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Terminal de Caja</h1>
                        <p className="text-xs text-slate-500">Nueva Operación de Ingreso</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>Conexión Segura</span>
                </div>
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            {/* --- WORKSPACE SPLIT --- */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* IZQUIERDA: FORMULARIO */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-8">
                    <PagoForm 
                        data={formData} 
                        handleChange={handleChange} 
                        setForm={setFormData} 
                    />
                </div>

                {/* DERECHA: TICKET PREVIEW */}
                <div className="lg:col-span-1 sticky top-6">
                    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                        
                        <div className="absolute -top-10 -right-10 p-10 opacity-5 pointer-events-none">
                            <BanknotesIcon className="w-40 h-40 transform rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resumen</span>
                                <ReceiptPercentIcon className="w-4 h-4 text-emerald-400" />
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase mb-1">Alumno</p>
                                    <p className="text-base font-bold truncate leading-tight">
                                        {formData.alumnoNombre || <span className="text-slate-600 italic">-- Seleccione --</span>}
                                    </p>
                                    {formData.alumnoDni && (
                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">DNI: {formData.alumnoDni}</p>
                                    )}
                                </div>

                                <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase">Fecha</p>
                                        <p className="font-bold text-xs">{formData.fecha_pago}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500 uppercase">Método</p>
                                        <p className="font-bold text-xs text-emerald-400">{formData.metodo_pago}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-700 border-dashed">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-xs text-slate-400 pb-1">Total a Pagar</span>
                                    <div className="text-4xl font-black tracking-tighter text-white">
                                        <span className="text-lg font-bold text-slate-500 mr-1.5">S/</span>
                                        {formData.monto ? parseFloat(formData.monto).toFixed(2) : '0.00'}
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading || !formData.matricula_id || !formData.monto}
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-3.5 rounded-xl font-black uppercase tracking-wide shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                                >
                                    {loading ? 'Generando Ticket...' : (
                                        <>
                                            <span>COBRAR E IMPRIMIR</span>
                                            <PrinterIcon className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Store;