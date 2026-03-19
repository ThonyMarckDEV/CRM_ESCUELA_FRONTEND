import React, { useMemo } from 'react';
import { useIndex } from './hooks/useIndex';
import { Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import AlumnoSearchSelect from 'components/Shared/Comboboxes/AlumnoSearchSelect';
import { 
    QrCodeIcon, TrashIcon, ClockIcon, AcademicCapIcon, 
    IdentificationIcon, PencilSquareIcon, ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, asistencias, paginationInfo, filters, alert, deleteModal,
        setAlert, setDeleteModal, fetchAsistencias, handleFilterChange,
        handleFilterSubmit, handleClearFilters, handleDeleteConfirm,
        setFilters,
        exportToExcel // ✅ Obtenido del hook
    } = useIndex();

    const { role } = useAuth();
    const isSuperAdmin = role === 'superadmin';

    const filterConfig = useMemo(() => [
        {
            name: 'alumno_id',
            type: 'custom',
            colSpan: 'col-span-12 md:col-span-5',
            render: () => (
                <AlumnoSearchSelect form={filters} setForm={setFilters} isFilter={true} />
            )
        },
        { 
            name: 'fecha', type: 'date', label: 'Fecha', colSpan: 'col-span-12 md:col-span-3'
        },
        { 
            name: 'estado',
            type: 'select', label: 'Estado', colSpan: 'col-span-12 md:col-span-4',
            options: [
                { value: '', label: 'Todos' }, 
                { value: '1', label: 'Presente' }, 
                { value: '2', label: 'Tardanza' },
                { value: '3', label: 'Justificado' },
            ] 
        }
    ], [filters, setFilters]);

    const columns = useMemo(() => {
        const baseColumns = [
            {
                header: 'Fecha y Hora',
                render: (row) => (
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{row.fecha}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                            <ClockIcon className="w-3.5 h-3.5 text-slate-400" /> 
                            {row.hora_ingreso !== '-' ? `${row.hora_ingreso} hrs` : <span className="italic text-slate-400">Sin registro</span>}
                        </span>
                    </div>
                )
            },
            {
                header: 'Información del Estudiante',
                render: (row) => (
                    <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm uppercase mb-1">{row.alumno_nombre}</span>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold border border-slate-200">
                                <IdentificationIcon className="w-3 h-3" /> DNI: {row.alumno_dni}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-100">
                                COD: {row.alumno_codigo}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold border border-purple-100">
                                <AcademicCapIcon className="w-3 h-3" /> {row.grado_seccion}
                            </span>
                            <span className="text-[10px] text-slate-400" title="ID de Matrícula Interno">#M{row.matricula_id}</span>
                        </div>
                    </div>
                )
            },
            {
                header: 'Estado',
                render: (row) => {
                    const badgeColors = {
                        1: 'bg-green-100 text-green-700 border border-green-200',
                        2: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
                        3: 'bg-blue-100 text-blue-700 border border-blue-200'
                    };
                    return (
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeColors[row.estado_id] || 'bg-slate-100 text-slate-600'}`}>
                            {row.estado_texto}
                        </span>
                    );
                }
            },
            {
                header: 'Observación',
                render: (row) => (
                    <span className={`text-xs ${row.observacion ? 'text-slate-600 font-medium' : 'text-slate-400 italic'}`}>
                        {row.observacion || 'Ninguna'}
                    </span>
                )
            }
        ];

        if (isSuperAdmin) {
            baseColumns.push({
                header: 'Acciones',
                render: (row) => (
                    <div className="flex items-center gap-3">
                        <Link to={`/asistencia/diaria/editar/${row.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Editar">
                            <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                        <button onClick={() => setDeleteModal({ isOpen: true, id: row.id })} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                )
            });
        }
        return baseColumns;
    }, [isSuperAdmin, setDeleteModal]);

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <PageHeader 
                    title="Reporte de Asistencias" 
                    icon={QrCodeIcon} 
                    // Si es portero sale "Registrar +", si es superadmin no sale nada (null)
                    buttonText={role === 'portero' ? "Registrar +" : null} 
                    buttonLink={role === 'portero' ? "/asistencia/diaria/agregar" : null}
                />

                {isSuperAdmin && (
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-black text-xs uppercase hover:bg-green-700 transition-all shadow-md active:scale-95"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" /> Exportar Excel
                    </button>
                )}
            </div>
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={asistencias} 
                loading={loading} 
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleClearFilters}
                pagination={{
                    currentPage: paginationInfo.currentPage,
                    totalPages: paginationInfo.totalPages,
                    onPageChange: fetchAsistencias
                }} 
            />

            {deleteModal.isOpen && (
                <ConfirmModal 
                    title="¿Eliminar Registro?" 
                    message="¿Estás seguro de eliminar este registro de asistencia? Esto afectará el historial del estudiante." 
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteModal({ isOpen: false, id: null })}
                />
            )}
        </div>
    );
};

export default Index;