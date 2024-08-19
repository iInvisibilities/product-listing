<script lang="ts">
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	let category_selector: HTMLSelectElement;
	let optionMenuObj: HTMLDivElement;
	let queue: string;
	let feed_content: any;
	let min: number, max: number;
	min = 0;
	max = 1000;

	let item_being_edited: any | undefined;
	let edited_fields: {} | undefined;

	async function initFeed() {
		let fetch_search = await fetch('/api/search?q=' + encodeURIComponent(queue ?? ''), {
			method: 'post',
			body: JSON.stringify({
				categories: [category_selector.options[category_selector.selectedIndex].value],
				price_range: [min, max]
			})
		});
		feed_content = await fetch_search.json();
	}

	onMount(async () => {
		await initFeed();
		addEventListener('keyup', (event) => {
			if (event.key != 'Escape' || item_being_edited == undefined) return;
			closeOptionMenu();
		});
	});

	async function optionMenu(item_id: string) {
		optionMenuObj.classList.remove('hidden');
		let grab_item_information = await fetch('/api/item?item_id=' + item_id);
		item_being_edited = await grab_item_information.json();
		edited_fields = {};
	}

	function closeOptionMenu() {
		optionMenuObj.classList.add('hidden');
		let queryInputAreas = [...optionMenuObj.getElementsByClassName('input_mode')];
		queryInputAreas.forEach((inputAreaElement) => inputAreaElement.remove());

		item_being_edited = undefined;
		edited_fields = undefined;
	}

	function acceptInput(
		field_name: string,
		input_type: string,
		input_element: HTMLButtonElement
	): any {
		if (input_element.children.length == 2 || item_being_edited == undefined) {
			return;
		}

		let inputArea: HTMLInputElement | HTMLTextAreaElement = document.createElement('input');
		if (input_type == 'textarea') {
			inputArea = document.createElement('textarea');
		} else inputArea.type = input_type;
		inputArea.classList.add('input_mode');
		inputArea.value = item_being_edited[field_name];
		inputArea.addEventListener('input', (event) => {
			if (edited_fields != undefined) edited_fields[field_name] = inputArea.value;
		});

		input_element.appendChild(inputArea);
	}

	async function removeCurrentItem(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		await fetch('/api/admin', {
			credentials: 'include',
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ item_id: item_being_edited._id })
		});

		initFeed();
		closeOptionMenu();
	}

	async function saveEditChanges(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		await fetch('/api/admin', {
			credentials: 'include',
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ item_id: item_being_edited._id, updated_fields: edited_fields })
		});

		initFeed();
		closeOptionMenu();
	}
</script>

