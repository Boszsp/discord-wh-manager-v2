<script lang="ts">
	let isOpen = $state(false);
	let imgIndex = $state(0);
	let imgList = $state<Map<number, string>>(new Map());

	function addEventListenerToImages() {
		const images = document.querySelectorAll('.image-showable');
		images.forEach((img, i) => {
			imgList.set(i, (img as HTMLImageElement)?.src ?? '');

			//img.classList.add('cursor-pointer', 'hover:brightness-50',"hover:opcity-20");
			//img.classList.remove('cursor-pointer', 'hover:brightness-50');

			img.removeEventListener('dblclick', () => {});
			img.addEventListener('dblclick', () => {
				isOpen = true;
				//imgUrl = (img as HTMLImageElement)?.src ?? ""
				imgIndex = i;
			});
		});
	}
</script>

<svelte:window oninput={addEventListenerToImages} onclick={addEventListenerToImages} />

{#if isOpen}
	<button
		class="bg-opacity-75 fixed inset-0 z-50 flex h-dvh w-dvw justify-center bg-black/80 p-6"
		onclick={() => (isOpen = false)}
	>
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<div class="pb-18">
			<img src={imgList.get(imgIndex)} alt="Image Preview" class=" h-full rounded-md" />
		</div>
		<div class="absolute bottom-4 flex">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			{#each imgList as imgSrc, i}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					src={imgSrc?.[1]}
					alt={'preview-' + i}
					class="m-1 h-16 w-16 border-2 object-cover {i === imgIndex
						? 'border-primary'
						: 'border-transparent'} cursor-pointer rounded"
					onclick={(e) => {
						e.stopPropagation();
						imgIndex = i;
					}}
				/>
			{/each}
		</div>
	</button>
{/if}
