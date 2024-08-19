/* FAKE USER CART API ENDPOINT */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST() {
	await sleep(500);
	return new Response('Success', { status: 200 });
}
