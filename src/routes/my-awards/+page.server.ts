import { apiClient } from "$lib/api";
import type { PageServerLoad } from "./$types";
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {

    if (!locals.user) {
        throw redirect(302, '/login');
    }

    try {
        console.log(locals.user)
        const id = locals.user.student_id;
        console.log(id)
        const response = await apiClient.get(`/application/student/${id}`)


        // console.log('loading data');
        // console.log(response.data);
        let approved = 0, rejected = 0, all = 0, pending = 0;
        if (response.data.data.applications) {
            let regs = response.data.data.applications;
            for (const reg of regs) {
                // console.log(reg.status, " ", reg.level)
                all++;
                if (reg.status === "APPROVED" && reg.level === 5) approved++;
                else if (reg.status === "REJECTED") rejected++;
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
            student: response.data.data.student
        };

    } catch (err) {
        console.log(err)
        return {
            regs: []
        }
    }
}