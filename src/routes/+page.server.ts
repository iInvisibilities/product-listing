import { getCategoriesList } from '$lib/mongo_service';

/** @type {import('./$types').PageLoad} */
export async function load({ request, fetch }) {
	let category_list = await getCategoriesList();
	let isAdmin = await fetch('/api/admin', { credentials: 'include' });

	return { is_admin: isAdmin.status == 200, categories: category_list };
}
