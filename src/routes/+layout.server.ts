import type { LayoutServerLoad } from './$types';
import { roleMapUserRole } from '$lib/enums';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (user && roleMapUserRole[user.role]) {
		user.role = roleMapUserRole[user.role];
	}
	return {
		user: user
	};
};
