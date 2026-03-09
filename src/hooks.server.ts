import { redirect, type Handle } from '@sveltejs/kit';

// Define route access configuration
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password', '/oauth', '/logout'];

const NISIT_ONLY_ROUTES = ['/my-awards', '/award-application'];
const ADMIN_ROUTES = ['/application-list'];

const AUTHENTICATED_ROUTES = ['/profile', '/change-password'];

// Helper function to check if a path matches any of the given route patterns
function matchesRoute(path: string, routes: string[]): boolean {
	for (const route of routes) {
		if (route.endsWith('*')) {
			const prefix = route.slice(0, -1);
			if (path === prefix || path.startsWith(prefix)) {
				return true;
			}
		} else if (path === route || path.startsWith(route + '/')) {
			return true;
		}
	}
	return false;
}

// Helper function to check if a path exists in our route configuration
function isRouteExists(path: string): boolean {
	return (
		matchesRoute(path, PUBLIC_ROUTES) ||
		matchesRoute(path, NISIT_ONLY_ROUTES) ||
		matchesRoute(path, ADMIN_ROUTES) ||
		matchesRoute(path, AUTHENTICATED_ROUTES) ||
		path.startsWith('/api/') // API routes are handled separately
	);
}

// Get the default path for a given role
function getDefaultPathForRole(role: string | null): string {
	if (!role) {
		return '/login';
	}
	switch (role) {
		case 'NISIT':
			return '/my-awards';
		case 'DEPT_HEAD':
		case 'ASSO_DEAN':
		case 'DEAN':
		case 'BOARD':
			return '/application-list';
		case 'NISIT_DEV':
			// NISIT_DEV redirect handled externally - no default redirect
			return '/login';
		default:
			return '/login';
	}
}

// Check if the user's role allows access to the route
function canAccessRoute(path: string, role: string | null): boolean {
	// Public routes are accessible to everyone
	if (matchesRoute(path, PUBLIC_ROUTES)) {
		return true;
	}

	// Authenticated routes require any authenticated user
	if (matchesRoute(path, AUTHENTICATED_ROUTES)) {
		return role !== null;
	}

	// NISIT-only routes
	if (matchesRoute(path, NISIT_ONLY_ROUTES)) {
		return role === 'NISIT';
	}

	// Admin/approval routes
	if (matchesRoute(path, ADMIN_ROUTES)) {
		return (
			role === 'DEPT_HEAD' ||
			role === 'ASSO_DEAN' ||
			role === 'DEAN' ||
			role === 'BOARD'
		);
	}

	return false;
}

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');
	const userInfoCookie = event.cookies.get('user_info');

	event.locals.user = null;

	let userRole: string | null = null;

	if (token && userInfoCookie) {
		try {
			const jsonString = Buffer.from(userInfoCookie, 'base64').toString('utf-8');
			event.locals.user = JSON.parse(jsonString);
			if (event.locals.user) {
				userRole = event.locals.user.role;

				// Force password change check
				if (
					event.locals.user.force_password_change &&
					(event.url.pathname !== '/change-password' && event.url.pathname !== '/logout')
				) {
					throw redirect(303, '/change-password#forced');
				}
			}
		} catch (err: unknown) {
			if ((err as any).status === 303) throw err;
			event.cookies.delete('token', { path: '/' });
			event.cookies.delete('user_info', { path: '/' });
			userRole = null;
		}
	}

	// Route access check
	const pathname = event.url.pathname;

	// Redirect root path to appropriate default
	if (pathname === '/') {
		const defaultPath = getDefaultPathForRole(userRole);
		throw redirect(303, defaultPath);
	}

	// Check if route exists
	if (!isRouteExists(pathname)) {
		// Route doesn't exist - redirect to appropriate default
		const defaultPath = getDefaultPathForRole(userRole);
		if (pathname !== defaultPath) {
			throw redirect(303, defaultPath);
		}
	}

	// Check role-based access
	if (!canAccessRoute(pathname, userRole)) {
		// User doesn't have access - redirect to appropriate default
		const defaultPath = getDefaultPathForRole(userRole);
		if (pathname !== defaultPath) {
			throw redirect(303, defaultPath);
		}
	}

	return resolve(event);
};
