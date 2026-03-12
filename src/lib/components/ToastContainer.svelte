<script lang="ts">
	import { toastStack } from '$lib/stores/toast.svelte';
	import { fly } from 'svelte/transition';
	import Icon from './Icon.svelte';
</script>

<div class="fixed top-5 right-5 z-100 flex flex-col gap-2">
	{#each toastStack.current as toast (toast.id)}
		<div
			transition:fly={{ x: 100, duration: 500 }}
			class="flex min-w-62.5 items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg
      {toast.type === 'success' ? 'bg-primary' : 'bg-red-400'}"
		>
			{#if toast.type === 'success'}
				<div class="rounded-full bg-white p-2">
					<Icon name="check" class="stroke-primary" />
				</div>
			{:else}
				<div class="rounded-full bg-white p-2">
					<Icon name="X" class="stroke-red-400" />
				</div>
			{/if}
			<span>{toast.message}</span>
		</div>
	{/each}
</div>
