<script lang="ts">
	import ImagePreview from './image-preview.svelte';
	import FilePreview from './file-preview.svelte';
	import type { FileType } from '../types';

	const {
		attachments
	}: {
		attachments: (string | File | FileType)[];
	} = $props();

	const images = attachments.filter(isImage);
	const files = attachments.filter(isntImage);

	function isImage(attachment: string | File | FileType): boolean {
		if (typeof attachment === 'string') {
			return attachment.match(/\.(jpeg|jpg|gif|png)$/) != null;
		}
		if (attachment instanceof File) return attachment.type.startsWith('image/');
		return attachment?.file?.type?.startsWith('image/');
	}

	function isntImage(attachment: string | File | FileType): boolean {
		return !isImage(attachment);
	}
</script>

{#if images.length > 0}
	<ImagePreview {images} />
{/if}

{#each files as file, i ('attachment-preview-' + i)}
	{#if typeof file !== 'string'}
		<FilePreview {file} />
	{/if}
{/each}
