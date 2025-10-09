<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { HashIcon, SaveIcon, SendIcon, SquareXIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import Autocomplelte from '$lib/components/app/form/autocomplete.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { TemplateSchemaType } from '$lib/schema/templateSchema';

	interface serverProps {
		id?: string | number;
		name?: string | number;
	}
	let {
		server,
		channel,
		onsent,
		templates = [],
		selectedValue = $bindable(''),
		newTemplateValue = $bindable('')
	}: {
		server?: serverProps;
		channel?: serverProps;
		templates?: Pick<TemplateSchemaType, 'name'>[];
		onsent: (
			e?:
				| (MouseEvent & {
						currentTarget: EventTarget & HTMLButtonElement;
				  })
				| (MouseEvent & {
						currentTarget: EventTarget & HTMLAnchorElement;
				  })
		) => void;
		selectedValue?: string;
		newTemplateValue?: string;
	} = $props();

	const isMoble = new IsMobile();
	const templatesFormat = $derived(
		templates.map((t) => ({
			value: t.name,
			label: t.name
		}))
	);
</script>

<Card
	class="mb-4 w-full overflow-hidden bg-indigo-800 bg-gradient-to-br bg-[url('/banner-1.png')] from-indigo-800 to-violet-950 bg-cover p-4"
>
	<div class="center inline-flex h-full w-full gap-4">
		<span class="grow">
			<div
				class="inline-flex w-full items-center gap-1 rounded-md border-t bg-input/40 p-2 text-sm"
			>
				<HashIcon class="size-4" />
				<span>Channel: {channel?.name} </span>
				<span>(Server: {server?.name} ) </span>
			</div>
		</span>
		<span>
			<Button onclick={onsent} class="h-full"><SendIcon /></Button>
		</span>
	</div>
	<div>
		<Label for="template-select">Template</Label>
		<div class="inline-flex w-full gap-2">
			<Autocomplelte
				values={templatesFormat}
				bind:inputValue={newTemplateValue}
				bind:value={selectedValue}
				class="mt-2 border-0 border-t"
				id="template-select"
			/>
			<Tooltip.Provider>
				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<Button
							onclick={() => alert('Save Template/Create New Template')}
							class="mt-2 border-0 border-t"
							variant="outline"
						>
							<SaveIcon />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content
						side="top"
						class="border bg-secondary text-secondary-foreground"
						arrowClasses="bg-secondary text-secondary-foreground border-b border-r"
						>Save Template/Create New Template | บันทึกข้อมูลปัจจุบันเป็นเป็นเทมเพลต</Tooltip.Content
					>
				</Tooltip.Root>
			</Tooltip.Provider>
			<Tooltip.Provider>
				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<Button
							onclick={() => (selectedValue = '')}
							class="mt-2 border-0 border-t"
							variant="outline"
						>
							<SquareXIcon />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content
						side="top"
						class="border bg-secondary text-secondary-foreground"
						arrowClasses="bg-secondary text-secondary-foreground border-b border-r"
						>Clear Selected Template | ล้างข้อมูลเทมเพลตที่เลือกอยู่</Tooltip.Content
					>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>
	</div>
</Card>
