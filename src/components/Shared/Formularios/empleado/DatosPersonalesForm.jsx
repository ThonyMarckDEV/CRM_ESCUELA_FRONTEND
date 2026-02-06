import React from 'react';
import { IdentificationIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const DatosPersonalesForm = ({ data, handleNestedChange }) => {
    const onChange = (field, value) => handleNestedChange('datos_empleado', field, value);
    const valores = data.datos_empleado;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <IdentificationIcon className="w-5 h-5" /> Información Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* DNI */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">DNI <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        maxLength={8}
                        value={valores.dni}
                        onChange={(e) => onChange('dni', e.target.value.replace(/\D/g, ''))} // Solo números
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                        placeholder="00000000"
                    />
                </div>

                {/* Fecha Nacimiento */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fecha Nacimiento <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        value={valores.fechaNacimiento}
                        onChange={(e) => onChange('fechaNacimiento', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                    />
                </div>

                {/* Sexo */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sexo <span className="text-red-500">*</span></label>
                    <select
                        value={valores.sexo}
                        onChange={(e) => onChange('sexo', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none bg-white"
                    >
                        <option value="">-- Seleccionar --</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>

                {/* Nombres y Apellidos */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombres <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={valores.nombre}
                        onChange={(e) => onChange('nombre', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                    />
                </div>
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido Paterno <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={valores.apellidoPaterno}
                        onChange={(e) => onChange('apellidoPaterno', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                    />
                </div>
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido Materno <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={valores.apellidoMaterno}
                        onChange={(e) => onChange('apellidoMaterno', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                    />
                </div>

                {/* Contacto y Estado Civil */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <PhoneIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            value={valores.telefono}
                            onChange={(e) => onChange('telefono', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="999 999 999"
                        />
                    </div>
                </div>

                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estado Civil <span className="text-red-500">*</span></label>
                    <select
                        value={valores.estadoCivil}
                        onChange={(e) => onChange('estadoCivil', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none bg-white"
                    >
                        <option value="">-- Seleccionar --</option>
                        <option value="Soltero">Soltero(a)</option>
                        <option value="Casado">Casado(a)</option>
                        <option value="Divorciado">Divorciado(a)</option>
                        <option value="Viudo">Viudo(a)</option>
                    </select>
                </div>

                <div className="md:col-span-12">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <MapPinIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            value={valores.direccion}
                            onChange={(e) => onChange('direccion', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Av. Principal #123..."
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DatosPersonalesForm;