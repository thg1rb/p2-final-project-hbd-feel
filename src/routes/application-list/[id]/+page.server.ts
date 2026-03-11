import { apiClient } from '$lib/api.js';
import { roleMapUserRole, UserRole } from '$lib/enums.js';
import { toastStack } from '$lib/stores/toast.svelte.js';
import type { Application, Approval, UserFromToken } from '$lib/type.js';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const id = params.id;
	const token = cookies.get('token');
	let user: UserFromToken = {
		id: 0,
		name: '',
		email: '',
		role: UserRole.NISIT,
		studentID: ''
	};

	try {
		const appResponse = await apiClient.get(`/application/${id}`);
		const approvalResponse = await apiClient.get(`/approvals/${id}`);

		const approvals = approvalResponse.data as Approval[];
		const application = appResponse.data as Application;

		const userToken = cookies.get('user_info');

		if (userToken) {
			try {
				const decoded = Buffer.from(userToken, 'base64').toString('utf-8');
				const newUser = JSON.parse(decoded);
				user = {
					id: newUser['id'],
					name: newUser['name'],
					email: newUser['email'],
					role: roleMapUserRole[newUser['role']],
					studentID: newUser['student_id']
				};
				// if (user.role === UserRole.NISIT) {
				//   throw redirect(303, '/');
				// }
			} catch (e) {
				throw redirect(303, '/');
			}
		} else {
			throw redirect(303, '/');
		}

		let isClosed = false;

		try {
			const isClosedResponse = await apiClient.get(`/event/is-closed`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			isClosed = isClosedResponse.data as boolean;
		} catch {
			isClosed = false;
		}

		return {
			user: user,
			application: application,
			approvals: approvals,
			isClosed: isClosed
		};
	} catch (err: any) {
		toastStack.add('เกิดข้อผิดพลาด', 'error');
		return {
			user: user,
			error: 'ไม่สามารถดึงข้อมูลใบสมัครได้'
		};
	}
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const applicationId = params.id;

		const formData = await request.formData();
		const reason = formData.get('reason');
		const status = formData.get('status')?.toString().toUpperCase();

		// Get current user ID from cookie
		const userToken = cookies.get('user_info');
		let userId = 0;
		if (userToken) {
			try {
				const decoded = Buffer.from(userToken, 'base64').toString('utf-8');
				const newUser = JSON.parse(decoded);
				userId = newUser['id'];
			} catch (e) {
				// Handle error
			}
		}

		try {
			const response = await apiClient.post('/approvals', {
				user_id: userId,
				application_id: applicationId,
				reason: reason,
				status: status
			});

			return { success: true, data: response.data };
		} catch (error: any) {
			return {
				success: false,
				message: error.response?.data?.message || error.message || 'เกิดข้อผิดพลาดในการบันทึก'
			};
		}
	}
};
