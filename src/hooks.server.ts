import { redirect, type Handle } from '@sveltejs/kit';

// Public routes
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password', '/oauth', '/logout'];

// Routes accessible to any authenticated user
const AUTHENTICATED_ROUTES = ['/profile', '/change-password'];

// Role-based access control
const ROUTE_PERMISSIONS: Record<string, string[]> = {
	'/my-awards': ['NISIT'],
	'/award-application': ['NISIT'],

	'/application-list': ['DEPT_HEAD', 'ASSO_DEAN', 'DEAN', 'BOARD'],
	'/application-list/*': ['NISIT', 'DEPT_HEAD', 'ASSO_DEAN', 'DEAN', 'BOARD']
};

// Match route helper
function matchRoute(path: string, route: string): boolean {
	if (route.endsWith('*')) {
		const prefix = route.slice(0, -1);
		return path === prefix || path.startsWith(prefix);
	}

	return path === route || path.startsWith(route + '/');
}

// Check if route exists
function routeExists(path: string): boolean {
	if (PUBLIC_ROUTES.some((r) => matchRoute(path, r))) return true;
	if (AUTHENTICATED_ROUTES.some((r) => matchRoute(path, r))) return true;
	if (Object.keys(ROUTE_PERMISSIONS).some((r) => matchRoute(path, r))) return true;

	return path.startsWith('/api/');
}

// Default page per role
function getDefaultPath(role: string | null): string {
	if (!role) return '/login';

	switch (role) {
		case 'NISIT':
			return '/my-awards';

		case 'DEPT_HEAD':
		case 'ASSO_DEAN':
		case 'DEAN':
		case 'BOARD':
			return '/application-list';

		default:
			return '/login';
	}
}

// Check permission
function hasPermission(path: string, role: string | null): boolean {
	// Public
	if (PUBLIC_ROUTES.some((r) => matchRoute(path, r))) {
		return true;
	}

	// Authenticated
	if (AUTHENTICATED_ROUTES.some((r) => matchRoute(path, r))) {
		return role !== null;
	}

	// Sort routes so wildcard routes are checked first
	const sortedRoutes = Object.entries(ROUTE_PERMISSIONS).sort((a, b) => b[0].length - a[0].length);

	for (const [route, roles] of sortedRoutes) {
		if (matchRoute(path, route)) {
			return role !== null && roles.includes(role);
		}
	}

	return false;
}

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');
	const userInfoCookie = event.cookies.get('user_info');

	event.locals.user = null;

	let role: string | null = null;

	if (token && userInfoCookie) {
		try {
			const json = Buffer.from(userInfoCookie, 'base64').toString('utf-8');
			event.locals.user = JSON.parse(json);

			if (event.locals.user) {
				role = event.locals.user.role;

				// Force password change
				if (
					event.locals.user.force_password_change &&
					event.url.pathname !== '/change-password' &&
					event.url.pathname !== '/logout'
				) {
					throw redirect(303, '/change-password#forced');
				}
			}
		} catch (err: any) {
			if (err.status === 303) throw err;

			event.cookies.delete('token', { path: '/' });
			event.cookies.delete('user_info', { path: '/' });

			role = null;
		}
	}

	const path = event.url.pathname;

	// root redirect
	if (path === '/') {
		throw redirect(303, getDefaultPath(role));
	}

	// unknown route
	if (!routeExists(path)) {
		throw redirect(303, getDefaultPath(role));
	}

	// permission check
	if (!hasPermission(path, role)) {
		throw redirect(303, getDefaultPath(role));
	}

	return resolve(event);
};
