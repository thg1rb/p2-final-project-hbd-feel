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

    const [pendingResponse, approvedResponse, rejectedResponse] = await Promise.all([
      apiClient.get('/applications/count', { params: { status: 'SUBMITTED' } }),
      apiClient.get('/applications/count', { params: { status: 'APPROVED_DEPT_HEAD' } }),
      apiClient.get('/applications/count', { params: { status: 'REJECTED_DEPT_HEAD' } })
    ])

    const pendingCount = pendingResponse.data as number || 0
    const approvedCount = approvedResponse.data as number || 0
    const rejectedCount = rejectedResponse.data as number || 0
    const totalCount = pendingCount + approvedCount + rejectedCount

    return {
      applications: response.data.data as Application[],
      search,
      status,
      currentPage: response.data.current_page || page,
      totalPages: response.data.last_page || 1,
      stats: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      }
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
