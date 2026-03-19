import React from 'react';
import { useStore } from './hooks/useStore';
import { useNavigate } from 'react-router-dom';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { ClipboardDocumentCheckIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import AlumnoSearchSelect from 'components/Shared/Comboboxes/AlumnoSearchSelect';

const Store = () => {
    const { 
        formData, 
        setFormData, 
        loading, 
        loadingMatriculas, 
        matriculasDisponibles, 
        alert, 
        setAlert, 
        handleChange, 
        handleSubmit 
    } = useStore();
    
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Registro Manual de Asistencia" 
                icon={ClipboardDocumentCheckIcon} 
                buttonText="Volver" 
                buttonLink="/asistencia/diaria/listar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* 1. Buscador de Alumnos */}
                        <div className="md:col-span-2">
                            <AlumnoSearchSelect 
                                form={formData} 
                                setForm={setFormData} 
                            />
                        </div>

                        {/* 2. Selector de Matrícula (Se llena solo al elegir un alumno) */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                                Matrícula Asociada <span className="text-red-500">*</span>
                            </label>
                            <div className="relative flex items-center">
                                <DocumentCheckIcon className="w-5 h-5 absolute left-3 text-slate-400" />
                                <select
                                    name="matricula_id"
                                    value={formData.matricula_id}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.alumno_id || loadingMatriculas || matriculasDisponibles.length === 0}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-black outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                                >
                                    <option value="">
                                        {loadingMatriculas 
                                            ? 'Cargando matrículas...' 
                                            : (!formData.alumno_id 
                                                ? 'Primero selecciona un alumno arriba' 
                                                : (matriculasDisponibles.length === 0 ? 'Este alumno no tiene matrículas activas' : 'Seleccione una matrícula...')
                                              )
                                        }
                                    </option>
                                    
                                    {matriculasDisponibles.map(mat => (
                                        <option key={mat.id} value={mat.id}>
                                            Matrícula #{mat.id} - Grado/Sección {mat.grado_nombre || ''} {mat.seccion_nombre || ''} ({mat.anio_nombre || 'Actual'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 3. Fecha */}
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

                        {/* 4. Hora Ingreso */}
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

                        {/* 5. Estado */}
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

                        {/* 6. Observación */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Observación</label>
                            <input
                                type="text"
                                name="observacion"
                                value={formData.observacion}
                                onChange={handleChange}
                                placeholder="Ej: Permiso por cita médica, falló el carnet en puerta..."
                                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                        <button type="button" onClick={() => navigate('/asistencia/diaria/listar')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 uppercase text-sm transition-colors">
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || !formData.matricula_id} 
                            className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 text-sm"
                        >
                            {loading ? 'Guardando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Store;