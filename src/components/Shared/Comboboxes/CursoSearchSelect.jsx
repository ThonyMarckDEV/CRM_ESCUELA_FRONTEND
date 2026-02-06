import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/cursoService';
import { 
    MagnifyingGlassIcon, 
    BookOpenIcon, 
    XMarkIcon,
    LockClosedIcon 
} from '@heroicons/react/24/outline';

const CursoSearchSelect = ({ form, setForm, disabled, isFilter = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        if (form && form.cursoNombre) {
            setInputValue(form.cursoNombre);
        } else if (form && !form.curso_id) {
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

    const fetchCursos = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await index(1, { search: searchTerm });
            const lista = response.data || [];
            setSuggestions(lista);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error al buscar cursos", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);

        if (form.curso_id) {
            setForm(prev => ({ ...prev, curso_id: '', cursoNombre: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
            fetchCursos(texto);
        }, 500);
    };

    const handleInputClick = () => {
        if (disabled) return; // Bloqueo de click

        if (!showSuggestions) {
            if (suggestions.length === 0) {
                fetchCursos('');
            } else {
                setShowSuggestions(true);
            }
        }
    };

    const handleSelect = (curso) => {
        setInputValue(curso.nombre);
        setForm(prev => ({ 
            ...prev, 
            curso_id: curso.id, 
            cursoNombre: curso.nombre 
        }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, curso_id: '', cursoNombre: '' }));
        fetchCursos('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {!isFilter && (
                <label className="block text-sm font-black text-slate-700 uppercase mb-2">
                    Curso <span className="text-red-500">*</span>
                </label>
            )}
            
            <div className="relative flex items-center group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todos los cursos" : "Ej: Matemática, Lenguaje..."}
                    className={`w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-3'} 
                        ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' : 'bg-white'}
                    `}
                    autoComplete="off"
                />

                <div className="absolute left-3 text-slate-400">
                    <BookOpenIcon className="w-4 h-4" />
                </div>

                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div>
                    ) : disabled ? (
                        // Candado si bloqueado
                        <LockClosedIcon className="w-4 h-4 text-slate-400" />
                    ) : inputValue ? (
                        // X para limpiar
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
                            suggestions.map((curso) => (
                                <li
                                    key={curso.id}
                                    onClick={() => handleSelect(curso)}
                                    className={`px-4 py-2.5 cursor-pointer text-sm flex items-center gap-2 transition-colors ${
                                        form.curso_id === curso.id 
                                        ? 'bg-slate-100 text-black font-bold' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-black'
                                    }`}
                                >
                                    <BookOpenIcon className="w-4 h-4 opacity-50" />
                                    {curso.nombre}
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
                    {form.curso_id ? (
                        <span className={`font-bold flex items-center gap-1 ${disabled ? 'text-slate-500' : 'text-green-600 animate-pulse'}`}>
                            {disabled ? '🔒 Asignado:' : '✓ Seleccionado:'} {form.cursoNombre}
                        </span>
                    ) : (
                        <span className="text-gray-400 italic">
                            {inputValue && !loading ? 'Selecciona una opción de la lista' : 'Busca y selecciona un curso'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default CursoSearchSelect;