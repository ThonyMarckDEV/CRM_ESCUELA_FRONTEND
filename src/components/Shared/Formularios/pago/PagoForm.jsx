import React, { useState, useEffect } from 'react';
import AlumnoSearchSelect from 'components/Shared/Comboboxes/AlumnoSearchSelect';
import { index as getMatriculas } from 'services/matriculaService';
import { index as getConceptos } from 'services/conceptoPagoService';
import { 
    CalendarIcon, AcademicCapIcon, ExclamationCircleIcon, CheckBadgeIcon, LockClosedIcon
} from '@heroicons/react/24/outline';

const PagoForm = ({ data, handleChange, setForm, disabled = false }) => {
    
    const [matriculaInfo, setMatriculaInfo] = useState(null);
    const [conceptosOptions, setConceptosOptions] = useState([]);
    const [loadingMatricula, setLoadingMatricula] = useState(false);
    const [loadingConceptos, setLoadingConceptos] = useState(false);
    
    const [bloqueoMatricula, setBloqueoMatricula] = useState(false); 

    const { alumno_id, alumnoDni, alumnoNombre } = data;

    useEffect(() => {
        if (!alumno_id) {
            setMatriculaInfo(null);
            setConceptosOptions([]);
            setBloqueoMatricula(false);
            setForm(prev => ({ 
                ...prev, matricula_id: '', concepto_id: '', monto: '', nro_operacion: '', observaciones: '' 
            }));
            return;
        }

        const buscarMatricula = async () => {
            setLoadingMatricula(true);
            try {
                const response = await getMatriculas(1, { search: alumnoDni || alumnoNombre }); 
                const lista = response.data || [];
                const matriculaActiva = lista.find(m => m.estado === 1 || m.estado === 0 || m.estado === 3);

                if (matriculaActiva) {
                    setMatriculaInfo(matriculaActiva);
                    setForm(prev => {
                        if (prev.matricula_id === matriculaActiva.id) return prev;
                        return { ...prev, matricula_id: matriculaActiva.id };
                    });
                } else {
                    setMatriculaInfo(null);
                    setForm(prev => ({ ...prev, matricula_id: '' }));
                }
            } catch (error) {
                console.error("Error buscando matrícula", error);
                setMatriculaInfo(null);
            } finally {
                setLoadingMatricula(false);
            }
        };

        buscarMatricula();
    }, [alumno_id, alumnoDni, alumnoNombre, setForm]);

    useEffect(() => {
        const cargarConceptos = async () => {
            if (!matriculaInfo) {
                setConceptosOptions([]);
                return;
            }

            setLoadingConceptos(true);
            try {
                const response = await getConceptos(1, { 
                    anio_academico_id: matriculaInfo.anio_academico_id || '' 
                });
                const todosLosConceptos = response.data || [];

                const pagosRealizados = matriculaInfo.pagos || [];
                const idsPagados = pagosRealizados.map(p => String(p.concepto_id));

                const conceptoMatricula = todosLosConceptos.find(c => c.tipo === 1);
                
                const matriculaPagada = conceptoMatricula && idsPagados.includes(String(conceptoMatricula.id));

                let listaFiltrada = [];

                if (conceptoMatricula && !matriculaPagada) {
                    listaFiltrada = [conceptoMatricula];
                    setBloqueoMatricula(true);
                } else {
                    listaFiltrada = todosLosConceptos.filter(c => !idsPagados.includes(String(c.id)));
                    setBloqueoMatricula(false);
                }

                setConceptosOptions(listaFiltrada);

            } catch (error) {
                console.error("Error cargando conceptos", error);
            } finally {
                setLoadingConceptos(false);
            }
        };

        if (matriculaInfo) {
            cargarConceptos();
        }
    }, [matriculaInfo]);

    const handleConceptoChange = (e) => {
        const conceptoId = e.target.value;
        
        const conceptoSeleccionado = conceptosOptions.find(c => String(c.id) === String(conceptoId));
        
        setForm(prev => ({
            ...prev,
            concepto_id: conceptoId,
            monto: conceptoSeleccionado ? conceptoSeleccionado.monto : ''
        }));
    };

    return (
        <div className={`space-y-8 ${disabled ? 'opacity-70 pointer-events-none' : ''}`}>
            
            {/* BUSCADOR */}
            <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    1. Identificación del Cliente
                </h3>
                <AlumnoSearchSelect 
                    form={data} 
                    setForm={setForm} 
                    disabled={disabled} 
                />
            </div>

            {/* INFO MATRÍCULA */}
            <div className="min-h-[80px]">
                {loadingMatricula && <div className="text-xs text-slate-500 animate-pulse">Buscando datos académicos...</div>}
                
                {!loadingMatricula && matriculaInfo && (
                    <div className="bg-slate-50 border-l-4 border-black p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="mt-1 text-black">
                            <AcademicCapIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Alumno Regular</h4>
                            <div className="text-xs text-slate-600 mt-1">
                                <span className="font-semibold">{matriculaInfo.grado_nombre} "{matriculaInfo.seccion_nombre}"</span>
                                <span className="mx-2 text-slate-300">|</span>
                                <span>{matriculaInfo.anio_nombre}</span>
                            </div>
                        </div>
                        <div className="ml-auto">
                            <span className="px-2 py-1 bg-black text-white text-[10px] font-bold uppercase rounded">
                                Activo
                            </span>
                        </div>
                    </div>
                )}

                {!loadingMatricula && data.alumno_id && !matriculaInfo && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded text-red-800 flex items-center gap-2 text-sm animate-in zoom-in">
                        <ExclamationCircleIcon className="w-5 h-5"/>
                        <span>Sin matrícula activa para pagos.</span>
                    </div>
                )}
            </div>

            {/* FORMULARIO DE COBRO */}
            {matriculaInfo && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        2. Detalles de Facturación
                    </h3>

                    {/* ALERTA DE BLOQUEO DE MATRÍCULA */}
                    {bloqueoMatricula && (
                        <div className="mb-6 bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center gap-3 text-yellow-800 text-sm animate-in slide-in-from-left-2">
                            <LockClosedIcon className="w-5 h-5 text-yellow-600" />
                            <span>
                                <strong>Pensiones bloqueadas:</strong> Debe cancelar la <u>Matrícula</u> antes de realizar otros pagos.
                            </span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Concepto */}
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Concepto</label>
                            <div className="relative">
                                <select
                                    name="concepto_id"
                                    value={data.concepto_id}
                                    onChange={handleConceptoChange}
                                    disabled={disabled}
                                    className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-none border-b-2 border-t-0 border-x-0 focus:ring-0 focus:border-black px-0 py-2.5 transition-colors cursor-pointer"
                                >
                                    <option value="">-- Seleccione concepto --</option>
                                    {loadingConceptos ? (
                                        <option>Verificando pagos...</option>
                                    ) : (
                                        conceptosOptions.length > 0 ? (
                                            conceptosOptions.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.nombre} — S/ {parseFloat(c.monto).toFixed(2)}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>¡Todo está pagado! 🎉</option>
                                        )
                                    )}
                                </select>
                                {conceptosOptions.length === 0 && !loadingConceptos && (
                                    <div className="absolute right-0 top-2 text-green-600 flex items-center gap-1 text-xs font-bold">
                                        <CheckBadgeIcon className="w-4 h-4"/> Al día
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fecha */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha Emisión</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="fecha_pago"
                                    value={data.fecha_pago}
                                    onChange={handleChange}
                                    disabled={disabled}
                                    className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:ring-0 focus:border-black px-0 py-2 text-sm"
                                />
                                <CalendarIcon className="absolute right-2 top-2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Método */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medio de Pago</label>
                            <div className="relative">
                                <select
                                    name="metodo_pago"
                                    value={data.metodo_pago}
                                    onChange={handleChange}
                                    disabled={disabled}
                                    className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:ring-0 focus:border-black px-0 py-2 text-sm"
                                >
                                    <option value="Efectivo">Efectivo (Caja)</option>
                                    <option value="Yape">Yape / Plin</option>
                                    <option value="Transferencia">Transferencia Bancaria</option>
                                    <option value="Deposito">Depósito en Ventanilla</option>
                                </select>
                            </div>
                        </div>

                        {/* Monto */}
                        <div className="md:col-span-2 mt-2">
                             <div className="flex items-end gap-3 bg-slate-50 p-4 border border-slate-200 rounded">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Monto a Cobrar</label>
                                    <div className="flex items-center">
                                        <span className="text-xl font-bold text-slate-400 mr-2">S/</span>
                                        <input
                                            type="number"
                                            name="monto"
                                            value={data.monto}
                                            onChange={handleChange}
                                            disabled={disabled}
                                            step="0.01"
                                            placeholder="0.00"
                                            className="w-full bg-transparent border-none p-0 text-3xl font-black text-slate-900 focus:ring-0 placeholder-slate-200"
                                        />
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">N° Operación</label>
                                    <input
                                        type="text"
                                        name="nro_operacion"
                                        value={data.nro_operacion || ''}
                                        onChange={handleChange}
                                        disabled={disabled}
                                        placeholder="---"
                                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-black outline-none"
                                    />
                                </div>
                             </div>
                        </div>

                        {/* Obs */}
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Notas Internas</label>
                            <textarea
                                name="observaciones"
                                value={data.observaciones || ''}
                                onChange={handleChange}
                                disabled={disabled}
                                rows="1"
                                placeholder="Opcional..."
                                className="w-full bg-transparent border-0 border-b border-slate-200 focus:ring-0 focus:border-black px-0 py-1 text-sm resize-none placeholder-slate-300"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PagoForm;