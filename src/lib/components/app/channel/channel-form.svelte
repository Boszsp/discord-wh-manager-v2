<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
	import ChannelFormProfileThread from './channel-form-profile-thread.svelte';
	import ChannelFormContent from './channel-form-content.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ChannelFormEmbeds from './channel-form-embeds.svelte';
	import { Card } from '$lib/components/ui/card';
	let {
		ref = $bindable(null),
		class: className,
		form,
		...restProps
	}: WithElementRef<HTMLFormAttributes> & {
		form: SuperForm<hookJsonPartialSchemaType, any>;
	} = $props();
	const { form: formData, enhance } = form;
</script>

<form
	class={cn('flex flex-col gap-4', className)}
	bind:this={ref}
	{...restProps}
	method="POST"
	use:enhance
>
	<ChannelFormContent {form} />
	<Separator />
	<Card class="overflow-hidden p-2">
		<ChannelFormProfileThread {form} class="px-4" />
	</Card>
	<Separator />
	<ChannelFormEmbeds {form} />
</form>
