<script lang="ts">
	import { cn } from '$lib/utils';

	const {
		images
	}: {
		images: (string | File)[];
	} = $props();

	function getUrl(image: string | File): string {
		if (typeof image === 'string') {
			return image;
		}
		return URL.createObjectURL(image);
	}

	const remainingImages = images.length > 4 ? images.length - 4 : 0;
</script>

<div class="mt-2 grid max-w-lg gap-1 overflow-hidden rounded-lg">
	{#if images.length === 1}
		<div class="relative aspect-video h-full w-full">
			<img
				src={getUrl(images[0])}
				alt="preview 0"
				class="h-full w-full rounded-md object-cover"
			/>
		</div>
	{:else if images.length === 2}
		<div class="grid grid-cols-2 gap-1">
			<div class="relative aspect-square h-full w-full">
				<img
					src={getUrl(images[0])}
					alt="preview 0"
					class="h-full w-full object-cover"
				/>
			</div>
			<div class="relative aspect-square h-full w-full">
				<img
					src={getUrl(images[1])}
					alt="preview 1"
					class="h-full w-full object-cover"
				/>
			</div>
		</div>
	{:else if images.length === 3}
		<div class="grid grid-cols-2 grid-rows-2 gap-1">
			<div class="relative row-span-2 aspect-square h-full w-full">
				<img
					src={getUrl(images[0])}
					alt="preview 0"
					class="h-full w-full object-cover"
				/>
			</div>
			<div class="relative col-start-2 aspect-square h-full w-full">
				<img
					src={getUrl(images[1])}
					alt="preview 1"
					class="h-full w-full object-cover"
				/>
			</div>
			<div class="relative col-start-2 row-start-2 aspect-square h-full w-full">
				<img
					src={getUrl(images[2])}
					alt="preview 2"
					class="h-full w-full object-cover"
				/>
			</div>
		</div>
    {:else if images.length >= 4}
        <div class="grid grid-cols-2 grid-rows-2 gap-1">
            {#each images.slice(0, 4) as image, i (i)}
                <div class="relative aspect-square h-full w-full">
                    <img
                        src={getUrl(image)}
                        alt={`preview ${i}`}
                        class="h-full w-full object-cover"
                    />
                    {#if i === 3 && remainingImages > 0}
                        <div
                            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-2xl font-bold text-white"
                        >
                            +{remainingImages}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
	{/if}
</div>
