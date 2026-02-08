import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/mallaCurricularService';
import { 
    MagnifyingGlassIcon, 
    BookOpenIcon, 
    XMarkIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const MallaSearchSelect = ({ form, setForm, gradoId, disabled, isFilter = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        if (form && form.cursoNombre) {
            setInputValue(form.cursoNombre);
        } else if (form && !form.malla_curricular_id) {
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
        if (!gradoId && !isFilter) return;

        setLoading(true);
        try {
            const response = await index(1, { 
                grado_id: gradoId,
                search: searchTerm 
            });
            
            let lista = response.data || [];
            if (searchTerm && !lista.length) {
            }

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

        if (form.malla_curricular_id) {
            setForm(prev => ({ ...prev, malla_curricular_id: '', cursoNombre: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchCursos(texto);
        }, 300);
    };

    const handleInputClick = () => {
        if (disabled || (!gradoId && !isFilter)) return;
        if (!showSuggestions) {
            fetchCursos('');
        }
    };

    const handleSelect = (mallaItem) => {
        const nombreCurso = mallaItem.curso_nombre || mallaItem.curso?.nombre;
        setInputValue(nombreCurso);
        
        setForm(prev => ({ 
            ...prev, 
            malla_curricular_id: mallaItem.id, 
            cursoNombre: nombreCurso
        }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, malla_curricular_id: '', cursoNombre: '' }));
        if (showSuggestions && gradoId) fetchCursos('');
    };

    const isLocked = !gradoId && !isFilter;

    return (
        <div className="relative w-full" ref={wrapperRef}>
            {!isFilter && (
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Curso / Materia <span className="text-red-500">*</span>
                </label>
            )}
            
            <div className="relative flex items-center group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled || isLocked}
                    placeholder={isLocked ? "Seleccione un Grado primero" : "Buscar curso..."}
                    className={`w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-2.5'} 
                        ${(disabled || isLocked) ? 'bg-gray-100 cursor-not-allowed text-slate-400' : 'bg-white'}
                    `}
                    autoComplete="off"
                />

                <div className="absolute left-3 text-slate-400">
                    <BookOpenIcon className="w-5 h-5" />
                </div>

                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                    ) : inputValue && !disabled && !isLocked ? (
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500 transition-colors">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        isLocked ? <ExclamationCircleIcon className="w-4 h-4 text-orange-400"/> : <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    )}
                </div>

                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                        {suggestions.length > 0 ? (
                            suggestions.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    className="px-4 py-2.5 cursor-pointer text-sm flex items-center justify-between transition-colors border-b border-slate-50 last:border-0 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-blue-50 rounded text-blue-600">
                                            <BookOpenIcon className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-slate-700">
                                            {item.curso_nombre || item.curso?.nombre}
                                        </span>
                                    </div>
                                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">
                                        {item.horas_semanales} hrs
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-4 text-slate-400 text-xs text-center italic">
                                {loading ? 'Buscando...' : 'No se encontraron cursos'}
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MallaSearchSelect;