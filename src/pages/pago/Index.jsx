import React, { useMemo } from 'react';
import { useIndex } from './hooks/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import PdfModal from 'components/Shared/Modals/PdfModal';

import { 
    BanknotesIcon, 
    TrashIcon, 
    UserIcon,
    PrinterIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading,
        pagos,
        paginationInfo,
        filters,
        alert,
        setAlert,
        deleteModal,
        setDeleteModal,
        pdfUrl,
        showPdfModal,
        loadingTicket,
        fetchPagos,
        handlePrintTicket,
        handleClosePdf,
        handleConfirmAnular,
        isPaymentLocked,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    } = useIndex();

    const columns = useMemo(() => [
        {
            header: 'Estudiante',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-full">
                        <UserIcon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">{row.alumno_nombre}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 rounded">
                                COD: {row.alumno_codigo}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                                <span className="uppercase">DNI:</span> {row.alumno_dni}
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Concepto',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sm">{row.concepto_nombre}</span>
                    <span className="text-[10px] text-slate-500">{row.fecha_pago}</span>
                </div>
            )
        },
        {
            header: 'Monto',
            render: (row) => (
                <span className={`font-mono font-bold ${row.es_anulado ? 'text-gray-400 line-through' : 'text-emerald-600'}`}>
                    S/ {parseFloat(row.monto).toFixed(2)}
                </span>
            )
        },
        {
            header: 'Método',
            render: (row) => (
                <div className="flex flex-col text-xs">
                    <span className="font-bold uppercase">{row.metodo_pago}</span>
                    {row.nro_operacion !== '-' && <span className="text-slate-400">Op: {row.nro_operacion}</span>}
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${row.es_anulado ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                    {row.es_anulado ? 'Anulado' : 'Pagado'}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => !row.es_anulado && (
                <div className="flex gap-2 items-center">
                    <button 
                        onClick={() => handlePrintTicket(row.id)}
                        disabled={loadingTicket}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Imprimir Ticket"
                    >
                        <PrinterIcon className="w-5 h-5" />
                    </button>

                    {isPaymentLocked(row.fecha_pago) ? (
                        <div 
                            className="p-1.5 text-gray-300 cursor-not-allowed"
                            title="Bloqueado: El pago tiene más de 24 horas y no puede ser anulado."
                        >
                            <LockClosedIcon className="w-5 h-5" />
                        </div>
                    ) : (
                        <button 
                            onClick={() => setDeleteModal({ isOpen: true, id: row.id })}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Anular Pago"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )
        }
    ], [loadingTicket, handlePrintTicket, isPaymentLocked, setDeleteModal]);

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar', placeholder: 'Alumno, Operación...', colSpan: 'md:col-span-12' }
    ], []);

    return (
        <div className="container mx-auto p-6">
            <PdfModal 
                isOpen={showPdfModal} 
                onClose={handleClosePdf} 
                title="Reimpresión de Ticket" 
                pdfUrl={pdfUrl} 
            />

            <PageHeader title="Caja y Pagos" icon={BanknotesIcon} buttonText="+ Registrar Pago" buttonLink="/pago/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={pagos} 
                loading={loading} 
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ 
                    currentPage: paginationInfo.currentPage, 
                    totalPages: paginationInfo.totalPages, 
                    onPageChange: fetchPagos 
                }}
            />

            {deleteModal.isOpen && (
                <ConfirmModal 
                    title="¿Anular Pago?" 
                    message="Esta acción revertirá el pago y quedará registrado como anulado. ¿Continuar?"
                    confirmText="Sí, anular"
                    onConfirm={handleConfirmAnular} 
                    onCancel={() => setDeleteModal({ isOpen: false, id: null })} 
                />
            )}
        </div>
    );
};

export default Index;