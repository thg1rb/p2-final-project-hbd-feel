import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token');
    const userInfoCookie = event.cookies.get('user_info');

    event.locals.user = null;

    if (token && userInfoCookie) {
        try {
            const jsonString = Buffer.from(userInfoCookie, 'base64').toString('utf-8');
            event.locals.user = JSON.parse(jsonString);
            if ( 
                JSON.parse(jsonString).force_password_change &&
                event.url.pathname !== '/change-password#forced'
            ) {
                throw redirect(303, '/change-password#forced');
            }
        } catch (err) {
            console.log(err)
            event.cookies.delete('token', { path: '/' });
            event.cookies.delete('user_info', { path: '/' });
        }
    }



    return resolve(event);
};