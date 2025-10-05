<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { CardTitle } from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { HashIcon, CirclePlusIcon, SearchIcon } from 'lucide-svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { channelCurId } from '$lib/store/channel.svelte';
	import ChannelCreateDialog from '../channel/channel-create-dialog.svelte';
	import { page } from '$app/state';
	import { Input } from '$lib/components/ui/input';
	/*export interface channelsProps {
		title: string;
		id: number;
	}*/
	const {
		name = 'Server Name',
		channels = ['temp', 'temp2']
	}: { name?: string; channels?: string[] } = $props();
	let selectedId = $state(-1);
	//let isOpenCreateChannelDialog:boolean = $state(false);
	channelCurId.subscribe((v) => (selectedId = v?.cid ?? -1));
	let searchChannelKey = $state('');
	channelCurId.subscribe(()=>searchChannelKey='')
	//const channelsFilterd = $derived(channels.filter((v)=>(!(searchChannelKey?.length > 0))||(v.includes(searchChannelKey))))
</script>

<nav>
	<div class="border-b p-2">
		<CardTitle class="mx-auto rounded-md p-2">{name}</CardTitle>
	</div>
	<ScrollArea class="h-full p-2">
		<ChannelCreateDialog />

		<Separator class="my-2" />
		<div>
			<small class="text-sm leading-none font-medium text-muted-foreground"
				>Webhooks | เว็บฮุก</small
			>
		</div>
		<div class="flex flex-col gap-1">
			<div class="relative mb-1">
				<SearchIcon class="absolute top-1.5 left-1.5 text-muted-foreground size-4" />
				<Input bind:value={searchChannelKey} class="p-1 h-fit pl-6 text-sm focus-visible:ring-0" placeholder="webhook name" />
			</div>
			{#each channels as channel, i (`${channel}-${i}`)}
			{#if searchChannelKey.length <= 0 || channel.includes(searchChannelKey)}
				{#key selectedId}
					<Button
						onclick={() => {
							page.url.searchParams.set('channel', i + 1 + '');
							goto(page.url.toString(), { invalidate: ['channel:get'] });
						}}
						size="sm"
						variant={selectedId === i + 1 ? 'secondary' : 'ghost'}
						class="w-full justify-start text-start"><HashIcon />{channel}</Button
					>
				{/key}
			{/if}
			{/each}
		</div>
	</ScrollArea>
</nav>
