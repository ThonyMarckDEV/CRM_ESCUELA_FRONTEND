import React, { useState } from 'react';
import { UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const UsuarioForm = ({ data, handleNestedChange, isEditing = false }) => {
    const [showPass, setShowPass] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const passwordError = !isEditing && confirmPassword && data.usuario.password !== confirmPassword;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                <UserIcon className="w-5 h-5" /> Credenciales de Acceso
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Username */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre de Usuario *</label>
                    <input
                        type="text"
                        value={data.usuario.username || ''}
                        onChange={(e) => handleNestedChange('usuario', 'username', e.target.value.trim())}
                        className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                        required
                    />
                </div>
                
                {/* Contraseña */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Contraseña {isEditing ? '(Opcional)' : '*'}
                    </label>
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            value={data.usuario.password || ''}
                            onChange={(e) => handleNestedChange('usuario', 'password', e.target.value)}
                            className={`w-full p-2.5 text-sm border rounded-lg focus:ring-1 focus:ring-black outline-none ${passwordError ? 'border-red-500' : 'border-slate-300'}`}
                            placeholder="Mínimo 6 caracteres"
                            required={!isEditing}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-2.5 text-slate-400"
                        >
                            {showPass ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirmar Contraseña *</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isEditing && !data.usuario.password}
                        className={`w-full p-2.5 text-sm border rounded-lg focus:ring-1 focus:ring-black outline-none ${passwordError ? 'border-red-500' : 'border-slate-300'}`}
                        placeholder="Repite la contraseña"
                    />
                    {passwordError && <p className="text-[10px] text-red-500 mt-1 font-bold italic uppercase">Las contraseñas no coinciden</p>}
                </div>
            </div>
        </div>
    );
};

export default UsuarioForm;