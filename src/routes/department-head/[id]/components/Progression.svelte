<script>
	import Icon from '$lib/components/Icon.svelte';
	import { ApprovalRole, ApprovalStatus } from '$lib/enums';
	import StatusBox from './StatusBox.svelte';
</script>

<div class="flex flex-1 flex-col gap-6 rounded-xl border border-gray-300 bg-white p-5 shadow-sm">
	<div class="flex gap-3 font-bold">
		<Icon name="user" class="stroke-primary" />
		<p>สถานะการพิจารณา</p>
	</div>
	<div class="flex flex-col">
		<StatusBox
			status={ApprovalStatus.APPROVED}
			role={ApprovalRole.HEAD_OF_DEPT}
			agree={true}
			name={'ผศ.ดร.วิชัย รักเรียน'}
			time={'16 ธันวาคม 2568'}
			reason={'มีคุณสมบัติเหมาะสม'}
		/>
		<StatusBox status={ApprovalStatus.PENDING} role={ApprovalRole.VICE_DEAN} />
		<StatusBox status={ApprovalStatus.NOT_STARTED} role={ApprovalRole.DEAN} />
		<StatusBox status={ApprovalStatus.NOT_STARTED} role={ApprovalRole.STUDENT_AFFAIRS} />
		<StatusBox status={ApprovalStatus.NOT_STARTED} role={ApprovalRole.COMMITTEE} />
		<StatusBox status={ApprovalStatus.NOT_STARTED} role={ApprovalRole.COMMITTEE_CHAIR} />
		<StatusBox
			status={ApprovalStatus.NOT_STARTED}
			role={ApprovalRole.PRESIDENT_PROPOSAL}
			last={true}
		/>
	</div>
</div>
