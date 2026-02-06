import React, { useRef, useEffect } from 'react';
import { XMarkIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';

const PdfModal = ({ isOpen, onClose, title, pdfUrl }) => {
    const iframeRef = useRef(null);

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePrint = () => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.focus();
            iframeRef.current.contentWindow.print();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden border border-slate-700">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{title}</h3>
                        <p className="text-xs text-slate-500 font-medium">Vista Previa de Impresión</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Botón Descargar */}
                        <a 
                            href={pdfUrl} 
                            download={`ticket-${Date.now()}.pdf`}
                            className="p-2 text-slate-500 hover:bg-white hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                            title="Descargar PDF"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                        </a>
                        
                        {/* Botón Cerrar */}
                        <button 
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Body - Iframe con el PDF */}
                <div className="flex-1 bg-slate-100 relative">
                    <iframe 
                        ref={iframeRef}
                        src={pdfUrl} 
                        type="application/pdf"
                        className="w-full h-full"
                        title="Visor de Ticket"
                    />
                </div>

                {/* Footer con Acción Principal */}
                <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-between items-center">
                    <span className="text-xs text-slate-400 italic">
                        * Asegúrese de que su impresora térmica esté conectada.
                    </span>
                    <div className="flex gap-3">
                        <button 
                            onClick={handlePrint}
                            className="px-8 py-2.5 bg-black text-white rounded-lg font-bold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <PrinterIcon className="w-5 h-5" />
                            IMPRIMIR TICKET
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfModal;