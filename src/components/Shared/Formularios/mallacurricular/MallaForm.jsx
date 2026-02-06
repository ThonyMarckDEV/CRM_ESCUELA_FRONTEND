import React from 'react';
import GradoSearchSelect from 'components/Shared/Comboboxes/GradoSearchSelect';
import CursoSearchSelect from 'components/Shared/Comboboxes/CursoSearchSelect';
import { ClockIcon } from '@heroicons/react/24/outline';

const MallaForm = ({ data, setForm, isLocked = false }) => {
    
    const handleChange = (e) => {
        setForm({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            
            {/* GRADO - BLOQUEABLE */}
            <div>
                <GradoSearchSelect 
                    form={data} 
                    setForm={setForm} 
                    disabled={isLocked}
                />
            </div>

            {/* CURSO - BLOQUEABLE */}
            <div>
                <CursoSearchSelect 
                    form={data} 
                    setForm={setForm} 
                    disabled={isLocked}
                />
            </div>

            {/* HORAS - SIEMPRE EDITABLE */}
            <div>
                <label className="block text-sm font-black text-slate-700 uppercase mb-2">
                    Horas Semanales <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <ClockIcon className="w-5 h-5" />
                    </div>
                    <input
                        type="number"
                        name="horas_semanales"
                        value={data.horas_semanales}
                        onChange={handleChange}
                        placeholder="Ej: 4"
                        min="1"
                        max="40"
                        className="w-full border border-slate-300 rounded-md shadow-sm pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-mono font-bold"
                    />
                </div>
                <p className="text-xs text-slate-400 mt-1 ml-1">Cantidad de horas pedagógicas por semana.</p>
            </div>
        </div>
    );
};

export default MallaForm;