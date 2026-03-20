import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from './hooks/useIndex'; // Ajusta la ruta si es necesario

// Componentes UI
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import PeriodoSearchSelect from 'components/Shared/Comboboxes/PeriodoSearchSelect';
import AnioAcademicoSearchSelect from 'components/Shared/Comboboxes/AnioAcademicoSearchSelect';

// Iconos
import { 
    BanknotesIcon, 
    PencilSquareIcon, 
    CalendarDaysIcon, 
    TrashIcon, 
    LockClosedIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading,
        conceptos,
        paginationInfo,
        filters,
        setFilters,
        alert,
        setAlert,
        deleteModal,
        setDeleteModal,
        fetchConceptos,
        handleDeleteClick,
        confirmDelete,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear
    } = useIndex();

    const columns = useMemo(() => [
        {
            header: 'Detalle del Concepto',
            render: (row) => (
                <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-lg border transition-colors ${
                        row.es_matricula ? 'bg-blue-50 border-blue-100 text-blue-600' : 
                        (row.es_pension ? 'bg-purple-50 border-purple-100 text-purple-600' : 'bg-gray-50 border-gray-200 text-gray-400')
                    }`}>
                        {row.es_matricula ? <AcademicCapIcon className="w-5 h-5" /> : <BanknotesIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className={`font-black uppercase text-sm ${row.contexto_abierto ? 'text-slate-700' : 'text-slate-400 line-through decoration-slate-300'}`}>
                            {row.nombre}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-tight">
                                AÑO {row.anio_nombre}
                            </span>
                            <div className="flex items-center gap-1">
                                <CalendarDaysIcon className={`w-3 h-3 ${row.es_matricula ? 'text-blue-400' : 'text-slate-400'}`}/> 
                                <span className={`text-[10px] font-bold uppercase ${row.es_matricula ? 'text-blue-600' : 'text-slate-500'}`}>
                                    {row.periodo_nombre}
                                </span>
                            </div>
                            {!row.contexto_abierto && (
                                <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-black border border-red-200 uppercase ml-auto animate-pulse">
                                    {row.es_matricula ? 'Año Cerrado' : 'Periodo Cerrado'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Monto',
            render: (row) => (
                <span className={`font-mono font-bold text-sm px-3 py-1 rounded-md border inline-block ${row.contexto_abierto ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                    S/ {parseFloat(row.monto).toFixed(2)}
                </span>
            )
        },
        {
            header: 'Clasificación',
            render: (row) => (
                <div className="flex">
                    {row.es_matricula ? (
                        <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-black border border-blue-700 uppercase shadow-sm tracking-wide">
                            {row.tipo_texto || 'Matrícula'}
                        </span>
                    ) : row.es_pension ? (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-black border border-purple-200 uppercase tracking-wide">
                            {row.tipo_texto || 'Pensión'}
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold border border-gray-200 uppercase tracking-wide">
                            {row.tipo_texto || 'Otro'}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Acciones',
            render: (row) => {
                if (!row.contexto_abierto) {
                    return (
                        <div className="flex items-center gap-2 text-gray-400 select-none bg-gray-50 px-3 py-1.5 rounded border border-gray-100 cursor-not-allowed" 
                             title="No se pueden realizar acciones porque el periodo o año académico ha finalizado.">
                            <LockClosedIcon className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-wide">Cerrado</span>
                        </div>
                    );
                }
                return (
                    <div className="flex items-center gap-3">
                        <Link 
                            to={`/concepto-pago/editar/${row.id}`} 
                            className="p-1.5 text-black hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all" 
                            title="Editar Concepto"
                        >
                            <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                        {row.tiene_data ? (
                            <div className="p-1.5 text-amber-400 opacity-50 cursor-not-allowed" title="No se puede eliminar: Existen pagos registrados">
                                <BanknotesIcon className="w-5 h-5" />
                            </div>
                        ) : (
                            <button 
                                onClick={() => handleDeleteClick(row)} 
                                className="p-1.5 text-black hover:text-red-600 hover:bg-red-50 rounded-md transition-all" 
                                title="Eliminar Concepto"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                );
            }
        }
    ], [handleDeleteClick]); // Agregamos handleDeleteClick como dependencia

    // --- CONFIGURACIÓN DE FILTROS ---
    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Buscar', 
            placeholder: 'Nombre del concepto...', 
            colSpan: 'col-span-12 md:col-span-6' 
        },
        {
            name: 'anio_academico_id',
            type: 'custom',
            label: '',
            colSpan: 'col-span-12 md:col-span-3',
            render: () => (
                <AnioAcademicoSearchSelect 
                    form={filters} 
                    setForm={setFilters} 
                    isFilter={true}
                />
            )
        },
        {
            name: 'periodo_id',
            type: 'custom',
            label: '',
            colSpan: 'col-span-12 md:col-span-3',
            render: () => (
                <PeriodoSearchSelect 
                    form={filters} 
                    setForm={setFilters} 
                    isFilter={true}
                />
            )
        }
    ], [filters, setFilters]); // Agregamos filters y setFilters como dependencias

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Gestión de Conceptos de Pago" 
                icon={BanknotesIcon} 
                buttonText="+ Nuevo Concepto" 
                buttonLink="/concepto-pago/agregar" 
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns}
                data={conceptos}
                loading={loading}
                filterConfig={filterConfig} 
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{
                    ...paginationInfo,
                    onPageChange: fetchConceptos
                }}
            />

            {deleteModal.isOpen && (
                <ConfirmModal
                    title="¿Eliminar Concepto Financiero?"
                    message={`Estás a punto de eliminar "${deleteModal.nombre}". Si ya existen pagos registrados con este concepto, podría causar inconsistencias.`}
                    confirmText="Sí, eliminar definitivamente"
                    cancelText="Cancelar"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteModal({ isOpen: false, id: null, nombre: '' })}
                />
            )}
        </div>
    );
};

export default Index;