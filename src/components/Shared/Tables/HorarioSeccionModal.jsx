import React, { useEffect, useState, useCallback } from 'react';
import { getBySeccion, getMiHorario } from 'services/horarioService';
import { useAuth } from 'context/AuthContext';
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const HorarioSeccionModal = ({ seccionId, seccionNombre, onClose }) => {
    const { role } = useAuth();
    const [horarioData, setHorarioData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const dias = [
        { id: 1, nombre: 'Lunes' },
        { id: 2, nombre: 'Martes' },
        { id: 3, nombre: 'Miércoles' },
        { id: 4, nombre: 'Jueves' },
        { id: 5, nombre: 'Viernes' }
    ];

    const loadHorario = useCallback(async () => {
        const puedeVerSinId = role === 'alumno' || role === 'docente';

        if (!puedeVerSinId && !seccionId) {
            console.warn("HorarioModal: Se requiere seccionId para este rol.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            let response;
            
            if (role === 'alumno' || (role === 'docente' && !seccionId)) {
                response = await getMiHorario(); 
            } else {
                response = await getBySeccion(seccionId);
            }

            const data = response.data?.data || response.data || response;
            setHorarioData(Array.isArray(data) ? data : []);
            
        } catch (err) {
            setAlert(handleApiError(err , 'Error cargando horario'));
        } finally {
            setLoading(false);
        }
    }, [seccionId, role]);

    useEffect(() => {
        loadHorario();
    }, [loadHorario]);

    const renderDia = (diaId) => {
        const clasesDia = horarioData
            .filter(h => parseInt(h.dia_semana) === diaId)
            .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
        
        if (clasesDia.length === 0) return <div className="text-xs text-gray-300 text-center py-4 italic">Libre</div>;

        return clasesDia.map(clase => (
            <div key={clase.id} className="mb-2 p-2 bg-blue-50 border-l-4 border-blue-500 rounded shadow-sm text-xs">
                <div className="font-bold text-slate-700 leading-tight">{clase.curso}</div>
                
                {/* MOSTRAR GRADO Y SECCIÓN SI ES DOCENTE */}
                {role === 'docente' && (
                    <div className="mt-1 text-[10px] font-black text-blue-600 uppercase bg-blue-100/50 px-1.5 py-0.5 rounded w-fit">
                        {clase.grado_nombre} - "{clase.seccion_nombre}"
                    </div>
                )}

                <div className="text-slate-500 mt-1 flex justify-between font-medium">
                    <span>{clase.hora_inicio} - {clase.hora_fin}</span>
                </div>
                
                <div className="text-[10px] text-slate-400 mt-1 truncate border-t border-blue-100 pt-1">
                    {clase.docente}
                </div>
                {clase.aula && clase.aula !== '-' && (
                    <div className="text-[9px] text-indigo-500 mt-0.5 flex items-center gap-1">
                        <span>📍</span> {clase.aula}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                            <CalendarIcon className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Horario Semanal</h2>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">
                                {role === 'alumno' ? 'Mi Horario de Clases' : `Sección: ${seccionNombre}`}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                    >
                        <XMarkIcon className="w-6 h-6 text-slate-400 group-hover:text-white"/>
                    </button>
                </div>

                <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 bg-slate-50">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">Cargando horario...</span>
                        </div>
                    ) : horarioData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-400 italic">
                            No se encontraron clases programadas.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-h-full">
                            {dias.map(dia => (
                                <div key={dia.id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                                    <div className="p-3 border-b border-slate-100 font-bold text-center text-slate-700 uppercase bg-slate-50/50 rounded-t-xl text-xs tracking-tighter">
                                        {dia.nombre}
                                    </div>
                                    <div className="p-2 flex-1 overflow-y-auto">
                                        {renderDia(dia.id)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HorarioSeccionModal;