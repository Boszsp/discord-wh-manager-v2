<script lang="ts">
	import { convertMdToHTML } from '$lib/utilsFn/md';
	import './side-avatar.css';
	

	let {
		content = ""
	}: {
		content?: string;
	} = $props();

	let oldMdContent = '';
</script>

<div>
	{#await convertMdToHTML(content)}
		<div class="md-content">
			{@html oldMdContent}
		</div>
	{:then res}
		<div class="md-content">
			<p hidden class="hidden">
				{(oldMdContent = res && '')}
			</p>
			{@html res}
		</div>
	{:catch e}
		{@debug e}
		<div class="md-content">
			{@html oldMdContent}
		</div>
	{/await}
</div>
