import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/nivelService';
import { MagnifyingGlassIcon, BuildingLibraryIcon, XMarkIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const NivelSearchSelect = ({ form, setForm, disabled, isFilter = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        if (form && form.nivelNombre) {
            setInputValue(form.nivelNombre);
        } else if (form && !form.nivel_id) {
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

    const fetchNiveles = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await index(1, { search: searchTerm });
            const lista = response.data || [];
            setSuggestions(lista);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error al buscar niveles", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);

        if (form.nivel_id) {
            setForm(prev => ({ ...prev, nivel_id: '', nivelNombre: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
            fetchNiveles(texto);
        }, 500);
    };

    const handleInputClick = () => {
        if (disabled) return; // Bloqueo click

        if (!showSuggestions) {
            if (suggestions.length === 0) {
                fetchNiveles('');
            } else {
                setShowSuggestions(true);
            }
        }
    };

    const handleSelect = (nivel) => {
        setInputValue(nivel.nombre);
        setForm(prev => ({ 
            ...prev, 
            nivel_id: nivel.id, 
            nivelNombre: nivel.nombre 
        }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, nivel_id: '', nivelNombre: '' }));
        fetchNiveles('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {!isFilter && (
                <label className="block text-sm font-black text-slate-700 uppercase mb-2">
                    Nivel Educativo <span className="text-red-500">*</span>
                </label>
            )}
            
            <div className="relative flex items-center group">

                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todos los niveles" : "Ej: Primaria..."}
                    className={`w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-3'} 
                        ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' : 'bg-white'}
                    `}
                    autoComplete="off"
                />

                <div className="absolute left-3 text-slate-400">
                    <BuildingLibraryIcon className="w-4 h-4" />
                </div>

                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div>
                    ) : disabled ? (
                        <LockClosedIcon className="w-4 h-4 text-slate-400" />
                    ) : inputValue ? (
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
                            suggestions.map((nivel) => (
                                <li
                                    key={nivel.id}
                                    onClick={() => handleSelect(nivel)}
                                    className={`px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2 transition-colors ${
                                        form.nivel_id === nivel.id 
                                        ? 'bg-slate-100 text-black font-bold' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-black'
                                    }`}
                                >
                                    <BuildingLibraryIcon className="w-4 h-4 opacity-50" />
                                    {nivel.nombre}
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
                    {form.nivel_id ? (
                        <span className={`font-bold flex items-center gap-1 ${disabled ? 'text-slate-500' : 'text-green-600 animate-pulse'}`}>
                             {disabled ? '🔒 Asignado:' : '✓ Seleccionado:'} {form.nivelNombre}
                        </span>
                    ) : (
                        <span className="text-gray-400 italic">
                            {inputValue && !loading ? 'Selecciona una opción de la lista' : 'Busca y selecciona un nivel'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default NivelSearchSelect;