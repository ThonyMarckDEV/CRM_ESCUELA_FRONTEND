import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from 'context/AuthContext';
import { index, destroy } from 'services/horarioService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const { user, role, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [horarios, setHorarios] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    const [filters, setFilters] = useState({ 
        anio_academico_id: '', docente_id: '', grado_id: '', seccion_id: '', seccionNombre: '' , search: ''
    });
    
    const filtersRef = useRef(filters);
    const [showHorarioModal, setShowHorarioModal] = useState(false);
    const [alert, setAlert] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, descripcion: '' });

    const fetchHorarios = useCallback(async (page = 1) => {
        if (authLoading) return;
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setHorarios(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar horarios'));
        } finally {
            setLoading(false);
        }
    }, [authLoading]);

    useEffect(() => {
        if (!authLoading) fetchHorarios(1);
    }, [fetchHorarios, authLoading]);

    useEffect(() => {
        if (authLoading) return;
        const hasChanged = 
            filters.anio_academico_id !== filtersRef.current.anio_academico_id || 
            filters.docente_id !== filtersRef.current.docente_id ||
            filters.grado_id !== filtersRef.current.grado_id ||
            filters.seccion_id !== filtersRef.current.seccion_id;

        if (hasChanged) {
            filtersRef.current = { ...filters };
            fetchHorarios(1); 
        }
    }, [filters, fetchHorarios, authLoading]);

    const handleConfirmDelete = async () => {
        try {
            await destroy(deleteModal.id);
            setAlert({ type: 'success', message: 'Horario eliminado correctamente.' });
            fetchHorarios(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar'));
        } finally {
            setDeleteModal({ isOpen: false, id: null, descripcion: '' });
        }
    };

    const showViewScheduleButton = useCallback(() => {
        if (role === 'alumno' || role === 'docente') return true;
        if (filters.seccion_id) return true;
        return false;
    }, [role, filters.seccion_id]);

    const getModalSeccionId = () => {
        return role === 'alumno' ? user.alumno_data?.seccion_id : (filters.seccion_id || null);
    };

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({...prev, [name]: val}));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters; 
        fetchHorarios(1);
    };

    const handleFilterClear = () => {
        const c = { anio_academico_id: '', grado_id: '', seccion_id: '', seccionNombre: '', docente_id: '' , search: '' }; 
        setFilters(c); 
        filtersRef.current = c; 
        fetchHorarios(1); 
    };

    return {
        user,
        role,
        loading,
        horarios,
        paginationInfo,
        filters,
        setFilters,
        showHorarioModal,
        setShowHorarioModal,
        alert,
        setAlert,
        deleteModal,
        setDeleteModal,
        fetchHorarios,
        handleConfirmDelete,
        showViewScheduleButton,
        getModalSeccionId,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    };
};