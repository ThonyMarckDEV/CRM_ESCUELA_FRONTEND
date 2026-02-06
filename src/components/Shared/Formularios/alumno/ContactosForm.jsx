import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';

const ContactosForm = ({ data, handleNestedChange }) => {

    const handleLetters = (section, field, value) => {
        const val = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        handleNestedChange(section, field, val);
    };

    const handleNumbers = (section, field, value, limit) => {
        const val = value.replace(/\D/g, '').slice(0, limit);
        handleNestedChange(section, field, val);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <PhoneIcon className="w-5 h-5" /> Información de Contacto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Apoderado */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase">Datos del Apoderado</h4>
                    
                    {/* Nombre Apoderado */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Nombre Completo Apoderado <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.datos_alumno.nombre_apoderado || ''}
                            onChange={(e) => handleLetters('datos_alumno', 'nombre_apoderado', e.target.value)}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                            required
                        />
                    </div>

                    {/* Teléfono Apoderado */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Teléfono Apoderado <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.datos_alumno.telefono_apoderado || ''}
                            onChange={(e) => handleNumbers('datos_alumno', 'telefono_apoderado', e.target.value, 9)}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                            placeholder="Ej: 987654321"
                            required
                        />
                    </div>
                </div>

                {/* Contacto Estudiante */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase">Contacto del Estudiante</h4>
                    
                    {/* Teléfono Personal */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Teléfono Personal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.contactos.telefono || ''}
                            onChange={(e) => handleNumbers('contactos', 'telefono', e.target.value, 9)}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                            placeholder="Ej: 912345678"
                            required
                        />
                    </div>

                    {/* Correo Electrónico */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={data.contactos.correo || ''}
                            onChange={(e) => handleNestedChange('contactos', 'correo', e.target.value)}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactosForm;