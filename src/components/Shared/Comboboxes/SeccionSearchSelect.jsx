import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/seccionService';
import { 
    MagnifyingGlassIcon, 
    RectangleGroupIcon, 
    AcademicCapIcon, 
    XMarkIcon,
    UserGroupIcon 
} from '@heroicons/react/24/outline';

const SeccionSearchSelect = ({ form, setForm, disabled, isFilter = false, gradoId = null }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        if (form && form.seccionNombre) {
            setInputValue(form.seccionNombre);
        } else if (form && !form.seccion_id) {
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

    const fetchSecciones = async (searchTerm = '') => {
        setLoading(true);
        try {
            const filters = {
                search: searchTerm,
                estado: 1,
                grado_id: gradoId || '' 
            };
            const response = await index(1, filters);
            const lista = response.data || [];
            setSuggestions(lista);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error al buscar secciones", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);
        if (form.seccion_id) setForm(prev => ({ ...prev, seccion_id: '', seccionNombre: '' }));
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => { fetchSecciones(texto); }, 500);
    };

    const handleInputClick = () => {
        if (disabled) return;
        if (!showSuggestions) {
            if (suggestions.length === 0) fetchSecciones('');
            else setShowSuggestions(true);
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, seccion_id: '', seccionNombre: '' }));
        if (showSuggestions) fetchSecciones('');
    };

    const handleSelect = (seccion) => {
        if (seccion.esta_llena && !isFilter) return; 

        setInputValue(seccion.nombre);
        setForm(prev => ({ 
            ...prev, 
            seccion_id: seccion.id, 
            seccionNombre: seccion.nombre,
            gradoNombre: seccion.grado_nombre || '' 
        }));
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {!isFilter && (
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Sección <span className="text-red-500">*</span>
                </label>
            )}
            
            <div className="relative flex items-center group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todas las secciones" : "Buscar sección..."}
                    className={`w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-3'} 
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                    autoComplete="off"
                />
                <div className="absolute left-3 text-slate-400"><RectangleGroupIcon className="w-4 h-4" /></div>
                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div>
                    ) : inputValue ? (
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500 transition-colors"><XMarkIcon className="w-4 h-4" /></button>
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    )}
                </div>

                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl animate-in fade-in zoom-in duration-100">
                        {suggestions.length > 0 ? (
                            suggestions.map((seccion) => (
                                <li
                                    key={seccion.id}
                                    onClick={() => handleSelect(seccion)}
                                    className={`px-4 py-2.5 text-sm flex items-center justify-between gap-3 border-b border-slate-50 last:border-0 transition-colors
                                        ${seccion.esta_llena && !isFilter 
                                            ? 'bg-red-50 cursor-not-allowed opacity-80'
                                            : 'cursor-pointer hover:bg-slate-50' 
                                        }
                                        ${form.seccion_id === seccion.id ? 'bg-slate-100' : ''}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="mt-0.5 text-slate-400"><RectangleGroupIcon className="w-5 h-5" /></div>
                                        <div className="flex flex-col">
                                            <span className={`font-black uppercase ${seccion.esta_llena && !isFilter ? 'text-red-600' : 'text-slate-700'}`}>
                                                {seccion.nombre}
                                            </span>
                                            {seccion.grado_nombre && (
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1 uppercase">
                                                    <AcademicCapIcon className="w-3 h-3" />
                                                    {seccion.grado_nombre} {seccion.nivel_nombre}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* INFO DE VACANTES */}
                                    <div className="flex flex-col items-end">
                                        {seccion.esta_llena ? (
                                            <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                                                LLENO
                                            </span>
                                        ) : (
                                            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                                                <UserGroupIcon className="w-3 h-3"/>
                                                {/* Mostramos Disponibles / Totales */}
                                                <span>{seccion.vacantes_disponibles} / {seccion.vacantes_maximas} Libres</span>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-4 text-slate-400 text-xs text-center italic flex flex-col items-center gap-1">
                                <MagnifyingGlassIcon className="w-6 h-6 opacity-30"/>
                                <span>{loading ? 'Buscando...' : 'No se encontraron secciones'}</span>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {!isFilter && (
                <div className="mt-2 text-xs h-4">
                    {form.seccion_id ? (
                        <span className="text-green-600 font-bold flex items-center gap-1 animate-pulse">
                            ✓ Seleccionado: {form.seccionNombre}
                        </span>
                    ) : (
                        <span className="text-gray-400 italic">
                            {inputValue && !loading ? 'Selecciona una sección' : 'Busca por nombre'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default SeccionSearchSelect;