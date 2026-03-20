import { useState, useEffect, useCallback, useRef } from 'react';
import { index, destroy, getTicket } from 'services/pagoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [pagos, setPagos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    // Estados para el PDF
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

    useEffect(() => { 
        fetchPagos(1); 
    }, [fetchPagos]);

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

    const isPaymentLocked = (dateString) => {
        if (!dateString) return false;
        
        try {
            const [fecha, hora] = dateString.split(' ');
            const [dia, mes, anio] = fecha.split('/');
            const [horas, minutos] = hora.split(':');

            const paymentDate = new Date(anio, mes - 1, dia, horas, minutos);
            const now = new Date();

            const diffInMs = now - paymentDate;
            const diffInHours = diffInMs / (1000 * 60 * 60);
            
            return diffInHours > 24;
        } catch (e) {
            console.error("Error al procesar fecha:", dateString);
            return false;
        }
    };

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchPagos(1);
    };

    const handleFilterClear = () => {
        const c = {search:'', estado: ''}; 
        setFilters(c); 
        filtersRef.current = c; 
        fetchPagos(1);
    };

    return {
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
    };
};