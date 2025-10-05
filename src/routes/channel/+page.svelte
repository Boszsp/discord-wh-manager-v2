<script>
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
</script>

<ChannelContainer class="overflow-hidden bg-background">
	<Resizable.PaneGroup direction="horizontal">
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
		<Resizable.Pane defaultSize={60} class="w-fit overflow-hidden">
			<ScrollArea class="h-full w-full overflow-hidden">
				<div class="w-full overflow-hidden px-4">
					<Card
						class="mb-4 w-full overflow-hidden bg-gradient-to-br from-indigo-800 to-violet-950 p-2"
					>
						<div class="center inline-flex h-full w-full gap-4">
							<span class="grow">
								<h3 class="text-lg font-medium">Sent To</h3>
								<div
									class="inline-flex w-full items-center gap-1 rounded-md bg-secondary/60 p-2 text-sm"
								>
									<HashIcon class="size-4" />
									<span>Channel: {data?.channel?.name} </span>
									<span>(Server: {data?.server?.name} ) </span>
								</div>
							</span>
							<span class="h-16">
								<Button class="h-full"><SendIcon /></Button>
							</span>
						</div>
					</Card>
					<ChannelForm {form} />
				</div>
			</ScrollArea>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</ChannelContainer>
