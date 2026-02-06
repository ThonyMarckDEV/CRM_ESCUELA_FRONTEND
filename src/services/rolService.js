import { fetchWithAuth } from 'js/authToken';
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse';

const BASE_URL = `${API_BASE_URL}/api/rol`;

export const index = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: page,
    search: filters.search || '',
  });

  const response = await fetchWithAuth(`${BASE_URL}/index?${params.toString()}`, { method: 'GET' });
  return handleResponse(response);
};
