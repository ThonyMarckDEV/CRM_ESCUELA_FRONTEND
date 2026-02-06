import React from 'react';
import { UserIcon, KeyIcon } from '@heroicons/react/24/outline';
import RolSearchSelect from 'components/Shared/Comboboxes/RolSearchSelect';

const UsuarioForm = ({ form, setForm, handleNestedChange, isEditing = false }) => {
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
        <UserIcon className="w-5 h-5" /> Credenciales y Acceso
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* COMBOBOX DE ROLES */}
        <div className="md:col-span-2">
            <RolSearchSelect 
                form={form} 
                setForm={setForm} 
            />
        </div>

        {/* Username */}
        <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nombre de Usuario <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                <input
                    type="text"
                    value={form.usuario.username || ''}
                    onChange={(e) => handleNestedChange('usuario', 'username', e.target.value)}
                    className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                    placeholder="Ej: jperez"
                    required
                />
            </div>
        </div>
        
        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Contraseña {isEditing && <span className="text-xs text-gray-400 font-normal normal-case">(Opcional al editar)</span>}
              {!isEditing && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
              <KeyIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
              <input
                  type="password"
                  value={form.usuario.password || ''}
                  onChange={(e) => handleNestedChange('usuario', 'password', e.target.value)}
                  className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                  placeholder={isEditing ? "Dejar vacío para mantener" : "Mínimo 6 caracteres"}
                  required={!isEditing}
                  minLength={6}
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;