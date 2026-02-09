import React, { useState, useEffect, useRef } from 'react';
import { index } from 'services/seccionService';
import { MagnifyingGlassIcon, RectangleGroupIcon, XMarkIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const SeccionSearchSelect = ({ form, setForm, disabled, isFilter = false, gradoId = null }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);
    const prevGradoIdRef = useRef(gradoId);

    useEffect(() => {
        if (form?.seccion_id) {
            if (inputValue !== form.seccionNombre) {
                setInputValue(form.seccionNombre || '');
            }
        } else {
            setInputValue('');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form?.seccion_id, form?.seccionNombre]); 

    useEffect(() => {
        if (prevGradoIdRef.current !== gradoId) {
            prevGradoIdRef.current = gradoId;
            
            if (form.seccion_id) {
                setInputValue('');
                setForm(prev => ({ 
                    ...prev, 
                    seccion_id: '', 
                    seccionNombre: '' 
                }));
            }
            
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [gradoId, form.seccion_id, setForm]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSecciones = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await index(1, { search: searchTerm, estado: 1, grado_id: gradoId || '' });
            setSuggestions(response.data || []);
            setShowSuggestions(true);
        } catch (error) { setSuggestions([]); } 
        finally { setLoading(false); }
    };

    const handleChange = (e) => {
        const texto = e.target.value;
        setInputValue(texto);
        if (form.seccion_id) setForm(prev => ({ ...prev, seccion_id: '', seccionNombre: '' }));
        
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSecciones(texto), 500);
    };

    const handleSelect = (seccion) => {
        if (seccion.esta_llena && !isFilter) return;
        setInputValue(seccion.nombre);
        setForm(prev => ({ ...prev, seccion_id: seccion.id, seccionNombre: seccion.nombre, gradoNombre: seccion.grado_nombre || prev.gradoNombre }));
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setForm(prev => ({ ...prev, seccion_id: '', seccionNombre: '' }));
        fetchSecciones('');
    };

    const handleInputClick = () => {
        if (disabled) return;
        if (!showSuggestions) {
            if (suggestions.length === 0) fetchSecciones('');
            else setShowSuggestions(true);
        }
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            {!isFilter && <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sección <span className="text-red-500">*</span></label>}
            <div className="relative flex items-center group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    disabled={disabled}
                    placeholder={isFilter ? "Todas las secciones" : "Buscar sección..."}
                    className={`w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-8 text-sm focus:ring-1 focus:ring-black outline-none transition-all placeholder-slate-400 ${isFilter ? 'py-2' : 'py-3'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    autoComplete="off"
                />
                <div className="absolute left-3 text-slate-400"><RectangleGroupIcon className="w-4 h-4" /></div>
                <div className="absolute right-2 flex items-center">
                    {loading ? <div className="w-4 h-4 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div> : inputValue && !disabled ? <button onClick={handleClear} type="button" className="text-slate-400 hover:text-red-500"><XMarkIcon className="w-4 h-4" /></button> : <MagnifyingGlassIcon className="w-4 h-4 text-slate-400" />}
                </div>
                {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                        {suggestions.length > 0 ? suggestions.map((seccion) => (
                            <li key={seccion.id} onClick={() => handleSelect(seccion)} className={`px-4 py-2.5 text-sm flex items-center justify-between gap-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${form.seccion_id === seccion.id ? 'bg-slate-100' : ''}`}>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-700">{seccion.nombre}</span>
                                    {seccion.grado_nombre && <span className="text-[10px] text-slate-400 flex gap-1"><AcademicCapIcon className="w-3 h-3"/> {seccion.grado_nombre}</span>}
                                </div>
                                {!seccion.esta_llena && <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 flex gap-1"><UserGroupIcon className="w-3 h-3"/> {seccion.vacantes_disponibles} Libres</span>}
                            </li>
                        )) : <li className="px-4 py-4 text-slate-400 text-xs text-center italic">Sin resultados</li>}
                    </ul>
                )}
            </div>
            {!isFilter && <div className="mt-2 text-xs h-4">{form.seccion_id ? <span className="text-green-600 font-bold flex gap-1">✓ Seleccionado: {form.seccionNombre}</span> : <span className="text-gray-400 italic">Seleccione una sección</span>}</div>}
        </div>
    );
};

export default SeccionSearchSelect;