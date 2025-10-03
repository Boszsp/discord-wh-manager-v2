<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';
	import { DEFAULT_SIDEBAR_FIRST_MENU } from '$lib/default';

	export interface sidebarMenuProps {
		image: string;
		fallback: string;
		title: string;
		link?: string;
		isSelected?: boolean;
		class?: ClassValue;
	}
	const {
		sidebarMenu,
		class: className
	}: { sidebarMenu?: sidebarMenuProps[]; class?: ClassValue } = $props();
	const sidebarMenus: sidebarMenuProps[] = [
		{ ...DEFAULT_SIDEBAR_FIRST_MENU, isSelected: !sidebarMenu?.some((v) => v.isSelected) }
	];
</script>

<aside>
	<nav class={cn('flex flex-col gap-2 px-4', className)}>
		{#each sidebarMenus as menu, i (menu.title + i)}
			<div class={cn('group relative', menu?.class)}>
				{#if  menu?.isSelected}
					<div class="absolute top-0 -left-4 h-10 w-1 rounded-r-2xl bg-foreground/60"></div>
				{:else}
					<div
						class="absolute top-0 -left-4 h-10 w-0 scale-y-50 rounded-r-2xl bg-foreground/60 transition-all group-hover:w-1"
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
									class={cn("text-primary-secondary size-10 rounded-xl bg-secondary/60")}
								>
									<Avatar.Image src={menu?.image} alt="@shadcn" />
									<Avatar.Fallback class="bg-transparent scale-75">{menu.fallback}</Avatar.Fallback>
								</Avatar.Root>
							</Tooltip.Trigger>
							<Tooltip.Content
								side="right"
								class="border bg-secondary text-secondary-foreground"
								arrowClasses="bg-secondary text-secondary-foreground border-b border-r"
								>{menu.title}</Tooltip.Content
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
