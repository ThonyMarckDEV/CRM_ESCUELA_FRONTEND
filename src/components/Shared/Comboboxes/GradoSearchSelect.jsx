import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/gradoService';
import { 
    MagnifyingGlassIcon, 
    AcademicCapIcon, 
    XMarkIcon, 
    LockClosedIcon 
} from '@heroicons/react/24/outline';

const GradoSearchSelect = ({ form, setForm, disabled, isFilter = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        if (form && form.gradoNombre) {
            setInputValue(form.gradoNombre);
        } else if (form && !form.grado_id) {
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

    const fetchGrados = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await index(1, { search: searchTerm });
            const lista = response.data || [];
            setSuggestions(lista);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error al buscar grados", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);

        if (form.grado_id) {
            setForm(prev => ({ ...prev, grado_id: '', gradoNombre: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
            fetchGrados(texto);
        }, 500);
    };

    const handleInputClick = () => {
        if (disabled) return; // Bloqueo de click

        if (!showSuggestions) {
            if (suggestions.length === 0) {
                fetchGrados('');
            } else {
                setShowSuggestions(true);
            }
        }
    };

    const handleSelect = (grado) => {
        setInputValue(grado.nombre);
        setForm(prev => ({ 
            ...prev, 
            grado_id: grado.id, 
            gradoNombre: grado.nombre 
        }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, grado_id: '', gradoNombre: '' }));
        fetchGrados('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {!isFilter && (
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Grado <span className="text-red-500">*</span>
                </label>
            )}
            
            <div className="relative flex items-center group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todos los grados" : "Ej: 1ero Primaria..."}
                    className={`w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-3'} 
                        ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' : 'bg-white'}
                    `}
                    autoComplete="off"
                />

                <div className="absolute left-3 text-slate-400">
                    <AcademicCapIcon className="w-4 h-4" />
                </div>

                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div>
                    ) : disabled ? (
                        // Muestra candado si está bloqueado
                        <LockClosedIcon className="w-4 h-4 text-slate-400" />
                    ) : inputValue ? (
                        // Muestra X solo si hay valor y NO está bloqueado
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    )}
                </div>

                {showSuggestions && !disabled && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl animate-in fade-in zoom-in duration-100">
                        {suggestions.length > 0 ? (
                            suggestions.map((grado) => (
                                <li
                                    key={grado.id}
                                    onClick={() => handleSelect(grado)}
                                    className={`px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2 transition-colors ${
                                        form.grado_id === grado.id 
                                        ? 'bg-slate-100 text-black font-bold' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-black'
                                    }`}
                                >
                                    <AcademicCapIcon className="w-4 h-4 opacity-50" />
                                    {grado.nombre}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-slate-400 text-xs text-center italic">
                                {loading ? 'Buscando...' : 'No se encontraron resultados'}
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {!isFilter && (
                <div className="mt-2 text-xs h-4">
                    {form.grado_id ? (
                        <span className={`font-bold flex items-center gap-1 ${disabled ? 'text-slate-500' : 'text-green-600 animate-pulse'}`}>
                            {disabled ? '🔒 Asignado:' : '✓ Seleccionado:'} {form.gradoNombre}
                        </span>
                    ) : (
                        <span className="text-gray-400 italic">
                            {inputValue && !loading ? 'Selecciona una opción' : 'Busca y selecciona un grado'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default GradoSearchSelect;