<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type { loginSchemaType } from '$lib/schema/loginSchema';

	let {
		ref = $bindable(null),
		class: className,
		form,
		...restProps
	}: WithElementRef<HTMLFormAttributes> & {
		form: SuperForm<loginSchemaType, any>;
	} = $props();
	const id = $props.id();
	const { form: formData, enhance } = form;
</script>

<form
	class={cn('flex flex-col gap-6', className)}
	bind:this={ref}
	{...restProps}
	method="POST"
	use:enhance
>
	<div class="flex flex-col items-center gap-2 text-center">
		<h1 class="text-2xl font-bold">Login to your account</h1>
		<p class="text-sm text-balance text-muted-foreground">
			Enter your email below to login to your account
		</p>
	</div>
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Username</Form.Label>
				<Input {...props} bind:value={$formData.username} placeholder="email@example.com" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input {...props} bind:value={$formData.password} type="password" placeholder="******" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Button type="submit" class="w-full">Login</Button>
</form>
