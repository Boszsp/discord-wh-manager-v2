<script lang="ts">
	import LoginForm from '$lib/components/app/form/login-form.svelte';
	import { APP_NAME } from '$lib/default';
	import { superForm } from 'sveltekit-superforms/client';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/schema/loginSchema';
	import PageTransition from '$lib/components/app/layout/page-transition.svelte';
	let { data } = $props();
	const form = superForm(data.form, {
		validators: zod4(loginSchema),
		validationMethod:"onblur",
		onSubmit:(inp)=>{
			inp.cancel()
			return false
		},
		clearOnSubmit:"errors"
		
	});
</script>
<PageTransition/>
<div class="fixed top-0 left-0 z-60 grid h-svh min-h-svh w-svw bg-background lg:grid-cols-2">
	<div class="relative hidden bg-muted lg:block">
		<img
			src="/bg-1.png"
			alt="placeholder"
			class="absolute inset-0 h-full w-full object-cover"
		/>
	</div>
	<div class="flex flex-col gap-4 p-6 md:p-10">
		<div class="flex justify-center gap-2 md:justify-start">
			<a href="##" class="flex items-center gap-2 font-medium">
				<div class="flex size-6 items-center justify-center rounded-md text-primary-foreground">
					<img src="/logo.png" alt="logo" class="size-6" />
				</div>
				{APP_NAME}
			</a>
		</div>
		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-xs">
				<LoginForm form={form} />
			</div>
		</div>
	</div>
</div>
