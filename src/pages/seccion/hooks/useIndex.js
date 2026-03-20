import { useState, useEffect, useCallback, useRef } from 'react';
import { index, toggleStatus, destroy } from 'services/seccionService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [secciones, setSecciones] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '', grado_id: '', gradoNombre: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    // Modales
    const [statusModal, setStatusModal] = useState({ isOpen: false, id: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, nombre: '' });

    const fetchSecciones = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setSecciones(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar las secciones'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchSecciones(1); 
    }, [fetchSecciones]);

    useEffect(() => {
        if (filters.grado_id !== filtersRef.current.grado_id) {
            filtersRef.current = { ...filtersRef.current, grado_id: filters.grado_id };
            fetchSecciones(1); 
        }
    }, [filters.grado_id, fetchSecciones]);

    const handleConfirmToggle = async () => {
        setStatusModal({ isOpen: false, id: null });
        setLoading(true);
        try {
            await toggleStatus(statusModal.id);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            await fetchSecciones(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar estado'));
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        setDeleteModal({ isOpen: false, id: null, nombre: '' });
        setLoading(true);
        try {
            await destroy(deleteModal.id);
            setAlert({ type: 'success', message: 'Sección eliminada correctamente.' });
            await fetchSecciones(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar sección'));
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchSecciones(1);
    };

    const handleFilterClear = () => {
        const c = {search:'', grado_id: '', gradoNombre: '', estado: ''}; 
        setFilters(c); 
        filtersRef.current = c; 
        fetchSecciones(1); 
    };

    return {
        loading,
        secciones,
        paginationInfo,
        filters,
        setFilters,
        alert,
        setAlert,
        statusModal,
        setStatusModal,
        deleteModal,
        setDeleteModal,
        fetchSecciones,
        handleConfirmToggle,
        handleConfirmDelete,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    };
};