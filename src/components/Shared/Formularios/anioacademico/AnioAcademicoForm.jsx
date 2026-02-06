import React from 'react';

const AnioAcademicoForm = ({ data, handleChange, isLocked = false }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <label className="block text-sm font-black text-slate-700 uppercase mb-2">
          Año Académico (Ej: 2026)
        </label>
        <input
          type="text"
          name="nombre"
          maxLength="4"
          value={data.nombre}
          onChange={handleChange}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all font-mono text-lg"
          placeholder="2026"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-black text-slate-700 uppercase mb-2">
            Fecha Inicio {isLocked && "🔒"}
          </label>
          <input
            type="date"
            name="fecha_inicio"
            value={data.fecha_inicio}
            onChange={handleChange}
            disabled={isLocked} // BLOQUEO AQUÍ
            className={`w-full p-3 border rounded-lg outline-none transition-all ${
              isLocked ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-black'
            }`}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-black text-slate-700 uppercase mb-2">
            Fecha Fin {isLocked && "🔒"}
          </label>
          <input
            type="date"
            name="fecha_fin"
            value={data.fecha_fin}
            onChange={handleChange}
            disabled={isLocked} // BLOQUEO AQUÍ
            className={`w-full p-3 border rounded-lg outline-none transition-all ${
              isLocked ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-black'
            }`}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AnioAcademicoForm;