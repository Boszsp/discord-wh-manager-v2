<script lang="ts">
	import LoginForm from '$lib/components/app/form/loginForm.svelte';
	import { APP_NAME } from '$lib/default';
</script>

<div class="grid min-h-svh lg:grid-cols-2 fixed top-0 left-0 h-svh w-svw z-60 bg-background">
	<div class="relative hidden bg-muted lg:block">
		<img
			src="/bg-1.png"
			alt="placeholder"
			class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6]"
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
				<LoginForm />
			</div>
		</div>
	</div>
</div>
