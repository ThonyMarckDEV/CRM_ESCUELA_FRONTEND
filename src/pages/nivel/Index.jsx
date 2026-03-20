import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from './hooks/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { BuildingLibraryIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading,
        niveles,
        paginationInfo,
        filters,
        alert,
        setAlert,
        fetchNiveles,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar Nivel', placeholder: 'Nombre...', colSpan: 'md:col-span-12' },
    ], []);

    const columns = useMemo(() => [
        {
            header: 'Nivel Educativo',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <BuildingLibraryIcon className="w-8 h-8 text-black p-1.5 bg-slate-100 rounded-lg" />
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
                    <Link to={`/nivel/editar/${row.id}`} className="text-black hover:scale-110 transition-transform" title="Editar">
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                </div>
            )
        }
    ], []);

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Gestión de Niveles" 
                icon={BuildingLibraryIcon} 
                buttonText="+ Nuevo Nivel" 
                buttonLink="/nivel/agregar" 
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns}
                data={niveles}
                loading={loading}
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{
                    currentPage: paginationInfo.currentPage,
                    totalPages: paginationInfo.totalPages,
                    onPageChange: fetchNiveles
                }}
            />
        </div>
    );
};

export default Index;