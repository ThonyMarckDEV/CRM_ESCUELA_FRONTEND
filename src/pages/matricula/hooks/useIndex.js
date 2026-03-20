import { useState, useEffect, useCallback, useRef } from 'react';
import { index, destroy } from 'services/matriculaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [matriculas, setMatriculas] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '', anio_academico_id: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);
    
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, nombre: '' });

    const fetchMatriculas = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setMatriculas(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar matrículas'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchMatriculas(1); 
    }, [fetchMatriculas]);

    useEffect(() => {
        if (filters.anio_academico_id !== filtersRef.current.anio_academico_id) {
            filtersRef.current = { ...filtersRef.current, anio_academico_id: filters.anio_academico_id };
            fetchMatriculas(1); 
        }
    }, [filters.anio_academico_id, fetchMatriculas]);

    const handleConfirmDelete = async () => {
        try {
            await destroy(deleteModal.id);
            setAlert({ type: 'success', message: 'Matrícula eliminada.' });
            fetchMatriculas(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar'));
        } finally {
            setDeleteModal({ isOpen: false, id: null, nombre: '' });
        }
    };

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchMatriculas(1);
    };

    const handleFilterClear = () => {
        const reset = {search:'', anio_academico_id: '', estado: ''}; 
        setFilters(reset); 
        filtersRef.current = reset; 
        fetchMatriculas(1); 
    };

    return {
        loading,
        matriculas,
        paginationInfo,
        filters,
        setFilters,
        alert,
        setAlert,
        deleteModal,
        setDeleteModal,
        fetchMatriculas,
        handleConfirmDelete,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    };
};