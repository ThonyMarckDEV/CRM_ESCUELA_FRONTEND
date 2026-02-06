import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { index, destroy, toggleStatus } from 'services/anioAcademicoService';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { CalendarIcon, PencilSquareIcon, TrashIcon, LockClosedIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const ListarAniosAcademicos = () => {
    const [loading, setLoading] = useState(true);
    const [anios, setAnios] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [filters] = useState({ search: '' });
    const [alert, setAlert] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, nombre: '' });
    const [statusModal, setStatusModal] = useState({ isOpen: false, id: null, estadoActual: null });

    const fetchAnios = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await index(page, filters);
            setAnios(response.data || []);
            setPagination({ currentPage: response.current_page, totalPages: response.last_page });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los años' });
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchAnios(1); }, [fetchAnios]);

    const handleStatusChange = async () => {
        try {
            await toggleStatus(statusModal.id);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            fetchAnios(pagination.currentPage);
        } catch (e) {
            setAlert({ type: 'error', message: 'Error al cambiar el estado.' });
        }
        setStatusModal({ isOpen: false });
    };

    const columns = useMemo(() => [
        {
            header: 'Año Académico',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-8 h-8 text-white p-1.5 bg-black rounded-lg" />
                    <span className="font-black text-slate-700 text-lg">{row.nombre}</span>
                </div>
            )
        },
        {
            header: 'Vigencia',
            render: (row) => (
                <span className="text-xs font-bold text-slate-500 uppercase">
                    {row.fecha_inicio} al {row.fecha_fin}
                </span>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setStatusModal({ isOpen: true, id: row.id, estadoActual: row.estado })}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all hover:ring-2 hover:ring-offset-1 ${
                        row.estado ? 'bg-green-100 text-green-700 hover:ring-green-300' : 'bg-red-100 text-red-700 hover:ring-red-300'
                    }`}
                >
                    {row.estado ? 'Activo' : 'Cerrado'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <Link to={`/anio-academico/editar/${row.id}`} className="text-black hover:text-blue-600 transition-all">
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>

                    {row.tiene_data ? (
                        <LockClosedIcon className="w-5 h-5 text-slate-400" title="No se puede eliminar: Tiene matriculas y/o periodos asociados." />
                    ) : (
                        <button 
                            onClick={() => setDeleteModal({ isOpen: true, id: row.id, nombre: row.nombre })} 
                            className="text-black hover:text-red-600 transition-all"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )
        }
    ], []);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Años Académicos" icon={CalendarIcon} buttonText="+ Nuevo Año" buttonLink="/anio-academico/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            <Table columns={columns} data={anios} loading={loading} pagination={{ ...pagination, onPageChange: fetchAnios }} />

            {/* Modal para Eliminar */}
            {deleteModal.isOpen && (
                <ConfirmModal 
                    title="¿Eliminar Año?" 
                    message={`¿Seguro que quieres borrar el año ${deleteModal.nombre}? Esta acción no se puede deshacer.`} 
                    onConfirm={async () => {
                        try {
                            await destroy(deleteModal.id);
                            setAlert({ type: 'success', message: 'Año eliminado.' });
                            fetchAnios();
                        } catch(e) { setAlert({ type: 'error', message: 'No se pudo eliminar.' }); }
                        setDeleteModal({ isOpen: false });
                    }}
                    onCancel={() => setDeleteModal({ isOpen: false })}
                />
            )}

            {/* Modal para Cambiar Estado */}
            {statusModal.isOpen && (
                <ConfirmModal 
                    title="Cambiar Estado" 
                    icon={ArrowsRightLeftIcon}
                    message={`¿Deseas ${statusModal.estadoActual ? 'CERRAR' : 'ACTIVAR'} este año académico?`} 
                    onConfirm={handleStatusChange}
                    onCancel={() => setStatusModal({ isOpen: false })}
                />
            )}
        </div>
    );
};

export default ListarAniosAcademicos;