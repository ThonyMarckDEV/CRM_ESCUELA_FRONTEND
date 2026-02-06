import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from 'services/anioAcademicoService';
import AnioAcademicoForm from 'components/Shared/Formularios/anioacademico/AnioAcademicoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { CalendarIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const AgregarAnio = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        nombre: '', 
        fecha_inicio: '', 
        fecha_fin: '',
        estado: true 
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await store(formData);
            setAlert({ type: 'success', message: 'Año académico creado con éxito. Redirigiendo...' });
            setTimeout(() => navigate('/anio-academico/listar'), 1500);
        } catch (error) {
            setAlert(handleApiError(error, 'Error al crear el año'));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Nuevo Año Académico" icon={CalendarIcon} buttonText="Volver" buttonLink="/anio-academico/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <AnioAcademicoForm data={formData} handleChange={handleChange} />
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="mt-8 w-full bg-black text-white py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Registrar Año'}
                </button>
            </form>
        </div>
    );
};

export default AgregarAnio;