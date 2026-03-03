<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import ApprovalStats from '$lib/components/ApprovalStats.svelte';
	import RequestTable from '$lib/components/application/RequestTable.svelte';
	import ApplicationHeader from '$lib/components/application/ApplicationHeader.svelte';
	import type { Application } from '$lib/type';
	import type { PageData } from './$types';
	import { ApprovalRole, UserRole } from '$lib/enums';

	const statusOptions = {
		pending: 'PENDING',
		approved: 'APPROVED',
		rejected: 'REJECTED'
	};

	let { data }: { data: PageData } = $props();

	const info = $derived.by(() => {
		let desc: string = '';
		let currentLevel: number = 0;
		switch (data.user.role) {
			case UserRole.DEPT_HEAD:
				desc = 'จัดการรายละเอียดนิสิตดีเด่นในภาควิชา, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ';
				currentLevel = 1;
				break;
			case UserRole.ASSO_DEAN:
				desc = 'จัดการรายละเอียดนิสิตดีเด่นภายในคณะ, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ';
				currentLevel = 2;
				break;
			case UserRole.DEAN:
				desc = 'จัดการรายละเอียดนิสิตดีเด่นภายในคณะ, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ';
				currentLevel = 3;
				break;
			case UserRole.ADMIN:
				desc = 'จัดการรายละเอียดนิสิตดีเด่น, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ';
				currentLevel = 4;
				break;
			case UserRole.BOARD:
				desc = 'จัดการรายละเอียดนิสิตดีเด่น, ดูสถานะ และพิจารณาเห็นชอบหรือไม่เห็นชอบ';
				currentLevel = 5;
				break;
		}
		return { desc, currentLevel };
	});
</script>

<div class="flex flex-col gap-7 p-10">
	<ApplicationHeader role={data.user.role} desc={info.desc} />
	<ApprovalStats stats={data.stats} />
	<RequestTable
		user={data.user}
		applications={data.applications as Application[]}
		currentLevel={info.currentLevel}
		{statusOptions}
		searchQuery={data.search || ''}
		statusFilter={data.status || ''}
		currentPage={data.currentPage || 1}
		totalPages={data.totalPages || 1}
	/>
</div>
