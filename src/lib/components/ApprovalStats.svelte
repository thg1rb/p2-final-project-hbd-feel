<script lang="ts">
	import Icon from "./Icon.svelte";

	interface Stat {
	  total: number;
		pending: number;
		rejected: number;
		approved: number;
	}

	let { stats }: { stats?: Stat } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
	<div class="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-2">
			<p>จำนวนใบสมัครทั้งหมด</p>
			<p class="text-2xl font-bold">{stats?.total || 0}</p>
		</div>
		<div class="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-3">
			<Icon name="book" class="stroke-white"></Icon>
		</div>
	</div>
	<div class="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-2">
			<p>จำนวนใบสมัครที่รอพิจาณา</p>
			<p class="text-2xl font-bold">{stats?.pending || 0}</p>
		</div>
		<div class="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-3">
			<Icon name="loading" class="stroke-white"></Icon>
		</div>
	</div>
	<div class="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-2">
			<p>จำนวนใบสมัครที่ปฏิเสธ</p>
			<p class="text-2xl font-bold">{stats?.rejected || 0}</p>
		</div>
		<div class="rounded-xl bg-gradient-to-br from-red-400 to-red-600 p-3">
			<Icon name="X" class="stroke-white"></Icon>
		</div>
	</div>
	<div class="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-2">
			<p>จำนวนใบสมัครที่อนุมัติ</p>
			<p class="text-2xl font-bold">{stats?.approved || 0}</p>
		</div>
		<div class="rounded-xl bg-gradient-to-br from-primary to-green-700 p-3">
			<Icon name="userCheck" class="stroke-white"></Icon>
		</div>
	</div>
</div>
