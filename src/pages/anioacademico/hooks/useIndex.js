import { useState, useEffect, useCallback } from 'react';
import { index, destroy, toggleStatus } from 'services/anioAcademicoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [anios, setAnios] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [filters] = useState({ search: '' });
    const [alert, setAlert] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, nombre: '' });
    const [statusModal, setStatusModal] = useState({ isOpen: false, id: null, estadoActual: null });

    const fetchAnios = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filters);
            setAnios(response.data || []);
            setPagination({ currentPage: response.current_page, totalPages: response.last_page });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar los años'));
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { 
        fetchAnios(1); 
    }, [fetchAnios]);

    const handleStatusChange = async () => {
        try {
            await toggleStatus(statusModal.id);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            fetchAnios(pagination.currentPage);
        } catch (err) {
            setAlert(handleApiError(err,'Error al cambiar el estado.'));
        }
        setStatusModal({ isOpen: false });
    };

    const handleDelete = async () => {
        try {
            await destroy(deleteModal.id);
            setAlert({ type: 'success', message: 'Año eliminado.' });
            fetchAnios(pagination.currentPage);
        } catch(e) { 
            setAlert({ type: 'error', message: 'No se pudo eliminar.' }); 
        }
        setDeleteModal({ isOpen: false });
    };

    return {
        loading,
        anios,
        pagination,
        alert,
        setAlert,
        deleteModal,
        setDeleteModal,
        statusModal,
        setStatusModal,
        fetchAnios,
        handleStatusChange,
        handleDelete
    };
};