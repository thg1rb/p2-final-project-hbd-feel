<script lang="ts">
	// import { title } from './store.js';
	export let title;
	// export let icon
	export let textColor = '#000000';
	export let amount = 0;
	export let icon = '';
	export let iconPrimary = '#ffffff';
	export let iconSecondary = '#ffffff';
	import Icon from './Icon.svelte';
</script>

<div class="h-30 w-full rounded-2xl bg-white p-6 shadow-md md:w-70">
	<div class="flex justify-between">
		<div class="flex flex-col gap-4">
			<p class="text-sm text-gray-500">{title}</p>
			<p class="text-4xl" style="color: {textColor}">{amount}</p>
		</div>
		<div class="flex items-center justify-center">
			<div
				class="flex size-14 items-center justify-center rounded-2xl p-2"
				style="background-color: {iconSecondary};"
			>
				<Icon name={icon} size={36} currentColor={iconPrimary}></Icon>
			</div>
		</div>
	</div>
</div>
