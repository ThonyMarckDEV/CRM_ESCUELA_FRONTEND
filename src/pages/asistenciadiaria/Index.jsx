import React, { useMemo } from 'react';
import { useIndex } from './hooks/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { QrCodeIcon, TrashIcon, ClockIcon, AcademicCapIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, asistencias, paginationInfo, filters, alert, deleteModal,
        setAlert, setDeleteModal, fetchAsistencias, handleFilterChange,
        handleFilterSubmit, handleClearFilters, handleDeleteConfirm
    } = useIndex();

    // Configuración de los filtros de la tabla
    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Buscar Alumno', 
            placeholder: 'Nombre o DNI...', 
            colSpan: 'col-span-12 md:col-span-6'
        },
        { 
            name: 'fecha', 
            type: 'date', 
            label: 'Fecha', 
            colSpan: 'col-span-12 md:col-span-3'
        },
        { 
            name: 'estado',
            type: 'select', 
            label: 'Estado', 
            colSpan: 'col-span-12 md:col-span-3',
            options: [
                { value: '', label: 'Todos' }, 
                { value: '1', label: 'Presente' }, 
                { value: '3', label: 'Tardanza' },
                { value: '4', label: 'Justificado' },
                { value: '2', label: 'Falta' }
            ] 
        }
    ], []);

    // Configuración de las columnas
    const columns = useMemo(() => [
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
                    <span className="font-black text-slate-900 text-sm uppercase mb-1">
                        {row.alumno_nombre}
                    </span>
                    
                    {/* Fila de Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        
                        {/* DNI */}
                        <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold border border-slate-200">
                            <IdentificationIcon className="w-3 h-3" /> DNI: {row.alumno_dni}
                        </span>
                        
                        {/* Código de Estudiante */}
                        <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-100">
                            COD: {row.alumno_codigo}
                        </span>

                        {/* Grado y Sección */}
                        <span className="flex items-center gap-1 text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold border border-purple-100">
                            <AcademicCapIcon className="w-3 h-3" /> {row.grado_seccion}
                        </span>

                        {/* ID Matricula (Gris chiquito al final) */}
                        <span className="text-[10px] text-slate-400" title="ID de Matrícula Interno">
                            #M{row.matricula_id}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => {
                const badgeColors = {
                    1: 'bg-green-100 text-green-700 border border-green-200',   // Presente
                    2: 'bg-red-100 text-red-700 border border-red-200',       // Falta
                    3: 'bg-yellow-100 text-yellow-700 border border-yellow-200', // Tardanza
                    4: 'bg-blue-100 text-blue-700 border border-blue-200'      // Justificado
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
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setDeleteModal({ isOpen: true, id: row.id })} 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar registro"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ], [setDeleteModal]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Reporte de Asistencias" 
                icon={QrCodeIcon} 
                buttonText="+ Escáner de Ingreso" 
                buttonLink="/asistencia/diaria/agregar" 
            />
            
            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                details={alert?.details} 
                onClose={() => setAlert(null)} 
            />
            
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