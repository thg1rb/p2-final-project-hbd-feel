import { apiClient } from "$lib/api";
import type { Actions } from "./$types";
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
    login: async ({ cookies, request }) => {
        console.log("Try to login");
        const data = await request.formData();
        const credential = data.get('credential');
        const password = data.get('password');
        try {
            const response = await apiClient.post('/login', {
                credential: credential,
                password: password,
            })
            console.log("RESPONSE: ", response.data.user)

            const token = response.data.token;
            const user = response.data.user;

            cookies.set('token', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })

            const userBase64 = Buffer.from(JSON.stringify(user)).toString('base64');
            cookies.set('user_info', userBase64, { path: '/', maxAge: 60 * 60 * 24 * 7 });
            if (user.role == 'NISIT') {
                throw redirect(303, '/my-awards')
            }
            if (user.role === 'ADMIN') {
                throw redirect(303, '/application-list')
            }
            if (user.role === 'ASSO_DEAN' || user.role === 'DEAN' || user.role === 'DEPT_HEAD') {
                throw redirect(303, '/application-list')
            }
        } catch (err) {
            console.log(err);
            if (err?.status === 303) throw err;
            if (err.status === 401) {
                return fail(401, "Invalid Credential")
            }
        }

    }
}