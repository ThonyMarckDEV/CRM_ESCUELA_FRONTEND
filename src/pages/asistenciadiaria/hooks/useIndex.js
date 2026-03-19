import { useState, useEffect, useCallback, useRef } from 'react';
import { index, destroy } from 'services/asistenciaDiariaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading]       = useState(true);
    const [asistencias, setAsistencias] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    // ✅ alumno_id añadido para el combobox de alumno
    const [filters, setFilters] = useState({ alumno_id: '', alumnoNombre: '', fecha: '', estado: '' });
    const filtersRef = useRef(filters);

    const [alert, setAlert]           = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const fetchAsistencias = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setAsistencias(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages:  response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar las asistencias'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAsistencias(1); }, [fetchAsistencias]);

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({ ...prev, [name]: val }));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters;
        fetchAsistencias(1);
    };

    // ✅ Limpieza completa incluyendo alumno_id y alumnoNombre
    const handleClearFilters = () => {
        const cleanFilters = { alumno_id: '', alumnoNombre: '', fecha: '', estado: '' };
        setFilters(cleanFilters);
        filtersRef.current = cleanFilters;
        fetchAsistencias(1);
    };

    const handleDeleteConfirm = async () => {
        try {
            await destroy(deleteModal.id);
            setAlert({ type: 'success', message: 'Asistencia eliminada correctamente.' });
            fetchAsistencias(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar la asistencia.'));
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    return {
        loading,
        asistencias,
        paginationInfo,
        filters,
        setFilters,      // ✅ Expuesto para que el combobox de alumno pueda actualizarlo
        alert,
        deleteModal,
        setAlert,
        setDeleteModal,
        fetchAsistencias,
        handleFilterChange,
        handleFilterSubmit,
        handleClearFilters,
        handleDeleteConfirm
    };
};