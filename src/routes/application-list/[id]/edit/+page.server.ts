import type { Actions, PageServerLoad } from './$types';
import { redirect, fail, error } from '@sveltejs/kit';
import { apiClient } from '$lib/api';
import type { Application, UserFromToken } from '$lib/type.js';
import { roleMapUserRole, UserRole } from '$lib/enums.js';

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
		} catch (e) {
			throw redirect(303, '/');
		}
	} else {
		throw redirect(303, '/');
	}

	try {
		const appResponse = await apiClient.get(`/application/${id}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		const application = appResponse.data as Application;

		const isOwnApplication = application.student_id === user.studentID;

		let isEditable = false;
		if (application.event) {
			const now = new Date();
			const startDate = new Date(application.event.start_date);
			const endDate = new Date(application.event.end_date);
			isEditable = now >= startDate && now <= endDate;
		}

		const awardResponse = await apiClient.get(`/awards/${application.award_id}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		const award = awardResponse.data;

		return {
			user,
			application,
			award,
			isOwnApplication,
			isEditable
		};
	} catch (err: any) {
		throw error(400, err.response?.data?.message);
	}
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const formData = await request.formData();
		const token = cookies.get('token');

		const apiPayload = new FormData();
		apiPayload.append('year', formData.get('year') as string);
		apiPayload.append('grade', formData.get('grade') as string);

		const mainFile = formData.get('path') as File;
		if (mainFile && mainFile.size > 0) {
			apiPayload.append('path', mainFile);
		}

		for (const [key, value] of formData.entries()) {
			if (key.startsWith('documents[') && value instanceof File && value.size > 0) {
				apiPayload.append(key, value);
			}
		}

		try {
			const response = await apiClient.put(`/application/${params.id}`, apiPayload, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
		} catch (err: any) {
			return fail(400, {
				message: err.response?.data?.message || err.response?.data?.error || err.message || 'เกิดข้อผิดพลาดในการแก้ไข'
			});
		}
		throw redirect(303, `/application-list/${params.id}`);
	}
};
