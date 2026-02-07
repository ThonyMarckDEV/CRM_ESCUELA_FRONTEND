import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { index, destroy } from 'services/matriculaService';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import AnioAcademicoSearchSelect from 'components/Shared/Comboboxes/AnioAcademicoSearchSelect';
import { 
    IdentificationIcon, 
    AcademicCapIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    UserIcon
} from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@heroicons/react/24/solid';

const Index = () => {
    const [loading, setLoading] = useState(true);
    const [matriculas, setMatriculas] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [filters, setFilters] = useState({ search: '', anio_academico_id: '', estado: '' });
    const filtersRef = useRef(filters);
    const [alert, setAlert] = useState(null);
    
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, nombre: '' });

    const fetchMatriculas = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setMatriculas(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar matrículas'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMatriculas(1); }, [fetchMatriculas]);

    // Recargar si cambia el año (filtro común)
    useEffect(() => {
        if (filters.anio_academico_id !== filtersRef.current.anio_academico_id) {
            filtersRef.current = { ...filtersRef.current, anio_academico_id: filters.anio_academico_id };
            fetchMatriculas(1); 
        }
    }, [filters.anio_academico_id, fetchMatriculas]);

    const handleConfirmDelete = async () => {
        try {
            await destroy(deleteModal.id);
            setAlert({ type: 'success', message: 'Matrícula eliminada.' });
            fetchMatriculas(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar'));
        } finally {
            setDeleteModal({ isOpen: false, id: null, nombre: '' });
        }
    };

    const columns = useMemo(() => [
        {
            header: 'Estudiante',
            render: (row) => (
                <div className="flex items-start gap-3">
                    <div className="bg-slate-100 p-2 rounded-full">
                        <UserIcon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{row.alumno_nombre}</span>
                        <div className="flex gap-2 text-[10px] mt-0.5">
                            <span className="bg-blue-50 text-blue-600 px-1.5 rounded border border-blue-100">
                                COD: {row.alumno_codigo}
                            </span>
                            <span className="text-slate-400">
                                DNI: {row.alumno_dni}
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Información Académica',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1">
                        <AcademicCapIcon className="w-3 h-3"/> {row.grado_nombre} - "{row.seccion_nombre}"
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                        Año Académico: {row.anio_nombre}
                    </span>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => {
                const colors = {
                    0: 'bg-yellow-100 text-yellow-700 border-yellow-200', // Pendiente
                    1: 'bg-green-100 text-green-700 border-green-200',   // Cursando
                    2: 'bg-red-100 text-red-700 border-red-200',         // Retirado
                    3: 'bg-blue-100 text-blue-700 border-blue-200'       // Promovido
                };
                return (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${colors[row.estado] || 'bg-gray-100'}`}>
                        {row.estado_texto}
                    </span>
                );
            }
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex gap-2">
                    {/* Botón Editar (Siempre visible, pero el form interno manejará sus bloqueos) */}
                    <Link 
                        to={`/matricula/editar/${row.id}`} 
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar Matrícula"
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>

                    {/* Botón Eliminar (Condicional) */}
                    {row.bloqueado_delete ? (
                        <div 
                            className="p-1.5 text-gray-300 cursor-not-allowed" 
                            title={`No se puede eliminar: ${row.motivo_bloqueo}`}
                        >
                            <LockClosedIcon className="w-5 h-5" />
                        </div>
                    ) : (
                        <button 
                            onClick={() => setDeleteModal({ isOpen: true, id: row.id, nombre: row.alumno_nombre })}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar Matrícula"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )
        }
    ], []);

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar Alumno', placeholder: 'Nombre, DNI...', colSpan: 'col-span-12 md:col-span-6' },
        { 
            name: 'anio_academico_id', 
            type: 'custom', 
            colSpan: 'col-span-12 md:col-span-3',
            render: () => <AnioAcademicoSearchSelect form={filters} setForm={setFilters} isFilter={true} />
        },
        // Puedes agregar más filtros como estado aquí si quieres
    ], [filters]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Gestión de Matrículas" icon={IdentificationIcon} buttonText="+ Nueva Matrícula" buttonLink="/matricula/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={matriculas} 
                loading={loading} 
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={(n, v) => setFilters(p => ({...p, [n]: v}))}
                onFilterSubmit={() => { filtersRef.current = filters; fetchMatriculas(1); }}
                onFilterClear={() => { 
                    const c = {search:'', anio_academico_id: '', estado: ''}; 
                    setFilters(c); 
                    filtersRef.current = c; 
                    fetchMatriculas(1); 
                }}
                pagination={{
                    currentPage: paginationInfo.currentPage,
                    totalPages: paginationInfo.totalPages,
                    onPageChange: fetchMatriculas
                }}
            />

            {deleteModal.isOpen && (
                <ConfirmModal 
                    title="¿Eliminar Matrícula?" 
                    message={`Esta acción eliminará la matrícula del alumno ${deleteModal.nombre}.`}
                    confirmText="Sí, eliminar"
                    onConfirm={handleConfirmDelete} 
                    onCancel={() => setDeleteModal({ isOpen: false, id: null, nombre: '' })} 
                />
            )}
        </div>
    );
};

export default Index;