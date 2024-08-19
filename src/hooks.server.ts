import { connect } from '$lib/mongo_service';
import { checkToken } from '$lib/security_service';

await connect();

export async function handle({ event, resolve }) {
	const response = await resolve(event);

	response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173');
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

	let authCookie = event.cookies.get('authorization');

	if (event.route.id == '/api/admin' && (authCookie == undefined || !checkToken(authCookie))) {
		return new Response('Not authorized to access this endpoint', { status: 401 });
	}

	return response;
}
