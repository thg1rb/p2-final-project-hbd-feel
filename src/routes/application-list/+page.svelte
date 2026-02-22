<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import ApprovalStats from '$lib/components/ApprovalStats.svelte';
	import RequestTable from '$lib/components/application/RequestTable.svelte';
	import ApplicationHeader from '$lib/components/application/ApplicationHeader.svelte';
	import type { Application } from '$lib/type';
	import type { PageData } from './$types';
	import { ApprovalRole } from '$lib/enums';

	// TODO: Use user from cookies instead
	let role = ApprovalRole.BOARD as ApprovalRole;

	let desc: string = '';
	let currentLevel: number = 0;
	switch (role) {
		case ApprovalRole.DEPT_HEAD:
			desc = 'จัดการรายละเอียดนิสิตดีเด่นในภาควิชา, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ';
			currentLevel = 1;
			break;
		case ApprovalRole.ASSO_DEAN:
			desc = 'จัดการรายละเอียดนิสิตดีเด่นภายในคณะ, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ';
			currentLevel = 2;
			break;
		case ApprovalRole.DEAN:
			desc = 'จัดการรายละเอียดนิสิตดีเด่นภายในคณะ, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ';
			currentLevel = 3;
			break;
		case ApprovalRole.ADMIN:
			desc = 'จัดการรายละเอียดนิสิตดีเด่น, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ';
			currentLevel = 4;
			break;
		case ApprovalRole.BOARD:
			desc = 'จัดการรายละเอียดนิสิตดีเด่น, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ';
			currentLevel = 5;
			break;
	}

	const statusOptions = {
		pending: 'PENDING',
		approved: 'APPROVED',
		rejected: 'REJECTED'
	};

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-7 p-10">
	<ApplicationHeader {role} {desc} />
	<ApprovalStats stats={data.stats} />
	<RequestTable
		applications={data.applications as Application[]}
		{currentLevel}
		{statusOptions}
		searchQuery={data.search || ''}
		statusFilter={data.status || ''}
		currentPage={data.currentPage || 1}
		totalPages={data.totalPages || 1}
	/>
</div>
