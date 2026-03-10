import type { PageServerLoad } from './$types';
import { apiClient } from '$lib/api';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const token = cookies.get('token');

		const res = await apiClient.get('/awards', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		return {
			awards: res.data
		};
	} catch (error) {
		console.error('Fetch awards error:', error);

		return {
			awards: []
		};
	}
};