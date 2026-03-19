import React from 'react';
import { useStore } from './hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner'; 
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import AlumnoSearchSelect from 'components/Shared/Comboboxes/AlumnoSearchSelect';
import { 
    ClipboardDocumentCheckIcon, DocumentCheckIcon, QrCodeIcon, 
    HandRaisedIcon, CheckCircleIcon, ClockIcon, 
    DocumentTextIcon, ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const Store = () => {
    const { 
        activeTab, setActiveTab,
        qrConfig, handleQrConfigChange, handleQrScan, handleQrError, cameraError,
        formData, setFormData, loading, loadingMatriculas, matriculasDisponibles, 
        alert, setAlert, handleChange, handleManualSubmit 
    } = useStore();
    
    useNavigate();

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Control de Ingreso" 
                icon={ClipboardDocumentCheckIcon} 
                buttonText="Ver Reportes" 
                buttonLink="/asistencia/diaria/listar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                
                {/* --- TABS --- */}
                <div className="flex border-b border-slate-200 bg-slate-50">
                    <button 
                        onClick={() => setActiveTab('qr')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 font-black uppercase tracking-wider transition-colors ${activeTab === 'qr' ? 'bg-white text-black border-b-2 border-black' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                        <QrCodeIcon className="w-5 h-5" /> Escáner QR
                    </button>
                    <button 
                        onClick={() => setActiveTab('manual')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 font-black uppercase tracking-wider transition-colors ${activeTab === 'manual' ? 'bg-white text-black border-b-2 border-black' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                        <HandRaisedIcon className="w-5 h-5" /> Registro Manual
                    </button>
                </div>

                <div className="p-8">
                    {/* =========================================
                                PESTAÑA 1: ESCÁNER QR
                    ========================================= */}
                    {activeTab === 'qr' && (
                        <div className="space-y-8">
                            
                           <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 text-center">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3">
                                        Estado a registrar al escanear:
                                    </label>
                                    
                                    {/* Agregamos justify-center para centrar las columnas del grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center">
    
                                        {/* Opción: Presente (EL POR DEFECTO) */}
                                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${qrConfig.estado === '1' ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}>
                                            <input type="radio" name="estado" value="1" checked={qrConfig.estado === '1'} onChange={handleQrConfigChange} className="hidden" />
                                            <CheckCircleIcon className="w-8 h-8" /> 
                                            <span className="font-black text-xs uppercase">Presente</span>
                                        </label>

                                        {/* Opción: Tardanza */}
                                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${qrConfig.estado === '3' ? 'border-yellow-500 bg-yellow-50 text-yellow-700 ring-2 ring-yellow-200' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}>
                                            <input type="radio" name="estado" value="3" checked={qrConfig.estado === '3'} onChange={handleQrConfigChange} className="hidden" />
                                            <ClockIcon className="w-8 h-8" /> 
                                            <span className="font-black text-xs uppercase">Tardanza</span>
                                        </label>

                                        {/* Opción: Justificado */}
                                        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${qrConfig.estado === '4' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}>
                                            <input type="radio" name="estado" value="4" checked={qrConfig.estado === '4'} onChange={handleQrConfigChange} className="hidden" />
                                            <DocumentTextIcon className="w-8 h-8" /> 
                                            <span className="font-black text-xs uppercase">Justificado</span>
                                        </label>

                                    </div>

                                </div>

                                <div className="max-w-md mx-auto">
                                    <input
                                        type="text"
                                        name="observacion"
                                        value={qrConfig.observacion}
                                        onChange={handleQrConfigChange}
                                        placeholder="Observación opcional para el siguiente escaneo..."
                                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none text-center"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            {/* Cámara Escáner */}
                            <div className="max-w-md mx-auto overflow-hidden rounded-2xl border-4 border-black relative bg-black shadow-2xl min-h-[300px] flex items-center justify-center">
                                
                                {/* Si hay error de cámara, mostramos esto */}
                                {cameraError ? (
                                    <div className="p-6 text-center text-white flex flex-col items-center">
                                        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mb-3" />
                                        <p className="font-bold text-lg mb-2">Error de Cámara</p>
                                        <p className="text-sm text-slate-300 mb-6">{cameraError}</p>
                                        <button 
                                            onClick={() => setActiveTab('manual')}
                                            className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors uppercase tracking-wider"
                                        >
                                            Ir a Registro Manual
                                        </button>
                                    </div>
                                ) : (
                                    /* Si no hay error, intentamos cargar el Scanner */
                                    <>
                                        {loading && (
                                            <div className="absolute inset-0 bg-black/80 z-10 flex flex-col items-center justify-center text-white">
                                                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <p className="font-black animate-pulse">Procesando...</p>
                                            </div>
                                        )}
                                        
                                       <Scanner 
                                            onScan={(detectedCodes) => {
                                                // La versión 2.x devuelve un array de objetos, sacamos el texto del primer resultado
                                                if (detectedCodes && detectedCodes.length > 0) {
                                                    handleQrScan(detectedCodes[0].rawValue);
                                                }
                                            }} 
                                            onError={handleQrError} 
                                            // Si quieres formatos específicos puedes poner: formats={['qr_code']}
                                        />
                                    </>
                                )}
                            </div>
                            
                            {!cameraError && (
                                <p className="text-center text-slate-500 text-sm italic">
                                    Posiciona el código QR del estudiante frente a la cámara.
                                </p>
                            )}
                        </div>
                    )}


                    {/* =========================================
                                PESTAÑA 2: REGISTRO MANUAL
                    ========================================= */}
                    {activeTab === 'manual' && (
                        <form onSubmit={handleManualSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div className="md:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
                                    <AlumnoSearchSelect form={formData} setForm={setFormData} />
                                    
                                    <div className="mt-4">
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
                                                className="w-full bg-white border border-slate-300 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-black outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
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
                                                        Matrícula #{mat.id} - {mat.grado_nombre || ''} {mat.seccion_nombre || ''} ({mat.anio_nombre || 'Actual'})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Fecha *</label>
                                    <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hora de Ingreso</label>
                                    <input type="time" name="hora_ingreso" value={formData.hora_ingreso} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Estado *</label>
                                    <select name="estado" value={formData.estado} onChange={handleChange} required className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none">
                                        <option value="1">Presente</option>
                                        <option value="2">Tardanza</option>
                                        <option value="3">Justificado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Observación</label>
                                    <input type="text" name="observacion" value={formData.observacion} onChange={handleChange} placeholder="Ej: Justificación en proceso..." className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button 
                                    type="submit" 
                                    disabled={loading || !formData.matricula_id} 
                                    className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 text-sm w-full md:w-auto"
                                >
                                    {loading ? 'Guardando...' : 'Registrar Manualmente'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Store;