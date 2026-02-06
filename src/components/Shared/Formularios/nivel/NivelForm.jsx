import React from 'react';

const NivelForm = ({ data, handleChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <label className="block text-sm font-black text-slate-700 uppercase mb-2">
            Nombre del Nivel Educativo
        </label>
        <input
          type="text"
          name="nombre"
          value={data.nombre}
          onChange={handleChange}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
          placeholder="Ej: Inicial, Primaria, Secundaria..."
          required
        />
      </div>
    </div>
  );
};

export default NivelForm;