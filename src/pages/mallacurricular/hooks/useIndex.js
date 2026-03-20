import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from 'context/AuthContext';
import { index, destroy } from 'services/mallaCurricularService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const { role, loading: authLoading } = useAuth();
    
    const isAlumno = role === 'alumno';
    const isDocente = role === 'docente';

    const [loading, setLoading] = useState(true);
    const [mallas, setMallas] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '', grado_id: '', curso_id: '' });
    const filtersRef = useRef(filters);
    
    const [alert, setAlert] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    const fetchMalla = useCallback(async (page = 1) => {
        if (authLoading) return; 

        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);

            setMallas(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
            });

        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar la malla curricular'));
        } finally {
            setLoading(false);
        }
    }, [authLoading]);

    useEffect(() => { 
        if(!authLoading) fetchMalla(1); 
    }, [fetchMalla, authLoading]);

    useEffect(() => {
        if (isAlumno) return;

        if (filters.grado_id !== filtersRef.current.grado_id || filters.curso_id !== filtersRef.current.curso_id) {
            filtersRef.current = { ...filtersRef.current, grado_id: filters.grado_id, curso_id: filters.curso_id };
            fetchMalla(1); 
        }
    }, [filters, fetchMalla, isAlumno]);

    const handleConfirmDelete = async () => {
        setShowConfirm(false); 
        setLoading(true);
        try { 
            await destroy(idToDelete); 
            setAlert({ type: 'success', message: 'Eliminado.' }); 
            fetchMalla(paginationInfo.currentPage); 
        } catch (err) { 
            setAlert(handleApiError(err, 'Error eliminar')); 
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
        fetchMalla(1);
    };

    const handleFilterClear = () => {
        const reset = {search:'', grado_id: '', curso_id: ''};
        setFilters(reset); 
        filtersRef.current = reset; 
        fetchMalla(1);
    };

    return {
        isAlumno,
        isDocente,
        loading,
        mallas,
        paginationInfo,
        filters,
        setFilters,
        alert,
        setAlert,
        showConfirm,
        setShowConfirm,
        setIdToDelete,
        fetchMalla,
        handleConfirmDelete,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    };
};