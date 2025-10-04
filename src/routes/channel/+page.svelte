<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ChannelContainer from '$lib/components/app/container/channel-container.svelte';
	import ChannelForm from '$lib/components/app/channel/channel-form.svelte';
	import { parseNumber } from '$lib/schema/numberSchema';
	import { hookJsonPartial } from '$lib/schema/webhookContentSchema';
	import { channelCurId } from '$lib/store/channel.svelte';
	import { onMount } from 'svelte';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import Preview from '$lib/components/app/preview/preview.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	const serverId = $derived(parseNumber(page.url.searchParams.get('id') ?? '-1'));
	const channelId = $derived(parseNumber(page.url.searchParams.get('channel') ?? '1'));
	function init() {
		channelCurId.set({ id: serverId ?? 0, cid: channelId ?? 0 });
	}
	init()
	onMount(() => {
		if (!page.url.searchParams.has('channel')) {
			page.url.searchParams.set('channel', '1');
		}
		goto(page.url.toString());
	});
	const {data} = $props()
	const form = superForm(data.form, {
		dataType:"json",
		validators: zod4(hookJsonPartial),
		validationMethod:"onblur",
		onSubmit:(inp)=>{
			console.log(inp);
			inp.cancel()
			console.log(inp.formData);
			return false
		},
		clearOnSubmit:"errors"
		
	});

	const { form: formData } = form;
</script>

<ChannelContainer class="bg-background">
	<div class="grid grid-cols-2 gap-8 w-full max-w-6xl mx-auto p-4 pt-8">
		<ScrollArea class="w-full h-full">
			<ChannelForm form={form}/>
		</ScrollArea>
		<div>
			<h3 class="text-lg font-medium mb-4">Preview</h3>
			<div class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
				<Preview content={$formData} />
			</div>
		</div>
	</div>
</ChannelContainer>
