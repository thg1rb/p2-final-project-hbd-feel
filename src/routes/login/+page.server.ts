import { apiClient } from '$lib/api';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const credential = data.get('credential');
		const password = data.get('password');
		try {
			const response = await apiClient.post('/login', {
				credential: credential,
				password: password
			});

			const token = response.data.token;
			const user = response.data.user;
			const force_password_change = response.data.user.force_password_change;

			cookies.set('token', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});


			const userBase64 = Buffer.from(JSON.stringify(user)).toString('base64');
			cookies.set('user_info', userBase64, { path: '/', maxAge: 60 * 60 * 24 * 7 });
			if (force_password_change) {
				redirect(303, '/change-password#forced');
			}
			if (user.role == 'NISIT') {
				throw redirect(303, '/my-awards');
			}
			if (
				user.role === 'DEPT_HEAD' ||
				user.role === 'ASSO_DEAN' ||
				user.role === 'DEAN' ||
				user.role === 'BOARD'
			) {
				throw redirect(303, '/application-list');
			}
		} catch (err: any) {
			if (err?.status === 303) throw err;
			if (err?.response?.status === 401) {
				return fail(401, {
					message: err.response.data.message || 'Invalid credentials',
					errors: err.response.data.errors || {
						credential: ['ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง']
					}
				});
			}
		}
	}
};
