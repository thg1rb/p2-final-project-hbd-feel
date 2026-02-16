import { apiClient } from "$lib/api";
import type { Application } from "$lib/type";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || '';
  const page = parseInt(url.searchParams.get('page') || '1');

  try {
    const response = await apiClient.get('/applications', {
      params: { search, status, page }
    })

    return {
      applications: response.data.data as Application[],
      search,
      status,
      currentPage: response.data.current_page || page,
      totalPages: response.data.last_page || 1
    }
  } catch (error: any) {
    console.error('--- LOG START ---');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    console.error('--- LOG END ---');

    return {
      applications: [],
      search,
      status,
      currentPage: 1,
      totalPages: 1,
      error: error.message
    };
  }
}
