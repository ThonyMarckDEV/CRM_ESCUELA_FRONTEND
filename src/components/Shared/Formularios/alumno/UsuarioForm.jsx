import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

const UsuarioForm = ({ data, handleNestedChange, isEditing = false }) => {
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
        <UserIcon className="w-5 h-5" /> Credenciales de Acceso
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nombre de Usuario <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                value={data.usuario.username || ''}
                onChange={(e) => handleNestedChange('usuario', 'username', e.target.value)}
                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                placeholder="Ej: jperez2024"
                required
            />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Contraseña {isEditing && <span className="text-xs text-gray-400 font-normal normal-case">(Opcional al editar)</span>}
              {!isEditing && <span className="text-red-500">*</span>}
          </label>
          <input
              type="password"
              value={data.usuario.password || ''}
              onChange={(e) => handleNestedChange('usuario', 'password', e.target.value)}
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              placeholder={isEditing ? "Dejar vacío para mantener actual" : "Mínimo 6 caracteres"}
              required={!isEditing}
              minLength={6}
          />
        </div>
      </div>
    </div>
  );
};

export default UsuarioForm;