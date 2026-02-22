<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '$lib/components/Icon.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from '../$types';
	import { toastStack } from '$lib/stores/toast.svelte';

	let { form = null }: { form: ActionData } = $props();

	let isSubmitting = $state(false);

	const handleSubmit: SubmitFunction = ({ formData, cancel }) => {
		const status = formData.get('status') || 'ดำเนินการ';
		console.log(status);
		const message =
			status === 'approved'
				? 'ยืนยันการ "เห็นชอบ" ใช่หรือไม่? \n(หากเห็นชอบไปแล้วจะไม่สามารถย้อนกลับได้อีก)'
				: 'ยืนยันการ "ไม่เห็นชอบ" ใช่หรือไม่? \n(หากไม่เห็นชอบไปแล้วจะไม่สามารถย้อนกลับได้อีกและใบคำร้องนี้จะยุติทันที)';

		if (!window.confirm(message)) {
			return cancel();
		}
		isSubmitting = true;
		return async ({ update, result }) => {
			await update();
			isSubmitting = false;

			if (result.type === 'success') {
				if (result.data != undefined && result.data['success']) {
					if (status === 'approved') {
						toastStack.add('อนุมัติสำเร็จ', 'success');
					} else {
						toastStack.add('ไม่อนุมัติสำเร็จ', 'success');
					}
				} else {
					toastStack.add('เกิดข้อผิดพลาด', 'error');
				}
				console.log('ข้อมูลจากเซิร์ฟเวอร์:', result.data);
			}
		};
	};
</script>

<form method="POST" action="" use:enhance={handleSubmit}>
	<div class="flex flex-col rounded-xl border border-gray-300 bg-white shadow-sm">
		<div class="flex flex-col gap-1 border-b border-gray-300 p-5">
			<p class="font-bold">พิจารณาคำขอ</p>
			<p class="text-sm text-gray-400">กรุณาพิจารณาและให้ความเห็นชอบหรือไม่เห็นชอบคำขอนี้</p>
		</div>
		<div class="px-5 py-6">
			<p>ความเห็นของหัวหน้าภาควิชา</p>
			<textarea
				rows="5"
				name="reason"
				placeholder="ระบุความเห็นเพิ่มเติม (ถ้ามี)"
				class="mt-4 w-full rounded-xl border border-gray-400 bg-background text-sm"
			></textarea>
			<div class="mt-5 flex gap-3">
				<button
					type="submit"
					name="status"
					value="approved"
					disabled={isSubmitting}
					class="button-effect flex flex-1 items-center justify-center gap-3 rounded-xl bg-primary p-3 text-white"
				>
					<Icon name="check" class="stroke-white" />
					<p>เห็นชอบ</p>
				</button>
				<button
					type="submit"
					name="status"
					value="rejected"
					disabled={isSubmitting}
					class="button-effect flex flex-1 items-center justify-center gap-3 rounded-xl bg-red-500 p-3 text-white"
				>
					<Icon name="X" class="stroke-white" />
					<p>ไม่เห็นชอบ</p>
				</button>
			</div>
		</div>
	</div>
</form>
