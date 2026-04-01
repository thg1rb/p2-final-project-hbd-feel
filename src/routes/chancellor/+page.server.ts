import { apiClient, withAuth } from "$lib/api";
import type { Application, User, UserFromToken } from "$lib/type";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from './$types';
import { roleMapUserRole, UserRole } from "$lib/enums";
import type { StatProps } from "./components/ApplicationStat.svelte";

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

  console.log("TOKEN: ", token)


  try {
    const [applicationsResponse, countResponse] = await Promise.all([
      apiClient.get('/applications', {
        params: { search, status, page },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }),
      apiClient.get('/applications/count/inprogress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }),
    ]);

    const count: StatProps = {
      total: countResponse.data.total as number || 0,
      totalInprogress: countResponse.data.totalInprogress as number || 0,
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
        totalInprogress: 0
      },
      error: error.message
    };
  }
}

export const actions: Actions = {
  upload: async ({ request, cookies }) => {
    const formData = await request.formData()
    const file = formData.get('document') as File
    const eventId = formData.get('event-id')

    if (!file || file.size === 0) {
      return fail(400, { error: 'กรุณาเลือกไฟล์' })
    }

    if (file.type !== 'application/pdf') {
      return fail(400, { message: 'รองรับเฉพาะไฟล์ PDF เท่านั้น' })
    }

    const apiFormData = new FormData()
    apiFormData.append('file', file)
    apiFormData.append('folder', 'event')

    try {
      const token = cookies.get('token');
      const res = await apiClient.post('/minio/upload', apiFormData, withAuth(token))
      const result = await res.data
      const path = result.path

      const resEvent = await apiClient.post('/event/end-event', {
        eventId: eventId,
        path: path
      }, withAuth(token))

      return { success: true }
    } catch (err: any) {
      console.log(err)
      return fail(500, { error: 'ไม่สามารถติดต่อ Server ได้' })
    }
  }

} 