<script lang="ts">
	import ChannelContainer from '$lib/components/app/container/channel-container.svelte';
	import ChannelForm from '$lib/components/app/channel/channel-form.svelte';
	import { hookJsonPartial } from '$lib/schema/webhookContentSchema';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import Preview from '$lib/components/app/preview/preview.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Resizable from '$lib/components/ui/resizable';
	import { cleanUpBlank } from '$lib/utilsFn/webhook.js';
	import type { Snapshot, PageProps } from './$types';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import ChannelSentCard from '$lib/components/app/channel/channel-sent-card.svelte';
	import ChannelFile from '$lib/components/app/channel/channel-file.svelte';
	import { fromStore } from '$lib/store/form.svelte';
	import { Button } from '$lib/components/ui/button';
	import PageTransition from '$lib/components/app/layout/page-transition.svelte';
	import ImagePopupShow from '$lib/components/app/preview/image-popup-show.svelte';
	import TextareaJson from '$lib/components/app/form/textarea-json.svelte';
	import { safePareseTemplateString } from '$lib/utilsFn/template';
	import { fade } from 'svelte/transition';
	import type { webhookSchemaType } from '$lib/schema/webhookSchema';
	import { createChannelAction, editChannelAction, removeChannelAction } from '$lib/curdFn/channel';
	import TemplateVariableForm from '$lib/components/app/template/template-variable-form.svelte';
	import type { TemplateSchemaType } from '$lib/schema/templateSchema';

	const { data }: PageProps = $props();
	const form = superForm(data.form, {
		dataType: 'json',
		validators: zod4(hookJsonPartial),
		validationMethod: 'oninput',
		onSubmit: (inp) => {
			inp.cancel();
			return false;
		},
		clearOnSubmit: 'errors'
	});

	const { form: formData } = form;
	let files: File[] = $state([]);
	let templates: TemplateSchemaType[] = $state(data?.templates || []);
	let selectedTemplate: string = $state('');
	let selectedTemplateObj: TemplateSchemaType | undefined = $derived(
		templates.find((v) => v.id === selectedTemplate)
	);

	let newTemplateValue: string = $state('');
	let channels: webhookSchemaType[] = $state(data?.channels || []);

	const isMoble = new IsMobile();

	export const snapshot: Snapshot<{ formdata: typeof $formData }> = {
		capture: () => ({ formdata: $formData }),
		restore: (value) => {
			const { formdata: SformdatS } = value;
			$formData = SformdatS;
		}
	};

	formData.subscribe((v) => fromStore.set(v));

	$effect(() => {
		if(selectedTemplateObj?.content)
		$formData = safePareseTemplateString(selectedTemplateObj.content) as typeof $formData;
	});

	function onSm() {
		console.log(cleanUpBlank($formData));
	}

	async function onCreateChannel(serverId: string, channel: webhookSchemaType) {
		createChannelAction(serverId, channel).then((r) => {
			if (r?.affectedChannel?.id) channels.push(r.affectedChannel);
		});
	}

	function onRemoveChannel(serverId: string, channelId: string) {
		removeChannelAction(serverId, channelId).then((r) => {
			if (r?.affectedChannel?.id) channels = channels.filter((v) => v.id !== channelId);
		});
	}

	function onEditChannel(channelId: string, channel: webhookSchemaType) {
		editChannelAction(data?.server?.id, channelId, channel).then((r) => {
			if (r?.affectedChannel?.name) {
				const channelIndex = channels.findIndex((v) => v.id === channelId);
				console.log(channelIndex);
				if (channelIndex >= 0) {
					const channelsTemp = [...channels];
					channelsTemp[channelIndex] = Object.assign({ id: channelId }, r.affectedChannel);
					channels = channelsTemp;
				}
			}
		});
	}
</script>

<PageTransition />
<ImagePopupShow />
<ChannelContainer
	{onRemoveChannel}
	{onCreateChannel}
	{onEditChannel}
	{channels}
	leftWidth={16}
	class="overflow-hidden bg-background"
>
	{#if data?.channels && data?.channels?.length > 0}
		<Resizable.PaneGroup direction={isMoble.current ? 'vertical' : 'horizontal'}>
			<Resizable.Pane defaultSize={40} class="w-fit">
				<ScrollArea orientation="both" class="h-full w-full overflow-hidden text-wrap  break-all">
					<div class="p-4">
						<h3 class="mb-4 text-lg font-medium">Preview</h3>
						<div>
							<Preview content={$formData} {files} />
							<Separator class="my-8" />
							<TextareaJson
								value={JSON.stringify($formData, null, 2)}
								oninput={(e) => {
									try {
										formData.set(
											safePareseTemplateString(e.currentTarget.value, $formData) as typeof $formData
										);
									} catch (err) {
										console.error(err);
									}
								}}
								class="mt-4"
							/>
						</div>
					</div>
				</ScrollArea>
			</Resizable.Pane>
			<Resizable.Handle withHandle />
			<Resizable.Pane defaultSize={60} class="overflow-hidden md:w-fit">
				<ScrollArea class="h-full w-full overflow-hidden">
					<div class="w-full overflow-hidden p-4">
						<h3 class="text-lg font-medium">Sent To</h3>
						<p class="mb-2 text-xs text-muted-foreground">
							Your content will sent to displayed channel. |
							ข้อมูลของคุณจะถูกส่งไปยังช่องทางที่แสดงอยู่นี้.
						</p>
						<ChannelSentCard
							server={data?.server}
							channel={data?.channel}
							{templates}
							bind:newTemplateValue
							bind:selectedValue={selectedTemplate}
							onsent={onSm}
						/>
						<Separator class="my-4" />
						{#if !selectedTemplate || selectedTemplate === ''}
							<div transition:fade>
								<div class="flex gap-4">
									<div>
										<h3 class="text-lg font-medium">Form Data</h3>
										<p class="mb-2 text-xs text-muted-foreground">
											Type your content here. | กรอกข้อมูลของคุณที่นี่.
										</p>
									</div>
									<Button
										class="ml-auto"
										variant="outline"
										onclick={() => {
											$formData = { content: '' };
											files = [];
										}}>Clear</Button
									>
								</div>
								<ChannelFile bind:files />
								<Separator class="mt-8 mb-4" />
								<ChannelForm {form} />
							</div>
						{:else}
							<TemplateVariableForm templateContent={selectedTemplateObj?.content || ''} />
						{/if}
					</div>
				</ScrollArea>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	{/if}
</ChannelContainer>
