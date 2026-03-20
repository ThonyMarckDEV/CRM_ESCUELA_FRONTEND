import { useState, useEffect, useCallback, useRef } from 'react';
import { index, toggleStatus, destroy } from 'services/periodoService'; 
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [periodos, setPeriodos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '', estado: '' });
    const filtersRef = useRef(filters);

    const [showStatusConfirm, setShowStatusConfirm] = useState(false);
    const [idToToggle, setIdToToggle] = useState(null);
    
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [nameToDelete, setNameToDelete] = useState('');

    const [alert, setAlert] = useState(null);

    const fetchPeriodos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setPeriodos(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los periodos'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchPeriodos(1); 
    }, [fetchPeriodos]);

    const handleConfirmToggle = async () => {
        setShowStatusConfirm(false);
        setLoading(true);
        try {
            await toggleStatus(idToToggle);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            await fetchPeriodos(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar el estado'));
        } finally {
            setLoading(false);
            setIdToToggle(null);
        }
    };

    const handleConfirmDelete = async () => {
        setShowDeleteConfirm(false);
        setLoading(true);
        try {
            await destroy(idToDelete);
            setAlert({ type: 'success', message: 'Periodo eliminado.' });
            await fetchPeriodos(1); 
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar'));
        } finally {
            setLoading(false);
            setIdToDelete(null);
        }
    };

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchPeriodos(1);
    };

    const handleFilterClear = () => {
        const c = {search:'', estado:''}; 
        setFilters(c); 
        filtersRef.current = c; 
        fetchPeriodos(1);
    };

    return {
        loading,
        periodos,
        paginationInfo,
        filters,
        setFilters,
        alert,
        setAlert,
        showStatusConfirm,
        setShowStatusConfirm,
        setIdToToggle,
        showDeleteConfirm,
        setShowDeleteConfirm,
        setIdToDelete,
        nameToDelete,
        setNameToDelete,
        fetchPeriodos,
        handleConfirmToggle,
        handleConfirmDelete,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    };
};