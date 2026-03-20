import { useState, useEffect, useCallback, useRef } from 'react';
import { index } from 'services/perfilService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import CryptoJS from 'crypto-js';
import { toPng } from 'html-to-image';

export const useIndex = () => {
    const [loading, setLoading] = useState(true);
    const [perfil, setPerfil] = useState(null);
    const [alert, setAlert] = useState(null);
    const [qrEncriptado, setQrEncriptado] = useState(null);
    
    const carnetRef = useRef(null);

    const fetchPerfil = useCallback(async () => {
        setLoading(true);
        try {
            const response = await index();
            const data = response.data || response;
            setPerfil(data);

            if (data.tipo === 'alumno' && data.datos?.dni) {
                const secretKey = process.env.REACT_APP_QR_SECRET_KEY;
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

    // Función para descargar el carnet
    const downloadCarnet = useCallback(() => {
        if (carnetRef.current === null || !perfil?.datos?.dni) return;

        toPng(carnetRef.current, { cacheBust: true, pixelRatio: 2 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `Carnet-${perfil.datos.dni}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Error al generar la imagen', err);
                setAlert({ type: 'error', message: 'No se pudo generar la imagen del carnet.' });
            });
    }, [perfil]);

    return { 
        loading, 
        perfil, 
        alert, 
        setAlert, 
        qrEncriptado, 
        carnetRef, 
        downloadCarnet 
    };
};