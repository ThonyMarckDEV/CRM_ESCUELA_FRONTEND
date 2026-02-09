import React, { useEffect, useState } from 'react';
import { getBySeccion } from 'services/horarioService';
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';

const HorarioSeccionModal = ({ seccionId, seccionNombre, onClose }) => {
    const [horarioData, setHorarioData] = useState([]);
    const [loading, setLoading] = useState(true);

    const dias = [
        { id: 1, nombre: 'Lunes' },
        { id: 2, nombre: 'Martes' },
        { id: 3, nombre: 'Miércoles' },
        { id: 4, nombre: 'Jueves' },
        { id: 5, nombre: 'Viernes' }
    ];

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getBySeccion(seccionId);
                setHorarioData(response.data || response); // Ajustar según respuesta
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if(seccionId) load();
    }, [seccionId]);

    // Función para renderizar las celdas de un día
    const renderDia = (diaId) => {
        const clasesDia = horarioData.filter(h => h.dia_semana === diaId).sort((a,b) => a.hora_inicio.localeCompare(b.hora_inicio));
        
        if (clasesDia.length === 0) return <div className="text-xs text-gray-300 text-center py-4">Libre</div>;

        return clasesDia.map(clase => (
            <div key={clase.id} className="mb-2 p-2 bg-blue-50 border-l-4 border-blue-500 rounded shadow-sm text-xs">
                <div className="font-bold text-slate-700">{clase.curso}</div>
                <div className="text-slate-500 mt-1 flex justify-between">
                    <span>{clase.hora_inicio} - {clase.hora_fin}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{clase.docente}</div>
                {clase.aula !== '-' && <div className="text-[9px] text-slate-400 mt-0.5">📍 {clase.aula}</div>}
            </div>
        ));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg"><CalendarIcon className="w-6 h-6"/></div>
                        <div>
                            <h2 className="text-lg font-bold">Horario Semanal</h2>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Sección: {seccionNombre}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><XMarkIcon className="w-6 h-6"/></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 bg-slate-100">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-slate-400">Cargando horario...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
                            {dias.map(dia => (
                                <div key={dia.id} className="bg-white rounded-xl shadow border border-slate-200 flex flex-col h-full">
                                    <div className="p-3 border-b border-slate-100 font-bold text-center text-slate-700 uppercase bg-slate-50 rounded-t-xl">
                                        {dia.nombre}
                                    </div>
                                    <div className="p-2 flex-1 overflow-y-auto custom-scrollbar">
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