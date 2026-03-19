import React from 'react';
import { useUpdate } from './hooks/useUpdate';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from 'components/Shared/LoadingScreen';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const { formData, loading, saving, alert, alumnoNombre, setAlert, handleChange, handleSubmit } = useUpdate();
    const navigate = useNavigate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Editar Asistencia" 
                subtitle={`Modificando registro de: ${alumnoNombre}`}
                icon={PencilSquareIcon} 
                buttonText="← Volver" 
                buttonLink="/asistencia/diaria/listar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Alumno (Lectura)</label>
                            <input
                                type="text"
                                value={alumnoNombre}
                                disabled
                                className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-lg p-3 text-sm font-bold cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Fecha *</label>
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hora de Ingreso</label>
                            <input
                                type="time"
                                name="hora_ingreso"
                                value={formData.hora_ingreso}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Estado *</label>
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            >
                                <option value="1">Presente</option>
                                <option value="3">Tardanza</option>
                                <option value="4">Justificado</option>
                                <option value="2">Falta</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Observación</label>
                            <input
                                type="text"
                                name="observacion"
                                value={formData.observacion}
                                onChange={handleChange}
                                placeholder="Ej: Justificación entregada..."
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                        <button type="button" onClick={() => navigate('/asistencia/diaria/listar')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 uppercase text-sm">
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 text-sm">
                            {saving ? 'Guardando...' : 'Actualizar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update;