<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { PUBLIC_BROWSER_API_BASE_URL } from '$env/static/public';

	const { data }: PageProps = $props();

	const award = $derived(data.award);
	const requirements = $derived(data.award?.requirements ?? []);
	const pdfPath = $derived(data.award?.form_path);

	let selectedFile = $state<File | null>(null);
	let requirementFiles = $state<Record<string, File | null>>({});
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	let year = $state('');
	let grade = $state('');

	$effect(() => {
		if (requirements.length > 0) {
			const init: Record<string, File | null> = {};
			for (const req of requirements) {
				init[req.id] = null;
			}
			requirementFiles = init;
		}
	});

	function handleMainFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.[0]) return;

		const file = input.files[0];
		const maxSize = 10 * 1024 * 1024;

		if (file.type !== "application/pdf") {
			errors = { ...errors, main: "อนุญาตเฉพาะไฟล์ PDF เท่านั้น" };
			selectedFile = null;
			return;
		}

		if (file.size > maxSize) {
			errors = { ...errors, main: "ขนาดไฟล์ต้องไม่เกิน 10MB" };
			selectedFile = null;
			return;
		}

		errors = { ...errors, main: "" };
		selectedFile = file;
	}

	function handleRequirementFileChange(event: Event, reqId: string) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.[0]) return;

		const file = input.files[0];
		const maxSize = 10 * 1024 * 1024;

		if (file.type !== "application/pdf") {
			errors = { ...errors, [reqId]: "อนุญาตเฉพาะไฟล์ PDF เท่านั้น" };
			requirementFiles = { ...requirementFiles, [reqId]: null };
			return;
		}

		if (file.size > maxSize) {
			errors = { ...errors, [reqId]: "ขนาดไฟล์ต้องไม่เกิน 10MB" };
			requirementFiles = { ...requirementFiles, [reqId]: null };
			return;
		}

		errors = { ...errors, [reqId]: "" };
		requirementFiles = { ...requirementFiles, [reqId]: file };
	}

	function handleSubmit({ cancel }) {
		isSubmitting = true;
		errors = {};

		if (!selectedFile) {
			errors = { ...errors, main: "กรุณาอัปโหลดไฟล์สมัคร" };
		}

		if (award) {
			for (const req of award.requirements) {
				if (req.required && !requirementFiles[req.id]) {
					errors = {
						...errors,
						[req.id]: `กรุณาอัปโหลดไฟล์ ${req.name}`
					};
				}
			}
		}

		if (Object.keys(errors).length > 0) {
			isSubmitting = false;
			cancel();
			return;
		}
		if (!year) {
			errors = { ...errors, year: 'กรุณากรอกปีการศึกษา' };
		}

		if (!grade) {
			errors = { ...errors, grade: 'กรุณากรอกเกรดเฉลี่ย' };
		}
		return async ({ update }) => {
			await update();
			isSubmitting = false;
		};
	}
</script>

<form method="POST" enctype="multipart/form-data" use:enhance={handleSubmit}>
	<input type="hidden" name="award_id" value={award?.id} />

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
	<!-- ปีการศึกษา -->
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
			<p class="text-sm text-red-500 mt-2">
				{errors.year}
			</p>
		{/if}
	</div>

	<div>
		<label class="block text-sm font-medium text-gray-700 mb-2">
			เกรดเฉลี่ยสะสม <span class="text-red-500">*</span>
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
			<p class="text-sm text-red-500 mt-2">
				{errors.grade}
			</p>
		{/if}
	</div>
</div>
	<div class="space-y-8">
		<div>
			<div class="flex items-center justify-between mb-2">
				<p class="block text-sm font-medium text-gray-700">
					อัปโหลดไฟล์สมัคร <span class="text-red-500">*</span>
				</p>

				{#if pdfPath}
					<a
						href={`${PUBLIC_BROWSER_API_BASE_URL}/minio/download-pdf?path=${encodeURIComponent(pdfPath)}`}
						class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition font-medium"
						download
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
							/>
						</svg>

						ดาวน์โหลดใบสมัคร
					</a>
				{/if}
			</div>
			<label
				for="documents"
				class="flex flex-col items-center justify-center gap-2 w-full h-48 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:border-emerald-500 hover:bg-emerald-50 transition"
			>
				<p class="text-sm font-medium">คลิกเพื่ออัปโหลดไฟล์</p>
				<p class="text-xs text-gray-500">
					รองรับเฉพาะไฟล์ PDF (สูงสุด 10MB ต่อไฟล์)
				</p>

				<input
					id="documents"
					type="file"
					name="path"
					accept="application/pdf"
					class="hidden"
					onchange={handleMainFileChange}
				/>
			</label>

			{#if selectedFile}
				<p class="text-sm text-emerald-600 mt-2">
					{selectedFile.name}
				</p>
			{/if}

			{#if errors["main"]}
				<p class="text-sm text-red-500 mt-2">
					{errors["main"]}
				</p>
			{/if}
		</div>

		{#if award && award.requirements && award.requirements.length > 0}
			<div>
				<h3 class="text-lg font-semibold mb-4">
					เอกสารเพิ่มเติมสำหรับ {award.name}
				</h3>

				{#each award.requirements as req (req.id)}
					<div class="mb-8">
						<p class="block text-sm font-medium text-gray-700 mb-2">
							{req.name}
							{#if req.required}
								<span class="text-red-500">*</span>
							{/if}
						</p>

						<label
							for={"requirement_" + req.id}
							class="flex flex-col items-center justify-center gap-2 w-full h-40 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:border-emerald-500 hover:bg-emerald-50 transition"
						>
							<p class="text-sm font-medium">คลิกเพื่ออัปโหลดไฟล์</p>
							<p class="text-xs text-gray-500">
								รองรับเฉพาะไฟล์ PDF (สูงสุด 10MB ต่อไฟล์)
							</p>

							<input
								id={"requirement_" + req.id}
								type="file"
								name={"documents[" + req.id + "]"}
								accept="application/pdf"
								class="hidden"
								onchange={(e) =>
									handleRequirementFileChange(e, req.id)
								}
							/>
						</label>

						{#if requirementFiles[req.id]}
							<p class="text-sm text-emerald-600 mt-2">
								{requirementFiles[req.id]?.name}
							</p>
						{/if}

						{#if errors[req.id]}
							<p class="text-sm text-red-500 mt-2">
								{errors[req.id]}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="mt-10 flex justify-between">
		<a href="/award-application/step1" class="px-6 py-2 border rounded-lg">
			&lt; ย้อนกลับ
		</a>

		<button
			type="submit"
			disabled={isSubmitting}
			class="cursor-pointer px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed"
		>
			{isSubmitting ? "กำลังส่ง..." : "ส่งใบสมัคร"}
		</button>
	</div>
</form>