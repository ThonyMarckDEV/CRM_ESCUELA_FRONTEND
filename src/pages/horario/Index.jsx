import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { index, destroy } from 'services/horarioService';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

import AnioAcademicoSearchSelect from 'components/Shared/Comboboxes/AnioAcademicoSearchSelect';
import DocenteSearchSelect from 'components/Shared/Comboboxes/DocenteSearchSelect';
import GradoSearchSelect from 'components/Shared/Comboboxes/GradoSearchSelect';
import SeccionSearchSelect from 'components/Shared/Comboboxes/SeccionSearchSelect';
import HorarioSeccionModal from 'components/Shared/Tables/HorarioSeccionModal';

import { 
    CalendarDaysIcon, ClockIcon, PencilSquareIcon, TrashIcon, UserIcon, MapPinIcon, BookOpenIcon, EyeIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const { user, role, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [horarios, setHorarios] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    const [filters, setFilters] = useState({ 
        anio_academico_id: '', docente_id: '', grado_id: '', seccion_id: '', seccionNombre: ''
    });
    
    const filtersRef = useRef(filters);
    const [showHorarioModal, setShowHorarioModal] = useState(false);
    const [alert, setAlert] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, descripcion: '' });

    const fetchHorarios = useCallback(async (page = 1) => {
        if (authLoading) return;

        setLoading(true);
        try {
            const response = await index(page, filtersRef.current);
            setHorarios(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                last_page: response.last_page,
                totalPages: response.last_page,
            });
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar horarios'));
        } finally {
            setLoading(false);
        }
    }, [authLoading]);

    useEffect(() => {
        if (!authLoading) {
            fetchHorarios(1);
        }
    }, [fetchHorarios, authLoading]);

    useEffect(() => {
        if (authLoading) return;

        const hasChanged = 
            filters.anio_academico_id !== filtersRef.current.anio_academico_id || 
            filters.docente_id !== filtersRef.current.docente_id ||
            filters.grado_id !== filtersRef.current.grado_id ||
            filters.seccion_id !== filtersRef.current.seccion_id;

        if (hasChanged) {
            filtersRef.current = { ...filters };
            fetchHorarios(1); 
        }
    }, [filters, fetchHorarios, authLoading]);

    const handleConfirmDelete = async () => {
        try {
            await destroy(deleteModal.id);
            setAlert({ type: 'success', message: 'Horario eliminado correctamente.' });
            fetchHorarios(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al eliminar'));
        } finally {
            setDeleteModal({ isOpen: false, id: null, descripcion: '' });
        }
    };

    // --- COLUMNAS ---
    const columns = useMemo(() => {
        const cols = [
            {
                header: 'Docente',
                render: (row) => (
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-full">
                            <UserIcon className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-sm">{row.docente_nombre}</span>
                        </div>
                    </div>
                )
            },
            {
                header: 'Horario',
                render: (row) => (
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit border border-blue-100">
                            {row.dia_nombre}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs mt-0.5">
                            <ClockIcon className="w-4 h-4 text-slate-400" />
                            {row.hora_inicio} - {row.hora_fin}
                        </div>
                        {row.aula && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                <MapPinIcon className="w-3 h-3" />
                                {row.aula}
                            </div>
                        )}
                    </div>
                )
            },
            {
                header: 'Materia / Grupo',
                render: (row) => (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <BookOpenIcon className="w-4 h-4 text-slate-400"/>
                            <span className="text-sm font-bold text-slate-700">{row.curso_nombre}</span>
                        </div>
                        <div className="flex flex-col pl-6">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">
                                {row.grado_nombre}
                            </span>
                            <span className="text-[10px] text-slate-400">
                                Sección: <strong className="text-slate-600">"{row.seccion_nombre}"</strong>
                            </span>
                        </div>
                    </div>
                )
            }
        ];

        if (role !== 'alumno') {
            cols.push({
                header: 'Acciones',
                render: (row) => (
                    <div className="flex gap-2">
                        <Link to={`/horario/editar/${row.id}`} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                        <button onClick={() => setDeleteModal({ isOpen: true, id: row.id, descripcion: `${row.dia_nombre} (${row.hora_inicio} - ${row.hora_fin})` })}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                )
            });
        }
        return cols;
    }, [role]);

    // --- CONFIGURACIÓN DE FILTROS ---
    const filterConfig = useMemo(() => {
        // ALUMNO: NO VE FILTROS
        if (role === 'alumno') return [];

        const config = [
            { 
                name: 'anio_academico_id', type: 'custom', colSpan: 'col-span-12 md:col-span-3',
                render: () => <AnioAcademicoSearchSelect form={filters} setForm={setFilters} isFilter={true} />
            },
            { 
                name: 'grado_id', type: 'custom', colSpan: 'col-span-12 md:col-span-3',
                render: () => <GradoSearchSelect form={filters} setForm={setFilters} isFilter={true} />
            },
            { 
                name: 'seccion_id', type: 'custom', colSpan: 'col-span-12 md:col-span-3',
                render: () => (
                    <SeccionSearchSelect 
                        form={filters} setForm={setFilters} isFilter={true} 
                        gradoId={filters.grado_id} disabled={!filters.grado_id} 
                    />
                )
            }
        ];

        // DOCENTE: NO VE FILTRO DE DOCENTE (Ya lo sabe el backend)
        // ADMIN: SÍ LO VE
        if (role !== 'docente') {
            config.push({ 
                name: 'docente_id', type: 'custom', colSpan: 'col-span-12 md:col-span-3',
                render: () => <DocenteSearchSelect form={filters} setForm={setFilters} isFilter={true} />
            });
        }
        return config;
    }, [filters, role]);

    // --- LÓGICA BOTÓN VER HORARIO ---
    const showViewScheduleButton = () => {
        if (role === 'alumno') return true; 
        if (filters.seccion_id) return true;
        return false;
    };

    // --- OBTENER ID SECCIÓN PARA MODAL ---
    const getModalSeccionId = () => {
        if (role === 'alumno') {
            // ID desde /me (AuthContext)
            return user.alumno_data?.seccion_id; 
        }
        return filters.seccion_id;
    };

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title={role === 'alumno' ? "Mi Horario de Clases" : "Gestión de Horarios"} 
                icon={CalendarDaysIcon} 
                buttonText={role !== 'alumno' ? "+ Nuevo Horario" : null} 
                buttonLink="/horario/agregar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            {showViewScheduleButton() && (
                <div className="mb-4 flex justify-end animate-in fade-in slide-in-from-top-2">
                    <button 
                        onClick={() => setShowHorarioModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-indigo-700 transition-colors"
                    >
                        <EyeIcon className="w-5 h-5"/>
                        {role === 'alumno' 
                            ? `Ver Horario Semanal Completo (${user.alumno_data?.seccion || ''})` 
                            : `Ver Horario de ${filters.seccionNombre || 'Sección'}`
                        }
                    </button>
                </div>
            )}

            <Table 
                columns={columns} 
                data={horarios} 
                loading={loading} 
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={(n, v) => setFilters(p => ({...p, [n]: v}))}
                onFilterSubmit={() => { filtersRef.current = filters; fetchHorarios(1); }}
                onFilterClear={() => { 
                    const c = { 
                        anio_academico_id: '', grado_id: '', seccion_id: '', seccionNombre: '',
                        docente_id: '' // Ya no necesitamos preservarlo, el backend se encarga
                    }; 
                    setFilters(c); 
                    filtersRef.current = c; 
                    fetchHorarios(1); 
                }}
                pagination={{
                    currentPage: paginationInfo.currentPage,
                    totalPages: paginationInfo.totalPages,
                    onPageChange: fetchHorarios
                }}
            />

            {showHorarioModal && (
                <HorarioSeccionModal 
                    seccionId={getModalSeccionId()}
                    seccionNombre={role === 'alumno' ? user.alumno_data?.seccion : filters.seccionNombre}
                    onClose={() => setShowHorarioModal(false)}
                />
            )}

            {deleteModal.isOpen && (
                <ConfirmModal 
                    title="¿Eliminar Horario?" 
                    message={`Se eliminará la clase del ${deleteModal.descripcion}.`}
                    confirmText="Sí, eliminar"
                    onConfirm={handleConfirmDelete} 
                    onCancel={() => setDeleteModal({ isOpen: false, id: null, descripcion: '' })} 
                />
            )}
        </div>
    );
};

export default Index;