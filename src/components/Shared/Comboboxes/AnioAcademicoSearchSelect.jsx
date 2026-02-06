import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/anioAcademicoService'; 
import { MagnifyingGlassIcon, CalendarIcon, XMarkIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AnioAcademicoSearchSelect = ({ form, setForm, disabled, isFilter = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        if (form?.anioNombre) {
            setInputValue(form.anioNombre);
        } else if (form && !form.anio_academico_id) {
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

    const fetchAnios = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await index(1, { search: searchTerm });
            setSuggestions(response.data || []);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error al buscar años académicos", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);

        if (form.anio_academico_id) {
            setForm(prev => ({ ...prev, anio_academico_id: '', anioNombre: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
            fetchAnios(texto);
        }, 500);
    };

    const handleInputClick = () => {
        if (!disabled) fetchAnios(inputValue);
    };

    const handleSelect = (anio, isSelectable) => {
        if (!isSelectable) return;

        setInputValue(anio.nombre);
        setForm(prev => ({ 
            ...prev, 
            anio_academico_id: anio.id, 
            anioNombre: anio.nombre 
        }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, anio_academico_id: '', anioNombre: '' }));
        if (showSuggestions) fetchAnios('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {!isFilter && (
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1.5 tracking-wider">
                    Año Académico <span className="text-red-500">*</span>
                </label>
            )}
            
            <div className="relative flex items-center group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todos los años" : "Buscar año académico..."}
                    className={`w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-2.5'} 
                        ${disabled ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'bg-white text-slate-700'}
                    `}
                    autoComplete="off"
                />

                <div className="absolute left-3 text-slate-400">
                    <CalendarIcon className="w-4 h-4" />
                </div>

                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-200 border-t-black rounded-full animate-spin"></div>
                    ) : inputValue ? (
                        <button onClick={handleClear} type="button" className="text-slate-300 hover:text-red-500 transition-colors">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-300" />
                    )}
                </div>

                {showSuggestions && (
                    <ul className="absolute z-[100] top-full left-0 w-full bg-white border border-slate-200 rounded-xl mt-2 max-h-64 overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                        {suggestions.length > 0 ? (
                            suggestions.map((anio) => {
                                const isClosed = !anio.estado; 
                                const isSelectable = isFilter || !isClosed; 
                                const isSelected = form.anio_academico_id === anio.id;

                                return (
                                    <li
                                        key={anio.id}
                                        onClick={() => handleSelect(anio, isSelectable)}
                                        className={`
                                            px-4 py-3 text-sm flex items-center gap-3 border-b border-slate-50 last:border-0 transition-all
                                            ${isSelectable 
                                                ? 'cursor-pointer hover:bg-slate-50 text-slate-600 hover:text-black' 
                                                : 'cursor-not-allowed bg-slate-50/50 text-slate-300 opacity-70'
                                            }
                                            ${isSelected ? 'bg-black/5 text-black font-bold' : ''}
                                        `}
                                    >
                                        <div className="flex-shrink-0">
                                            {isClosed ? (
                                                <LockClosedIcon className="w-4 h-4 text-slate-300" /> 
                                            ) : (
                                                <CheckCircleIcon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-green-500'}`} />
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col flex-grow">
                                            <span className="font-semibold">{anio.nombre}</span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-tighter">
                                                Vigencia: {anio.fecha_inicio} - {anio.fecha_fin}
                                            </span>
                                        </div>
                                        
                                        {isClosed && (
                                            <span className="ml-auto text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase border border-slate-200">
                                                Cerrado
                                            </span>
                                        )}
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-4 py-8 text-slate-400 text-xs text-center italic">
                                {loading ? 'Cargando opciones...' : 'No se encontraron años académicos'}
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* Helper Text */}
            {!isFilter && (
                <div className="mt-1.5 h-4 px-1">
                    {form.anio_academico_id ? (
                        <span className="text-[10px] text-green-600 font-bold uppercase flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                            <CheckCircleIcon className="w-3 h-3" /> Seleccionado: {form.anioNombre}
                        </span>
                    ) : (
                        <span className="text-[10px] text-slate-400 italic">
                            {inputValue && !loading ? 'Haz clic en un año de la lista' : 'Escribe para buscar un año'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnioAcademicoSearchSelect;