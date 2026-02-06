import React from 'react';
import PeriodoSearchSelect from 'components/Shared/Comboboxes/PeriodoSearchSelect';
import AnioAcademicoSearchSelect from 'components/Shared/Comboboxes/AnioAcademicoSearchSelect';
import { CurrencyDollarIcon, TagIcon, CalendarIcon, LockClosedIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConceptoPagoForm = ({ data = {}, handleChange, setForm, disabled = false, bloqueoFinanciero = false }) => {
    
    if (!data) return null;

    const handleCheckbox = (e) => {
        if (disabled || bloqueoFinanciero) return;
        const { name, checked } = e.target;

        setForm(prev => {
            let newState = { ...prev, [name]: checked };
            if (checked) {
                if (name === 'es_matricula') {
                    newState.es_pension = false;
                    newState.periodo_id = null;
                    newState.periodoNombre = '';
                }
                if (name === 'es_pension') {
                    newState.es_matricula = false;
                    newState.anio_academico_id = '';
                    newState.anioNombre = '';
                }
            }
            return newState;
        });
    };

    return (
        <div className={`space-y-6 ${disabled ? 'opacity-60 pointer-events-none grayscale' : ''}`}>
            
            {disabled && <div className="absolute inset-0 z-10 bg-white/10 cursor-not-allowed"></div>}

            {/* MENSAJE DE ALERTA SI HAY PAGOS */}
            {bloqueoFinanciero && !disabled && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800">
                        <strong>Edición Restringida:</strong> Este concepto ya tiene pagos registrados. 
                        Por seguridad financiera, no se puede modificar el monto ni el periodo, solo el nombre.
                    </div>
                </div>
            )}

            {/* SELECCIÓN DE CONTEXTO (Bloqueado si hay pagos) */}
            <div className={`transition-opacity ${bloqueoFinanciero ? 'opacity-70 pointer-events-none' : ''}`}>
                {data.es_matricula ? (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm relative">
                        {bloqueoFinanciero && <LockClosedIcon className="absolute top-2 right-2 w-4 h-4 text-blue-400" />}
                        <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold text-xs uppercase tracking-wide">
                            <CalendarIcon className="w-4 h-4"/> Configuración Anual
                        </div>
                        <AnioAcademicoSearchSelect form={data} setForm={setForm} disabled={disabled || bloqueoFinanciero} />
                        {/* Texto de ayuda restaurado */}
                        <p className="text-[10px] text-blue-600 mt-2 font-medium">
                            * La matrícula vincula al alumno con todo el Año Académico seleccionado.
                        </p>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative">
                        {bloqueoFinanciero && <LockClosedIcon className="absolute top-2 right-2 w-4 h-4 text-gray-400" />}
                        <div className="flex items-center gap-2 mb-3 text-gray-700 font-bold text-xs uppercase tracking-wide">
                            <CalendarIcon className="w-4 h-4"/> Configuración Periódica
                        </div>
                        <PeriodoSearchSelect form={data} setForm={setForm} disabled={disabled || bloqueoFinanciero} />
                        {/* Texto de ayuda restaurado */}
                        <p className="text-[10px] text-gray-500 mt-2">
                            * Las pensiones se generan para un bimestre o trimestre específico.
                        </p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* NOMBRE (Único campo editable si hay pagos) */}
                <div>
                    <label className="block text-sm font-black text-slate-700 uppercase mb-2">
                        Nombre del Concepto <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center group">
                        <input
                            type="text"
                            name="nombre"
                            value={data.nombre || ''}
                            onChange={handleChange}
                            disabled={disabled} 
                            placeholder={data.es_matricula ? "Ej: Matrícula 2026" : "Ej: Pensión Marzo - I Bimestre"}
                            className="w-full border border-slate-300 rounded-lg shadow-sm pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all disabled:bg-slate-50 placeholder-slate-400"
                        />
                        <div className="absolute left-3 text-slate-400">
                            {disabled ? <LockClosedIcon className="w-5 h-5"/> : <TagIcon className="w-5 h-5" />}
                        </div>
                    </div>
                </div>

                {/* MONTO (Bloqueado si hay pagos) */}
                <div>
                    <label className="block text-sm font-black text-slate-700 uppercase mb-2 flex justify-between">
                        <span>Monto (S/) <span className="text-red-500">*</span></span>
                        {bloqueoFinanciero && <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1"><LockClosedIcon className="w-3 h-3"/> Protegido</span>}
                    </label>
                    <div className="relative flex items-center group">
                        <input
                            type="number"
                            name="monto"
                            value={data.monto || ''}
                            onChange={handleChange}
                            disabled={disabled || bloqueoFinanciero} 
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full border border-slate-300 rounded-lg shadow-sm pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all font-mono font-bold disabled:bg-slate-100 placeholder-slate-300"
                        />
                        <div className="absolute left-3 text-slate-400">
                            <CurrencyDollarIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* TIPO (Bloqueado si hay pagos) */}
            <div className={`p-5 bg-white rounded-xl border border-slate-200 shadow-sm relative ${bloqueoFinanciero ? 'opacity-70 pointer-events-none' : ''}`}>
                <span className="block text-xs font-black text-slate-400 uppercase mb-4 tracking-wider">
                    Clasificación Financiera
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Opción Matrícula */}
                    <label className={`relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${data.es_matricula ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-blue-300'}`}>
                        <input 
                            type="checkbox" 
                            name="es_matricula" 
                            checked={data.es_matricula || false} 
                            onChange={handleCheckbox}
                            disabled={disabled || bloqueoFinanciero}
                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold ${data.es_matricula ? 'text-blue-800' : 'text-slate-600'}`}>
                                Matrícula Anual
                            </span>
                            <span className="text-xs text-slate-400 mt-0.5">Pago único de inscripción al año.</span>
                        </div>
                    </label>

                    {/* Opción Pensión */}
                    <label className={`relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${data.es_pension ? 'border-purple-500 bg-purple-50/50' : 'border-slate-100 hover:border-purple-300'}`}>
                        <input 
                            type="checkbox" 
                            name="es_pension" 
                            checked={data.es_pension || false} 
                            onChange={handleCheckbox}
                            disabled={disabled || bloqueoFinanciero}
                            className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <div className="flex flex-col">
                            <span className={`text-sm font-bold ${data.es_pension ? 'text-purple-800' : 'text-slate-600'}`}>
                                Pensión Mensual
                            </span>
                            <span className="text-xs text-slate-400 mt-0.5">Pagos recurrentes por periodo.</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ConceptoPagoForm;