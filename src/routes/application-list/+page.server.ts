import { apiClient } from "$lib/api";
import type { Application } from "$lib/type";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || '';
  const page = parseInt(url.searchParams.get('page') || '1');

  try {
    const [applicationsResponse, countResponse] = await Promise.all([
      apiClient.get('/applications', { params: { search, status, page } }),
      apiClient.get('/applications/count'),
    ]);

    const count = {
      'pending': countResponse.data.pending as number || 0,
      'approved': countResponse.data.approved as number || 0,
      'rejected': countResponse.data.rejected as number || 0,
      'total': countResponse.data.pending + countResponse.data.approved + countResponse.data.rejected as number || 0,
    }

    return {
      applications: applicationsResponse.data.data as Application[],
      search,
      status,
      currentPage: applicationsResponse.data.current_page || page,
      totalPages: applicationsResponse.data.last_page || 1,
      stats: count
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
      stats: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      },
      error: error.message
    };
  }
}
