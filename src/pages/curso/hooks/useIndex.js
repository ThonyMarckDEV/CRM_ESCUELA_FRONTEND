import { useState, useEffect, useCallback, useRef } from 'react';
import { index } from 'services/cursoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [cursos, setCursos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const fetchCursos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setCursos(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los cursos'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchCursos(1); 
    }, [fetchCursos]);

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchCursos(1);
    };

    const handleFilterClear = () => {
        const clearedFilters = { search: '' };
        setFilters(clearedFilters);
        filtersRef.current = clearedFilters;
        fetchCursos(1);
    };

    return {
        loading,
        cursos,
        paginationInfo,
        filters,
        alert,
        setAlert,
        fetchCursos,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    };
};