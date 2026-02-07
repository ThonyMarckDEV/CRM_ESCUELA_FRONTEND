import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { index, toggleStatus, destroy } from 'services/seccionService';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import GradoSearchSelect from 'components/Shared/Comboboxes/GradoSearchSelect';

import { 
    Squares2X2Icon, 
    PencilSquareIcon, 
    AcademicCapIcon,
    UsersIcon,
    TrashIcon,     
    LockClosedIcon 
} from '@heroicons/react/24/outline';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [secciones, setSecciones] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
  
  const [filters, setFilters] = useState({ search: '', grado_id: '', gradoNombre: '', estado: '' });
  const filtersRef = useRef(filters);
  const [alert, setAlert] = useState(null);

  // Modales
  const [statusModal, setStatusModal] = useState({ isOpen: false, id: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, nombre: '' });

  const fetchSecciones = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await index(page, filtersRef.current);
      setSecciones(response.data || []);
      setPaginationInfo({
        currentPage: response.current_page,
        last_page: response.last_page,
        totalPages: response.last_page,
      });
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar las secciones'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSecciones(1); }, [fetchSecciones]);

  useEffect(() => {
    if (filters.grado_id !== filtersRef.current.grado_id) {
        filtersRef.current = { ...filtersRef.current, grado_id: filters.grado_id };
        fetchSecciones(1); 
    }
  }, [filters.grado_id, fetchSecciones]);


  const handleConfirmToggle = async () => {
    setStatusModal({ isOpen: false, id: null });
    setLoading(true);
    try {
      await toggleStatus(statusModal.id);
      setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
      await fetchSecciones(paginationInfo.currentPage);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cambiar estado'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteModal({ isOpen: false, id: null, nombre: '' });
    setLoading(true);
    try {
      await destroy(deleteModal.id);
      setAlert({ type: 'success', message: 'Sección eliminada correctamente.' });
      await fetchSecciones(paginationInfo.currentPage);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al eliminar sección'));
    } finally {
      setLoading(false);
    }
  };

  const filterConfig = useMemo(() => [
    { 
      name: 'search', 
      type: 'text', 
      label: 'Buscar Sección', 
      placeholder: 'Ej: A, B...', 
      colSpan: 'col-span-12 md:col-span-4' 
    },
    {
      name: 'grado_id',
      type: 'custom',
      label: '',
      colSpan: 'col-span-12 md:col-span-4',
      render: () => (
           <GradoSearchSelect 
              form={filters} 
              setForm={setFilters} 
              isFilter={true}
           />
      )
    },
    {
      name: 'estado', 
      type: 'select', 
      label: 'Estado', 
      colSpan: 'col-span-12 md:col-span-4',
      options: [
        { value: '', label: 'Todos' }, 
        { value: '1', label: 'Activos' }, 
        { value: '0', label: 'Inactivos' }
      ] 
    }
  ], [filters]);

  const columns = useMemo(() => [
    {
      header: 'Grado',
      render: (row) => (
        <div className="flex items-center gap-3">
          <AcademicCapIcon className="w-8 h-8 text-slate-700 p-1.5 bg-slate-100 rounded-lg" />
          <div className="flex flex-col">
            <span className="font-black text-slate-700 uppercase">{row.grado_nombre}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{row.nivel_nombre}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Sección',
      render: (row) => (
        <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-800 bg-slate-50 px-3 py-1 rounded border border-slate-200">
                {row.nombre}
            </span>
        </div>
      )
    },
    {
        header: 'Vacantes',
        render: (row) => (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 flex items-center gap-1 w-fit">
              <UsersIcon className="w-3 h-3"/> {row.vacantes_maximas}
          </span>
        )
    },
    {
      header: 'Estado',
      render: (row) => (
        <button 
          onClick={() => setStatusModal({ isOpen: true, id: row.id })}
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-transform shadow-sm
            ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
          title="Clic para cambiar estado"
        >
          {row.estado ? 'Activo' : 'Inactivo'}
        </button>
      )
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-3">
          {/* Editar siempre disponible (para cambiar nombre o vacantes) */}
          <Link to={`/seccion/editar/${row.id}`} className="text-slate-600 hover:text-blue-600 hover:scale-110 transition-transform" title="Editar">
            <PencilSquareIcon className="w-5 h-5" />
          </Link>

          {/* Eliminar condicional: Si tiene matriculas, mostramos candado */}
          {row.tiene_matriculas ? (
             <div className="text-gray-300 cursor-not-allowed" title="No se puede eliminar: Tiene alumnos matriculados">
                 <LockClosedIcon className="w-5 h-5" />
             </div>
          ) : (
             <button 
                onClick={() => setDeleteModal({ isOpen: true, id: row.id, nombre: row.nombre })}
                className="text-slate-600 hover:text-red-600 hover:scale-110 transition-transform" 
                title="Eliminar"
             >
                <TrashIcon className="w-5 h-5" />
             </button>
          )}
        </div>
      )
    }
  ], []);

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Gestión de Secciones" 
        icon={Squares2X2Icon} 
        buttonText="+ Nueva Sección" 
        buttonLink="/seccion/agregar" 
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <Table
        columns={columns}
        data={secciones}
        loading={loading}
        filterConfig={filterConfig} 
        filters={filters}
        onFilterChange={(name, val) => setFilters(prev => ({...prev, [name]: val}))}
        onFilterSubmit={() => { filtersRef.current = filters; fetchSecciones(1); }}
        onFilterClear={() => { 
            const c = {search:'', grado_id: '', gradoNombre: '', estado: ''}; 
            setFilters(c); 
            filtersRef.current = c; 
            fetchSecciones(1); 
        }}
        pagination={{
          currentPage: paginationInfo.currentPage,
          totalPages: paginationInfo.totalPages,
          onPageChange: fetchSecciones
        }}
      />

      {/* Modal de Cambio de Estado */}
      {statusModal.isOpen && (
        <ConfirmModal 
            message="¿Estás seguro de cambiar el estado? Esto afecta nuevas matrículas."
            confirmText="Sí, cambiar"
            onConfirm={handleConfirmToggle}
            onCancel={() => setStatusModal({ isOpen: false, id: null })}
        />
      )}

      {/* Modal de Eliminación */}
      {deleteModal.isOpen && (
        <ConfirmModal 
            title="¿Eliminar Sección?"
            message={`Estás a punto de eliminar la sección "${deleteModal.nombre}".`}
            confirmText="Sí, eliminar"
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteModal({ isOpen: false, id: null, nombre: '' })}
        />
      )}
    </div>
  );
};

export default Index;