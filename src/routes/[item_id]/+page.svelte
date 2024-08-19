<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	let cart_btn: HTMLButtonElement;

	async function addToCart() {
		cart_btn.disabled = true;
		cart_btn.style.pointerEvents = 'none';
		cart_btn.style.opacity = '85%';
		let user_cart_action = await fetch('/api/user_cart', { method: 'post' });
		if (user_cart_action.status == 200) {
			cart_btn.textContent = 'Added!';
		}
	}
</script>

{#if data.error || data.display_name == undefined}
	<h1 class="text-6xl text-[#B83B5E] font-extrabold">
		{#if data.error}{data.error}{:else}Not found{/if}
	</h1>

	<p class="text-3xl text-gray-700">
		Please navigate back to <a class="underline underline-offset-4" href="/">home</a>
	</p>
{:else}
	<div
		class="w-full h-max absolute inset-y-0 md:my-auto grid items-center justify-center gap-5 md:px-20"
	>
		<img
			class="w-full lg:w-[510px] h-auto max-h-[340px] overflow-clip"
			src={data.thumbnail}
			alt=""
		/>
		<div class="w-full">
			<div class="px-5 md:px-0">
				<div class="flex items-center gap-3 md:gap-5 flex-wrap">
					<h1 class="text-4xl xl:text-5xl md:text-6xl text-[#F08A5D] font-extrabold break-all">
						{data.display_name}
					</h1>
					{#if data.quantity_in_stock > 0}
						<span class="text-[#EEECDA] bg-gray-700 px-2 py-0 min-w-max text-sm"
							><strong>{data.quantity_in_stock}</strong> left in stock</span
						>
					{:else}
						<span class="text-[#B83B5E] font-extrabold uppercase text-sm">out of stock</span>
					{/if}
				</div>
				<h2 class="text-md font-extrabold text-gray-700 opacity-80 italic">{data.category}</h2>
				<p class="lg:text-lg text-[#6A2C70] md:w-2/3 mb-5 md:mb-0">{data.long_description}</p>
			</div>
			<hr class="border-[#B83B5E] border-2 w-full" />
			<div class="grid text-md gap-2 float-right bg-[#B83B5E] w-full md:w-max">
				<span class="font-bold text-[#EEECDA] text-center">for ${data.price}</span>
				<button
					contenteditable="false"
					bind:this={cart_btn}
					on:click={addToCart}
					class="w-full md:w-40 bg-[#6A2C70] text-[#EEECDA] px-2 py-1 transition-all duration-200 ease-out shadow-[0px_0px_0px_#F08A5D] hover:shadow-[3px_3px_0px_#F08A5D] active:scale-95 active:shadow-[1px_1px_0px_#F08A5D]"
					>Add to cart</button
				>
			</div>
		</div>
	</div>
{/if}
