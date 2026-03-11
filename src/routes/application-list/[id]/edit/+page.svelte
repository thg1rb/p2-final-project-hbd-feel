<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { formatThaiDate } from '$lib/utils/dateFormatter';
	import { UserRole } from '$lib/enums.js';
	import Icon from '$lib/components/Icon.svelte';

	const { data, form }: PageProps = $props();

	const application = $derived(data.application);
	const award = $derived(data.award);
	const requirements = $derived(data.award?.requirements ?? []);
	const isEditable = $derived(data.isEditable);

	let selectedFile = $state<File | null>(null);
	let requirementFiles = $state<Record<string, File | null>>({});
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	let year = $state(application?.year?.toString() ?? '');
	let grade = $state(application?.grade?.toString() ?? '');

	const existingDocsMap = $derived.by(() => {
		const docs = application?.documents;
		if (!docs) return {};

		if (Array.isArray(docs)) {
			return docs.reduce(
				(acc, doc) => {
					const key = doc.requirement_id || doc.id;
					acc[key] = doc;
					return acc;
				},
				{} as Record<string, any>
			);
		}
		return docs as Record<string, any>;
	});

	function handleMainFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.[0]) return;

		const file = input.files[0];
		const maxSize = 10 * 1024 * 1024;

		if (file.type !== 'application/pdf') {
			errors = { ...errors, main: 'อนุญาตเฉพาะไฟล์ PDF เท่านั้น' };
			selectedFile = null;
			return;
		}

		if (file.size > maxSize) {
			errors = { ...errors, main: 'ขนาดไฟล์ต้องไม่เกิน 10MB' };
			selectedFile = null;
			return;
		}

		errors = { ...errors, main: '' };
		selectedFile = file;
	}

	function handleRequirementFileChange(event: Event, reqId: string) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.[0]) return;

		const file = input.files[0];
		const maxSize = 10 * 1024 * 1024;

		if (file.type !== 'application/pdf') {
			errors = { ...errors, [reqId]: 'อนุญาตเฉพาะไฟล์ PDF เท่านั้น' };
			requirementFiles = { ...requirementFiles, [reqId]: null };
			return;
		}

		if (file.size > maxSize) {
			errors = { ...errors, [reqId]: 'ขนาดไฟล์ต้องไม่เกิน 10MB' };
			requirementFiles = { ...requirementFiles, [reqId]: null };
			return;
		}

		errors = { ...errors, [reqId]: '' };
		requirementFiles = { ...requirementFiles, [reqId]: file };
	}

	function handleSubmit({ cancel }: any) {
		isSubmitting = true;
		errors = {};

		if (!selectedFile && !application?.path) {
			errors = { ...errors, main: 'กรุณาอัปโหลดไฟล์สมัคร' };
		}

		if (award) {
			for (const req of award.requirements) {
				const hasNewFile = !!requirementFiles[req.id];
				const hasOldFile = !!existingDocsMap[req.id];

				if (req.required && !hasNewFile && !hasOldFile) {
					errors = { ...errors, [req.id]: `กรุณาอัปโหลดไฟล์ ${req.name}` };
				}
			}
		}

		if (!year) errors = { ...errors, year: 'กรุณากรอกปีการศึกษา' };
		if (!grade) errors = { ...errors, grade: 'กรุณากรอกเกรดเฉลี่ย' };

		if (Object.keys(errors).length > 0) {
			isSubmitting = false;
			cancel();
			return;
		}

		return async ({ update }: any) => {
			await update();
			isSubmitting = false;
		};
	}
</script>

