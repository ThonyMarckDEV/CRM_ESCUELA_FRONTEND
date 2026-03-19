import { useState, useEffect, useCallback, useRef } from 'react';
import { index, destroy } from 'services/asistenciaDiariaService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import * as XLSX from 'xlsx'; // Se movió aquí

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [asistencias, setAsistencias] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    const [filters, setFilters] = useState({ alumno_id: '', alumnoNombre: '', fecha: '', estado: '' });
    const filtersRef = useRef(filters);

    const [alert, setAlert] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const fetchAsistencias = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setAsistencias(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar las asistencias'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAsistencias(1); }, [fetchAsistencias]);

    // --- LÓGICA DE EXCEL MOVIDA AL HOOK ---
    const exportToExcel = useCallback(() => {
        if (asistencias.length === 0) {
            setAlert({ type: 'error', message: 'No hay datos cargados para exportar.' });
            return;
        }

        const dataToExport = asistencias.map(item => ({
            'Fecha': item.fecha,
            'Hora': item.hora_ingreso,
            'Alumno': item.alumno_nombre,
            'DNI': item.alumno_dni,
            'Código': item.alumno_codigo,
            'Grado y Sección': item.grado_seccion,
            'Estado': item.estado_texto,
            'Observación': item.observacion || '-'
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencias');

        XLSX.writeFile(workbook, `Reporte_Asistencias_${new Date().toISOString().split('T')[0]}.xlsx`);
    }, [asistencias]);

    const handleFilterChange = (name, val) => {
        setFilters(prev => ({ ...prev, [name]: val }));
    };

    const handleFilterSubmit = () => {
        filtersRef.current = filters;
        fetchAsistencias(1);
    };

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
        setFilters,
        alert,
        deleteModal,
        setAlert,
        setDeleteModal,
        fetchAsistencias,
        handleFilterChange,
        handleFilterSubmit,
        handleClearFilters,
        handleDeleteConfirm,
        exportToExcel // ✅ Expuesto para la vista
    };
};