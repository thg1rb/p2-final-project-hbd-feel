import { apiClient } from '$lib/api.js';
import { roleMapUserRole, UserRole } from '$lib/enums.js';
import { toastStack } from '$lib/stores/toast.svelte.js';
import type { Application, Approval, UserFromToken } from '$lib/type.js';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const id = params.id
  let user = {
    name: "",
    email: "",
    role: UserRole.NISIT,
    studentID: ""
  };
  try {
    const appResponse = await apiClient.get(`/application/${id}`)
    const approvalResponse = await apiClient.get(`/approvals/${id}`)

    const approvals = approvalResponse.data as Approval[]
    const application = appResponse.data as Application

    const userToken = cookies.get('user_info')

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
        // if (user.role === UserRole.NISIT) {
        //   throw redirect(303, '/');
        // }
      } catch (e) {
        throw redirect(303, '/');
      }
    } else {
      throw redirect(303, '/');
    }

    return {
      user: user,
      application: application,
      approvals: approvals,
    };
  } catch (err: any) {
    toastStack.add('เกิดข้อผิดพลาด', 'error')
    return {
      user: user,
      error: "ไม่สามารถดึงข้อมูลใบสมัครได้"
    };
  }

};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const applicationId = params.id

    const formData = await request.formData();
    const reason = formData.get('reason')
    const status = formData.get('status')?.toString().toUpperCase()

    try {
      const response = await apiClient.post('/approvals', {
        user_id: 2,
        application_id: applicationId,
        reason: reason,
        status: status,
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || error.message || 'เกิดข้อผิดพลาดในการบันทึก' };
    }

  }
}
