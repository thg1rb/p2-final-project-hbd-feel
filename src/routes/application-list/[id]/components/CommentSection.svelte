<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { Approval } from '$lib/type';
	interface Props {
		headDeptApproval: Approval;
	}

	const { headDeptApproval }: Props = $props();
</script>

<div class="flex flex-col gap-4 rounded-xl border border-gray-300 bg-white p-7 shadow-sm">
	<div class="flex gap-3 font-bold">
		<Icon name="comment" class="stroke-primary" />
		<p>ความคิดเห็นหัวหน้าภาควิชา</p>
	</div>
	<div class="rounded-2xl bg-gray-100 p-5">
		<p class="font-medium">{headDeptApproval.user.firstName} {headDeptApproval.user.lastName}</p>
		<p class="mt-2 text-sm text-gray-400">
			{headDeptApproval.reason}
		</p>
	</div>
</div>
