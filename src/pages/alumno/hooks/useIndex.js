import { useState, useEffect, useCallback, useRef } from 'react';
import { index, show, toggleStatus } from 'services/alumnoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useIndex = () => {
  const [loading, setLoading] = useState(true);
  const [alumnos, setAlumnos] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
  
  const [filters, setFilters] = useState({ search: '', sexo: '', estado: '' });
  const filtersRef = useRef(filters);
  const [alert, setAlert] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [idToToggle, setIdToToggle] = useState(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const fetchAlumnos = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await index(page, filtersRef.current);
      setAlumnos(response.data || []);
      setPaginationInfo({
        currentPage: response.current_page,
        totalPages: response.last_page,
      });
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar el listado de alumnos'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchAlumnos(1); 
  }, [fetchAlumnos]);

  const handleFilterChange = (name, val) => {
    setFilters(prev => ({ ...prev, [name]: val }));
  };

  const handleFilterSubmit = () => {
    filtersRef.current = filters;
    fetchAlumnos(1);
  };

  const handleClearFilters = () => {
    const cleanFilters = { search: '', sexo: '', estado: '' };
    setFilters(cleanFilters);
    filtersRef.current = cleanFilters;
    fetchAlumnos(1);
  };

  const handleAskToggle = useCallback((id) => {
    setIdToToggle(id);
    setShowConfirm(true);
  }, []);

  const handleConfirmToggle = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await toggleStatus(idToToggle);
      setAlert({ type: 'success', message: 'Estado del alumno actualizado correctamente.' });
      await fetchAlumnos(paginationInfo.currentPage);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cambiar el estado'));
    } finally {
      setLoading(false);
      setIdToToggle(null);
    }
  };

  const handleCancelToggle = () => {
    setShowConfirm(false);
    setIdToToggle(null);
  };

  const handleView = useCallback(async (id) => {
    setIsViewOpen(true);
    setViewLoading(true);
    setViewData(null);
    try {
      const response = await show(id);
      setViewData(response.data || response);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al cargar detalles del alumno'));
      setIsViewOpen(false);
    } finally {
      setViewLoading(false);
    }
  }, []);

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewData(null);
  };

  return {
    loading,
    alumnos,
    paginationInfo,
    filters,
    alert,
    showConfirm,
    isViewOpen,
    viewData,
    viewLoading,
    setAlert,
    fetchAlumnos,
    handleFilterChange,
    handleFilterSubmit,
    handleClearFilters,
    handleAskToggle,
    handleConfirmToggle,
    handleCancelToggle,
    handleView,
    handleCloseView
  };
};