<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type { loginSchemaType } from '$lib/schema/loginSchema';
	import type { hookJsonPartialSchemaType } from '$lib/schema/webhookContentSchema';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Card } from '$lib/components/ui/card';
	import ChannelFormProfileThread from './channel-form-profile-thread.svelte';
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
	class={cn('flex flex-col gap-6', className)}
	bind:this={ref}
	{...restProps}
	method="POST"
	use:enhance
>
	<ChannelFormProfileThread form={form} />
</form>
