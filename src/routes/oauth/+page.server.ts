import { apiClient } from "$lib/api";
import type { PageServerLoad } from "./$types";
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({url, cookies}) => {
    let token = url.searchParams.get('token');

    if (!token) {
        throw redirect(303, '/login#notFound');
    }

    try {
        let response = await apiClient.get('/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        let user = response.data.user;

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
        if (err.status === 303) throw err;
    }


}