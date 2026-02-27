import type { PageServerLoad } from './$types';
import { apiClient } from '$lib/api';

export const load: PageServerLoad = async () => {
	try {
		const res = await apiClient.get('/awards');

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