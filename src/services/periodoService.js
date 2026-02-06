import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/periodo`;

// GET: Listar con paginación y filtros
export const index = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
    estado: filters.estado || ''
  });

  const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
  return handleResponse(response);
};

// GET: Obtener un solo registro
export const show = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/show/${id}`, { method: 'GET' });
  return handleResponse(response);
};

// POST: Crear nuevo
export const store = async (data) => {
  const response = await fetchWithAuth(`${BASE_URL}/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// PUT: Actualizar existente
export const update = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// PATCH: Cambiar estado
export const toggleStatus = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/status/${id}`, { method: 'PATCH' });
  return handleResponse(response);
};

// DELETE: Eliminar
export const destroy = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
    return handleResponse(response);
};