<script lang="ts">
	import { selectedFileStore } from '$lib/store/selected-file-store.svelte';
	import { cn } from '$lib/utils';
	import type { FileType } from '../types';

	const {
		images
	}: {
		images: (string | File | FileType)[];
	} = $props();

	function getUrl(image: string | File | FileType): string {
		if (typeof image === 'string') {
			return image;
		}
		let fileURL: string;
		if (image instanceof File) return URL.createObjectURL(image);
		else return URL.createObjectURL(image?.file);
		return '';
	}

	const remainingImages = images.length > 4 ? images.length - 10 : 0;
</script>

<div class="mt-2 grid max-w-lg gap-1 overflow-hidden rounded-lg">
	{#if images.length === 1}
		<div class="relative aspect-square h-full w-full">
			<img
				src={getUrl(images[0])}
				alt="preview 0"
				class={cn('image-preview image-showable h-full w-full rounded-md bg-black/20 object-cover')}
			/>
			{#if $selectedFileStore.includes((images[0] as FileType)?.id)}
				<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
			{/if}
		</div>
	{:else if images.length === 3}
		<div class="grid grid-cols-2 grid-rows-2 gap-1">
			<div class="relative row-span-2 aspect-square h-full w-full">
				<img
					src={getUrl(images[0])}
					alt="preview 0"
					class="image-preview image-showable h-full w-full bg-black/20 object-cover"
				/>
				{#if $selectedFileStore.includes((images[0] as FileType)?.id)}
					<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
				{/if}
			</div>
			<div class="relative col-start-2 aspect-square h-full w-full">
				<img
					src={getUrl(images[1])}
					alt="preview 1"
					class="image-preview image-showable h-full w-full bg-black/20 object-cover"
				/>
				{#if $selectedFileStore.includes((images[1] as FileType)?.id)}
					<div class="absolute inset-0 size-full bg-indigo-800/60"></div>
				{/if}
			</div>
			<div class="relative col-start-2 row-start-2 aspect-square h-full w-full">
				<img
					src={getUrl(images[2])}
					alt="preview 2"
					class="image-preview image-showable h-full w-full bg-black/20 object-cover"
				/>
				{#if $selectedFileStore.includes((images[2] as FileType)?.id)}
					<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
				{/if}
			</div>
		</div>
	{:else if images?.length % 3 === 0 && Number.isSafeInteger(images.length / 2)}
		<div class="grid grid-cols-3 gap-1">
			{#each images as image, i (i)}
				<div class="relative aspect-square h-full w-full">
					<img
						src={getUrl(image)}
						alt={`preview ${i}`}
						class="image-preview image-showable h-full w-full bg-black/20 object-cover"
					/>
					{#if $selectedFileStore.includes((image as FileType)?.id)}
						<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
					{/if}
				</div>
			{/each}
		</div>
	{:else if images.length <= 4 && images?.length % 2 === 0}
		<div class="grid grid-cols-2 gap-1">
			{#each images as image, i (i)}
				<div class="relative aspect-square h-full w-full">
					<img
						src={getUrl(image)}
						alt={`preview ${i}`}
						class="image-preview image-showable h-full w-full bg-black/20 object-cover"
					/>
					{#if $selectedFileStore.includes((image as FileType)?.id)}
						<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
					{/if}
				</div>
			{/each}
		</div>
	{:else if images.length === 5}
		<div class="grid grid-cols-2 gap-1">
			{#each images.slice(0, 2) as image, i (i)}
				<div class="col-span-1/2 relative aspect-square h-full w-full">
					<img
						src={getUrl(image)}
						alt={`preview ${i}`}
						class="image-preview image-showable h-full w-full bg-black/20 object-cover"
					/>
					{#if $selectedFileStore.includes((image as FileType)?.id)}
						<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
					{/if}
				</div>
			{/each}
		</div>
		<div class="grid grid-cols-3 gap-1">
			{#each images.slice(2, 5) as image, i (i)}
				<div class="relative aspect-square h-full w-full">
					<img
						src={getUrl(image)}
						alt={`preview ${i}`}
						class="image-preview image-showable h-full w-full bg-black/20 object-cover"
					/>
					{#if $selectedFileStore.includes((image as FileType)?.id)}
						<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
					{/if}
				</div>
			{/each}
		</div>
	{:else if images.length > 6 && images.length <= 10}
		<div class="grid grid-cols-2 gap-1">
			{#each images.slice(0, images.length % 3) as image, i (i)}
				<div
					class={cn(
						'relative aspect-square h-full w-full',
						images.length % 3 === 1 && 'col-span-2 aspect-video'
					)}
				>
					<img
						src={getUrl(image)}
						alt={`preview ${i}`}
						class="image-preview image-showable pointer-events-none h-full w-full bg-black/20 object-cover"
					/>
					{#if $selectedFileStore.includes((image as FileType)?.id)}
						<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
					{/if}
				</div>
			{/each}
		</div>
		<div class="grid grid-cols-3 gap-1">
			{#each images.slice(images.length % 3) as image, i (i)}
				<div class="relative aspect-square h-full w-full">
					<img
						src={getUrl(image)}
						alt={`preview ${i}`}
						class="image-preview image-showable h-full w-full bg-black/20 object-cover"
					/>
					{#if $selectedFileStore.includes((image as FileType)?.id)}
						<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-3 gap-1">
			<div class={cn('relative col-span-3 aspect-video h-full w-full')}>
				<img
					src={getUrl(images[0])}
					alt={`preview 0`}
					class="image-preview image-showable h-full w-full bg-black/20 object-cover"
				/>
				{#if $selectedFileStore.includes((images[0] as FileType)?.id)}
					<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
				{/if}
			</div>
			{#each images.slice(1, 10) as image, i (i)}
				<div class="relative aspect-square h-full w-full">
					<img
						src={getUrl(image)}
						alt={`preview ${i}`}
						class="image-preview image-showable h-full w-full bg-black/20 object-cover"
					/>
					{#if i == 8}
						<div class="absolute inset-0 top-0 left-0 flex items-center justify-center bg-black/80">
							<p class="text-center text-xl font-bold">
								+{remainingImages}
							</p>
						</div>
						{#each images.slice(10) as image, i (i)}
							<img
								src={getUrl(image)}
								alt={`preview ${i + 10}`}
								class="image-preview image-showable hidden"
							/>
						{/each}
					{/if}
					{#if $selectedFileStore.includes((image as FileType)?.id)}
						<div class="pointer-events-none absolute inset-0 size-full bg-indigo-800/60"></div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
