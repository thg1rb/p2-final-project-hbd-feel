import { apiClient, withAuth } from '$lib/api.js';
import { roleMapUserRole, UserRole } from '$lib/enums.js';
import { toastStack } from '$lib/stores/toast.svelte.js';
import type { Application, Approval, UserFromToken } from '$lib/type.js';
import { redirect, fail } from '@sveltejs/kit';
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
		const userToken = cookies.get('user_info');
		const token = cookies.get('token');

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
			} catch (e) {
				throw redirect(303, '/');
			}
		} else {
			throw redirect(303, '/');
		}

		const appResponse = await apiClient.get(`/application/${id}`, withAuth(token));

		if (!appResponse.data) {
			return {
				user,
				token,
				application: undefined,
				approvals: undefined,
				isOwnApplication: false,
				isEditable: false
			};
		}

		const application = appResponse.data as Application;
		const approvalResponse = await apiClient.get(`/approvals/${id}`, withAuth(token));
		const approvals = approvalResponse.data as Approval[];

		const isOwnApplication = application?.student_id === user.studentID;

		let isEditable = false;
		if (isOwnApplication && application?.event) {
			const now = new Date();
			const startDate = new Date(application.event.start_date);
			const endDate = new Date(application.event.end_date);
			isEditable = now >= startDate && now <= endDate;
		}

		return {
			user,
			token,
			application,
			approvals,
			isOwnApplication,
			isEditable
		};
	} catch (err: any) {
		console.error('Load error:', err);
		return {
			user,
			application: undefined,
			approvals: undefined,
			isOwnApplication: false,
			isEditable: false
		};
	}
};

export const actions: Actions = {
	// Default action: handle approval submission
	approve: async ({ request, params, cookies }) => {
		const applicationId = params.id;

		const formData = await request.formData();
		const reason = formData.get('reason');
		const status = formData.get('status')?.toString().toUpperCase();

		// Get current user ID from cookie
		const userToken = cookies.get('user_info');
		const token = cookies.get('token')
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
			}, withAuth(token));

			return { success: true, data: response.data };
		} catch (error: any) {
			return {
				success: false,
				message: error.response?.data?.message || error.message || 'เกิดข้อผิดพลาดในการบันทึก'
			};
		}
	},

	delete: async ({ params, cookies }) => {
		const token = cookies.get('token');
		const applicationId = params.id;

		try {
			await apiClient.delete(`/application/${applicationId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
		} catch (error: any) {
			console.error('Delete Action Error:', error);

			if (error.response) {
				return fail(error.response.status, {
					success: false,
					message: error.response.data?.message || 'ไม่สามารถลบใบสมัครได้'
				});
			}

			return fail(500, {
				success: false,
				message: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์'
			});
		}

		throw redirect(303, '/my-awards');
	}
};
