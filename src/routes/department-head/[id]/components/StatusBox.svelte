<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { ApprovalStatus } from '$lib/enums';
	export let status: ApprovalStatus;
	export let role: string;
	export let name: string = '';
	export let time: string = '';
	export let agree: boolean = false;
	export let reason: string = '';
	export let last: boolean = false;

	$: borderColor =
		status === ApprovalStatus.NOT_STARTED
			? 'border-gray-200'
			: status === ApprovalStatus.PENDING
				? 'border-amber-500'
				: 'border-primary';
</script>

<div class="flex h-fit gap-4">
	<div class="justify-cente flex w-fit flex-col items-center">
		<div class="flex items-center justify-center rounded-full border-2 {borderColor}">
			<div class="m-2 flex h-5 w-5 items-center justify-center rounded-full border-2 {borderColor}">
				{#if status === ApprovalStatus.NOT_STARTED}
					<Icon name="circle" class="fil-gray-200 stroke-0" size={10} />
				{:else if status === ApprovalStatus.PENDING}
					<Icon name="loading" class="stroke-amber-500" size={10} />
				{:else}
					<Icon name="check" class="stroke-primary" size={10} />
				{/if}
			</div>
		</div>
		{#if last}
			<div></div>
		{:else}
			<div class="h-full w-0.5 bg-gray-300"></div>
		{/if}
	</div>
	<div class="flex flex-col gap-1 pb-10">
		<p class="font-medium">{role}</p>
		{#if status === ApprovalStatus.NOT_STARTED}
			<p class="text-sm text-gray-400">ยังไม่ถึงขั้นตอนนี้</p>
		{:else if status === ApprovalStatus.PENDING}
			<p class="text-sm text-amber-400">รอดำเนินการ</p>
		{:else}
			<p class="text-sm text-gray-400">{name} - {time}</p>
			<div class="rounded-xl bg-gray-100 p-3">
				{#if agree}
					<p class="text-sm text-gray-700">เห็นชอบ มีคุณสมบัติเหมาะสม</p>
				{:else}
					<p class="text-sm text-red-400">ไม่เห็นชอบ: {reason || 'ไม่ระบุเหตุผล'}</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
