import React from 'react';
import GradoSearchSelect from 'components/Shared/Comboboxes/GradoSearchSelect'; 
import { BookmarkIcon, UsersIcon } from '@heroicons/react/24/outline';

const SeccionForm = ({ data, setForm, isGradeLocked = false }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6">
            
            {/* GRADO ACADÉMICO */}
            <div>
                <GradoSearchSelect 
                    form={data} 
                    setForm={setForm}
                    disabled={isGradeLocked}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NOMBRE DE SECCIÓN */}
                <div>
                    <label className="block text-sm font-black text-slate-700 uppercase mb-2">
                        Nombre de Sección <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            name="nombre"
                            value={data.nombre}
                            onChange={handleChange}
                            placeholder="Ej: A, B, Única..."
                            className="w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all uppercase"
                        />
                        <div className="absolute left-3 text-slate-400">
                            <BookmarkIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">Identificador de la sección.</p>
                </div>

                {/* VACANTES */}
                <div>
                    <label className="block text-sm font-black text-slate-700 uppercase mb-2">
                        Vacantes Máximas <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                        <input
                            type="number"
                            name="vacantes_maximas"
                            value={data.vacantes_maximas}
                            onChange={handleChange}
                            placeholder="Ej: 30"
                            min="1"
                            className="w-full border border-slate-300 rounded-md shadow-sm pl-9 pr-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-mono font-bold"
                        />
                        <div className="absolute left-3 text-slate-400">
                            <UsersIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">Límite de alumnos por aula.</p>
                </div>
            </div>
        </div>
    );
};

export default SeccionForm;