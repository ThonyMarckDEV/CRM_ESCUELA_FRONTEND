import React from 'react';

const CursoForm = ({ data, handleChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Nombre del Curso */}
      <div>
        <label className="block text-sm font-black text-slate-700 uppercase mb-2">
            Nombre del Curso / Materia
        </label>
        <input
          type="text"
          name="nombre"
          value={data.nombre}
          onChange={handleChange}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
          placeholder="Ej: Matemática Financiera, Algoritmos..."
          required
        />
      </div>
    </div>
  );
};

export default CursoForm;