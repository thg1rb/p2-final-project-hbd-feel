import { apiClient } from "$lib/api";
import type { Application, User, UserFromToken } from "$lib/type";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';
import { roleMapUserRole, UserRole } from "$lib/enums";

export const load: PageServerLoad = async ({ url, cookies }) => {
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const token = cookies.get('token');
  const userToken = cookies.get('user_info')
  let user: UserFromToken = {
    name: "",
    email: "",
    role: UserRole.NISIT,
    studentID: ""
  };

  if (userToken) {
    try {
      const decoded = Buffer.from(userToken, 'base64').toString('utf-8');
      const newUser = JSON.parse(decoded);
      user = {
        name: newUser['name'],
        email: newUser['email'],
        role: roleMapUserRole[newUser['role']],
        studentID: newUser['student_id'],
      }
      if (user.role === UserRole.NISIT) {
        throw redirect(303, '/');
      }
    } catch (e) {
      throw redirect(303, '/');
    }
  } else {
    throw redirect(303, '/');
  }



  try {
    const [applicationsResponse, countResponse] = await Promise.all([
      apiClient.get('/applications', {
        params: { search, status, page },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }),
      apiClient.get('/applications/count', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }),
    ]);

    const count = {
      'pending': countResponse.data.pending as number || 0,
      'approved': countResponse.data.approved as number || 0,
      'rejected': countResponse.data.rejected as number || 0,
      'total': countResponse.data.pending + countResponse.data.approved + countResponse.data.rejected as number || 0,
    }

    return {
      user: user,
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
      user: user,
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
