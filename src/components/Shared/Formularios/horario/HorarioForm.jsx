import React from 'react';
import { 
    ClockIcon, 
    MapPinIcon, 
} from '@heroicons/react/24/outline';

import AnioAcademicoSearchSelect from 'components/Shared/Comboboxes/AnioAcademicoSearchSelect';
import DocenteSearchSelect from 'components/Shared/Comboboxes/DocenteSearchSelect';
import GradoSearchSelect from 'components/Shared/Comboboxes/GradoSearchSelect';
import SeccionSearchSelect from 'components/Shared/Comboboxes/SeccionSearchSelect';
import MallaSearchSelect from 'components/Shared/Comboboxes/MallaSearchSelect'; 

const HorarioForm = ({ 
    data, 
    handleChange, 
    setForm, 
    isEdit = false, 
    disabled = false,
    security = {} 
}) => {
    
    const diasSemana = [
        { id: 1, nombre: 'Lunes' },
        { id: 2, nombre: 'Martes' },
        { id: 3, nombre: 'Miércoles' },
        { id: 4, nombre: 'Jueves' },
        { id: 5, nombre: 'Viernes' },
        { id: 6, nombre: 'Sábado' },
        { id: 7, nombre: 'Domingo' },
    ];

    return (
        <div className="grid grid-cols-12 gap-6">
            
            {/* 1. ASIGNACIÓN DOCENTE */}
            <div className="col-span-12">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                    1. Asignación Docente
                </h3>
            </div>

            <div className="col-span-12 md:col-span-6">
                <div className={`relative flex items-center ${disabled ? 'opacity-60' : ''}`}>
                    <div className="w-full">
                        <AnioAcademicoSearchSelect 
                            form={data} 
                            setForm={setForm} 
                            disabled={disabled || isEdit}
                        />
                    </div>
                </div>
            </div>

            <div className="col-span-12 md:col-span-6">
                <div className={`relative flex items-center ${disabled ? 'opacity-60' : ''}`}>
                    <div className="w-full">
                        <DocenteSearchSelect 
                            form={data} 
                            setForm={setForm} 
                            disabled={disabled}
                        />
                    </div>
                </div>
            </div>

            {/* 2. GRUPO Y MATERIA */}
            <div className="col-span-12 mt-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                    2. Grupo y Materia
                </h3>
            </div>

            {/* GRADO */}
            <div className="col-span-12 md:col-span-4">
                <div className="relative flex items-center">
                    <div className="w-full">
                        <GradoSearchSelect 
                            form={data} 
                            setForm={setForm}
                            disabled={disabled || security.hasAsistencia}
                        />
                    </div>
                </div>
            </div>

            {/* SECCIÓN */}
            <div className="col-span-12 md:col-span-4">

                <div className={`relative flex items-center ${!data.grado_id ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="w-full">
                        <SeccionSearchSelect 
                            form={data} 
                            setForm={setForm} // <--- AQUÍ ESTÁ EL FIX: Se manda setForm directo
                            gradoId={data.grado_id} 
                            disabled={disabled || !data.grado_id || security.hasAsistencia}
                        />
                    </div>
                </div>
                {!data.grado_id && <p className="text-[10px] text-orange-500 mt-1 ml-1">* Seleccione un Grado primero</p>}
            </div>

            {/* CURSO / MALLA */}
            <div className="col-span-12 md:col-span-4">
                <div className={`relative flex items-center ${!data.grado_id ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="w-full">
                        <MallaSearchSelect 
                            form={data} 
                            setForm={setForm}
                            gradoId={data.grado_id} 
                            disabled={disabled || !data.grado_id || security.hasAsistencia}
                        />
                    </div>
                </div>
            </div>

            {/* 3. DETALLE HORARIO */}
            <div className="col-span-12 mt-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                    3. Detalle Horario
                </h3>
            </div>

            <div className="col-span-12 md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Día <span className="text-red-500">*</span>
                </label>
                <select
                    name="dia_semana"
                    value={data.dia_semana}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-full border border-slate-300 rounded-lg p-2.5 pl-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm font-medium"
                >
                    <option value="">-- Seleccionar --</option>
                    {diasSemana.map(dia => (
                        <option key={dia.id} value={dia.id}>{dia.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="col-span-6 md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hora Inicio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <ClockIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                        type="time" 
                        name="hora_inicio"
                        value={data.hora_inicio}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    />
                </div>
            </div>

            <div className="col-span-6 md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Hora Fin <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <ClockIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                        type="time" 
                        name="hora_fin"
                        value={data.hora_fin}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    />
                </div>
            </div>

            <div className="col-span-12">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Aula Física / Ubicación (Opcional)
                </label>
                <div className="relative">
                    <MapPinIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                        type="text" 
                        name="aula_fisica"
                        value={data.aula_fisica || ''}
                        onChange={handleChange}
                        disabled={disabled}
                        placeholder="Ej: Pabellón B - Aula 204"
                        className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>
            </div>

            {security.hasAsistencia && (
                <div className="col-span-12 mt-2">
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded text-orange-700 text-xs flex items-center gap-2">
                        <span className="font-bold">Bloqueado:</span> 
                        Este horario ya tiene registros de asistencia. No se puede modificar el Grado, Sección ni Curso.
                    </div>
                </div>
            )}
        </div>
    );
};

export default HorarioForm;