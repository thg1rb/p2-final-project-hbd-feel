import { apiClient } from "$lib/api";
import type { Actions } from "./$types";
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
    update_profile: async ({ cookies, request, locals }) => {
        const data = await request.formData();
        const firstName = data.get('firstName');
        const lastName = data.get('lastName');
        const email = data.get('email');
        const username = data.get('username');
        const token = cookies.get('token');

        try {
            let response = await apiClient.post('/auth/update-user-details', {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    username: username
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            const updatedUser = response.data.user;
            const userBase64 = Buffer.from(JSON.stringify(updatedUser)).toString('base64');
            cookies.set('user_info', userBase64, { path: '/', maxAge: 60 * 60 * 24 * 7 });
            // throw redirect(303, '/profile')
        } catch (err: any) {
            if (err.status === 303) throw err;
            if (err.response?.status === 422) {
                return fail(422, {
                    errors: err.response.data.errors
                });
            }
            console.log(err)
        }

    }
}