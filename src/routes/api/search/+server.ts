import { getCategoriesList, collection } from '$lib/mongo_service';
import { generateDoubleRangeRegex } from '$lib/regex_util.js';

import { json } from '@sveltejs/kit';

export async function POST({ url, request }) {
	let query = url.searchParams.get('q');
	let filter = null;
	try {
		filter = await request.json();
	} catch (error) {
		return new Response('Bad request', { status: 400 });
	}

	if (query == null || filter == null) return new Response('Bad request', { status: 400 });

	let searchResult: any = {};
	let filteredCategories = filter.categories;
	if (filteredCategories) {
		filteredCategories = filteredCategories.filter((cat: string) => cat.trim() != '');
	}
	let priceRange = filter.price_range;

	for (const category of filteredCategories && filteredCategories.length > 0
		? filteredCategories
		: await getCategoriesList()) {
		let categoryCollection = await collection(category);
		let priceRangeRegex: RegExp = new RegExp('');
		let minPrice = parseFloat(priceRange[0]);
		let maxPrice = parseFloat(priceRange[1]);
		if (priceRange) {
			let minPrice = priceRange[0];
			let maxPrice = priceRange[1];

			if (minPrice != undefined && maxPrice != undefined) {
				try {
					priceRangeRegex = generateDoubleRangeRegex(minPrice, maxPrice);
				} catch (error: any) {
					return new Response(error, { status: 400 });
				}
			}
		}
		let searchResultForCategory = categoryCollection.find(
			{
				display_name: { $regex: query, $options: 'i' },
				price: { $gt: minPrice, $lt: maxPrice } /*{ $regex: priceRangeRegex, $options: 'i' }*/
			},
			{ projection: { display_name: 1, price: 1, thumbnail: 1 } }
		);

		let searchResultArray = await searchResultForCategory.toArray();
		if (searchResultArray.length > 0) {
			searchResult[category] = searchResultArray;
		}
	}

	return json(searchResult);
}
