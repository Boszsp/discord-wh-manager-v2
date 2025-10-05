<script lang="ts">
	import type { hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
	import AttachmentPreview from './attachment-preview.svelte';
	import PreviewEmbed from './preview-embed.svelte';
	import SideAvatar from './side-avatar.svelte';

	const { content, files = [] }: { content: hookJsonPartialSchemaType; files?: File[] } = $props();
</script>

<SideAvatar name={content?.username} image={content?.avatar_url} content={content?.content}>
	<div class="pt-4">
		{#if content?.embeds}
			{#each content.embeds as embed, i (`preview-embed-${i}`)}
				<PreviewEmbed {embed} />
			{/each}
		{/if}
		{#key files}
			{#if files.length > 0}
				<AttachmentPreview attachments={files} />
			{/if}
		{/key}
	</div>
</SideAvatar>
