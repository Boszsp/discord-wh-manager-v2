<script lang="ts">
	import { convertMdToHTML } from '$lib/utilsFn/md';
	import { fade } from 'svelte/transition';
	import './side-avatar.css';
	

	let {
		content = ""
	}: {
		content?: string;
	} = $props();

	let oldMdContent = $state('');
</script>

<div>
	{#await convertMdToHTML(content)}
		<div transition:fade class="md-content">
			{@html oldMdContent}
		</div>
	{:then res}
		<div transition:fade class="md-content">
			<p hidden class="hidden">
				{(oldMdContent = res && '')}
			</p>
			{@html res}
		</div>
	{:catch e}
		{@debug e}
		<div transition:fade class="md-content">
			{@html oldMdContent}
		</div>
	{/await}
</div>
