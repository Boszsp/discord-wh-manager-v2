<script lang="ts">
	import { selectedFileStore } from "./selected-file-store.svelte";

    let val:string[] = $state([])
    selectedFileStore.subscribe(v=>val = v)

</script>

{JSON.stringify(val)}
