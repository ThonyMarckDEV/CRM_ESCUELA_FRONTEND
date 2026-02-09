import React, { useMemo, useState } from 'react';
import { 
    MapPinIcon, 
    CalculatorIcon,
    ExclamationTriangleIcon,
    CheckBadgeIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

import AnioAcademicoSearchSelect from 'components/Shared/Comboboxes/AnioAcademicoSearchSelect';
import DocenteSearchSelect from 'components/Shared/Comboboxes/DocenteSearchSelect';
import GradoSearchSelect from 'components/Shared/Comboboxes/GradoSearchSelect';
import SeccionSearchSelect from 'components/Shared/Comboboxes/SeccionSearchSelect';
import MallaSearchSelect from 'components/Shared/Comboboxes/MallaSearchSelect'; 
import HorarioSeccionModal from 'components/Shared/Tables/HorarioSeccionModal'; 

const HorarioForm = ({ 
    data, 
    handleChange, 
    setForm, 
    isEdit = false, 
    disabled = false,
    security = {} 
}) => {
    
    // --- ESTADO PARA EL MODAL ---
    const [showModal, setShowModal] = useState(false);

    const diasLaborables = [
        { id: 1, nombre: 'Lunes' },
        { id: 2, nombre: 'Martes' },
        { id: 3, nombre: 'Miércoles' },
        { id: 4, nombre: 'Jueves' },
        { id: 5, nombre: 'Viernes' },
    ];

    // --- CÁLCULO DE HORAS EN TIEMPO REAL ---
    const calculoHoras = useMemo(() => {
        if (isEdit) return { asignadas: 0, faltantes: 0, estado: 'neutral' };

        const matrix = data.horariosMatrix || {};
        let minutosTotales = 0;

        Object.values(matrix).forEach(dia => {
            if (dia.hora_inicio && dia.hora_fin) {
                const [h1, m1] = dia.hora_inicio.split(':').map(Number);
                const [h2, m2] = dia.hora_fin.split(':').map(Number);
                
                const inicio = h1 * 60 + m1;
                const fin = h2 * 60 + m2;

                if (fin > inicio) {
                    minutosTotales += (fin - inicio);
                }
            }
        });

        const horasAsignadas = parseFloat((minutosTotales / 60).toFixed(1)); 
        const horasRequeridas = data.horas_semanales || 0;
        const diferencia = horasRequeridas - horasAsignadas;

        let estado = 'neutral';
        if (horasRequeridas > 0) {
            if (diferencia > 0) estado = 'incompleto';
            else if (diferencia === 0) estado = 'completo';
            else estado = 'excedido';
        }

        return { 
            asignadas: horasAsignadas, 
            requeridas: horasRequeridas,
            faltantes: diferencia,
            estado
        };
    }, [data.horariosMatrix, data.horas_semanales, isEdit]);


    const handleCheckDia = (diaId) => {
        const matrix = data.horariosMatrix || {};
        if (matrix[diaId]) {
            const newMatrix = { ...matrix };
            delete newMatrix[diaId];
            setForm(prev => ({ ...prev, horariosMatrix: newMatrix }));
        } else {
            setForm(prev => ({ 
                ...prev, 
                horariosMatrix: { 
                    ...matrix, 
                    [diaId]: { hora_inicio: '', hora_fin: '' } 
                } 
            }));
        }
    };

    const handleTimeChange = (diaId, field, value) => {
        setForm(prev => ({
            ...prev,
            horariosMatrix: {
                ...prev.horariosMatrix,
                [diaId]: {
                    ...prev.horariosMatrix[diaId],
                    [field]: value
                }
            }
        }));
    };

    return (
        <div className="grid grid-cols-12 gap-6">
            
            {/* 1. DATOS GENERALES */}
            <div className="col-span-12">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                    1. Datos Generales
                </h3>
            </div>

            <div className="col-span-12 md:col-span-6">
                <div className={`relative flex items-center ${disabled ? 'opacity-60' : ''}`}>
                    <div className="w-full">
                        <AnioAcademicoSearchSelect form={data} setForm={setForm} disabled={disabled || isEdit}/>
                    </div>
                </div>
            </div>

            <div className="col-span-12 md:col-span-6">
                <div className={`relative flex items-center ${disabled ? 'opacity-60' : ''}`}>
                    <div className="w-full">
                        <DocenteSearchSelect form={data} setForm={setForm} disabled={disabled}/>
                    </div>
                </div>
            </div>

            <div className="col-span-12 md:col-span-4">
                <div className="relative flex items-center">
                    <div className="w-full">
                        <GradoSearchSelect form={data} setForm={setForm} disabled={disabled || security.hasAsistencia}/>
                    </div>
                </div>
            </div>

            <div className="col-span-12 md:col-span-4">

                <div className={`relative flex items-center ${!data.grado_id ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="w-full">
                        <SeccionSearchSelect 
                            form={data} 
                            setForm={setForm} 
                            gradoId={data.grado_id} 
                            disabled={disabled || !data.grado_id || security.hasAsistencia}
                            isFilter={false}
                        />
                    </div>
                </div>
                
                {/* --- BOTÓN VER HORARIO (NUEVO) --- */}
                <div className="flex justify-between items-center mb-1">
                    {data.seccion_id && (
                        <button 
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="text-[10px] flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors font-bold"
                        >
                            <EyeIcon className="w-3 h-3"/> Ver Horario
                        </button>
                    )}
                </div>
            </div>

            <div className="col-span-12 md:col-span-4">
                <div className="relative flex items-center">
                    <div className={`w-full ${!data.grado_id ? 'opacity-50 pointer-events-none' : ''}`}>
                        <MallaSearchSelect 
                            form={data} 
                            setForm={setForm}
                            gradoId={data.grado_id} 
                            disabled={disabled || !data.grado_id || security.hasAsistencia}
                        />
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 2: CONFIGURACIÓN DE HORARIO --- */}
            <div className="col-span-12 mt-4">
                <div className="flex justify-between items-end border-b border-slate-100 pb-2 mb-3">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider">
                        2. Configuración de Horario
                    </h3>
                    
                    {/* WIDGET DE CONTADOR DE HORAS */}
                    {!isEdit && data.malla_curricular_id && (
                        <div className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-2 border transition-all duration-300
                            ${calculoHoras.estado === 'incompleto' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                            ${calculoHoras.estado === 'completo' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                            ${calculoHoras.estado === 'excedido' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                            ${calculoHoras.estado === 'neutral' ? 'bg-slate-50 text-slate-500 border-slate-200' : ''}
                        `}>
                            <CalculatorIcon className="w-4 h-4"/>
                            <span>
                                {calculoHoras.estado === 'completo' && '¡Carga Completa! '}
                                {calculoHoras.estado === 'excedido' && '¡Excedido! '}
                                {calculoHoras.asignadas} / {calculoHoras.requeridas} Horas
                                {calculoHoras.estado === 'incompleto' && ` (Faltan ${calculoHoras.faltantes.toFixed(1)})`}
                            </span>
                            {calculoHoras.estado === 'completo' && <CheckBadgeIcon className="w-4 h-4"/>}
                            {calculoHoras.estado === 'excedido' && <ExclamationTriangleIcon className="w-4 h-4"/>}
                        </div>
                    )}
                </div>
            </div>

            {isEdit ? (
                // MODO EDICIÓN (SIMPLE)
                <>
                    <div className="col-span-12 md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Día</label>
                        <select name="dia_semana" value={data.dia_semana} onChange={handleChange} disabled={disabled}
                            className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-sm">
                            {diasLaborables.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                        </select>
                    </div>
                    <div className="col-span-6 md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Inicio</label>
                        <input type="time" name="hora_inicio" value={data.hora_inicio} onChange={handleChange} disabled={disabled}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"/>
                    </div>
                    <div className="col-span-6 md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fin</label>
                        <input type="time" name="hora_fin" value={data.hora_fin} onChange={handleChange} disabled={disabled}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"/>
                    </div>
                </>
            ) : (
                // MODO CREAR (MATRIZ)
                <div className="col-span-12">
                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 w-10 text-center">#</th>
                                    <th className="px-4 py-3">Día</th>
                                    <th className="px-4 py-3 w-40">Hora Inicio</th>
                                    <th className="px-4 py-3 w-40">Hora Fin</th>
                                    <th className="px-4 py-3 text-right">Duración</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {diasLaborables.map((dia) => {
                                    const isChecked = !!data.horariosMatrix?.[dia.id];
                                    const diaData = data.horariosMatrix?.[dia.id] || { hora_inicio: '', hora_fin: '' };
                                    
                                    let duracion = '-';
                                    if (diaData.hora_inicio && diaData.hora_fin) {
                                        const [h1, m1] = diaData.hora_inicio.split(':').map(Number);
                                        const [h2, m2] = diaData.hora_fin.split(':').map(Number);
                                        const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
                                        if (diff > 0) duracion = `${(diff/60).toFixed(1)} hrs`;
                                    }

                                    return (
                                        <tr key={dia.id} className={`transition-colors ${isChecked ? 'bg-white' : 'bg-slate-50 opacity-60'}`}>
                                            <td className="px-4 py-3 text-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={isChecked}
                                                    onChange={() => handleCheckDia(dia.id)}
                                                    disabled={disabled}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-700">
                                                {dia.nombre}
                                            </td>
                                            <td className="px-4 py-3">
                                                <input 
                                                    type="time" 
                                                    value={diaData.hora_inicio}
                                                    onChange={(e) => handleTimeChange(dia.id, 'hora_inicio', e.target.value)}
                                                    disabled={!isChecked || disabled}
                                                    className="w-full border border-slate-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input 
                                                    type="time" 
                                                    value={diaData.hora_fin}
                                                    onChange={(e) => handleTimeChange(dia.id, 'hora_fin', e.target.value)}
                                                    disabled={!isChecked || disabled}
                                                    className="w-full border border-slate-300 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs font-mono text-slate-500">
                                                {duracion}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {(!data.horariosMatrix || Object.keys(data.horariosMatrix).length === 0) && (
                        <p className="text-red-500 text-xs mt-2 text-center font-bold">
                            * Seleccione al menos un día y configure sus horas.
                        </p>
                    )}
                </div>
            )}

            <div className="col-span-12 mt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Aula Física (Opcional)</label>
                <div className="relative">
                    <MapPinIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                    <input type="text" name="aula_fisica" value={data.aula_fisica || ''} onChange={handleChange} disabled={disabled}
                        placeholder="Ej: Pabellón B - Aula 204"
                        className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 text-sm"/>
                </div>
            </div>

            {security.hasAsistencia && (
                <div className="col-span-12 mt-2">
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded text-orange-700 text-xs flex items-center gap-2">
                        <span className="font-bold">Bloqueado:</span> 
                        Edición restringida por historial de asistencia.
                    </div>
                </div>
            )}

            {/* --- RENDERIZADO DEL MODAL (Condicional) --- */}
            {showModal && (
                <HorarioSeccionModal 
                    seccionId={data.seccion_id}
                    seccionNombre={data.seccionNombre} // Asegúrate que el SeccionSearchSelect te pase el nombre
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default HorarioForm;