import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from './hooks/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import AnioAcademicoSearchSelect from 'components/Shared/Comboboxes/AnioAcademicoSearchSelect';
import DocenteSearchSelect from 'components/Shared/Comboboxes/DocenteSearchSelect';
import GradoSearchSelect from 'components/Shared/Comboboxes/GradoSearchSelect';
import SeccionSearchSelect from 'components/Shared/Comboboxes/SeccionSearchSelect';
import HorarioSeccionModal from 'components/Shared/Tables/HorarioSeccionModal';

import { 
    CalendarDaysIcon, ClockIcon, PencilSquareIcon, TrashIcon, UserIcon, BookOpenIcon, EyeIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        user,
        role,
        loading,
        horarios,
        paginationInfo,
        filters,
        setFilters,
        showHorarioModal,
        setShowHorarioModal,
        alert,
        setAlert,
        deleteModal,
        setDeleteModal,
        fetchHorarios,
        handleConfirmDelete,
        showViewScheduleButton,
        getModalSeccionId,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    } = useIndex();

    const columns = useMemo(() => {
        const cols = [
            {
                header: 'Docente',
                render: (row) => (
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-full">
                            <UserIcon className="w-5 h-5 text-slate-500" />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{row.docente_nombre}</span>
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
                                {row.grado_nombre} | <strong className="text-slate-600">"{row.seccion_nombre}"</strong>
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
                        <button onClick={() => setDeleteModal({ isOpen: true, id: row.id, descripcion: `${row.dia_nombre}` })}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                )
            });
        }
        return cols;
    }, [role, setDeleteModal]);

    const filterConfig = useMemo(() => {
        const config = [
            { 
                name: 'search', 
                type: 'text', 
                placeholder: 'Buscar profesor, materia o día...',
                colSpan: role === 'alumno' ? 'col-span-12 md:col-span-9' : 'col-span-12 md:col-span-4', 
            }
        ];

        if (role !== 'alumno') {
            config.push(
                { 
                    name: 'grado_id', type: 'custom', colSpan: 'col-span-6 md:col-span-2',
                    render: () => <GradoSearchSelect form={filters} setForm={setFilters} isFilter={true} />
                },
                { 
                    name: 'seccion_id', type: 'custom', colSpan: 'col-span-6 md:col-span-2',
                    render: () => (
                        <SeccionSearchSelect 
                            form={filters} setForm={setFilters} isFilter={true} 
                            gradoId={filters.grado_id} disabled={!filters.grado_id} 
                        />
                    )
                }
            );

            if (role === 'admin') {
                config.push(
                    { 
                        name: 'anio_academico_id', type: 'custom', colSpan: 'col-span-6 md:col-span-2',
                        render: () => <AnioAcademicoSearchSelect form={filters} setForm={setFilters} isFilter={true} />
                    },
                    { 
                        name: 'docente_id', type: 'custom', colSpan: 'col-span-6 md:col-span-2',
                        render: () => <DocenteSearchSelect form={filters} setForm={setFilters} isFilter={true} />
                    }
                );
            }
        }

        if (showViewScheduleButton()) {
            config.push({
                name: 'view_schedule_btn',
                type: 'custom',
                colSpan: role === 'alumno' ? 'col-span-12 md:col-span-3' : 'col-span-12 md:col-span-2',
                render: () => (
                    <button 
                        type="button"
                        onClick={() => setShowHorarioModal(true)}
                        className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 h-[38px]"
                    >
                        <EyeIcon className="w-5 h-5"/>
                        <span className="text-xs md:text-sm">Ver Horario</span>
                    </button>
                )
            });
        }

        return config;
    }, [filters, setFilters, role, showViewScheduleButton, setShowHorarioModal]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title={role === 'alumno' ? "Mi Horario de Clases" : "Gestión de Horarios"} 
                icon={CalendarDaysIcon} 
                buttonText={role !== 'alumno' && role !== 'docente' ? "+ Nuevo Horario" : null} 
                buttonLink="/horario/agregar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={horarios} 
                loading={loading} 
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{
                    ...paginationInfo,
                    onPageChange: fetchHorarios
                }}
            />

            {showHorarioModal && (
                <HorarioSeccionModal 
                    seccionId={getModalSeccionId()}
                    seccionNombre={role === 'alumno' ? user.alumno_data?.seccion : (filters.seccionNombre || 'Sección')}
                    onClose={() => setShowHorarioModal(false)}
                />
            )}

            {deleteModal.isOpen && (
                <ConfirmModal 
                    title="¿Eliminar Horario?" 
                    message={`Se eliminará la clase de los días ${deleteModal.descripcion}.`}
                    onConfirm={handleConfirmDelete} 
                    onCancel={() => setDeleteModal({ isOpen: false, id: null, descripcion: '' })} 
                />
            )}
        </div>
    );
};

export default Index;