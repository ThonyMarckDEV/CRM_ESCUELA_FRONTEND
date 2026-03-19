import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from './hooks/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { UserGroupIcon, PencilSquareIcon, UserIcon, IdentificationIcon, EyeIcon } from '@heroicons/react/24/outline';

const Index = () => {
  // Ahora llamamos a useIndex
  const {
    loading,
    alumnos,
    paginationInfo,
    filters,
    alert,
    showConfirm,
    isViewOpen,
    viewData,
    viewLoading,
    setAlert,
    fetchAlumnos,
    handleFilterChange,
    handleFilterSubmit,
    handleClearFilters,
    handleAskToggle,
    handleConfirmToggle,
    handleCancelToggle,
    handleView,
    handleCloseView
  } = useIndex();

  const filterConfig = useMemo(() => [
    { 
      name: 'search', 
      type: 'text', 
      label: 'Búsqueda General', 
      placeholder: 'Buscar por Nombre, DNI...', 
      colSpan: 'col-span-12 md:col-span-6'
    },
    {
      name: 'sexo', 
      type: 'select', 
      label: 'Sexo',
      colSpan: 'col-span-12 md:col-span-2',
      options: [
        { value: '', label: 'Todos' }, 
        { value: 'Masculino', label: 'Masc.' }, 
        { value: 'Femenino', label: 'Fem.' }
      ]
    },
    { 
      name: 'estado',
      type: 'select', 
      label: 'Estado', 
      colSpan: 'col-span-12 md:col-span-2',
      options: [
        { value: '', label: 'Todos' }, 
        { value: '1', label: 'Activo' }, 
        { value: '0', label: 'Inactivo' }
      ] 
    }
  ], []);

  const columns = useMemo(() => [
    {
      header: 'Estudiante',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-black text-sm border border-slate-200">
            {row.nombre_completo ? row.nombre_completo.charAt(0) : '?'}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm">{row.nombre_completo}</span>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                <span className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    <IdentificationIcon className="w-3 h-3"/> {row.dni}
                </span>
                <span className="text-slate-400">ID: {row.codigo}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Usuario Sistema',
      render: (row) => (
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <UserIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-slate-600">
                {row.usuario || <span className="text-gray-300 italic">Sin usuario</span>}
            </span>
        </div>
      )
    },
    {
      header: 'Estado',
      render: (row) => (
        <button 
          onClick={() => handleAskToggle(row.id)}
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:opacity-80 transition-opacity
            ${row.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}
          title="Clic para cambiar estado"
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
          <Link to={`/alumno/editar/${row.id}`} className="text-black hover:scale-110 transition-transform" title="Editar">
            <PencilSquareIcon className="w-5 h-5" />
          </Link>
        </div>
      )
    }
  ], [handleAskToggle, handleView]);

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Gestión de Alumnos" 
        icon={UserGroupIcon} 
        buttonText="+ Nuevo Alumno" 
        buttonLink="/alumno/agregar" 
      />

      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

      <Table
        columns={columns}
        data={alumnos}
        loading={loading}
        filterConfig={filterConfig} 
        filters={filters}
        onFilterChange={handleFilterChange}
        onFilterSubmit={handleFilterSubmit}
        onFilterClear={handleClearFilters}
        pagination={{
          currentPage: paginationInfo.currentPage,
          totalPages: paginationInfo.totalPages,
          onPageChange: fetchAlumnos
        }}
      />

      {showConfirm && (
        <ConfirmModal 
            message="¿Estás seguro de cambiar el estado de acceso de este alumno?"
            confirmText="Sí, cambiar"
            cancelText="Cancelar"
            onConfirm={handleConfirmToggle}
            onCancel={handleCancelToggle}
        />
      )}

      <ViewModal 
        isOpen={isViewOpen} 
        onClose={handleCloseView} 
        title="Detalles del Alumno"
        isLoading={viewLoading}
      >
        {viewData && (
            <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Nombre Completo</h4>
                        <p className="text-gray-800 font-medium text-lg">
                            {viewData.nombre} {viewData.apellidoPaterno} {viewData.apellidoMaterno}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">DNI</h4>
                            <p className="text-gray-800 font-medium">{viewData.dni}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Código</h4>
                            <p className="text-gray-800 font-medium">{viewData.codigo_estudiante}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Sexo</h4>
                        <p className="text-gray-800">{viewData.sexo}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Fecha Nacimiento</h4>
                        <p className="text-gray-800">{viewData.fechaNacimiento}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Dirección</h4>
                        <p className="text-gray-800 text-sm truncate" title={viewData.direccion}>{viewData.direccion}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-black text-gray-700 uppercase mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4"/> Apoderado & Contacto
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Nombre Apoderado</p>
                            <p className="font-semibold text-gray-800">{viewData.nombre_apoderado}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Teléfono Apoderado</p>
                            <p className="font-semibold text-gray-800">{viewData.telefono_apoderado}</p>
                        </div>
                        {viewData.contacto && (
                            <>
                                <div>
                                    <p className="text-xs text-gray-500">Teléfono Personal</p>
                                    <p className="font-semibold text-gray-800">{viewData.contacto.telefono || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-800 break-all">{viewData.contacto.correo || '-'}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {viewData.usuario && (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-blue-400 uppercase">Usuario de Sistema</p>
                                <p className="font-bold text-blue-900 text-lg">{viewData.usuario.username}</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${viewData.usuario.estado ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {viewData.usuario.estado ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                )}
            </div>
        )}
      </ViewModal>
    </div>
  );
};

export default Index;