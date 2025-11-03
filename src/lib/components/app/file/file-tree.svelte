<script lang="ts">
	let { files }: { files: File[] } = $props();
</script>

<ul>
	{#each files as file}
		<li>{file.name}</li>
	{/each}
</ul>
