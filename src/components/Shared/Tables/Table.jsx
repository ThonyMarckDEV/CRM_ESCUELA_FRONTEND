import React from 'react';
import Pagination from '../Pagination';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Table = ({ 
    columns, 
    data, 
    loading = false, 
    pagination = null, 
    filterConfig = [], 
    filters = {},       
    onFilterChange,    
    onFilterSubmit,    
    onFilterClear,     
    searchPlaceholder = "Buscar..."
}) => {

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onFilterSubmit();
        }
    };

    const renderFilterInput = (config) => {
        // ... (Tu código de filtros se mantiene igual, lo omito para brevedad) ...
        const baseClass = "block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:bg-gray-50 transition-all";

        if (config.type === 'custom' || config.render) {
            return config.render ? config.render() : null;
        }

        switch (config.type) {
            case 'select':
                return (
                    <select
                        name={config.name}
                        value={filters[config.name] || ''}
                        onChange={(e) => onFilterChange(config.name, e.target.value)}
                        disabled={loading}
                        className={`${baseClass} bg-white cursor-pointer h-[38px]`}
                    >
                        {config.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            case 'date':
                return (
                    <input
                        type="date"
                        name={config.name}
                        value={filters[config.name] || ''}
                        onChange={(e) => onFilterChange(config.name, e.target.value)}
                        disabled={loading}
                        className={`${baseClass} h-[38px]`}
                    />
                );
            case 'text':
            default:
                return (
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name={config.name}
                            placeholder={config.placeholder || searchPlaceholder}
                            className={`${baseClass} pl-10 h-[38px]`}
                            value={filters[config.name] || ''}
                            onChange={(e) => onFilterChange(config.name, e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            
            {/* --- SECCIÓN DE FILTROS --- */}
            {filterConfig.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-12 gap-4 items-end">
                        {filterConfig.map((config, index) => (
                            <div key={index} className={config.colSpan || "col-span-12 md:col-span-3"}>
                                {config.label && config.type !== 'custom' && (
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        {config.label}
                                    </label>
                                )}
                                {renderFilterInput(config)}
                            </div>
                        ))}
                        <div className="col-span-12 md:col-span-2 flex gap-2">
                            <button
                                onClick={onFilterSubmit}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 h-[38px]"
                            >
                                <MagnifyingGlassIcon className="h-4 w-4" />
                                Buscar
                            </button>

                            <button 
                                type="button"
                                onClick={onFilterClear}
                                disabled={loading}
                                className="px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md border border-gray-300 transition-all h-[38px]"
                                title="Limpiar filtros"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TABLA RESPONSIVA (CARDS EN MÓVIL) --- */}
            {/* Quitamos overflow-hidden y border del wrapper principal en móvil para que las cards floten libremente */}
            <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                
                {/* En móvil quitamos la estructura de tabla tradicional visualmente */}
                <table className="min-w-full md:divide-y md:divide-gray-200 w-full block md:table">
                    
                    {/* THEAD: Oculto en móvil (hidden), visible como grupo de encabezado en desktop (md:table-header-group) */}
                    <thead className="hidden md:table-header-group bg-gray-100">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="block md:table-row-group md:divide-y md:divide-gray-100 bg-transparent md:bg-white">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr 
                                    key={row.id || rowIndex} 
                                    // TR Styles:
                                    // Móvil: Block, margen inferior, borde, bordes redondeados, sombra, fondo blanco (Card look)
                                    // Desktop: Table-row, sin margen, sin borde externo, hover effect normal
                                    className="block md:table-row mb-4 md:mb-0 border border-gray-200 md:border-none rounded-lg md:rounded-none shadow-sm md:shadow-none bg-white md:hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td 
                                            key={`${rowIndex}-${colIndex}`} 
                                            // TD Styles:
                                            // Móvil: Flex container (para poner label y valor lado a lado), border bottom, padding
                                            // Desktop: Table-cell normal
                                            className="block md:table-cell px-4 py-3 md:px-6 md:py-4 text-sm text-gray-700 border-b last:border-b-0 md:border-b-0 flex justify-between md:block items-center"
                                        >
                                            {/* Etiqueta (Label) visible SOLO en móvil */}
                                            <span className="font-bold text-gray-600 text-xs uppercase md:hidden mr-2">
                                                {col.header}
                                            </span>

                                            {/* Contenido de la celda */}
                                            <span className="text-right md:text-left truncate max-w-[70%] md:max-w-none">
                                                {col.render ? col.render(row) : row[col.accessor]}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            // Estado vacío
                            <tr className="block md:table-row bg-white rounded-lg border border-gray-200 md:border-none p-4 md:p-0">
                                <td colSpan={columns.length} className="block md:table-cell px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <MagnifyingGlassIcon className="w-8 h-8 opacity-20" />
                                        <span>No se encontraron registros</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- PAGINACIÓN --- */}
            {pagination && (
                <div className="flex justify-center md:justify-end">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default Table;