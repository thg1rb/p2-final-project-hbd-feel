<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { Application } from '$lib/type';
	import type { PageData } from './$types';
	import RequestTable from './RequestTable.svelte';

	export let data: PageData;
	const applications: Application[] = data.applications as Application[];
</script>

<div class="flex flex-col gap-7 p-10">
	<div class="flex flex-col gap-2">
		<p class="text-2xl font-bold">แดชบอร์ดเจ้าหน้าที่คณะ</p>
		<p class=" text-gray-400">
			จัดการรายละเอียดนิสิตดีเด่นในภาควิชา, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ
		</p>
	</div>
	<div class="flex gap-4">
		<div class="flex flex-1 items-center justify-between rounded-xl bg-white p-5 shadow-sm">
			<div class="flex flex-col gap-2">
				<p>คำขอทั้งหมด</p>
				<p class="text-2xl font-bold">15</p>
			</div>
			<div class="rounded-xl bg-blue-500 p-3">
				<Icon name="book" class="stroke-white"></Icon>
			</div>
		</div>
		<div class="flex flex-1 items-center justify-between rounded-xl bg-white p-5 shadow-sm">
			<div class="flex flex-col gap-2">
				<p>นิสิตที่รอการอนุมัติ</p>
				<p class="text-2xl font-bold">10</p>
			</div>
			<div class="rounded-xl bg-gray-400 p-3">
				<Icon name="loading" class="stroke-white"></Icon>
			</div>
		</div>
		<div class="flex flex-1 items-center justify-between rounded-xl bg-white p-5 shadow-sm">
			<div class="flex flex-col gap-2">
				<p>นิสิตที่ไม่ได้รับการอนุมัติ</p>
				<p class="text-2xl font-bold">5</p>
			</div>
			<div class="rounded-xl bg-red-400 p-3">
				<Icon name="X" class="stroke-white"></Icon>
			</div>
		</div>
		<div class="flex flex-1 items-center justify-between rounded-xl bg-white p-5 shadow-sm">
			<div class="flex flex-col gap-2">
				<p>นิสิตที่ได้รับการอนุมัติแล้ว</p>
				<p class="text-2xl font-bold">15</p>
			</div>
			<div class="rounded-xl bg-primary p-3">
				<Icon name="userCheck" class="stroke-white"></Icon>
			</div>
		</div>
	</div>
	<RequestTable {applications} />
</div>
