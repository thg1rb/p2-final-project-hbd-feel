import { error, json } from '@sveltejs/kit';
import { apiClient } from '$lib/api';

export const GET = async ({ cookies }) => {
  const token = cookies.get('token');

  if (!token) {
    throw error(401, 'Unauthorized: No token found');
  }

  try {
    const response = await apiClient.get('/applications/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return json(response.data);

  } catch (err: any) {
    console.error('Export API Error:', err.message);
    throw error(err.response?.status || 500, 'Internal Server Error');
  }
};