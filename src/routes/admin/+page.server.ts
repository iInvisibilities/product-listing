import { getToken } from '$lib/security_service.js';

export function load({ cookies }) {
	if (cookies.get('authorization') != undefined) {
		cookies.delete('authorization', { path: '/' });
	} else cookies.set('authorization', getToken(), { path: '/' });
}
