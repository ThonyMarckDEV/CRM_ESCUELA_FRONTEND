import { useState, useEffect, useCallback, useRef } from 'react';
import { index, destroy } from 'services/gradoService'; 
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [grados, setGrados] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '', nivel_id: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, nombre: '' });

    const fetchGrados = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setGrados(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los grados'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchGrados(1); 
    }, [fetchGrados]);

    useEffect(() => {
        if (filters.nivel_id !== filtersRef.current.nivel_id) {
            filtersRef.current = { ...filtersRef.current, nivel_id: filters.nivel_id };
            fetchGrados(1); 
        }
    }, [filters.nivel_id, fetchGrados]);

    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
            await destroy(deleteModal.id);
            setAlert({ type: 'success', message: 'Grado eliminado correctamente.' });
            setDeleteModal({ isOpen: false, id: null, nombre: '' });
            await fetchGrados(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar el grado'));
            setDeleteModal({ isOpen: false, id: null, nombre: '' });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchGrados(1);
    };

    const handleFilterClear = () => {
        const resetFilters = { search:'', nivel_id: '' }; 
        setFilters(resetFilters); 
        filtersRef.current = resetFilters; 
        fetchGrados(1); 
    };

    return {
        loading,
        grados,
        paginationInfo,
        filters,
        setFilters,
        alert,
        setAlert,
        deleteModal,
        setDeleteModal,
        fetchGrados,
        handleConfirmDelete,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    };
};