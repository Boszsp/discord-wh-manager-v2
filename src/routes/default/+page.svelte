<script lang="ts">
	import ChannelContainer from '$lib/components/app/container/channel-container.svelte';
	import ChannelForm from '$lib/components/app/channel/channel-form.svelte';
	import { hookJsonPartial, urlSchema } from '$lib/schema/webhookContentSchema';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import Preview from '$lib/components/app/preview/preview.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Resizable from '$lib/components/ui/resizable';
	import { cleanUpBlank, sendToWebhook } from '$lib/utilsFn/webhook.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import ChannelFile from '$lib/components/app/channel/channel-file.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { z } from 'zod';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
		CardFooter
	} from '$lib/components/ui/card';

	const { data } = $props();
	const form = superForm(data.form, {
		dataType: 'json',
		validators: zod4(hookJsonPartial),
		validationMethod: 'oninput'
	});

	const { form: formData, enhance } = form;

	const whForm = superForm(
		{ url: '' },
		{
			validators: zod4(z.object({ url: urlSchema })),
			dataType: 'json'
		}
	);

	const { form: whData, enhance: whEnhance, validate: whValidate, errors: whErrors } = whForm;

	let files: File[] = $state([]);

	const isMoble = new IsMobile();

	async function onSm() {
		const valid = await whValidate();
		if (!valid) {
			if ($whErrors.url) toast.error($whErrors.url[0]);
			return;
		}
		const result = await sendToWebhook($whData.url, cleanUpBlank($formData), files);
		if (result) {
			toast.success('Message sent successfully');
		} else {
			toast.error('Failed to send message');
		}
	}
</script>

<Resizable.PaneGroup direction={isMoble.current ? 'vertical' : 'horizontal'} class="overflow-hidden bg-background">
	<Resizable.Pane defaultSize={40} class="w-fit">
		<ScrollArea orientation="both" class="h-full w-full overflow-hidden text-wrap  break-all">
			<div class="p-4">
				<h3 class="mb-4 text-lg font-medium">Preview</h3>
				<div>
					<Preview content={$formData} {files} />
					<pre class="text-wrap break-all">{JSON.stringify($formData, null, 2)}</pre>
					{files.length}
				</div>
			</div>
		</ScrollArea>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={60} class="overflow-hidden md:w-fit">
		<ScrollArea class="h-full w-full overflow-hidden">
			<div class="w-full overflow-hidden p-4">
				<h3 class="mb-2 text-lg font-medium">Sent To</h3>
				<Card class="bg-indigo-600  bg-[url('/banner-1.png')]">
					<CardHeader>
						<CardTitle>Webhook URL</CardTitle>
						<CardDescription>Please provide a valid Discord webhook URL.</CardDescription>
					</CardHeader>
					<CardContent>
						<form use:whEnhance method="POST">
							<Input
								name="url"
								bind:value={$whData.url}
								placeholder="https://discord.com/api/webhooks/..."
							/>
						</form>
					</CardContent>
					<CardFooter>
						<Button class="ml-auto" onclick={onSm}>Sent</Button>
					</CardFooter>
				</Card>
				<Separator class="my-4" />
				<ChannelFile bind:files />
				<Separator class="mt-8 mb-4" />

				<ChannelForm {form} />
			</div>
		</ScrollArea>
	</Resizable.Pane>
</Resizable.PaneGroup>
