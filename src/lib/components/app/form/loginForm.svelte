<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLFormAttributes } from 'svelte/elements';
	let {
		ref = $bindable(null),
		username = $bindable(''),
		password = $bindable(''),
		passkey = $bindable(''),
		class: className,
		...restProps
	}: WithElementRef<HTMLFormAttributes> & {
		username?: string;
		password?: string;
		passkey?: string;
	} = $props();
	const id = $props.id();
</script>

<form class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<div class="flex flex-col items-center gap-2 text-center">
		<h1 class="text-2xl font-bold">Login to your account</h1>
		<p class="text-sm text-balance text-muted-foreground">
			Enter your email below to login to your account
		</p>
	</div>
	<div class="grid gap-6">
		<div class="grid gap-3">
			<Label for="email-{id}">Email</Label>
			<Input bind:value={username} id="email-{id}" type="email" placeholder="m@example.com" required />
		</div>
		<div class="grid gap-3">
			<div class="flex items-center">
				<Label for="password-{id}">Password</Label>
			</div>
			<Input bind:value={password} id="password-{id}" type="password" placeholder="******" required />
		</div>
    <div class="grid gap-3">
			<div class="flex items-center">
				<Label for="password-{id}">Passkey</Label>
			</div>
			<Input bind:value={passkey} id="passkey-{id}" type="password" placeholder="****************" required />
		</div>
		<Button type="submit" class="w-full">Login</Button>

</form>
