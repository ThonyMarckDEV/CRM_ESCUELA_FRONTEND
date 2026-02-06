import React from 'react';
import { LockClosedIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import AnioAcademicoSearchSelect from 'components/Shared/Comboboxes/AnioAcademicoSearchSelect';

const PeriodoForm = ({ data, setFormData, handleChange, isLocked = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {isLocked && (
        <div className="md:col-span-2 bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
          <InformationCircleIcon className="w-6 h-6 text-blue-600 shrink-0" />
          <div className="text-sm text-blue-800">
            <strong>Edición Limitada:</strong> Este periodo tiene registros. Por seguridad, las fechas y el año académico no se pueden modificar.
          </div>
        </div>
      )}

      {/* SELECTOR DE AÑO ACADÉMICO */}
      <div className="md:col-span-2">
        <AnioAcademicoSearchSelect 
            form={data} 
            setForm={setFormData} 
            disabled={isLocked} 
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-black text-slate-700 uppercase mb-2">
          Nombre del Periodo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nombre"
          value={data.nombre}
          onChange={handleChange}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all uppercase"
          placeholder="Ej: PRIMER BIMESTRE"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-black text-slate-700 uppercase mb-2 flex items-center gap-2">
          Fecha de Inicio {isLocked && <LockClosedIcon className="w-4 h-4 text-slate-400" />}
        </label>
        <input
          type="date"
          name="fecha_inicio"
          value={data.fecha_inicio}
          onChange={handleChange}
          disabled={isLocked} 
          className={`w-full p-3 border rounded-lg outline-none transition-all ${isLocked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-black'}`}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-black text-slate-700 uppercase mb-2 flex items-center gap-2">
          Fecha de Fin {isLocked && <LockClosedIcon className="w-4 h-4 text-slate-400" />}
        </label>
        <input
          type="date"
          name="fecha_fin"
          value={data.fecha_fin}
          onChange={handleChange}
          disabled={isLocked}
          className={`w-full p-3 border rounded-lg outline-none transition-all ${isLocked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-black'}`}
          required
        />
      </div>
    </div>
  );
};

export default PeriodoForm;