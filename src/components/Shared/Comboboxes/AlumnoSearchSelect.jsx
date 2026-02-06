import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/alumnoService';
import { 
    MagnifyingGlassIcon, 
    AcademicCapIcon, 
    XMarkIcon, 
    IdentificationIcon 
} from '@heroicons/react/24/outline';

const AlumnoSearchSelect = ({ form, setForm, disabled, isFilter = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    useEffect(() => {
        if (form && form.alumnoNombre) {
            setInputValue(form.alumnoNombre);
        } else if (form && !form.alumno_id) {
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

    const fetchAlumnos = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await index(1, { 
                search: searchTerm, 
                estado: 1
            });
            const lista = response.data || [];
            setSuggestions(lista);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error al buscar alumnos", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);

        if (form.alumno_id) {
            setForm(prev => ({ ...prev, alumno_id: '', alumnoNombre: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
            fetchAlumnos(texto);
        }, 500);
    };

    const handleInputClick = () => {
        if (disabled) return;
        if (!showSuggestions) {
            if (suggestions.length === 0) {
                fetchAlumnos('');
            } else {
                setShowSuggestions(true);
            }
        }
    };

    const handleSelect = (alumno) => {
        setInputValue(alumno.nombre_completo);
        
        setForm(prev => ({ 
            ...prev, 
            alumno_id: alumno.id, 
            alumnoNombre: alumno.nombre_completo,
            alumnoDni: alumno.dni 
        }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, alumno_id: '', alumnoNombre: '' }));
        if (showSuggestions) fetchAlumnos('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {!isFilter && (
                <label className="block text-sm font-black text-slate-700 uppercase mb-2">
                    Alumno <span className="text-red-500">*</span>
                </label>
            )}
            
            <div className="relative flex items-center group">

                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todos los alumnos" : "Buscar por nombre, DNI o código..."}
                    className={`w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-3'} 
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                    autoComplete="off"
                />

                {/* Icono izquierdo (Gorro académico) */}
                <div className="absolute left-3 text-slate-400">
                    <AcademicCapIcon className="w-4 h-4" />
                </div>

                <div className="absolute right-2 flex items-center">
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
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl animate-in fade-in zoom-in duration-100">
                        {suggestions.length > 0 ? (
                            suggestions.map((alumno) => (
                                <li
                                    key={alumno.id}
                                    onClick={() => handleSelect(alumno)}
                                    className={`px-4 py-2.5 cursor-pointer text-sm flex items-start gap-3 transition-colors border-b border-slate-50 last:border-0
                                        ${form.alumno_id === alumno.id 
                                            ? 'bg-slate-100' 
                                            : 'hover:bg-slate-50'
                                        }`}
                                >
                                    {/* Icono DNI */}
                                    <div className="mt-0.5 text-slate-400">
                                        <IdentificationIcon className="w-5 h-5" />
                                    </div>

                                    {/* Info Alumno */}
                                    <div className="flex flex-col">
                                        <span className={`font-medium ${form.alumno_id === alumno.id ? 'text-black font-bold' : 'text-slate-700'}`}>
                                            {alumno.nombre_completo}
                                        </span>
                                        <div className="flex gap-2 text-xs text-slate-400">
                                            <span className="bg-slate-100 px-1.5 rounded border border-slate-200">
                                                DNI: {alumno.dni}
                                            </span>
                                            <span className="bg-blue-50 text-blue-600 px-1.5 rounded border border-blue-100">
                                                COD: {alumno.codigo}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-4 text-slate-400 text-xs text-center italic flex flex-col items-center gap-1">
                                <MagnifyingGlassIcon className="w-6 h-6 opacity-30"/>
                                <span>{loading ? 'Buscando...' : 'No se encontraron alumnos activos'}</span>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* Helper Text para mostrar selección */}
            {!isFilter && (
                <div className="mt-2 text-xs h-4">
                    {form.alumno_id ? (
                        <span className="text-green-600 font-bold flex items-center gap-1 animate-pulse">
                            ✓ Seleccionado: {form.alumnoNombre}
                        </span>
                    ) : (
                        <span className="text-gray-400 italic">
                            {inputValue && !loading ? 'Selecciona un estudiante de la lista' : 'Ingresa datos para buscar'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default AlumnoSearchSelect;