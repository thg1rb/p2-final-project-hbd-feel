import { apiClient } from "$lib/api";
import { getHomePage } from "$lib/utils/getHomePage";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = ({ locals }) => {
    if (locals.user) {
        throw redirect(303, getHomePage(locals.user.role) || '/');
    }
}

export const actions: Actions = {
    reset_password: async ({ request }) => {
        ;

        const data = await request.formData();
        const password = data.get('password');
        const confirm = data.get('password_confirmation');
        const token = data.get("token");
        const email = data.get("email");

        try {

            const response = await apiClient.post(
                '/auth/reset-password',
                {
                    password: password,
                    password_confirmation: confirm,
                    email: email,
                    token: token,
                },
            );

        } catch (err: any) {
            if (err?.status === 303) throw err;
            if (err.response?.status === 400) {
                return fail(400, {
                    message: "Reset Password Token ไม่ถูกต้องหรือหมดอายุแล้ว"
                });
            }
            if (err.response?.status === 422) {
                return fail(422, {
                    errors: err.response.data.errors
                });
            }
        }

    }
}