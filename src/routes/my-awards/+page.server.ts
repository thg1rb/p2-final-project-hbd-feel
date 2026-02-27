import { apiClient } from "$lib/api";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({  }) => {
    let id = '1223338363';
    try {
        const response = await apiClient.get(`/application/student/${id}`)

        // console.log('loading data');
        // console.log(response.data);
        let approved = 0, rejected = 0, all = 0, pending = 0;
        if (response.data.data.applications) {
            let regs = response.data.data.applications;
            for (const reg of regs) {
                all++;
                if (reg.status === "APPROVED") approved++;
                if (reg.status === "REJECTED") rejected++;
                if (reg.status === "PENDING") pending++;
            }
        }
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