<script lang="ts">
	import ChannelContainer from '$lib/components/app/container/channel-container.svelte';
	import ChannelForm from '$lib/components/app/channel/channel-form.svelte';
	import { hookJsonPartial } from '$lib/schema/webhookContentSchema';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import Preview from '$lib/components/app/preview/preview.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Card } from '$lib/components/ui/card';
	import { HashIcon, SendIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Resizable from '$lib/components/ui/resizable';
	import { cleanUpBlank } from '$lib/utilsFn/webhook.js';
	import { Label } from '$lib/components/ui/label';
	import Autocomplelte from '$lib/components/app/form/autocomplelte.svelte';
	import type { Snapshot } from './$types';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { channelCurId } from '$lib/store/channel.svelte';

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
	function onSm() {
		console.log(cleanUpBlank($formData));
	}

	const isMoble = new IsMobile();

	export const snapshot: Snapshot<typeof $formData> = {
		capture: () => $formData,
		restore: (value) => ($formData = value)
	};
</script>

<ChannelContainer leftWidth={16} class="overflow-hidden bg-background">
	<Resizable.PaneGroup direction={isMoble.current ? 'vertical' : 'horizontal'}>
		<Resizable.Pane defaultSize={40} class="w-fit">
			<ScrollArea orientation="both" class="h-full w-full overflow-hidden text-wrap  break-all">
				<div class="p-4">
					<h3 class="mb-4 text-lg font-medium">Preview</h3>
					<div>
						<Preview content={$formData} />
						<pre class="text-wrap break-all">
					{JSON.stringify($formData, null, 2)}
					</pre>
					</div>
				</div>
			</ScrollArea>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={60} class="overflow-hidden md:w-fit">
			<ScrollArea class="h-full w-full overflow-hidden">
				<div class="w-full overflow-hidden p-4">
					<h3 class="mb-2 text-lg font-medium">Sent To</h3>

					<Card
						class="overflow-hidde mb-4 w-full bg-indigo-800 bg-gradient-to-br bg-[url('/banner-1.png')] from-indigo-800 to-violet-950 bg-cover p-4"
					>
						<div class="center inline-flex h-full w-full gap-4">
							<span class="grow">
								<div
									class="inline-flex w-full items-center gap-1 rounded-md border-t bg-input/40 p-2 text-sm"
								>
									<HashIcon class="size-4" />
									<span>Channel: {data?.channel?.name} </span>
									<span>(Server: {data?.server?.name} ) </span>
								</div>
							</span>
							<span>
								<Button onclick={onSm} class="h-full"><SendIcon /></Button>
							</span>
						</div>
						<div>
							<Label for="template-select">Template</Label>
							<Autocomplelte class="mt-2 border-0 border-t" id="template-select" />
						</div>
					</Card>
					<Separator class="my-4" />
					<ChannelForm {form} />
				</div>
			</ScrollArea>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</ChannelContainer>
