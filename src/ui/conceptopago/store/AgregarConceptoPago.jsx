import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/conceptoPagoService';
import ConceptoPagoForm from 'components/Shared/Formularios/conceptopago/ConceptoPagoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const AgregarConceptoPago = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    nombre: '', 
    monto: '',
    periodo_id: null, 
    periodoNombre: '',
    anio_academico_id: '',
    anioNombre: '',
    es_matricula: false,
    es_pension: true
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (!formData.es_matricula && !formData.es_pension) {
        setAlert({ type: 'error', message: 'Seleccione si es Matrícula o Pensión.' });
        setLoading(false);
        return;
    }

    if (formData.es_matricula) {
        if (!formData.anio_academico_id) {
            setAlert({ type: 'error', message: 'Para una Matrícula, debes seleccionar el Año Académico.' });
            setLoading(false);
            return;
        }
    } else {
        if (!formData.periodo_id) {
            setAlert({ type: 'error', message: 'Para una Pensión, debes seleccionar el Periodo (Bimestre).' });
            setLoading(false);
            return;
        }
    }

    try {
      await store(formData);
      setAlert({ type: 'success', message: 'Registrado correctamente.' });
      setTimeout(() => navigate('/concepto-pago/listar'), 1500);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al crear'));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Nuevo Concepto" icon={BanknotesIcon} buttonText="Volver" buttonLink="/concepto-pago/listar" />
      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
      
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <ConceptoPagoForm 
                data={formData} 
                handleChange={handleChange} 
                setForm={setFormData} 
            />
            <button type="submit" disabled={loading} className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-lg">
                {loading ? 'Guardando...' : 'Registrar Concepto'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarConceptoPago;