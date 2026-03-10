import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { apiClient } from '$lib/api';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const awardId = url.searchParams.get('award_id');

	if (!awardId) {
		throw redirect(302, '/award-application/step1');
	}

	const token = cookies.get('token');

	const res = await apiClient.get(`/awards/${awardId}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return {
		award: res.data
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const token = cookies.get('token');

		try {
			await apiClient.post('/applications', formData, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
		} catch (error: any) {
			return fail(400, {
				message:
					error.response?.data?.message ||
					'เกิดข้อผิดพลาดในการส่งใบสมัคร'
			});
		}

		throw redirect(303, '/my-awards');
	}
};