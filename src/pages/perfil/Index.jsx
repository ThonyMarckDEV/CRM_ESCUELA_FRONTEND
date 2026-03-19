import React from 'react';
import { useIndex } from './hooks/useIndex';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { UserIcon, IdentificationIcon, PencilSquareIcon, QrCodeIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const { loading, perfil, alert, setAlert, qrEncriptado } = useIndex();

    if (loading) return <LoadingScreen />;
    if (!perfil) return null;

    const datos = perfil.datos;

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Mi Perfil" 
                subtitle={`Rol actual: ${perfil.rol.toUpperCase()}`}
                icon={UserIcon} 
                buttonText="Editar Datos" 
                buttonLink="/perfil/editar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* 1. INFORMACIÓN PERSONAL */}
                <div className="flex-1 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                    <div className="flex justify-between items-center border-b pb-4 mb-6">
                        <h3 className="text-lg font-black text-slate-800 uppercase flex items-center gap-2">
                            <IdentificationIcon className="w-6 h-6 text-black" />
                            Datos Personales
                        </h3>
                        <Link to="/perfil/editar" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-bold">
                            <PencilSquareIcon className="w-4 h-4" /> Editar
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Nombre Completo</p>
                            <p className="font-medium text-slate-800 text-lg">
                                {datos.nombre} {datos.apellidoPaterno} {datos.apellidoMaterno}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Documento (DNI)</p>
                            <p className="font-medium text-slate-800">{datos.dni}</p>
                        </div>
                        
                        {perfil.tipo === 'alumno' && (
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Código Estudiante</p>
                                <p className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">{datos.codigo_estudiante}</p>
                            </div>
                        )}

                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Dirección</p>
                            <p className="font-medium text-slate-800">{datos.direccion || 'No registrada'}</p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Teléfono</p>
                            <p className="font-medium text-slate-800">
                                {perfil.tipo === 'empleado' ? datos.telefono : datos.telefono_apoderado || 'No registrado'}
                            </p>
                        </div>
                        
                        {perfil.tipo === 'alumno' && (
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Apoderado</p>
                                <p className="font-medium text-slate-800">{datos.nombre_apoderado || 'No registrado'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. CARNET DIGITAL (SOLO ALUMNOS) */}
                {perfil.tipo === 'alumno' && qrEncriptado && (
                    <div className="lg:w-1/3 bg-black text-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <QrCodeIcon className="w-32 h-32" />
                        </div>
                        
                        <h3 className="text-xl font-black uppercase tracking-widest mb-2 relative z-10">Carnet Digital</h3>
                        <p className="text-sm text-slate-400 mb-8 relative z-10">Usa este código para registrar tu ingreso en portería.</p>
                        
                        <div className="bg-white p-4 rounded-xl shadow-2xl relative z-10">
                            <QRCode value={qrEncriptado} size={180} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Index;