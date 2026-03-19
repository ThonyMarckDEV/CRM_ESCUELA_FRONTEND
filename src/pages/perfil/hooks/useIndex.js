import { useState, useEffect, useCallback } from 'react';
import { index } from 'services/perfilService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import CryptoJS from 'crypto-js';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [perfil, setPerfil] = useState(null);
    const [alert, setAlert] = useState(null);
    const [qrEncriptado, setQrEncriptado] = useState(null);

    const fetchPerfil = useCallback(async () => {
        setLoading(true);
        try {
            const response = await index();
            const data = response.data || response;
            setPerfil(data);

            // Si es alumno y tiene DNI, generamos el QR Encriptado
            if (data.tipo === 'alumno' && data.datos?.dni) {
                const secretKey = process.env.REACT_APP_QR_SECRET_KEY || 'Escuela2026@';
                const encrypted = CryptoJS.AES.encrypt(data.datos.dni, secretKey).toString();
                setQrEncriptado(encrypted);
            }
            
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cargar el perfil.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPerfil();
    }, [fetchPerfil]);

    return { loading, perfil, alert, setAlert, qrEncriptado };
};