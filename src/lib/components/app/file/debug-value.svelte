<script>
	import { selectedFileStore } from "./selected-file-store.svelte";

    let val = $state([])
    selectedFileStore.subscribe(v=>val = v)

</script>

{JSON.stringify(val)}
