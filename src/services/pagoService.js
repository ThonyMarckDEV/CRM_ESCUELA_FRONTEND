import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/pago`;

// GET: Listar
export const index = async (page = 1, filters = {}) => {
  const estado = (filters.estado !== undefined && filters.estado !== null && filters.estado !== '') 
                 ? filters.estado 
                 : '';

  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
    fecha_inicio: filters.fecha_inicio || '',
    fecha_fin: filters.fecha_fin || '',
    estado: estado
  });

  const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
  return handleResponse(response);
};

// GET: Ver uno
export const show = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
  return handleResponse(response);
};

// POST: Crear
export const store = async (data) => {
  const response = await fetchWithAuth(`${BASE_URL}/store`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/pdf'
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
      return await response.blob(); 
  } else {
      const errorData = await response.json();
      throw errorData; 
  }
};

//GET: OBTENER EL TICKET DE VENTA
export const getTicket = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/ticket/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/pdf' }
    });
    
    if (response.ok) return await response.blob();
    
    const error = await response.json();
    throw error;
};

// PUT: Actualizar
export const update = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// PATCH: Anular (Borrado Lógico)
export const destroy = async (id) => {
    // Usamos 'anular' o 'destroy' según tu ruta backend
    const response = await fetchWithAuth(`${BASE_URL}/anular/${id}`, { method: 'DELETE' });
    return handleResponse(response);
};