<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';

	interface sidebarMenuProps {
		image: string;
		fallback: string;
		title: string;
		link?: string;
		isSelect?: boolean;
		class?: ClassValue;
	}
	const {
		sidebarMenu,
		class: className
	}: { sidebarMenu?: sidebarMenuProps[]; class?: ClassValue } = $props();
	const sidebarMenus: sidebarMenuProps[] = [
		{
			image: '/logo.png',
			fallback: 'DWM',
			title: 'Dashboard',
			link: '/',
			isSelect: false && !sidebarMenu?.some((v) => v.isSelect)
		}
	];
</script>

<aside>
	<nav class={cn('flex flex-col gap-2 px-4', className)}>
		{#each sidebarMenus as menu, i (menu.title + i)}
			<div class={cn('group relative', menu?.class)}>
				{#if menu?.isSelect}
					<div class="absolute top-0 -left-4 h-full w-1 rounded-r-2xl bg-foreground/60"></div>
				{:else}
					<div
						class="absolute top-0 -left-4 h-full w-0 scale-y-50 rounded-r-2xl bg-foreground/60 transition-all group-hover:w-1"
					></div>
				{/if}
				<div class="item-center flex">
					<Tooltip.Provider>
						<Tooltip.Root delayDuration={0}>
							<Tooltip.Trigger
								onclick={() => {
									if (menu?.link) goto(menu?.link);
								}}
							>
								<Avatar.Root
									class="text-primary-secondary size-10 rounded-2xl border bg-secondary/60"
								>
									<Avatar.Image src="/logo.png" alt="@shadcn" />
									<Avatar.Fallback class="bg-transparent">{menu.fallback}</Avatar.Fallback>
								</Avatar.Root>
							</Tooltip.Trigger>
							<Tooltip.Content
								side="right"
								class="border bg-secondary text-secondary-foreground"
								arrowClasses="bg-secondary text-secondary-foreground border-b border-r"
								>Dashboard</Tooltip.Content
							>
						</Tooltip.Root>
					</Tooltip.Provider>
				</div>
				{#if i == 0}
					<Separator class="mt-2"></Separator>
				{/if}
			</div>
		{/each}
	</nav>
</aside>
