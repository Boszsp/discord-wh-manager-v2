<script lang="ts">
	import type { hookJsonPartialSchemaType } from "$lib/schema/webhookContentSchema";
	import PreviewEmbed from "./preview-embed.svelte";
	import SideAvatar from "./side-avatar.svelte";

   const {content}:{content:hookJsonPartialSchemaType} = $props()
</script>
<SideAvatar name={content?.username} image={content?.avatar_url} content={content?.content} >
<div class="pt-4">
   {#if content?.embeds}
   {#each content.embeds as embed (embed.title)}
      <PreviewEmbed embed={embed} />
   {/each}
   {/if}
</div>
</SideAvatar>