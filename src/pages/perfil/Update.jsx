import React from 'react';
import { useUpdate } from './hooks/useUpdate';
import { useNavigate } from 'react-router-dom';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const { formData, perfil, loading, saving, alert, setAlert, handleChange, handleSubmit } = useUpdate();
    const navigate = useNavigate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Actualizar Perfil" icon={PencilSquareIcon} buttonText="Cancelar" buttonLink="/perfil" />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Campos de Solo Lectura (Por seguridad) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre (No editable)</label>
                            <input type="text" disabled value={`${perfil.datos.nombre} ${perfil.datos.apellidoPaterno}`} className="w-full bg-transparent font-medium text-slate-600 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">DNI (No editable)</label>
                            <input type="text" disabled value={perfil.datos.dni} className="w-full bg-transparent font-medium text-slate-600 outline-none" />
                        </div>
                    </div>

                    {/* Campos Editables */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Dirección de Residencia</label>
                            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                        </div>

                        {perfil.tipo === 'empleado' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Teléfono</label>
                                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Estado Civil</label>
                                    <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none">
                                        <option value="">Seleccione...</option>
                                        <option value="Soltero(a)">Soltero(a)</option>
                                        <option value="Casado(a)">Casado(a)</option>
                                        <option value="Viudo(a)">Viudo(a)</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {perfil.tipo === 'alumno' && (
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Teléfono de Apoderado / Contacto</label>
                                <input type="text" name="telefono_apoderado" value={formData.telefono_apoderado} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-slate-100 mt-8">
                        <button type="button" onClick={() => navigate('/perfil')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 uppercase text-sm">Cancelar</button>
                        <button type="submit" disabled={saving} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 text-sm">
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update;