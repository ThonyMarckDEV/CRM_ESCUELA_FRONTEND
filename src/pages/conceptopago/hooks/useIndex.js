import { useState, useEffect, useCallback, useRef } from 'react';
import { index, destroy } from 'services/conceptoPagoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [conceptos, setConceptos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '', periodo_id: '', anio_academico_id: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, nombre: '' });

    const fetchConceptos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setConceptos(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los conceptos'));
        } finally {
            setLoading(false);
        }
    }, []);

    // Carga inicial
    useEffect(() => { 
        fetchConceptos(1); 
    }, [fetchConceptos]);

    // Efecto para recargar cuando cambian los combos select
    useEffect(() => {
        if (
            filters.periodo_id !== filtersRef.current.periodo_id || 
            filters.anio_academico_id !== filtersRef.current.anio_academico_id
        ) {
            filtersRef.current = { 
                ...filtersRef.current, 
                periodo_id: filters.periodo_id,
                anio_academico_id: filters.anio_academico_id
            };
            fetchConceptos(1); 
        }
    }, [filters.periodo_id, filters.anio_academico_id, fetchConceptos]);

    const handleDeleteClick = (row) => {
        if (!row.contexto_abierto) return;
        setDeleteModal({ isOpen: true, id: row.id, nombre: row.nombre });
    };

    const confirmDelete = async () => {
        try {
            await destroy(deleteModal.id);
            setAlert({ type: 'success', message: 'Concepto eliminado correctamente.' });
            fetchConceptos(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar el concepto'));
        } finally {
            setDeleteModal({ isOpen: false, id: null, nombre: '' });
        }
    };

    // Funciones manejadoras de filtros
    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchConceptos(1);
    };

    const handleFilterClear = () => {
        const clearedFilters = { search: '', periodo_id: '', anio_academico_id: '' };
        setFilters(clearedFilters);
        filtersRef.current = clearedFilters;
        fetchConceptos(1);
    };

    return {
        loading,
        conceptos,
        paginationInfo,
        filters,
        setFilters,
        alert,
        setAlert,
        deleteModal,
        setDeleteModal,
        fetchConceptos,
        handleDeleteClick,
        confirmDelete,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    };
};