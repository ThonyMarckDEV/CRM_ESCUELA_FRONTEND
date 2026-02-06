import React from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';

const DatosPersonalesForm = ({ data, handleNestedChange }) => {

    const handleLetters = (field, value) => {
        const val = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        handleNestedChange('datos_alumno', field, val);
    };

    const handleNumbers = (field, value, limit) => {
        const val = value.replace(/\D/g, '').slice(0, limit);
        handleNestedChange('datos_alumno', field, val);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <IdentificationIcon className="w-5 h-5" /> Datos Personales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Código Estudiante */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Código Estudiante <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.datos_alumno.codigo_estudiante || ''}
                        onChange={(e) => handleNumbers('codigo_estudiante', e.target.value, 15)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                        placeholder="Ej: 2024001"
                        required
                    />
                </div>

                {/* DNI */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        DNI <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.datos_alumno.dni || ''}
                        onChange={(e) => handleNumbers('dni', e.target.value, 8)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                        placeholder="8 dígitos"
                        required
                    />
                </div>

                {/* Nombres */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nombres <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.datos_alumno.nombre || ''}
                        onChange={(e) => handleLetters('nombre', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                        required
                    />
                </div>

                {/* Apellido Paterno */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Apellido Paterno <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.datos_alumno.apellidoPaterno || ''}
                        onChange={(e) => handleLetters('apellidoPaterno', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                        required
                    />
                </div>

                {/* Apellido Materno */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Apellido Materno <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.datos_alumno.apellidoMaterno || ''}
                        onChange={(e) => handleLetters('apellidoMaterno', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                        required
                    />
                </div>
                
                {/* Sexo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Sexo <span className="text-red-500">*</span>
                  </label>
                  <select
                      value={data.datos_alumno.sexo || ''}
                      onChange={(e) => handleNestedChange('datos_alumno', 'sexo', e.target.value)}
                      className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white"
                      required
                  >
                      <option value="">Seleccione...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                  </select>
                </div>

                {/* Fecha Nacimiento */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Fecha Nacimiento <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={data.datos_alumno.fechaNacimiento || ''}
                        onChange={(e) => handleNestedChange('datos_alumno', 'fechaNacimiento', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                        required
                    />
                </div>
                
                {/* Dirección */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Dirección Domiciliaria <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.datos_alumno.direccion || ''}
                        onChange={(e) => handleNestedChange('datos_alumno', 'direccion', e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                        placeholder="Av. Principal 123..."
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default DatosPersonalesForm;