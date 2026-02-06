import React from 'react';
import NivelSearchSelect from 'components/Shared/Comboboxes/NivelSearchSelect'; 

const GradoForm = ({ data, handleChange, setForm, isLevelLocked = false }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      
      <NivelSearchSelect 
        form={data} 
        setForm={setForm} 
        disabled={isLevelLocked}
      />

      <div>
        <label className="block text-sm font-black text-slate-700 uppercase mb-2">
            Nombre del Grado
        </label>
        <input
          type="text"
          name="nombre"
          value={data.nombre}
          onChange={handleChange}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all placeholder-slate-400"
          placeholder="Ej: 5to de Secundaria, 1er Grado..."
          required
        />
      </div>
    </div>
  );
};

export default GradoForm;