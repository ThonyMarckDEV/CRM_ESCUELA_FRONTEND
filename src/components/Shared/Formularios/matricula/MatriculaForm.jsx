import React from 'react';
import AlumnoSearchSelect from 'components/Shared/Comboboxes/AlumnoSearchSelect';
import AnioAcademicoSearchSelect from 'components/Shared/Comboboxes/AnioAcademicoSearchSelect';
import GradoSearchSelect from 'components/Shared/Comboboxes/GradoSearchSelect';
import SeccionSearchSelect from 'components/Shared/Comboboxes/SeccionSearchSelect';
import { 
    UserIcon, 
    AcademicCapIcon, 
    ClipboardDocumentCheckIcon, 
    LockClosedIcon, 
    ExclamationTriangleIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';

const MatriculaForm = ({ 
    data, 
    handleChange, 
    setForm, 
    disabled = false, 
    isEdit = false, 
    security = { hasPayments: false, hasGrades: false } 
}) => {

    const lockIdentity = security.hasPayments || security.hasGrades;
    const lockGrade = security.hasPayments || security.hasGrades;
    const lockSection = security.hasGrades;

    return (
        <div className={`space-y-6 ${disabled ? 'opacity-60 pointer-events-none grayscale' : ''}`}>
            
            {/* Mensajes de Alerta */}
            {!disabled && (lockIdentity || lockSection) && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex gap-3 animate-in fade-in">
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5"/>
                    <div className="text-xs text-amber-800">
                        <strong>Edición Limitada:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 ml-1">
                            {security.hasPayments && <li>Existen pagos registrados.</li>}
                            {security.hasGrades && <li>Existen notas registradas.</li>}
                        </ul>
                    </div>
                </div>
            )}

            {/* DATOS PRINCIPALES */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 relative">
                {lockIdentity && !disabled && <LockClosedIcon className="absolute top-4 right-4 w-5 h-5 text-slate-400" />}
                <h3 className="text-xs font-black text-slate-500 uppercase mb-4 flex items-center gap-2">
                    <UserIcon className="w-4 h-4"/> Información Principal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={lockIdentity ? 'pointer-events-none opacity-80' : ''}>
                        <AlumnoSearchSelect form={data} setForm={setForm} disabled={disabled || lockIdentity} />
                    </div>
                    <div className={lockIdentity ? 'pointer-events-none opacity-80' : ''}>
                        <AnioAcademicoSearchSelect form={data} setForm={setForm} disabled={disabled || lockIdentity} />
                    </div>
                </div>
            </div>

            {/* DATOS ACADÉMICOS*/}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                <h3 className="text-xs font-black text-slate-500 uppercase mb-4 flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4"/> Ubicación Académica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        {lockGrade && !disabled && <LockClosedIcon className="absolute top-0 right-0 w-4 h-4 text-slate-400 z-10" />}
                        <div className={lockGrade ? 'pointer-events-none opacity-70' : ''}>
                            <GradoSearchSelect form={data} setForm={setForm} disabled={disabled || lockGrade} />
                        </div>
                    </div>
                    <div className="relative">
                        {lockSection && !disabled && <LockClosedIcon className="absolute top-0 right-0 w-4 h-4 text-slate-400 z-10" />}
                        <div className={lockSection ? 'pointer-events-none opacity-70' : ''}>
                            <SeccionSearchSelect form={data} setForm={setForm} disabled={disabled || lockSection || !data.grado_id} gradoId={data.grado_id} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ESTADO*/}
            {isEdit && (
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h3 className="text-xs font-black text-slate-500 uppercase mb-4 flex items-center gap-2">
                        <ClipboardDocumentCheckIcon className="w-4 h-4"/> Estado Actual
                    </h3>
                    
                    {/* CASO 1: PENDIENTE DE PAGO (0) */}
                    {parseInt(data.estado) === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center gap-3">
                            <BanknotesIcon className="w-6 h-6 text-yellow-600"/>
                            <div>
                                <span className="block font-bold text-yellow-800 uppercase text-sm">Pendiente de Pago</span>
                                <p className="text-xs text-yellow-700">
                                    El estado cambiará a <strong>CURSANDO</strong> automáticamente cuando se registre el pago de matrícula.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* CASO 2: PROMOVIDO (3) - FINALIZADO */}
                    {parseInt(data.estado) === 3 && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center gap-3">
                            <AcademicCapIcon className="w-6 h-6 text-blue-600"/>
                            <div>
                                <span className="block font-bold text-blue-800 uppercase text-sm">Promovido</span>
                                <p className="text-xs text-blue-700">
                                    El ciclo académico ha finalizado exitosamente.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* CASO 3: CURSANDO (1) o RETIRADO (2) - DEJAMOS EDITAR */}
                    {(parseInt(data.estado) === 1 || parseInt(data.estado) === 2) && (
                        <div>
                            <div className="relative">
                                <select
                                    name="estado"
                                    value={data.estado}
                                    onChange={handleChange}
                                    disabled={disabled}
                                    className={`w-full border rounded-lg shadow-sm px-4 py-3 text-sm focus:ring-2 outline-none appearance-none cursor-pointer font-bold
                                        ${parseInt(data.estado) === 2 
                                            ? 'bg-red-50 border-red-200 text-red-700 focus:ring-red-500' 
                                            : 'bg-green-50 border-green-200 text-green-700 focus:ring-green-500'
                                        }
                                    `}
                                >
                                    <option value="1">CURSANDO (Activo)</option>
                                    <option value="2">RETIRADO (Baja por abandono)</option>
                                </select>
                                <div className="absolute right-4 top-3.5 opacity-50 pointer-events-none">▼</div>
                            </div>
                            
                            {parseInt(data.estado) === 2 ? (
                                <p className="text-[10px] text-red-500 mt-2 font-medium animate-pulse">
                                    ⚠ Al marcar como Retirado, se liberará la vacante en la sección.
                                </p>
                            ) : (
                                <p className="text-[10px] text-slate-400 mt-2">
                                    * Solo cambie este estado si el alumno abandona la institución definitivamente.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MatriculaForm;