{#if !application || !award}
	<div class="flex h-screen w-full flex-col items-center justify-center gap-5">
		<p class="text-2xl">ไม่พบข้อมูลใบสมัครนี้</p>
		<button
			type="button"
			class="button-effect mb-10 flex gap-2 rounded-xl border p-3"
			onclick={() => history.back()}
		>
			<Icon name="arrow-left" />
			<p>กลับหน้าก่อนหน้า</p>
		</button>
	</div>
{:else if !data.isOwnApplication && data.user.role === UserRole.NISIT}
	<div class="flex h-screen w-full flex-col items-center justify-center gap-5">
		<p class="text-2xl">คุณไม่มีสิทธิเข้าถึงใบสมัครนี้</p>
		<button
			type="button"
			class="button-effect mb-10 flex gap-2 rounded-xl border p-3"
			onclick={() => history.back()}
		>
			<Icon name="arrow-left" />
			<p>กลับหน้าก่อนหน้า</p>
		</button>
	</div>
{:else if !isEditable}
	<div class="flex h-screen w-full flex-col items-center justify-center gap-5">
		<div class="mx-4 max-w-lg p-6 rounded-xl border border-red-400 bg-red-50">
			<h2 class="text-xl font-semibold text-red-800 mb-2">ไม่สามารถแก้ไขใบสมัครนี้</h2>
			<p class="text-red-600 mb-4">ใบสมัครนี้ไม่สามารถแก้ไขได้เนื่องจาก:</p>
			<ul class="list-disc list-inside text-sm text-red-700 space-y-1">
				<li>หมดระยะเวลาที่อนุญาตให้แก้ไข</li>
			</ul>
			<button
				type="button"
				class="mt-4 px-6 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-all"
				onclick={() => history.back()}
			>
				<Icon name="arrow-left" />
				<p>กลับหน้าก่อนหน้า</p>
			</button>
		</div>
	</div>
{:else}
	<div class="bg-background p-10">
		<button type="button" class="button-effect mb-10 flex gap-2" onclick={() => history.back()}>
			<Icon name="arrow-left" />
			<p>กลับหน้าก่อนหน้า</p>
		</button>

		{#if form?.message}
			<div class="mb-6 rounded-xl border border-red-400 bg-red-50 p-4">
				<h3 class="text-lg font-semibold text-red-800 mb-2">เกิดข้อผิดพลาด</h3>
				<p class="text-red-700">{form.message}</p>
			</div>
		{/if}

		<form method="POST" enctype="multipart/form-data" use:enhance={handleSubmit}>
			<input type="hidden" name="award_id" value={award?.id} />

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						ชั้นปีที่กำลังศึกษา <span class="text-red-500">*</span>
					</label>
					<input
						type="number"
						name="year"
						min="1"
						max="12"
						bind:value={year}
						placeholder="เช่น 1"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
					/>
					{#if errors.year}
						<p class="text-sm text-red-500 mt-2">{errors.year}</p>
					{/if}
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						เกรดเฉลี่ย <span class="text-red-500">*</span>
					</label>
					<input
						type="number"
						step="0.01"
						min="0"
						max="4"
						name="grade"
						bind:value={grade}
						placeholder="เช่น 3.58"
						class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
					/>
					{#if errors.grade}
						<p class="text-sm text-red-500 mt-2">{errors.grade}</p>
					{/if}
				</div>
			</div>

			<div class="space-y-8">
				<div>
					<p class="block text-sm font-medium text-gray-700 mb-2">
						อัปโหลดไฟล์สมัคร
						{#if application?.path}
							<span class="text-emerald-600 ml-2"
								>(มีไฟล์เดิม: {application.path?.split('/').pop()})</span
							>
						{:else}
							<span class="text-gray-500 ml-2">(ไม่มีไฟล์)</span>
						{/if}
					</p>
					<label
						for="main_document"
						class="flex flex-col items-center justify-center gap-2 w-full h-48 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:border-emerald-500 hover:bg-emerald-50 transition"
					>
						<p class="text-sm font-medium">คลิกเพื่ออัปโหลดไฟล์</p>
						<p class="text-xs text-gray-500">รองรับเฉพาะไฟล์ PDF (สูงสุด 10MB ต่อไฟล์)</p>
						<input
							id="main_document"
							type="file"
							name="path"
							accept="application/pdf"
							class="hidden"
							onchange={handleMainFileChange}
						/>
					</label>
					{#if selectedFile}
						<p class="text-sm text-emerald-600 mt-2">ไฟล์ที่เลือกใหม่: {selectedFile.name}</p>
					{/if}
					{#if errors['main']}
						<p class="text-sm text-red-500 mt-2">{errors['main']}</p>
					{/if}
				</div>

				{#if award}
					{#each award.requirements as req (req.id)}
						<div>
							<p class="block text-sm font-medium text-gray-700 mb-2">
								{req.name}
								{#if req.required}
									<span class="text-red-500">*</span>
								{/if}
								{#if existingDocsMap[req.id]}
									<span class="text-emerald-600 ml-2"
										>(มีไฟล์เดิม: {existingDocsMap[req.id]?.file_path?.split('/').pop()})</span
									>
								{:else}
									<span class="text-gray-500 ml-2">(ไม่มีไฟล์)</span>
								{/if}
							</p>
							<label
								for={'requirement_' + req.id}
								class="flex flex-col items-center justify-center gap-2 w-full h-48 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:border-emerald-500 hover:bg-emerald-50 transition"
							>
								<p class="text-sm font-medium">คลิกเพื่ออัปโหลดไฟล์</p>
								<p class="text-xs text-gray-500">รองรับเฉพาะไฟล์ PDF (สูงสุด 10MB ต่อไฟล์)</p>
								<input
									id={'requirement_' + req.id}
									type="file"
									name={'documents[' + req.id + ']'}
									accept="application/pdf"
									class="hidden"
									onchange={(e) => handleRequirementFileChange(e, req.id)}
								/>
							</label>
							{#if requirementFiles[req.id]}
								<p class="text-sm text-emerald-600 mt-2">
									ไฟล์ที่เลือกใหม่: {requirementFiles[req.id]?.name}
								</p>
							{/if}
							{#if errors[req.id]}
								<p class="text-sm text-red-500 mt-2">{errors[req.id]}</p>
							{/if}
						</div>
					{/each}
				{/if}
			</div>

			<div class="mt-10 flex justify-between">
				<button
					type="submit"
					disabled={isSubmitting}
					class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed"
				>
					{isSubmitting ? 'กำลังส่ง...' : 'บันทึกการแก้ไข'}
				</button>
			</div>
		</form>
	</div>
{/if}
