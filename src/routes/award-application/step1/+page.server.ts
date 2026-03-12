import { apiClient } from '$lib/api';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const token = cookies.get('token');
	const id = locals.user.student_id;

	const response = await apiClient.get(`/application/student/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	const regs = response.data.data.applications;
	const currentEvent = response.data.data.current_event;

	let alreadyApplied = false;

	if (regs && currentEvent) {
		alreadyApplied = regs.some((r: any) => r.event_id === currentEvent.id);
	}

	if (alreadyApplied) {
		throw redirect(302, '/dashboard');
	}

	const awards = await apiClient.get('/awards', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return {
		awards: awards.data
	};
};