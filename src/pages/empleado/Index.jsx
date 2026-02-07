import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { index, show, toggleStatus } from 'services/empleadoService';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import RolSearchSelect from 'components/Shared/Comboboxes/RolSearchSelect';

import { 
    UserIcon, 
    PencilSquareIcon, 
    PhoneIcon, 
    IdentificationIcon, 
    BriefcaseIcon, 
    EyeIcon,
    MapPinIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [empleados, setEmpleados] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

  const [filters, setFilters] = useState({ search: '', rol_id: '', rolNombre: '', estado: '' });
  const filtersRef = useRef(filters);
  const [alert, setAlert] = useState(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [idToToggle, setIdToToggle] = useState(null);

  const fetchEmpleados = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await index(page, filtersRef.current);
      setEmpleados(response.data || []);
      setPaginationInfo({
        currentPage: response.current_page,
        last_page: response.last_page,
        totalPages: response.last_page,
      });
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar los empleados'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmpleados(1); }, [fetchEmpleados]);

  useEffect(() => {
    if (filters.rol_id !== filtersRef.current.rol_id) {
        filtersRef.current = { ...filtersRef.current, rol_id: filters.rol_id };
        fetchEmpleados(1); 
    }
  }, [filters.rol_id, fetchEmpleados]);

  const handleView = async (id) => {
    setIsViewOpen(true);
    setViewLoading(true);
    setViewData(null);
    try {
      const response = await show(id);
      setViewData(response.data || response);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar detalles'));
      setIsViewOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const handleAskToggle = (id) => {
    setIdToToggle(id);
    setShowConfirm(true);
  };

  const handleConfirmToggle = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await toggleStatus(idToToggle);
      setAlert({ type: 'success', message: 'Acceso del empleado actualizado correctamente.' });
      await fetchEmpleados(paginationInfo.currentPage);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cambiar el estado'));
    } finally {
      setLoading(false);
      setIdToToggle(null);
    }
  };

  const filterConfig = useMemo(() => [
    { 
      name: 'search', 
      type: 'text', 
      label: 'Buscar (Nombre/DNI)', 
      placeholder: 'Ej: Juan, 12345678...', 
      colSpan: 'col-span-12 md:col-span-4' 
    },
    {
      name: 'rol_id',
      type: 'custom',
      label: '',
      colSpan: 'col-span-12 md:col-span-4',
      render: () => (
           <RolSearchSelect 
              form={filters} 
              setForm={setFilters} 
              isFilter={true}
           />
      )
    },
    {
      name: 'estado', 
      type: 'select', 
      label: 'Estado', 
      colSpan: 'col-span-12 md:col-span-4',
      options: [
        { value: '', label: 'Todos' }, 
        { value: '1', label: 'Activos' }, 
        { value: '0', label: 'Inactivos' }
      ] 
    }
  ], [filters]);

  const columns = useMemo(() => [
    {
      header: 'Empleado',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
            <UserIcon className="w-6 h-6 text-slate-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm">{row.nombre_completo}</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
                <UserIcon className="w-3 h-3"/> {row.usuario || 'Sin usuario'}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Documento / Contacto',
      render: (row) => (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <IdentificationIcon className="w-3 h-3"/> {row.dni}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
                <PhoneIcon className="w-3 h-3"/> {row.telefono}
            </span>
        </div>
      )
    },
    {
      header: 'Rol',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
            row.rol === 'Administrador' 
            ? 'bg-purple-50 text-purple-700 border-purple-200' 
            : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
            <BriefcaseIcon className="w-3 h-3"/>
            {row.rol || 'Sin Rol'}
        </span>
      )
    },
    {
      header: 'Estado',
      render: (row) => (
        <button 
          onClick={() => handleAskToggle(row.id)}
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-transform shadow-sm
            ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
          title="Clic para cambiar acceso"
        >
          {row.estado ? 'Activo' : 'Inactivo'}
        </button>
      )
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleView(row.id)}
            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
            title="Ver Detalle"
          >
            <EyeIcon className="w-5 h-5" />
          </button>

          <Link 
            to={`/empleado/editar/${row.id}`} 
            className="p-2 text-slate-500 hover:text-black hover:bg-slate-50 rounded-lg transition-all" 
            title="Editar Empleado"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </Link>
        </div>
      )
    }
  ], []);

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Gestión de Empleados" 
        icon={UserIcon} 
        buttonText="+ Nuevo Empleado" 
        buttonLink="/empleado/agregar" 
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <Table
        columns={columns}
        data={empleados}
        loading={loading}
        filterConfig={filterConfig} 
        filters={filters}
        onFilterChange={(name, val) => setFilters(prev => ({...prev, [name]: val}))}
        onFilterSubmit={() => { filtersRef.current = filters; fetchEmpleados(1); }}
        onFilterClear={() => { 
            const reset = {search:'', rol_id: '', rolNombre: '', estado: ''}; 
            setFilters(reset); 
            filtersRef.current = reset; 
            fetchEmpleados(1); 
        }}
        pagination={{
          currentPage: paginationInfo.currentPage,
          totalPages: paginationInfo.totalPages,
          onPageChange: fetchEmpleados
        }}
      />

      {showConfirm && (
        <ConfirmModal 
            message="¿Estás seguro de cambiar el acceso al sistema de este empleado? Si lo desactivas, no podrá iniciar sesión."
            confirmText="Sí, cambiar"
            cancelText="Cancelar"
            onConfirm={handleConfirmToggle}
            onCancel={() => { setShowConfirm(false); setIdToToggle(null); }}
        />
      )}

      <ViewModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        title="Ficha del Empleado"
        isLoading={viewLoading}
      >
        {viewData && (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shrink-0">
                        <UserIcon className="w-8 h-8 text-slate-400"/>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Nombre Completo</h4>
                        <p className="text-gray-800 font-black text-xl leading-tight">
                            {viewData.nombre} {viewData.apellidoPaterno} {viewData.apellidoMaterno}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-3">
                            <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                <IdentificationIcon className="w-4 h-4 text-gray-400"/> {viewData.dni}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                <PhoneIcon className="w-4 h-4 text-gray-400"/> {viewData.telefono}
                            </span>
                        </div>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Fecha Nacimiento</h4>
                        <div className="flex items-center gap-2 text-gray-800 font-medium">
                            <CalendarDaysIcon className="w-4 h-4 text-gray-400"/>
                            {viewData.fechaNacimiento}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Estado Civil</h4>
                        <p className="text-gray-800 font-medium">{viewData.estadoCivil}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Sexo</h4>
                        <p className="text-gray-800 font-medium">{viewData.sexo}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Dirección</h4>
                        <div className="flex items-start gap-2 text-gray-800 font-medium">
                            <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"/>
                            {viewData.direccion}
                        </div>
                    </div>
                </div>

                {viewData.usuario && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-sm font-black text-slate-700 uppercase flex items-center gap-2">
                                <BriefcaseIcon className="w-4 h-4"/> Acceso al Sistema
                            </h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${viewData.usuario.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {viewData.usuario.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5">Usuario</p>
                                <p className="font-bold text-slate-800">{viewData.usuario.username}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-0.5">Rol Asignado</p>
                                <p className="font-bold text-slate-800">
                                    {viewData.usuario.rol ? viewData.usuario.rol.nombre : 'Sin Rol'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}
      </ViewModal>
    </div>
  );
};

export default Index;