import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

// NOTA: Asegúrate de que este endpoint coincida con tu Route::prefix en Laravel
const BASE_URL = `${API_BASE_URL}/api/horario`;

// GET: Listar con filtros (Año, Docente, Día, Sección)
export const index = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: page,
    docente: filters.docente_id || '',
    anio: filters.anio_academico_id || '',
    seccion: filters.seccion_id || '',
    dia: filters.dia_semana || '',
    grado: filters.grado_id || '' 
  });

  const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { 
    method: 'GET' 
  });
  return handleResponse(response);
};

// GET: Obtener un horario específico (para editar)
export const show = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { 
    method: 'GET' 
  });
  return handleResponse(response);
};

// POST: Crear nuevo horario
export const store = async (data) => {
  const response = await fetchWithAuth(`${BASE_URL}/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// PUT: Actualizar horario existente
export const update = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// DELETE: Eliminar horario
export const destroy = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/delete/${id}`, { 
        method: 'DELETE' 
    });
    return handleResponse(response);
};

export const getBySeccion = async (seccionId) => {
  const response = await fetchWithAuth(`${BASE_URL}/seccion/${seccionId}`, { method: 'GET' });
  return handleResponse(response);
};

export const getMiHorario = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/mi-horario`, { method: 'GET' });
  return handleResponse(response);
};