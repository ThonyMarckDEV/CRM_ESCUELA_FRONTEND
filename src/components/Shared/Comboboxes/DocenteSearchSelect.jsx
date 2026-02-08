import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/empleadoService'; 
import { 
    MagnifyingGlassIcon, 
    UserIcon, 
    XMarkIcon, 
    IdentificationIcon,
    BriefcaseIcon 
} from '@heroicons/react/24/outline';

const DocenteSearchSelect = ({ form, setForm, disabled, isFilter = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null); 

    // Sincronizar input con el estado del formulario padre
    useEffect(() => {
        if (form && form.docenteNombre) {
            setInputValue(form.docenteNombre);
        } else if (form && !form.docente_id) {
            setInputValue('');
        }
    }, [form]);

    // Cerrar al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const fetchDocentes = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await index(1, { 
                search: searchTerm, 
                estado: 'Activo',
                rol_id: 4
            });
            const lista = response.data || [];
            setSuggestions(lista);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error al buscar docentes", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);

        // Si el usuario escribe, limpiamos el ID seleccionado para obligarlo a seleccionar de nuevo
        if (form.docente_id) {
            setForm(prev => ({ ...prev, docente_id: '', docenteNombre: '' }));
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
            fetchDocentes(texto);
        }, 500);
    };

    const handleInputClick = () => {
        if (disabled) return;
        if (!showSuggestions) {
            if (suggestions.length === 0) {
                fetchDocentes('');
            } else {
                setShowSuggestions(true);
            }
        }
    };

    const handleSelect = (docente) => {
        const nombreCompleto = docente.nombre_completo || `${docente.nombres} ${docente.apellido_paterno} ${docente.apellido_materno || ''}`;
        
        setInputValue(nombreCompleto);
        
        const idParaGuardar = docente.usuario?.id || docente.user_id || docente.id; 

        setForm(prev => ({ 
            ...prev, 
            docente_id: idParaGuardar, 
            docenteNombre: nombreCompleto
        }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, docente_id: '', docenteNombre: '' }));
        if (showSuggestions) fetchDocentes('');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {!isFilter && (
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Docente <span className="text-red-500">*</span>
                </label>
            )}
            
            <div className="relative flex items-center group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todos los docentes" : "Buscar por nombre o DNI..."}
                    className={`w-full border border-slate-300 rounded-lg shadow-sm pl-9 pr-8 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-400 
                        ${isFilter ? 'py-2' : 'py-2.5'} 
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                    `}
                    autoComplete="off"
                />

                <div className="absolute left-3 text-slate-400">
                    <BriefcaseIcon className="w-5 h-5" />
                </div>

                <div className="absolute right-2 flex items-center">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                    ) : inputValue && !disabled ? (
                        <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500 transition-colors">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    ) : (
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />
                    )}
                </div>

                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                        {suggestions.length > 0 ? (
                            suggestions.map((docente) => (
                                <li
                                    key={docente.id}
                                    onClick={() => handleSelect(docente)}
                                    className={`px-4 py-2.5 cursor-pointer text-sm flex items-start gap-3 transition-colors border-b border-slate-50 last:border-0 hover:bg-slate-50`}
                                >
                                    <div className="mt-0.5 text-slate-400 bg-slate-100 p-1.5 rounded-full">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700">
                                            {docente.nombre_completo || `${docente.nombres} ${docente.apellido_paterno}`}
                                        </span>
                                        <div className="flex gap-2 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <IdentificationIcon className="w-3 h-3"/> {docente.dni}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-4 text-slate-400 text-xs text-center italic">
                                {loading ? 'Buscando...' : 'No se encontraron docentes'}
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DocenteSearchSelect;