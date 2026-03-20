import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show, toggleStatus } from 'services/empleadoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [empleados, setEmpleados] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    const [filters, setFilters] = useState({ search: '', rol_id: '', rolNombre: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);

    // Estados para el Modal de Vista
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    // Estados para el Modal de Confirmación
    const [showConfirm, setShowConfirm] = useState(false);
    const [idToToggle, setIdToToggle] = useState(null);

    const fetchEmpleados = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setEmpleados(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los empleados'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchEmpleados(1); 
    }, [fetchEmpleados]);

    useEffect(() => {
        if (filters.rol_id !== filtersRef.current.rol_id) {
            filtersRef.current = { ...filtersRef.current, rol_id: filters.rol_id };
            fetchEmpleados(1); 
        }
    }, [filters.rol_id, fetchEmpleados]);

    const handleView = async (id) => {
        setIsViewOpen(true);
        setViewLoading(true);
        setViewData(null);
        try {
            const response = await show(id);
            setViewData(response.data || response);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar detalles'));
            setIsViewOpen(false);
        } finally {
            setViewLoading(false);
        }
    };

    const handleAskToggle = (id) => {
        setIdToToggle(id);
        setShowConfirm(true);
    };

    const handleConfirmToggle = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            await toggleStatus(idToToggle);
            setAlert({ type: 'success', message: 'Acceso del empleado actualizado correctamente.' });
            await fetchEmpleados(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar el estado'));
        } finally {
            setLoading(false);
            setIdToToggle(null);
        }
    };

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchEmpleados(1);
    };

    const handleFilterClear = () => {
        const reset = {search:'', rol_id: '', rolNombre: '', estado: ''}; 
        setFilters(reset); 
        filtersRef.current = reset; 
        fetchEmpleados(1);
    };

    return {
        loading,
        empleados,
        paginationInfo,
        filters,
        setFilters,
        alert,
        setAlert,
        isViewOpen,
        setIsViewOpen,
        viewData,
        viewLoading,
        showConfirm,
        setShowConfirm,
        setIdToToggle,
        fetchEmpleados,
        handleView,
        handleAskToggle,
        handleConfirmToggle,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    };
};