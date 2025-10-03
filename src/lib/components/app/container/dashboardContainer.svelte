<script lang="ts">
 import * as Resizable from "$lib/components/ui/resizable";
	import InnerSidebar from "../nav/innerSidebar.svelte";
</script>
 
<Resizable.PaneGroup class="h-full" direction="horizontal">
 <Resizable.Pane defaultSize={22} class="h-full">
    <InnerSidebar/>
 </Resizable.Pane>
 <Resizable.Handle  />
 <Resizable.Pane defaultSize={78}>Two</Resizable.Pane>
</Resizable.PaneGroup>