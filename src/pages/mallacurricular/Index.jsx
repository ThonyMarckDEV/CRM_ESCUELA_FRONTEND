import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { index, destroy } from 'services/mallaCurricularService';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

import GradoSearchSelect from 'components/Shared/Comboboxes/GradoSearchSelect';
import CursoSearchSelect from 'components/Shared/Comboboxes/CursoSearchSelect';

import { 
    BookOpenIcon, 
    PencilSquareIcon, 
    ClockIcon, 
    AcademicCapIcon,
    LockClosedIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [mallas, setMallas] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
  
  const [filters, setFilters] = useState({ search: '', grado_id: '', gradoNombre: '', curso_id: '', cursoNombre: '' });
  const filtersRef = useRef(filters);
  const [alert, setAlert] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const fetchMalla = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await index(page, filtersRef.current);
      setMallas(response.data || []);
      setPaginationInfo({
        currentPage: response.current_page,
        last_page: response.last_page,
        totalPages: response.last_page,
      });
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar la malla curricular'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMalla(1); }, [fetchMalla]);

  // Recargar si cambian los filtros de select (Grado o Curso)
  useEffect(() => {
    if (
        filters.grado_id !== filtersRef.current.grado_id || 
        filters.curso_id !== filtersRef.current.curso_id
    ) {
        filtersRef.current = { 
            ...filtersRef.current, 
            grado_id: filters.grado_id,
            curso_id: filters.curso_id 
        };
        fetchMalla(1); 
    }
  }, [filters.grado_id, filters.curso_id, fetchMalla]);

  // Lógica de eliminación
  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
        await destroy(idToDelete);
        setAlert({ type: 'success', message: 'Curso eliminado de la malla correctamente.' });
        fetchMalla(paginationInfo.currentPage);
    } catch (err) {
        setAlert(handleApiError(err, 'Error al eliminar el registro'));
    } finally {
        setLoading(false);
        setIdToDelete(null);
    }
  };

  const filterConfig = useMemo(() => [
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
        name: 'curso_id',
        type: 'custom',
        label: '',
        colSpan: 'col-span-12 md:col-span-4',
        render: () => (
             <CursoSearchSelect 
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
          <AcademicCapIcon className="w-8 h-8 text-slate-700 p-1.5 bg-slate-100 rounded-lg" />
          <div className="flex flex-col">
            <span className="font-black text-slate-700 uppercase">{row.grado_nombre}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{row.nivel_nombre}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Curso',
      render: (row) => (
        <div className="flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4 text-blue-500"/>
            <span className="font-bold text-slate-600">{row.curso_nombre}</span>
        </div>
      )
    },
    {
        header: 'Horas Semanales',
        render: (row) => (
          <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 flex items-center gap-1 w-fit">
              <ClockIcon className="w-3 h-3"/> {row.horas_semanales} hrs
          </span>
        )
      },
      {
        header: 'Acciones',
        render: (row) => (
          <div className="flex items-center gap-3">
            <Link to={`/malla-curricular/editar/${row.id}`} className="text-black hover:scale-110 transition-transform" title="Editar">
              <PencilSquareIcon className="w-5 h-5" />
            </Link>
            
            {/* LÓGICA DEL CANDADO */}
            {row.tiene_data ? (
                <div className="text-gray-300 cursor-not-allowed" title="No se puede eliminar: Curso con notas o carga docente.">
                    <LockClosedIcon className="w-5 h-5" />
                </div>
            ) : (
                <button 
                  onClick={() => handleDeleteClick(row.id)} 
                  className="text-red-500 hover:scale-110 transition-transform" 
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
        title="Malla Curricular" 
        icon={BookOpenIcon} 
        buttonText="+ Asignar Curso" 
        buttonLink="/malla-curricular/agregar" 
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <Table
        columns={columns}
        data={mallas}
        loading={loading}
        filterConfig={filterConfig} 
        filters={filters}
        onFilterChange={(name, val) => setFilters(prev => ({...prev, [name]: val}))}
        onFilterSubmit={() => { filtersRef.current = filters; fetchMalla(1); }}
        onFilterClear={() => { 
            const c = {search:'', grado_id: '', gradoNombre: '', curso_id: '', cursoNombre: ''}; 
            setFilters(c); 
            filtersRef.current = c; 
            fetchMalla(1); 
        }}
        pagination={{
          currentPage: paginationInfo.currentPage,
          totalPages: paginationInfo.totalPages,
          onPageChange: fetchMalla
        }}
      />

      {showConfirm && (
        <ConfirmModal 
            message="¿Estás seguro de eliminar este curso de la malla curricular?"
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default Index;