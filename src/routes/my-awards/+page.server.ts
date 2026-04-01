import { apiClient, withAuth } from '$lib/api';
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
		const response = await apiClient.get(`/application/student/${id}`, withAuth(token));

		// console.log('loading data');
		// console.log(response.data);
		let approved = 0,
			rejected = 0,
			all = 0,
			pending = 0;
		if (response.data.applications) {
			let regs = response.data.applications;
			for (const reg of regs) {
				// console.log(reg.status, " ", reg.level)
				all++;
				if (reg.status === 'APPROVED' && reg.level === 5 && reg.event.status === 'CLOSED')
					approved++;
				else if (reg.status === 'REJECTED') rejected++;
				else pending++;
			}
		}

		let alreadyApplied = false;

		if (response.data.applications && response.data.current_event) {
			const regs = response.data.applications;
			const currentEventId = response.data.current_event.id;
			alreadyApplied = regs.some((r: any) => r.event_id === currentEventId);
		}

		// console.log(pending)
		return {
			regs: response.data.applications,
			stats: {
				approved: approved,
				all: all,
				rejected: rejected,
				pending: pending
			},
			curr: response.data.current_event,
			student: response.data.student,
			alreadyApplied
		};
	} catch (err) {
		console.log(err);
		return {
			regs: []
		};
	}
};
