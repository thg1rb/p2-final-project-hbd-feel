import { apiClient } from '$lib/api';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	const token = cookies.get('token');

	try {
		console.log(locals.user);
		const id = locals.user.student_id;
		console.log(id);
		const response = await apiClient.get(`/application/student/${id}`);

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

		// console.log('loading data');
		// console.log(response.data);
		let approved = 0,
			rejected = 0,
			all = 0,
			pending = 0;
		if (response.data.data.applications) {
			let regs = response.data.data.applications;
			for (const reg of regs) {
				// console.log(reg.status, " ", reg.level)
				all++;
				if (reg.status === 'APPROVED' && reg.level === 5 && isClosed) approved++;
				else if (reg.status === 'REJECTED') rejected++;
				else pending++;
			}
		}

		// console.log(pending)
		return {
			regs: response.data.data.applications,
			stats: {
				approved: approved,
				all: all,
				rejected: rejected,
				pending: pending
			},
			curr: response.data.data.current_event,
			student: response.data.data.student,
			isClosed: isClosed
		};
	} catch (err) {
		console.log(err);
		return {
			regs: []
		};
	}
};
