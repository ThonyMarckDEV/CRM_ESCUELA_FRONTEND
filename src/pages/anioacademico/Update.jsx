import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { show, update } from 'services/anioAcademicoService';
import AnioAcademicoForm from 'components/Shared/Formularios/anioacademico/AnioAcademicoForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nombre: '', fecha_inicio: '', fecha_fin: '' });
    const [isLocked, setIsLocked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const loadAnio = async () => {
            try {
                const response = await show(id);
                const data = response.data || response;
                setFormData({
                    nombre: data.nombre,
                    fecha_inicio: data.fecha_inicio,
                    fecha_fin: data.fecha_fin
                });
                if (data.tiene_data) setIsLocked(true);
            } catch (err) {
                setAlert(handleApiError(err , 'No se pudo cargar el año académico.'));
            } finally {
                setLoading(false);
            }
        };
        loadAnio();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await update(id, formData);
            setAlert({ type: 'success', message: 'Datos actualizados con éxito.' });
            setTimeout(() => navigate('/anio-academico/listar'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Editar Año Académico" icon={PencilSquareIcon} buttonText="Volver" buttonLink="/anio-academico/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    <AnioAcademicoForm data={formData} handleChange={handleChange} isLocked={isLocked} />
                    
                    {isLocked && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                            <LockClosedIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-800 font-medium">
                                <strong>Edición Protegida:</strong> Este año ya tiene movimientos. Solo puedes editar el nombre.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
                        <button type="button" onClick={() => navigate('/anio-academico/listar')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors uppercase text-sm">
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-all disabled:opacity-50 text-sm">
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update;