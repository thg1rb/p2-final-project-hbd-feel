<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import RequestTable from '$lib/components/RequestTable.svelte';
	import ApprovalStats from '$lib/components/ApprovalStats.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statusOptions = {
    pending: "PENDING",
    approved: "APPROVED",
    rejected: "REJECTED",
  }
</script>

<div class="flex flex-col gap-7 p-10">
	<div class="flex flex-col gap-2">
		<p class="text-2xl font-bold">แดชบอร์ดรองคณบดี</p>
		<p class=" text-gray-400">
			จัดการรายละเอียดนิสิตดีเด่นภายในคณะ, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ
		</p>
	</div>
	<ApprovalStats
	  stats={data.stats}
	/>
	<RequestTable
  	applications={data.applications as Application[]}
    currentLevel={3}
   	statusOptions={statusOptions}
  	searchQuery={data.search || ''}
  	statusFilter={data.status || ''}
  	currentPage={data.currentPage || 1}
  	totalPages={data.totalPages || 1}
	/>
</div>
