<script>
	import Icon from '$lib/components/Icon.svelte';

	export let title = 'หัวข้อเริ่มต้น';
	export let value = '';
	export let award = false;
</script>

<div class="flex flex-1 flex-col gap-2">
	<p class="text-sm text-gray-400">{title}</p>
	{#if !award}
		<p>{value}</p>
	{:else}
		<div
			class=" flex w-fit items-center justify-center rounded-full border border-blue-500 bg-blue-50 px-2 py-1 text-sm text-blue-500"
		>
			<Icon name="badge" class=" stroke-blue-500" />
			<p>{value}</p>
		</div>
	{/if}
</div>
