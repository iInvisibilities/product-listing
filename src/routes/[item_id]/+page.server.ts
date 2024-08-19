/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
	let fetchedData = await fetch('/api/item?item_id=' + params.item_id);
	if (fetchedData.status == 200) return await fetchedData.json();
	else return { error: fetchedData.statusText };
}
