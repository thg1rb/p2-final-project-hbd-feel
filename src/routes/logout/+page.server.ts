import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { apiClient } from '$lib/api';

export const actions: Actions = {
    default: async ({ cookies }) => {
        const token = cookies.get('token');

        if (token) {
            try {
                await apiClient.delete('/revoke');
            } catch (err) {
                console.error('Logout API failed, but continuing to clear cookie...');
            }
        }
        cookies.delete('token', { path: '/' });
        cookies.delete('user_info', { path: '/' });
        throw redirect(303, '/login');
    }
};
