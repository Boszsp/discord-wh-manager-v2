<script lang="ts">
	import { HouseIcon, LogInIcon, LogOutIcon, ServerIcon, Settings } from 'lucide-svelte';
	import Sidebar, { type sidebarMenuProps } from '$lib/components/app/nav/sidebar.svelte';
	import { page } from '$app/state';
	import { APP_NAME } from '$lib/default';
	import type { Snippet } from 'svelte';
	import { userStore } from '$lib/store/auth.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { logout } from '$lib/db/auth';
	import { goto } from '$app/navigation';

	let { children, servers = [] }: { children: Snippet; servers?: sidebarMenuProps[] } = $props();
	const datas: sidebarMenuProps[] = $derived(
		servers?.map((v, id) => ({
			//fallback: v.fallback ?? "$",
			id: v?.id ?? id + '',
			title: v.title,
			link: v.link+'',
			color: v.color,
			isSelected: page.url.searchParams.get('id') === `${v?.id}`
		})) ?? []
	);
	const selected = $derived(datas.filter((v) => v.isSelected).pop());
	const user = userStore;

	async function handleLogout() {
		await logout();
		goto('/login');
	}
</script>

<div class="h-dvh w-dvw overflow-hidden bg-theme-accent">
	<header class="flex items-center-safe justify-between px-8 py-2">
		<span></span>
		<span>
			<a href="/" class="flex items-center justify-self-center-safe">
				{#if selected}
					<ServerIcon class="mr-2 size-4" />
					<small class="text-sm leading-none font-medium">
						{selected.title}
					</small>
				{:else}
					<img src="/logo-flat.png" alt="logo" class="mr-2 w-4" />
					<small class="text-sm leading-none font-medium">{APP_NAME}</small>
				{/if}
			</a>
		</span>
		<span>
			{#if $user}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Avatar class="size-6">
							<AvatarImage src={$user.photoURL} alt={$user.displayName} />
							<AvatarFallback>{$user.email?.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Label>{$user.email}</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item onclick={handleLogout}>
							<LogOutIcon class="mr-2 size-4" />
							<span>Logout</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<a href="/login">
					<LogInIcon class="size-4" />
				</a>
			{/if}
		</span>
	</header>
	<div class="flex h-full w-full">
		<Sidebar sidebarMenu={datas}>
			
		</Sidebar>
		<main class="h-[96dvh] w-full overflow-hidden rounded-tl-2xl border-t border-l">
			{@render children?.()}
		</main>
	</div>
</div>
