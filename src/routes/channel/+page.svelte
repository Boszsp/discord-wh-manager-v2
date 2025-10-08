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

	const { data }: PageProps = $props();
	const form = superForm(data.form, {
		dataType: 'json',
		validators: zod4(hookJsonPartial),
		validationMethod: 'oninput',
		onSubmit: (inp) => {
			console.log(inp);
			inp.cancel();
			console.log(inp.formData);
			return false;
		},
		clearOnSubmit: 'errors'
	});

	const { form: formData } = form;
	let files: File[] = $state([]);
	let selectedTemplate: string = $state('');
	let newTemplateValue: string = $state('');

	const isMoble = new IsMobile();

	export const snapshot: Snapshot<{ formdata: typeof $formData }> = {
		capture: () => ({ formdata: $formData }),
		restore: (value) => {
			const { formdata: SformdatS } = value;
			$formData = SformdatS;
		}
	};

	formData.subscribe((v) => fromStore.set(v));

	function onSm() {
		console.log(cleanUpBlank($formData));
	}
</script>

<PageTransition />
<ImagePopupShow />
<ChannelContainer leftWidth={16} class="overflow-hidden bg-background">
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
						templates={data?.templates}
						bind:newTemplateValue
						bind:selectedValue={selectedTemplate}
						onsent={onSm}
					/>
					<Separator class="my-4" />
					{#if !selectedTemplate || selectedTemplate === ""}
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
					{/if}
				</div>
			</ScrollArea>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</ChannelContainer>
