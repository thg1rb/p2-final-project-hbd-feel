import { apiClient } from "$lib/api";
import type { Actions } from "./$types";
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
    change_password: async ({ cookies, request, locals }) => {
        console.log("Try to login");
        const data = await request.formData();
        const password = data.get('password');
        const confirm = data.get('password_confirmation');
        try {
            const token = cookies.get('token');


            const old = data.get('old-password');
            const response = await apiClient.post(
                '/auth/change-password',
                {
                    current_password: old,
                    password: password,
                    password_confirmation: confirm
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            const me = await apiClient.get('/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedUser = me.data.user;
            const userBase64 = Buffer.from(JSON.stringify(updatedUser)).toString('base64');
            cookies.set('user_info', userBase64, { path: '/', maxAge: 60 * 60 * 24 * 7 });

            const user = locals.user;
            
            if (!user) {
                redirect(303, '/login');
            }

            if (user.role == 'NISIT') {
                throw redirect(303, '/my-awards')
            }
            if (user.role === 'ADMIN') {
                throw redirect(303, '/application-list')
            }
            if (user.role === 'ASSO_DEAN' || user.role === 'DEAN' || user.role === 'DEPT_HEAD') {
                throw redirect(303, '/application-list')
            }
        } catch (err : any) {
            console.log(err);
            if (err?.status === 303) throw err;
            if (err.status === 401) {
                return fail(401, "Invalid Credential")
            }
            if (err.response?.status === 422) {
                return fail(422, {
                    errors: err.response.data.errors
                });
            }
        }

    }
}