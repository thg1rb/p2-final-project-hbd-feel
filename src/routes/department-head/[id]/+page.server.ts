import { apiClient } from '$lib/api.js';
import type { Application, Approval } from '$lib/type.js';
import type { Actions } from './$types.js';

export const load = async ({ params }) => {
  const id = params.id
  const appResponse = await apiClient.get(`/application/${id}`)
  const approvalResponse = await apiClient.get(`/approvals/${id}`)

  const headDeptApprovalResponse = await apiClient.get(`/approvals/${id}/${2}`)

  const headDeptApproval = headDeptApprovalResponse.data as Approval
  const approvals = approvalResponse.data as Approval[]
  const application = appResponse.data as Application


  return {
    application: application,
    filePath: application.path,
    approvals: approvals,
    headDeptApproval: headDeptApproval
  };
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