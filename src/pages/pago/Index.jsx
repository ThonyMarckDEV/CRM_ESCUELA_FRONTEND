import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { index, destroy, getTicket } from 'services/pagoService';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import PdfModal from 'components/Shared/Modals/PdfModal';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { 
    BanknotesIcon, 
    TrashIcon, 
    UserIcon,
    PrinterIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const [loading, setLoading] = useState(true);
    const [pagos, setPagos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    // ESTADOS PARA PDF
    const [pdfUrl, setPdfUrl] = useState(null);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [loadingTicket, setLoadingTicket] = useState(false);

    const fetchPagos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setPagos(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar pagos'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPagos(1); }, [fetchPagos]);

    const handlePrintTicket = async (id) => {
        setLoadingTicket(true);
        try {
            const blob = await getTicket(id);
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            setPdfUrl(url);
            setShowPdfModal(true);
        } catch (error) {
            setAlert(handleApiError(error, 'Error al generar ticket'));
        } finally {
            setLoadingTicket(false);
        }
    };

    const handleClosePdf = () => {
        setShowPdfModal(false);
        if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
    };

    const handleConfirmAnular = async () => {
        try {
            await destroy(deleteModal.id);
            setAlert({ type: 'success', message: 'Pago anulado correctamente.' });
            fetchPagos(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al anular'));
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

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
                <div className="flex gap-2">
                    {/* BOTÓN REIMPRIMIR */}
                    <button 
                        onClick={() => handlePrintTicket(row.id)}
                        disabled={loadingTicket}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Imprimir Ticket"
                    >
                        <PrinterIcon className="w-5 h-5" />
                    </button>

                    {/* BOTÓN ANULAR */}
                    <button 
                        onClick={() => setDeleteModal({ isOpen: true, id: row.id })}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Anular Pago"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ], [loadingTicket]);

    const filterConfig = [{ name: 'search', type: 'text', label: 'Buscar', placeholder: 'Alumno, Operación...', colSpan: 'md:col-span-12' }];

    return (
        <div className="container mx-auto p-6">
            
            {/* MODAL DE PDF (Se abre al reimprimir) */}
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
                onFilterChange={(n, v) => setFilters(p => ({...p, [n]: v}))}
                onFilterSubmit={() => { filtersRef.current = filters; fetchPagos(1); }}
                onFilterClear={() => { const c = {search:'', estado: ''}; setFilters(c); filtersRef.current = c; fetchPagos(1); }}
                pagination={{ currentPage: paginationInfo.currentPage, totalPages: paginationInfo.totalPages, onPageChange: fetchPagos }}
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