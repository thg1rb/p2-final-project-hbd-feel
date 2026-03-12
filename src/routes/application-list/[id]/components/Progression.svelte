<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { ApprovalRole, ApprovalStatus, roleMapApprovalRole } from '$lib/enums';
	import type { Approval } from '$lib/type';
	import { formatThaiDate } from '$lib/utils/dateFormatter';
	import StatusBox from './StatusBox.svelte';

	interface Props {
		approvals: Approval[];
		isClosed: boolean;
	}

	const { approvals, isClosed }: Props = $props();

	const workflowOrder = [
		ApprovalRole.DEPT_HEAD,
		ApprovalRole.ASSO_DEAN,
		ApprovalRole.DEAN,
		ApprovalRole.NISIT_DEV,
		ApprovalRole.BOARD,
		ApprovalRole.CHANCELLOR
	];

	const getApprovalData = (role: ApprovalRole): Approval | null => {
		const approval = approvals.find((a) => roleMapApprovalRole[a.user.role] === role);
		if (approval === undefined) {
			return null;
		}
		return approval;
	};

	const displayWorkflows = $derived.by(() => {
		let hasRejected = false;

		return workflowOrder.map((role, i) => {
			const approval = getApprovalData(role);
			const isLast = i === workflowOrder.length - 1;

			if (hasRejected) {
				return { role, status: ApprovalStatus.NOT_STARTED, isLast };
			}

			if (approval !== null) {
				const isApproved = approval.status === 'APPROVED';

				if (!isApproved) hasRejected = true;

				return {
					role,
					status: isApproved ? ApprovalStatus.APPROVED : ApprovalStatus.REJECT,
					isLast,
					props: {
						agree: isApproved,
						name: `${approval.user.firstName} ${approval.user.lastName}`,
						time: formatThaiDate(approval.created_at),
						reason: approval.reason
					}
				};
			}

			return {
				role,
				status: i === approvals.length ? ApprovalStatus.PENDING : ApprovalStatus.NOT_STARTED,
				isLast
			};
		});
	});
</script>

<div class="flex flex-1 flex-col gap-6 max-h-fit rounded-xl border border-gray-300 bg-white p-5 shadow-sm">
	<div class="flex gap-3 font-bold">
		<Icon name="user" class="stroke-primary" />
		<p>สถานะการพิจารณา</p>
	</div>
	<div class="flex flex-col">
		{#each displayWorkflows as item}
			<StatusBox status={item.status} role={item.role} last={item.isLast} isClosed={isClosed} {...item.props} />
		{/each}
	</div>
</div>
