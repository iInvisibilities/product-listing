import { collection, categoryOf } from '$lib/mongo_service';
import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export async function GET() {
	return json({});
}

export async function PUT({ request }) {
	try {
		let body = await request.json();
		if (!body.category) {
			return new Response('Bad request!', { status: 400 });
		}

		body['price'] = parseFloat(body['price']);
		body['quantity_in_stock'] = parseInt(body['quantity_in_stock']);

		if (Number.isNaN(body['price']) || Number.isNaN(body['quantity_in_stock']))
			return new Response('Bad request!', { status: 400 });

		let categoryCollection = await collection(body.category);
		let result = await categoryCollection.insertOne({
			display_name: body.display_name,
			long_description: body.long_description,
			price: body.price,
			quantity_in_stock: body.quantity_in_stock,
			thumbnail: body.thumbnail,
			category: body.category
		});
		return json({ new_id: result.insertedId });
	} catch (error) {
		return new Response('Bad request!', { status: 400 });
	}
}

export async function PATCH({ request }) {
	try {
		let body = await request.json();
		let item_id: string = body.item_id;
		let updated_fields = body.updated_fields;

		updated_fields['price'] = parseFloat(updated_fields['price']);
		updated_fields['quantity_in_stock'] = parseInt(updated_fields['quantity_in_stock']);

		if (Number.isNaN(updated_fields['price'])) delete updated_fields['price'];
		if (Number.isNaN(updated_fields['quantity_in_stock']))
			delete updated_fields['quantity_in_stock'];

		try {
			let categoryOfItem = await categoryOf(item_id);
			if (categoryOfItem == null) {
				return new Response('Error while updating item information!', { status: 404 });
			}

			await categoryOfItem.findOneAndUpdate(
				{ _id: new ObjectId(item_id ?? '') },
				{ $set: updated_fields }
			);
		} catch (error) {
			return new Response('Error while updating item information!', { status: 404 });
		}

		return json('success');
	} catch (error) {
		return new Response('Bad request!', { status: 400 });
	}
}

export async function DELETE({ request }) {
	try {
		let body = await request.json();
		let item_id: string = body.item_id;
		try {
			let categoryOfItem = await categoryOf(item_id);
			if (categoryOfItem == null) {
				return new Response('Error while deleting the item!', { status: 404 });
			}

			await categoryOfItem.findOneAndDelete({ _id: new ObjectId(item_id ?? '') });
			return json('success');
		} catch (error) {
			return new Response('Error while deleting the item!', { status: 404 });
		}
	} catch (error) {
		return new Response('Bad request!', { status: 400 });
	}
}
