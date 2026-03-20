import { useState, useEffect, useCallback, useRef } from 'react';
import { index } from 'services/nivelService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [niveles, setNiveles] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    const fetchNiveles = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setNiveles(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los niveles'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchNiveles(1); 
    }, [fetchNiveles]);

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchNiveles(1);
    };

    const handleFilterClear = () => {
        const c = {search:''}; 
        setFilters(c); 
        filtersRef.current = c; 
        fetchNiveles(1);
    };

    return {
        loading,
        niveles,
        paginationInfo,
        filters,
        alert,
        setAlert,
        fetchNiveles,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    };
};