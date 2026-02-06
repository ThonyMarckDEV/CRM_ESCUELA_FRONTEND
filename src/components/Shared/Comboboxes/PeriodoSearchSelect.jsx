import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/periodoService'; 
import { 
    MagnifyingGlassIcon, 
    CalendarDaysIcon, 
    ClockIcon, 
    XMarkIcon, 
    LockClosedIcon,
    CalendarIcon 
} from '@heroicons/react/24/outline';

const PeriodoSearchSelect = ({ form, setForm, disabled, isFilter = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        if (form && form.periodoNombre) {
            setInputValue(form.periodoNombre);
        } else if (form && !form.periodo_id) {
            setInputValue('');
        }
    }, [form]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchPeriodos = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await index(1, { search: searchTerm });
            const lista = response.data || []; 
            setSuggestions(lista);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error al buscar periodos", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);

        if (form.periodo_id) {
            setForm(prev => ({ ...prev, periodo_id: '', periodoNombre: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchPeriodos(texto);
        }, 500);
    };

    const handleInputClick = () => {
        if (disabled) return;
        if (!showSuggestions) {
            fetchPeriodos(inputValue);
        } else {
            setShowSuggestions(true);
        }
    };

    const handleSelect = (periodo, isSelectable) => {
        if (!isSelectable) return;

        setInputValue(periodo.nombre);
        setForm(prev => ({ 
            ...prev, 
            periodo_id: periodo.id, 
            periodoNombre: periodo.nombre 
        }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, periodo_id: '', periodoNombre: '' }));
        if (showSuggestions) fetchPeriodos('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {!isFilter && (
                <label className="block text-sm font-black text-slate-700 uppercase mb-2">
                    Periodo Académico <span className="text-red-500">*</span>
                </label>
            )}
            
            <div className="relative flex items-center group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todos los periodos" : "Buscar periodo..."}
                    className={`w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-3'} 
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                    autoComplete="off"
                />

                <div className="absolute left-3 text-slate-400">
                    <CalendarDaysIcon className="w-4 h-4" />
                </div>

                <div className="absolute right-2 flex items-center gap-1">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div>
                    ) : inputValue ? (
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500 transition-colors">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    )}
                </div>

                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-72 overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                        {suggestions.length > 0 ? (
                            suggestions.map((periodo) => {
                                const isClosed = periodo.estado === 0 || periodo.estado === false;
                                const isSelectable = isFilter || !isClosed; 
                                const isSelected = form.periodo_id === periodo.id;

                                return (
                                    <li
                                        key={periodo.id}
                                        onClick={() => handleSelect(periodo, isSelectable)}
                                        className={`
                                            px-4 py-3 text-sm flex items-start gap-3 border-b border-slate-50 last:border-0 transition-all
                                            ${isSelectable 
                                                ? 'cursor-pointer hover:bg-slate-50 text-slate-700 hover:text-black' 
                                                : 'cursor-not-allowed bg-slate-50 text-slate-400 grayscale'
                                            }
                                            ${isSelected ? 'bg-zinc-50 border-l-4 border-l-black shadow-inner' : ''}
                                        `}
                                    >
                                        <div className="mt-0.5 flex-shrink-0">
                                            {isClosed ? (
                                                <LockClosedIcon className="w-4 h-4 text-slate-400" /> 
                                            ) : (
                                                <ClockIcon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-slate-400'}`} />
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`font-black uppercase truncate ${isSelected ? 'text-black' : 'text-slate-700'}`}>
                                                    {periodo.nombre}
                                                </span>
                                                {isClosed && (
                                                    <span className="flex-shrink-0 text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 font-bold uppercase">
                                                        Cerrado
                                                    </span>
                                                )}
                                            </div>

                                            {/* Detalles: Año y Fechas */}
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[11px] font-bold text-slate-500 tracking-tight">
                                                        AÑO {periodo.anio_academico?.nombre || '---'}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter text-nowrap">
                                                        {periodo.fecha_inicio} - {periodo.fecha_fin}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-4 py-8 text-slate-400 text-xs text-center flex flex-col items-center gap-2">
                                <MagnifyingGlassIcon className="w-8 h-8 opacity-20" />
                                <span>{loading ? 'Buscando periodos...' : 'No se encontraron coincidencias'}</span>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* Helper Text */}
            {!isFilter && (
                <div className="mt-2 text-[10px] h-4">
                    {form.periodo_id ? (
                        <span className="text-green-600 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            PERIODO SELECCIONADO
                        </span>
                    ) : (
                        <span className="text-slate-400 uppercase tracking-widest font-medium">
                            {inputValue ? 'Seleccione de la lista' : 'Esperando búsqueda...'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default PeriodoSearchSelect;