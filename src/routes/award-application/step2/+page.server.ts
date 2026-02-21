import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { apiClient } from '$lib/api';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		try {
			await apiClient.post('/applications', formData);
		} catch (error: any) {
			console.error(error);

			return fail(400, {
				message:
					error.response?.data?.message ||
					'เกิดข้อผิดพลาดในการส่งใบสมัคร'
			});
		}

		throw redirect(303, '/my-awards');
	}
};