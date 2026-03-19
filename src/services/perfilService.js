import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/perfil`;

export const index = async () => {
    const response = await fetchWithAuth(`${BASE_URL}/index`, { method: 'GET' });
    return handleResponse(response);
};

export const update = async (data) => {
    const response = await fetchWithAuth(`${BASE_URL}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};