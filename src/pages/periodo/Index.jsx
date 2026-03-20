import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from './hooks/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

import { 
    CalendarDaysIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    LockClosedIcon 
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading,
        periodos,
        paginationInfo,
        filters,
        alert,
        setAlert,
        showStatusConfirm,
        setShowStatusConfirm,
        setIdToToggle,
        showDeleteConfirm,
        setShowDeleteConfirm,
        setIdToDelete,
        nameToDelete,
        setNameToDelete,
        fetchPeriodos,
        handleConfirmToggle,
        handleConfirmDelete,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar', placeholder: 'Nombre...', colSpan: 'md:col-span-8' }
    ], []);

    const columns = useMemo(() => [
        {
            header: 'Periodo Académico',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="w-8 h-8 text-black p-1.5 bg-slate-100 rounded-lg" />
                    <div className="flex flex-col">
                        <span className="font-black text-slate-700 uppercase">{row.nombre}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">
                            Año: {row.anio_academico?.nombre || 'N/A'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Duración',
            render: (row) => (
                <span className="text-xs font-bold text-slate-500">{row.fecha_inicio} al {row.fecha_fin}</span>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => { setIdToToggle(row.id); setShowStatusConfirm(true); }}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm
                        ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-500 border border-red-200'}`}
                >
                    {row.estado ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <Link to={`/periodo/editar/${row.id}`} className="text-black hover:text-blue-600">
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                    {row.tiene_data ? (
                        <div className="text-gray-400 cursor-not-allowed" title="No se puede eliminar: Tiene conceptos de pago y/o notas asociadas.">
                            <LockClosedIcon className="w-5 h-5" />
                        </div>
                    ) : (
                        <button onClick={() => { setIdToDelete(row.id); setNameToDelete(row.nombre); setShowDeleteConfirm(true); }} className="text-black hover:text-red-600">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )
        }
    ], [setIdToToggle, setShowStatusConfirm, setIdToDelete, setNameToDelete, setShowDeleteConfirm]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Periodos Académicos" icon={CalendarDaysIcon} buttonText="+ Nuevo Periodo" buttonLink="/periodo/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table
                columns={columns}
                data={periodos}
                loading={loading}
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ 
                    currentPage: paginationInfo.currentPage, 
                    totalPages: paginationInfo.totalPages, 
                    onPageChange: fetchPeriodos 
                }}
            />
            
            {showStatusConfirm && (
                <ConfirmModal 
                    message="¿Cambiar estado?" 
                    onConfirm={handleConfirmToggle} 
                    onCancel={() => setShowStatusConfirm(false)} 
                />
            )}
            
            {showDeleteConfirm && (
                <ConfirmModal 
                    title="¿Eliminar?" 
                    message={`Eliminar "${nameToDelete}"?`} 
                    onConfirm={handleConfirmDelete} 
                    onCancel={() => setShowDeleteConfirm(false)} 
                />
            )}
        </div>
    );
};

export default Index;