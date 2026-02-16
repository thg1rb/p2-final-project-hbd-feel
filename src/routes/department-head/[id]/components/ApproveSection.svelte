<script>
	import Icon from '$lib/components/Icon.svelte';
</script>

<div class="flex flex-col rounded-xl border border-gray-300 bg-white shadow-sm">
	<div class="flex flex-col gap-1 border-b border-gray-300 p-5">
		<p class="font-bold">พิจารณาคำขอ</p>
		<p class="text-sm text-gray-400">กรุณาพิจารณาและให้ความเห็นชอบหรือไม่เห็นชอบคำขอนี้</p>
	</div>
	<div class="px-5 py-6">
		<p>ความเห็นของหัวหน้าภาควิชา</p>
		<textarea
			rows="5"
			name=""
			id=""
			placeholder="ระบุความเห็นเพิ่มเติม (ถ้ามี)"
			class="mt-4 w-full rounded-xl border border-gray-400 bg-background text-sm"
		></textarea>
		<div class="mt-5 flex gap-3">
			<button
				class="button-effect flex flex-1 items-center justify-center gap-3 rounded-xl bg-primary p-3 text-white"
			>
				<Icon name="check" class="stroke-white" />
				<p>เห็นชอบ</p>
			</button>
			<button
				class="button-effect flex flex-1 items-center justify-center gap-3 rounded-xl bg-red-500 p-3 text-white"
			>
				<Icon name="X" class="stroke-white" />
				<p>ไม่เห็นชอบ</p>
			</button>
		</div>
	</div>
</div>
