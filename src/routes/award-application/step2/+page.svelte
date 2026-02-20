<script lang="ts">
	import { onMount } from "svelte";
	import { awards, type Award } from "$lib/data/awardApplication";

	let award: Award | null = null;
	let selectedFiles: File[] = [];
	let requirementFiles: Record<string, File | null> = {};

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
		if (input.files) {
			selectedFiles = Array.from(input.files);
		}
	}

	function handleRequirementFileChange(event: Event, reqId: string) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			requirementFiles[reqId] = input.files[0];
		}
	}

	function goToStep3() {
		const params = new URLSearchParams(window.location.search);
		const awardId = params.get("award_id");

		window.location.href = `/award-application/step3?award_id=${awardId}`;
	}
</script>

<form method="POST" enctype="multipart/form-data">
	<div class="space-y-8">

		<!-- Upload หลัก -->
		<div>
			<p class="block text-sm font-medium text-gray-700 mb-2">
				อัปโหลดไฟล์สมัคร
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
					รองรับ PDF, รูปภาพ, Word (สูงสุด 10MB ต่อไฟล์)
				</p>

				<input
					id="documents"
					type="file"
					name="documents[]"
					multiple
					class="hidden"
					on:change={handleMainFileChange}
				/>
			</label>

			{#if selectedFiles.length}
				<ul class="mt-3 text-sm text-gray-600 space-y-1">
					{#each selectedFiles as file}
						<li>{file.name}</li>
					{/each}
				</ul>
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
						รองรับ PDF, รูปภาพ, Word (สูงสุด 10MB ต่อไฟล์)
					</p>

					<input
						id={"requirement_" + req.id}
						type="file"
						name={"requirement_" + req.id}
						required={req.required}
						class="hidden"
						on:change={(e) => handleRequirementFileChange(e, req.id)}
					/>
				</label>

				{#if requirementFiles[req.id]}
					<p class="text-sm text-emerald-600 mt-2">
						✓ เลือกไฟล์แล้ว: {requirementFiles[req.id]?.name}
					</p>
				{/if}
			</div>
		{/each}
	</div>
{/if}

	</div>

	<!-- Buttons -->
	<div class="mt-10 flex justify-between">
		<a
			href="/award-application/step1"
			class="px-6 py-2 border rounded-lg"
		>
			&lt; ย้อนกลับ
		</a>

		<button
			type="submit"
            on:click={goToStep3}
			name="action"
			value="next"
			class="px-6 py-2 bg-emerald-600 text-white rounded-lg"
		>
			ถัดไป &gt;
		</button>
	</div>
</form>