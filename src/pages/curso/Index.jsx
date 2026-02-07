import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { index } from 'services/cursoService';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { BookOpenIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
  
  const [filters, setFilters] = useState({ search: '' });
  const filtersRef = useRef(filters);
  const [alert, setAlert] = useState(null);

  const fetchCursos = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await index(page, filtersRef.current);
      setCursos(response.data || []);
      setPaginationInfo({
        currentPage: response.current_page,
        totalPages: response.last_page,
      });
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar los cursos'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCursos(1); }, [fetchCursos]);

  const filterConfig = useMemo(() => [
    { name: 'search', type: 'text', label: 'Buscar Curso', placeholder: 'Nombre...', colSpan: 'md:col-span-12' },
  ], []);

  const columns = useMemo(() => [
    {
      header: 'Nombre del Curso',
      render: (row) => (
        <div className="flex items-center gap-3">
          <BookOpenIcon className="w-8 h-8 text-black p-1.5 bg-slate-100 rounded-lg" />
          <span className="font-black text-slate-700 uppercase">{row.nombre}</span>
        </div>
      )
    },
    {
      header: 'Fecha Registro',
      accessor: 'created_at',
      render: (row) => <span className="text-sm text-slate-500 font-medium">{row.created_at}</span>
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Link to={`/curso/editar/${row.id}`} className="text-black hover:scale-110 transition-transform" title="Editar">
            <PencilSquareIcon className="w-5 h-5" />
          </Link>
        </div>
      )
    }
  ], []);

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Catálogo de Cursos" 
        icon={BookOpenIcon} 
        buttonText="+ Nuevo Curso" 
        buttonLink="/curso/agregar" 
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <Table
        columns={columns}
        data={cursos}
        loading={loading}
        filterConfig={filterConfig}
        filters={filters}
        onFilterChange={(name, val) => setFilters(prev => ({...prev, [name]: val}))}
        onFilterSubmit={() => { filtersRef.current = filters; fetchCursos(1); }}
        onFilterClear={() => { const c = {search:''}; setFilters(c); filtersRef.current = c; fetchCursos(1); }}
        pagination={{
          currentPage: paginationInfo.currentPage,
          totalPages: paginationInfo.totalPages,
          onPageChange: fetchCursos
        }}
      />
    </div>
  );
};

export default Index;