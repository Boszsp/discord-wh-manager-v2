<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { testSchema } from '$lib/schema/numberSchema';
	function clickHandler() {
		console.log(testSchema.partial().parse({x:"x",y:""},{}));
	}
</script>

<Button onclick={clickHandler}>test</Button>
