import { categoryOf } from '$lib/mongo_service';
import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export async function GET({ url }) {
	try {
		let item_id = url.searchParams.get('item_id');

		try {
			let categoryOfItem = await categoryOf(item_id ?? '');
			if (categoryOfItem == null) {
				return new Response('Error while updating item information!', { status: 404 });
			}
			let item = await categoryOfItem.findOne({ _id: new ObjectId(item_id ?? '') });
			if (item == null) {
				return new Response('Item not found', { status: 404 });
			}

			item['category'] = categoryOfItem.collectionName;
			return json(item);
		} catch (error) {
			return new Response('Error retrieving item information', { status: 404 });
		}
	} catch (error) {
		return new Response('Bad request', { status: 400 });
	}
}
