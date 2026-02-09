import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { index, destroy } from 'services/mallaCurricularService';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

import GradoSearchSelect from 'components/Shared/Comboboxes/GradoSearchSelect';
import CursoSearchSelect from 'components/Shared/Comboboxes/CursoSearchSelect';

import { 
    BookOpenIcon, PencilSquareIcon, ClockIcon, AcademicCapIcon, 
    LockClosedIcon, TrashIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Index = () => {
  const {role, loading: authLoading } = useAuth();
  
  const isAlumno = role === 'alumno';
  const isDocente = role === 'docente';

  const [loading, setLoading] = useState(true);
  const [mallas, setMallas] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
  
  const [filters, setFilters] = useState({ search: '', grado_id: '', curso_id: '' });
  const filtersRef = useRef(filters);
  
  const [alert, setAlert] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const fetchMalla = useCallback(async (page = 1) => {
    if (authLoading) return; 

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
  }, [authLoading]);

  useEffect(() => { 
      if(!authLoading) fetchMalla(1); 
  }, [fetchMalla, authLoading]);

  useEffect(() => {

    if (isAlumno) return;

    if (filters.grado_id !== filtersRef.current.grado_id || filters.curso_id !== filtersRef.current.curso_id) {
        filtersRef.current = { ...filtersRef.current, grado_id: filters.grado_id, curso_id: filters.curso_id };
        fetchMalla(1); 
    }
  }, [filters, fetchMalla, isAlumno]);

  
  // CONFIGURACIÓN DE FILTROS (Solo Admin/Docente)
  const filterConfig = useMemo(() => {
      if (isAlumno) return []; // Alumno no filtra

      return [
        {
          name: 'grado_id', type: 'custom', colSpan: 'col-span-12 md:col-span-4',
          render: () => <GradoSearchSelect form={filters} setForm={setFilters} isFilter={true}/>
        },
        {
            name: 'curso_id', type: 'custom', colSpan: 'col-span-12 md:col-span-4',
            render: () => <CursoSearchSelect form={filters} setForm={setFilters} isFilter={true}/>
        }
      ];
  }, [filters, isAlumno]);

  // COLUMNAS
  const columns = useMemo(() => {
    // --- VISTA ALUMNO ---
    if (isAlumno) {
        return [
            {
                header: 'Curso',
                render: (row) => (
                  <div className="flex items-center gap-3 py-2">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <BookOpenIcon className="w-6 h-6"/>
                      </div>
                      <span className="font-bold text-slate-700 text-sm md:text-base">{row.curso_nombre}</span>
                  </div>
                )
            },
            {
                header: 'Carga Horaria',
                render: (row) => (
                  <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-slate-400"/>
                      <span className="font-black text-slate-600">{row.horas_semanales} hrs/sem</span>
                  </div>
                )
            }
        ];
    }

    // --- VISTA ADMIN / DOCENTE ---
    const cols = [
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
            header: 'Horas',
            render: (row) => (
              <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                  {row.horas_semanales} hrs
              </span>
            )
        }
    ];

    // Acciones solo para Admin (Docente usualmente solo ve, no edita malla)
    if (!isDocente && !isAlumno) {
        cols.push({
            header: 'Acciones',
            render: (row) => (
              <div className="flex items-center gap-3">
                <Link to={`/malla-curricular/editar/${row.id}`} className="text-black hover:scale-110 transition-transform">
                  <PencilSquareIcon className="w-5 h-5" />
                </Link>
                {row.tiene_data ? (
                    <LockClosedIcon className="w-5 h-5 text-gray-300 cursor-not-allowed" title="No se puede eliminar" />
                ) : (
                    <button onClick={() => { setIdToDelete(row.id); setShowConfirm(true); }} className="text-red-500 hover:scale-110">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                )}
              </div>
            )
        });
    }
    return cols;
  }, [isAlumno, isDocente]);

  const handleConfirmDelete = async () => {
    setShowConfirm(false); setLoading(true);
    try { await destroy(idToDelete); setAlert({ type: 'success', message: 'Eliminado.' }); fetchMalla(paginationInfo.currentPage); }
    catch (err) { setAlert(handleApiError(err, 'Error eliminar')); } finally { setLoading(false); setIdToDelete(null); }
  };

  if (isAlumno && !loading && mallas.length === 0) {
      return (
        <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh] text-center animate-in fade-in">
            <div className="bg-orange-50 p-6 rounded-full mb-4">
                <ExclamationTriangleIcon className="w-16 h-16 text-orange-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">No tienes cursos asignados</h2>
            <p className="text-slate-500 max-w-md">
                No se encontró una matrícula activa o cursos para tu grado actual.
            </p>
        </div>
      );
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title={isAlumno ? "Mis Cursos" : "Gestión de Malla Curricular"} 
        icon={BookOpenIcon} 
        buttonText={(!isAlumno && !isDocente) ? "+ Asignar Curso" : null} 
        buttonLink="/malla-curricular/agregar" 
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <Table
        columns={columns}
        data={mallas || []}
        loading={loading}
        filterConfig={filterConfig} 
        filters={isAlumno ? {} : filters}
        
        onFilterChange={(name, val) => setFilters(prev => ({...prev, [name]: val}))}
        onFilterSubmit={() => { filtersRef.current = filters; fetchMalla(1); }}
        onFilterClear={() => { setFilters({search:'', grado_id: '', curso_id: ''}); filtersRef.current = {}; fetchMalla(1); }}
        
        pagination={{
          currentPage: paginationInfo.currentPage,
          totalPages: paginationInfo.totalPages,
          onPageChange: fetchMalla
        }}
      />

      {showConfirm && (
        <ConfirmModal 
            message="¿Eliminar curso de la malla?"
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default Index;