{#if data.is_admin}
	<div
		class="grid optionMenuObj fixed z-20 inset-0 w-dvw h-dvh items-center hidden"
		bind:this={optionMenuObj}
	>
		<button on:click={closeOptionMenu} class="block lg:hidden absolute top-5 right-5"
			><img src="close.png" width="40px" alt="" /></button
		>
		<p class="hidden lg:block absolute top-5 left-5">Press ESC to close</p>
		<div
			class="relative grid text-white text-lg md:text-xl lg:text-2xl w-2/3 md:w-1/3 mx-auto gap-1"
		>
			<button
				class="bg-[#14538a] capitalize"
				on:click={(e) => acceptInput('display_name', 'text', e.currentTarget)}
				><span>edit name</span></button
			>
			<button
				class="bg-[#14538a] capitalize"
				on:click={(e) => acceptInput('long_description', 'textarea', e.currentTarget)}
				><span>edit description</span></button
			>
			<button
				class="bg-[#14538a] capitalize"
				on:click={(e) => acceptInput('price', 'double', e.currentTarget)}
				><span>edit price</span></button
			>
			<button
				class="bg-[#14538a] capitalize"
				on:click={(e) => acceptInput('quantity_in_stock', 'number', e.currentTarget)}
				><span>edit stock quantity</span></button
			>
			<div class="p-0 flex gap-1 *:min-w-max">
				<button
					on:click={(event) => removeCurrentItem(event)}
					class="bg-[#B83B5E] capitalize p-1 px-2 w-full">delete item</button
				>
				<button
					on:click={(event) => saveEditChanges(event)}
					class="bg-[#188476] capitalize p-1 px-2 w-full">save changes</button
				>
			</div>
		</div>
	</div>
{/if}

<div class="app_view w-full lg:w-2/3 flex lg:mx-auto lg:mt-5 flex-wrap">
	<select
		class="bg-gray-700 text-white font-bold px-2 outline-none lg:w-max lg:border-none w-full border-b-[1px] pb-1"
		on:input={initFeed}
		bind:this={category_selector}
	>
		<option value="">All categories</option>
		{#each data.categories as category}
			<option value={category}>{category}</option>
		{/each}
	</select>

	<div class="flex w-full">
		<input
			class="outline-none h-full w-9/12 lg:w-10/12 text-lg md:text-xl lg:text-2xl p-2 bg-[#B83B5E] placeholder:text-white text-white placeholder:opacity-85"
			type="text"
			placeholder="Search products..."
			bind:value={queue}
			on:input={initFeed}
		/>

		<div
			class="flex items-center justify-center bg-gray-700 text-white px-3 lg:border-l-0 border-l-[1px] w-3/12 lg:w-2/12"
		>
			<div class="flex items-center gap-1">
				$<input
					class="w-5 md:w-10 outline-none bg-gray-700/75"
					min="0"
					type="number"
					bind:value={min}
					on:input={initFeed}
				/>
			</div>
			<hr class="w-3 md:w-5 border-[#EEECDA] md:mx-2" />
			<div class="flex items-center gap-1">
				$<input
					class="w-5 md:w-10 outline-none bg-gray-700/75"
					min="0"
					type="number"
					bind:value={max}
					on:input={initFeed}
				/>
			</div>
		</div>
	</div>
	{#if data.is_admin}
		<div class="flex justify-between w-full bg-[#248bda] text-white admin_ind">
			<p class="p-1 px-2 text-sm sm:text-md md:text-lg h-max my-auto">
				You're currently logged in as an admin
			</p>
			<div class="flex flex-wrap justify-end w-3/12 lg:w-2/12">
				<button class="p-1 bg-gray-700/75 px-2 text-xs sm:text-sm md:text-md w-full"
					>Add item</button
				>
				<button
					on:click={(e) => window.location.assign('/admin')}
					class="bg-[#B83B5E] p-1 px-2 text-xs sm:text-sm md:text-md w-full">Log Out</button
				>
			</div>
		</div>
	{/if}
</div>
<div class="app_view flex flex-wrap gap-3 p-5 items-center place-content-center">
	{#if feed_content != undefined}
		{#each Object.keys(feed_content) as category}
			{#each feed_content[category] as item}
				{#if data.is_admin}
					<button
						on:click={(e) => optionMenu(item._id)}
						class="w-2/3 sm:max-w-52 lg:max-w-60 overflow-clip bg-[#B83B5E]/75 transition-all duration-100 ease-out cursor-pointer hover:shadow-[1px_1px_0_#B83B5E] shadow-[3px_3px_0_#B83B5E] text-white backdrop-blur-lg"
					>
						<div class="w-full sm:max-w-60 h-32 overflow-clip">
							<img class="h-max w-max mx-auto" src={item.thumbnail} alt="" />
						</div>
						<div class="grid gap-2 p-1">
							<h1 class="break-words w-max">{item.display_name}</h1>
							<span class="lg:justify-self-end">${item.price}</span>
						</div>
					</button>
				{:else}
					<a
						target="_blank"
						href={'/' + item._id}
						class="w-2/3 sm:max-w-52 lg:max-w-60 overflow-clip bg-[#B83B5E]/75 transition-all duration-100 ease-out cursor-pointer hover:shadow-[1px_1px_0_#B83B5E] shadow-[3px_3px_0_#B83B5E] text-white backdrop-blur-lg"
					>
						<div class="w-full sm:max-w-60 h-32 overflow-clip">
							<img class="h-max w-max mx-auto" src={item.thumbnail} alt="" />
						</div>
						<div class="grid gap-2 p-1">
							<h1 class="break-words">{item.display_name}</h1>
							<span class="lg:justify-self-end">${item.price}</span>
						</div>
					</a>
				{/if}
			{/each}
		{/each}
	{:else}
		<div class="h-[75dvh] w-dvw grid items-center justify-center">
			<div class="loadingio-spinner-rolling-2by998twmg8">
				<div class="ldio-yzaezf3dcmj">
					<div></div>
				</div>
			</div>
		</div>
	{/if}
</div>
