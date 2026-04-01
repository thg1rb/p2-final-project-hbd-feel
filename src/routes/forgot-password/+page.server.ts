import { apiClient } from "$lib/api";
import { getHomePage } from "$lib/utils/getHomePage";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from '@sveltejs/kit';

export const load : PageServerLoad = ({ locals }) => {
    if (locals.user) {
        throw redirect(303, getHomePage(locals.user.role) || '/');
    }
}

export const actions: Actions = {
    forgot_password: async ({ request }) => {

        const data = await request.formData();
        const email = data.get('email');

        try {

            const response = await apiClient.post(
                '/auth/forgot-password',
                {
                    email: email,
                },
            );
            
        } catch (err : any) {
            if (err?.status === 303) throw err;
            if (err.response?.status === 404) {
                return fail(404, {
                    message: "ขออภัย เราไม่พบอีเมลที่ท่านกรอกในระบบ โปรดตรวจสอบอีกครั้ง"
                })
            }
            if (err.response?.status === 422) {
                return fail(422, {
                    errors: err.response.data.errors
                });
            }
        }

    }
}