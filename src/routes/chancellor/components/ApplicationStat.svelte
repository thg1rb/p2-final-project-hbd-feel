<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	export interface StatProps {
		total: number;
		totalInprogress: number;
	}
	const { stats }: { stats: StatProps } = $props();
</script>

<div class="flex flex-1 gap-4">
	<div
		class="flex flex-1 items-center justify-between rounded-xl bg-white bg-linear-to-r from-indigo-500 to-indigo-300 p-5 shadow-md"
	>
		<div class=" flex flex-col gap-2 text-white">
			<p class="font-semibold">นิสิตทั้งหมดที่ได้รับรางวัล</p>
			<p class="text-4xl font-bold">{stats.total}</p>
		</div>
		<div class="rounded-xl bg-white p-3">
			<Icon name="userCheck" class="stroke-indigo-500"></Icon>
		</div>
	</div>
</div>
