import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { index, destroy } from 'services/gradoService'; 
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { 
    AcademicCapIcon, 
    PencilSquareIcon, 
    BuildingLibraryIcon, 
    TrashIcon, 
    LockClosedIcon 
} from '@heroicons/react/24/outline';
import NivelSearchSelect from 'components/Shared/Comboboxes/NivelSearchSelect';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [grados, setGrados] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
  
  const [filters, setFilters] = useState({ search: '', nivel_id: '' });
  const filtersRef = useRef(filters);
  const [alert, setAlert] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, nombre: '' });

  const fetchGrados = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await index(page, filtersRef.current);
      setGrados(response.data || []);
      setPaginationInfo({
        currentPage: response.current_page,
        last_page: response.last_page,
        totalPages: response.last_page,
      });
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar los grados'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGrados(1); }, [fetchGrados]);

  useEffect(() => {
    if (filters.nivel_id !== filtersRef.current.nivel_id) {
        filtersRef.current = { ...filtersRef.current, nivel_id: filters.nivel_id };
        fetchGrados(1); 
    }
  }, [filters.nivel_id, fetchGrados]);

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
        await destroy(deleteModal.id);
        setAlert({ type: 'success', message: 'Grado eliminado correctamente.' });
        setDeleteModal({ isOpen: false, id: null, nombre: '' });
        await fetchGrados(paginationInfo.currentPage);
    } catch (err) {
        setAlert(handleApiError(err, 'Error al eliminar el grado'));
        setDeleteModal({ isOpen: false, id: null, nombre: '' });
    } finally {
        setLoading(false);
    }
  };

  const filterConfig = useMemo(() => [
    { 
      name: 'search', 
      type: 'text', 
      label: 'Buscar por Nombre', 
      placeholder: 'Ej: 1ero, 5to...', 
      colSpan: 'col-span-12 md:col-span-5' 
    },
    {
      name: 'nivel_id',
      type: 'custom',
      label: '',
      colSpan: 'col-span-12 md:col-span-5',
      render: () => (
           <NivelSearchSelect 
              form={filters} 
              setForm={setFilters} 
              isFilter={true}
           />
      )
    }
  ], [filters]);

  const columns = useMemo(() => [
    {
      header: 'Grado',
      render: (row) => (
        <div className="flex items-center gap-3">
          <AcademicCapIcon className="w-8 h-8 text-black p-1.5 bg-slate-100 rounded-lg" />
          <div className="flex flex-col">
            <span className="font-black text-slate-700 uppercase">{row.nombre}</span>
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                <BuildingLibraryIcon className="w-3 h-3"/> {row.nivel_nombre}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Nivel Educativo',
      render: (row) => (
        <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-200 uppercase">
            {row.nivel_nombre}
        </span>
      )
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Link to={`/grado/editar/${row.id}`} className="text-slate-600 hover:text-blue-600 hover:scale-110 transition-transform" title="Editar">
            <PencilSquareIcon className="w-5 h-5" />
          </Link>

          {/* LÓGICA DEL CANDADO VS BASURERO */}
          {row.tiene_dependencias ? (
              <div className="text-gray-300 cursor-not-allowed" title="No se puede eliminar: Tiene Secciones o Alumnos asociados.">
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
        title="Gestión de Grados" 
        icon={AcademicCapIcon} 
        buttonText="+ Nuevo Grado" 
        buttonLink="/grado/agregar" 
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <Table
        columns={columns}
        data={grados}
        loading={loading}
        filterConfig={filterConfig} 
        filters={filters}
        onFilterChange={(name, val) => setFilters(prev => ({...prev, [name]: val}))}
        onFilterSubmit={() => { filtersRef.current = filters; fetchGrados(1); }}
        onFilterClear={() => { 
            const c = {search:'', nivel_id: ''}; 
            setFilters(c); 
            filtersRef.current = c; 
            fetchGrados(1); 
        }}
        pagination={{
          currentPage: paginationInfo.currentPage,
          totalPages: paginationInfo.totalPages,
          onPageChange: fetchGrados
        }}
      />

      {/* Modal de Confirmación */}
      {deleteModal.isOpen && (
        <ConfirmModal
            title="¿Eliminar Grado?"
            message={`Estás a punto de eliminar el grado "${deleteModal.nombre}". Esta acción es irreversible.`}
            confirmText="Sí, eliminar"
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteModal({ isOpen: false, id: null, nombre: '' })}
        />
      )}
    </div>
  );
};

export default Index;