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
	import type { Snapshot } from './$types';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import ChannelSentCard from '$lib/components/app/channel/channel-sent-card.svelte';
	import ChannelFile from '$lib/components/app/channel/channel-file.svelte';
	
	const { data } = $props();
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
	let files:File[] = $state([])

	const isMoble = new IsMobile();

	export const snapshot: Snapshot<typeof $formData> = {
		capture: () => $formData,
		restore: (value) => ($formData = value)
	};

	function onSm() {
		console.log(cleanUpBlank($formData));
	}
</script>

<ChannelContainer leftWidth={16} class="overflow-hidden bg-background">
	<Resizable.PaneGroup direction={isMoble.current ? 'vertical' : 'horizontal'}>
		<Resizable.Pane defaultSize={40} class="w-fit">
			<ScrollArea orientation="both" class="h-full w-full overflow-hidden text-wrap  break-all">
				<div class="p-4">
					<h3 class="mb-4 text-lg font-medium">Preview</h3>
					<div>
						<Preview content={$formData} />
						<pre class="text-wrap break-all">{JSON.stringify($formData, null, 2)}</pre>
					</div>
				</div>
			</ScrollArea>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={60} class="overflow-hidden md:w-fit">
			<ScrollArea class="h-full w-full overflow-hidden">
				<div class="w-full overflow-hidden p-4">
					<h3 class="mb-2 text-lg font-medium">Sent To</h3>
					<ChannelSentCard server={data.server} channel={data.channel} onsent={onSm} />
					<Separator class="my-4" />
					<ChannelFile />
					<Separator class="mt-8 mb-4" />

					<ChannelForm {form} />
				</div>
			</ScrollArea>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</ChannelContainer>
