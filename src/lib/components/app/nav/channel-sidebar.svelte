<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { CardTitle } from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { HashIcon, CirclePlusIcon, SearchIcon, TrashIcon, PenBoxIcon } from 'lucide-svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { channelCurId } from '$lib/store/channel.svelte';
	import ChannelCreateDialog from '../channel/channel-create-dialog.svelte';
	import { page } from '$app/state';
	import { Input } from '$lib/components/ui/input';
	import type { webhookSchemaType } from '$lib/schema/webhookSchema';
	import type { createChannelActionType } from '$lib/curdFn/channel';
	/*export interface channelsProps {
		title: string;
		id: number;
	}*/
	const {
		name = 'Server Name',
		channels = [],
		onCreateChannel
	}: {
		name?: string;
		channels?: webhookSchemaType[];
		onCreateChannel?: (serverId: string, channel: webhookSchemaType) => Promise<void>;
	} = $props();
	let selectedId = $state('');
	//let isOpenCreateChannelDialog:boolean = $state(false);
	channelCurId.subscribe((v) => (selectedId = String(v?.cid ?? -1)));
	let searchChannelKey = $state('');
	channelCurId.subscribe(() => (searchChannelKey = ''));
	//const channelsFilterd = $derived(channels.filter((v)=>(!(searchChannelKey?.length > 0))||(v.includes(searchChannelKey))))
</script>

<nav>
	<div class="border-b p-2">
		<CardTitle class="mx-auto rounded-md p-2">{name}</CardTitle>
	</div>
	<ScrollArea class="h-full p-2">
		<ChannelCreateDialog {onCreateChannel} />

		<Separator class="my-2" />
		<div>
			<small class="text-sm leading-none font-medium text-muted-foreground"
				>Webhooks | เว็บฮุก</small
			>
		</div>
		<div class="flex flex-col gap-1">
			<div class="relative mb-1">
				<SearchIcon class="absolute top-1.5 left-1.5 size-4 text-muted-foreground" />
				<Input
					bind:value={searchChannelKey}
					class="h-fit p-1 pl-6 text-sm focus-visible:ring-0"
					placeholder="webhook name"
				/>
			</div>
			{#each channels as channel, i (`${channel}-${i}`)}
				{#if searchChannelKey.length <= 0 || channel?.name.includes(searchChannelKey)}
					{#key selectedId}
						<Button
							onclick={() => {
								page.url.searchParams.set('channel', channel?.id ?? i + 1 + '');
								goto(page.url.toString(), { invalidate: ['channel:get'], replaceState: false });
							}}
							size="sm"
							variant={selectedId === channel?.id ? 'secondary' : 'ghost'}
							class="w-full justify-start truncate text-start"
						>
							<HashIcon />{channel?.name}<span class="ml-auto">
								{#if selectedId === channel?.id}
								<Button size="icon" variant="link" class="text-destructive p-0 w-fit">
									<TrashIcon class="size-4" />
								</Button>
								<Button size="icon" variant="link" class="text-muted-foreground p-0 w-fit ml-0.5">
									<PenBoxIcon class="size-4" />
								</Button>
								{/if}
							</span>
						</Button>
					{/key}
				{/if}
			{/each}
		</div>
	</ScrollArea>
</nav>
