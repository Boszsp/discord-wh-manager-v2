<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { CardTitle } from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { HashIcon, SearchIcon, TrashIcon, PenBoxIcon } from 'lucide-svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { channelCurId } from '$lib/store/channel.svelte';
	import ChannelCreateDialog from '../channel/channel-create-dialog.svelte';
	import { page } from '$app/state';
	import { Input } from '$lib/components/ui/input';
	import type { webhookSchemaType } from '$lib/schema/webhookSchema';
	import ChannelEditDialog from '$lib/components/app/channel/channel-edit-dialog.svelte';
	import ChannelRemoveDialog from '$lib/components/app/channel/channel-remove-dialog.svelte';
	/*export interface channelsProps {
		title: string;
		id: number;
	}*/
	const {
		name = 'Server Name',
		channels = [],
		onCreateChannel,
		onRemoveChannel,
		onEditChannel
	}: {
		name?: string;
		channels?: webhookSchemaType[];
		onCreateChannel?: (serverId: string, channel: webhookSchemaType) => Promise<void>;
		onRemoveChannel?: (serverId: string, channelId: string) => void;
		onEditChannel?: (channelId: string, channel: webhookSchemaType) => void;
	} = $props();
	let selectedId = $state('');
	//let isOpenCreateChannelDialog:boolean = $state(false);
	channelCurId.subscribe((v) => (selectedId = String(v?.cid ?? -1)));
	let searchChannelKey = $state('');
	channelCurId.subscribe(() => (searchChannelKey = ''));

	let openEdit = $state(false);
	let openRemove = $state(false);

	let channelInfo = $state({ name: '', url: '', id: '' });
	function openEditDialog(name: string, url: string, id: string) {
		channelInfo = { name, url, id };
		openEdit = true;
	}
	function openRemoveDialog(name: string, url: string, id: string) {
		channelInfo = { name, url, id };
		openRemove = true;
	}
	function onRemoveChannelHandler() {
		if (onRemoveChannel) onRemoveChannel($channelCurId?.id + '', channelInfo.id);
	}
	function onEditChannelHandler(channelId: string, channel: webhookSchemaType) {
		if (onEditChannel) onEditChannel(channelId, channel);
	}
	//const channelsFilterd = $derived(channels.filter((v)=>(!(searchChannelKey?.length > 0))||(v.includes(searchChannelKey))))
</script>

<nav class="h-full">
	<div class="border-b p-2">
		<CardTitle class="mx-auto rounded-md p-2">{name}</CardTitle>
	</div>
	<div class="px-2">
		<ChannelCreateDialog class="mt-2" {onCreateChannel} />
	</div>

	<Separator class="my-2" />
	<div>
		<small class="px-2 text-sm leading-none font-medium text-muted-foreground"
			>Webhooks | เว็บฮุก</small
		>
	</div>
	<div class="relative mx-2 mt-1">
		<SearchIcon class="absolute top-1.5 left-1.5 size-4 text-muted-foreground" />
		<Input
			bind:value={searchChannelKey}
			class="h-fit p-1 pl-6 text-sm focus-visible:ring-0"
			placeholder="webhook name"
		/>
	</div>
	<ScrollArea class="h-full p-2">
		<div class="flex flex-col gap-1">
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
									<Button
										onclick={(e) => {
											e.stopPropagation();
											openRemoveDialog(channel?.name, channel?.url, String(channel?.id));
										}}
										size="icon"
										variant="link"
										class="w-fit p-0 text-destructive"
									>
										<TrashIcon class="size-4" />
									</Button>
									<Button
										onclick={(e) => {
											e.stopPropagation();
											openEditDialog(channel?.name, channel?.url, String(channel?.id));
										}}
										size="icon"
										variant="link"
										class="ml-0.5 w-fit p-0 text-muted-foreground"
									>
										<PenBoxIcon class="size-4" />
									</Button>
								{/if}
							</span>
						</Button>
					{/key}
				{/if}
			{/each}
			<div class="h-40"></div>
			{#key channelInfo}
				<ChannelEditDialog
					onSaveChannel={onEditChannelHandler}
					channel={channelInfo}
					bind:open={openEdit}
				/>
				<ChannelRemoveDialog
					onRemoveChannel={onRemoveChannelHandler}
					channel={channelInfo}
					bind:open={openRemove}
				/>
			{/key}
		</div>
	</ScrollArea>
</nav>
