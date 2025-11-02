<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import {
		HashIcon,
		LoaderCircleIcon,
		SaveIcon,
		SendIcon,
		SquarePlus,
		SquareXIcon
	} from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import Autocomplelte from '$lib/components/app/form/autocomplete.svelte';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { TemplateSchemaType } from '$lib/schema/templateSchema';
	import ChannelCreateTemplateDialog from './channel-create-template-dialog.svelte';

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
		newTemplateValue = $bindable(''),
		onSaveTemplate,
		onCreateTemplate,
		isLoading
	}: {
		server?: serverProps;
		channel?: serverProps;
		templates?: TemplateSchemaType[];
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
		onSaveTemplate?: () => void;
		onCreateTemplate?: (name?: string) => void;
		isLoading?: boolean;
	} = $props();

	const isMoble = new IsMobile();
	const templatesFormat = $derived(
		templates.map((t) => ({
			value: t?.id || t.name,
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
			<Button disabled={isLoading} onclick={onsent} class="h-full">
				{#if isLoading}
					<LoaderCircleIcon class="animate-spin" />
					Please wait
				{:else}
					<SendIcon />
				{/if}</Button
			>
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
							onclick={() => {
								if (onSaveTemplate) onSaveTemplate();
							}}
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
						>Save Template | บันทึกข้อมูลปัจจุบันเป็นเทมเพลต</Tooltip.Content
					>
				</Tooltip.Root>
			</Tooltip.Provider>
			<Tooltip.Provider>
				<Tooltip.Root delayDuration={0}>
					<Tooltip.Trigger>
						<Button
							onclick={() => (selectedValue = '')}
							class="mt-2 border-0 border-t !bg-destructive/20"
							variant="destructive"
						>
							<SquareXIcon />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content
						side="top"
						class="text-destructive-foreground border bg-destructive/20"
						arrowClasses="bg-destructive/20 text-destructive-foreground border-b border-r"
						>Clear Selected Template | ล้างข้อมูลเทมเพลตที่เลือกอยู่</Tooltip.Content
					>
				</Tooltip.Root>
			</Tooltip.Provider>

			<ChannelCreateTemplateDialog
				onConfirm={(name) => {
					if (onCreateTemplate) onCreateTemplate(name);
				}}
			>
				<Tooltip.Provider>
					<Tooltip.Root delayDuration={0}>
						<Tooltip.Trigger>
							<Button
								class="mt-2 border-0 border-t bg-primary/20 hover:bg-primary/20"
								variant="default"
							>
								<SquarePlus />
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content
							side="top"
							class="border bg-primary/20 text-secondary-foreground"
							arrowClasses="bg-primary/20 text-secondary-foreground border-b border-r"
							>Create New Template | สร้างเทมเพลตใหม่จากขุอมูลปัจจุบัน</Tooltip.Content
						>
					</Tooltip.Root>
				</Tooltip.Provider>
			</ChannelCreateTemplateDialog>
		</div>
	</div>
</Card>
