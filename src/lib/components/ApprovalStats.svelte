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

<div class="flex gap-4">
	<div class="flex flex-1 items-center justify-between rounded-xl bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-2">
			<p>คำขอทั้งหมด</p>
			<p class="text-2xl font-bold">{stats?.total || 0}</p>
		</div>
		<div class="rounded-xl bg-blue-500 p-3">
			<Icon name="book" class="stroke-white"></Icon>
		</div>
	</div>
	<div class="flex flex-1 items-center justify-between rounded-xl bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-2">
			<p>นิสิตที่รอการอนุมัติ</p>
			<p class="text-2xl font-bold">{stats?.pending || 0}</p>
		</div>
		<div class="rounded-xl bg-gray-400 p-3">
			<Icon name="loading" class="stroke-white"></Icon>
		</div>
	</div>
	<div class="flex flex-1 items-center justify-between rounded-xl bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-2">
			<p>นิสิตที่ไม่ได้รับการอนุมัติ</p>
			<p class="text-2xl font-bold">{stats?.rejected || 0}</p>
		</div>
		<div class="rounded-xl bg-red-400 p-3">
			<Icon name="X" class="stroke-white"></Icon>
		</div>
	</div>
	<div class="flex flex-1 items-center justify-between rounded-xl bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-2">
			<p>นิสิตที่ได้รับการอนุมัติแล้ว</p>
			<p class="text-2xl font-bold">{stats?.approved || 0}</p>
		</div>
		<div class="rounded-xl bg-primary p-3">
			<Icon name="userCheck" class="stroke-white"></Icon>
		</div>
	</div>
</div>
