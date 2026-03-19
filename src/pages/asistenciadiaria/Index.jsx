import React, { useMemo } from 'react';
import { useIndex } from './hooks/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { QrCodeIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';

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
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <ClockIcon className="w-3 h-3" /> 
                        {row.hora_ingreso !== '-' ? `${row.hora_ingreso} hrs` : 'Sin registro'}
                    </span>
                </div>
            )
        },
        {
            header: 'Alumno',
            render: (row) => (
                <div className="flex flex-col">
                    {/* Asegúrate de retornar alumno_nombre y alumno_dni desde tu backend */}
                    <span className="font-bold text-slate-800 text-sm uppercase">{row.alumno_nombre || `Matrícula #${row.matricula_id}`}</span>
                    <span className="text-xs text-slate-500">DNI: {row.alumno_dni || '---'}</span>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => {
                const badgeColors = {
                    1: 'bg-green-100 text-green-700',   // Presente
                    2: 'bg-red-100 text-red-700',       // Falta
                    3: 'bg-yellow-100 text-yellow-700', // Tardanza
                    4: 'bg-blue-100 text-blue-700'      // Justificado
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${badgeColors[row.estado_id] || 'bg-slate-100 text-slate-600'}`}>
                        {row.estado_texto}
                    </span>
                );
            }
        },
        {
            header: 'Observación',
            render: (row) => (
                <span className="text-xs text-slate-600 italic">
                    {row.observacion || '-'}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-3">
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
                buttonLink="/asistencia/diaria/escanear" 
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
                    message="¿Estás seguro de eliminar este registro de asistencia? Esto afectará los reportes del alumno." 
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteModal({ isOpen: false, id: null })}
                />
            )}
        </div>
    );
};

export default Index;