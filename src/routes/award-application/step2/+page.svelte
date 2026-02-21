<script lang="ts">
	import { onMount } from "svelte";
	import { awards, type Award } from "$lib/data/awardApplication";
	import { enhance } from '$app/forms';
	let award: Award | null = null;
	let selectedFile: File | null = null;
	let requirementFiles: Record<string, File | null> = {};
	let errors: Record<string, string> = {};
	let isSubmitting = false;

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const awardId = Number(params.get("award_id"));

		award = awards.find(a => a.id === awardId) ?? null;

		if (award) {
			award.requirements.forEach(req => {
				requirementFiles[req.id] = null;
			});
		}
	});

	function handleMainFileChange(event: Event) {
		const input = event.target as HTMLInputElement;

		if (input.files && input.files[0]) {
			const file = input.files[0];

			const maxSize = 10 * 1024 * 1024;

			if (file.type !== "application/pdf") {
				errors["main"] = "อนุญาตเฉพาะไฟล์ PDF เท่านั้น";
				selectedFile = null;
				return;
			}

			if (file.size > maxSize) {
				errors["main"] = "ขนาดไฟล์ต้องไม่เกิน 10MB";
				selectedFile = null;
				return;
			}

			errors["main"] = "";
			selectedFile = file;
		}
	}

	function handleRequirementFileChange(event: Event, reqId: string) {
		const input = event.target as HTMLInputElement;

		if (input.files && input.files[0]) {
			const file = input.files[0];
			const maxSize = 10 * 1024 * 1024;

			if (file.type !== "application/pdf") {
				errors[reqId] = "อนุญาตเฉพาะไฟล์ PDF เท่านั้น";
				requirementFiles[reqId] = null;
				return;
			}

			if (file.size > maxSize) {
				errors[reqId] = "ขนาดไฟล์ต้องไม่เกิน 10MB";
				requirementFiles[reqId] = null;
				return;
			}

			errors[reqId] = "";
			requirementFiles[reqId] = file;
		}
	}
	function handleSubmit() {
		isSubmitting = true;

		return async ({ update }) => {
			await update();
			isSubmitting = false;
		};
	}
</script>

<form
	method="POST"
	enctype="multipart/form-data"
	use:enhance={handleSubmit}
>
	<input type="hidden" name="award_id" value={award?.id} />
	<input type="hidden" name="event_id" value="2" />
	<input type="hidden" name="year" value="2025" />
	<input type="hidden" name="grade" value="3.58" />
	<div class="space-y-8">

		<div>
			<p class="block text-sm font-medium text-gray-700 mb-2">
				อัปโหลดไฟล์สมัคร <span class="text-red-500">*</span>
			</p>

			<label
				for="documents"
				class="flex flex-col items-center justify-center gap-2
					   w-full h-48 cursor-pointer
					   rounded-xl border-2 border-dashed border-gray-300
					   bg-gray-50 text-gray-600
					   hover:border-emerald-500 hover:bg-emerald-50
					   transition"
			>
				<p class="text-sm font-medium">
					คลิกเพื่ออัปโหลดไฟล์
				</p>

				<p class="text-xs text-gray-500">
					รองรับเฉพาะไฟล์ PDF (สูงสุด 10MB ต่อไฟล์)
				</p>

				<input
					id="documents"
					type="file"
					name="path"
					accept="application/pdf"
					class="hidden"
					required
					on:change={handleMainFileChange}
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

{#if award}
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
					class="flex flex-col items-center justify-center gap-2
						   w-full h-40 cursor-pointer
						   rounded-xl border-2 border-dashed border-gray-300
						   bg-gray-50 text-gray-600
						   hover:border-emerald-500 hover:bg-emerald-50
						   transition"
				>
					<p class="text-sm font-medium">
						คลิกเพื่ออัปโหลดไฟล์
					</p>

					<p class="text-xs text-gray-500">
						รองรับเฉพาะไฟล์ PDF (สูงสุด 10MB ต่อไฟล์)
					</p>

					<input
						id={"requirement_" + req.id}
						type="file"
						name={"documents[" + req.id + "]"}
						accept="application/pdf"
						class="hidden"
						on:change={(e) => handleRequirementFileChange(e, req.id)}
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
		<a
			href="/award-application/step1"
			class="px-6 py-2 border rounded-lg"
		>
			&lt; ย้อนกลับ
		</a>

		<button
			type="submit"
			disabled={isSubmitting}
			class="px-6 py-2 bg-emerald-600 text-white rounded-lg
			disabled:bg-emerald-300 disabled:cursor-not-allowed"
		>
			{isSubmitting ? 'กำลังส่ง...' : 'ส่งใบสมัคร'}
		</button>
	</div>
</form>