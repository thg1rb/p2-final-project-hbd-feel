<script lang="ts">
	import { PUBLIC_BROWSER_API_BASE_URL } from '$env/static/public';
  const { data } = $props();

	const awards = $derived(data.awards);

  let selectedYear = $state(String(data.selectedYear ?? '2567'));
  let selectedSemester = $state(String(data.selectedSemester ?? '1'));
  let selectedCampus = $state(String(data.selectedCampus ?? 'BANGKHEN'));

	const years = $derived(data.awards.years ?? []);
	const semesters = $derived(data.awards.semesters ?? []);

	$effect(() => {
		if (years.length && !years.includes(Number(selectedYear))) {
			selectedYear = String(years[0]);
		}
	});

  const categories = $derived(awards.categories ?? []);
  const pdfPath = $derived(awards.pdf_path ?? null);

  const downloadUrl = $derived(
    pdfPath 
      ? `/api/get-image?path=${encodeURIComponent(pdfPath)}` 
      : '#'
  );
</script>
<div class="bg-[#f3f4f6] min-h-screen">

  <div class="flex flex-col items-center p-8 gap-8">

    <div class="flex flex-col items-center gap-4">

      <h1 class="text-3xl font-bold">
        รางวัลนิสิตดีเด่น
      </h1>
      <div class="flex gap-6 items-end">

        <div class="flex flex-col items-start">
          <label class="text-sm text-gray-500">
            ปีการศึกษา
          </label>

          <select
            class="border border-gray-300 rounded-md px-3 py-2 pr-10"
            bind:value={selectedYear}
            on:change={() => {
              window.location.search =
                `?campus=${selectedCampus}&year=${selectedYear}&semester=${selectedSemester}`;
            }}
          >
            {#each years as year}
              <option value={String(year)}>
                ปีการศึกษา {year}
              </option>
            {/each}
          </select>
        </div>

        <div class="flex flex-col items-start">
          <label class="text-sm text-gray-500">
            ภาคการศึกษา
          </label>

          <select
            class="border border-gray-300 rounded-md px-3 py-2 pr-10"
            bind:value={selectedSemester}
            on:change={() => {
              window.location.search =
                `?campus=${selectedCampus}&year=${selectedYear}&semester=${selectedSemester}`;
            }}
          >
            {#each semesters as semester}
              <option value={String(semester)}>
                ภาคเรียน {semester}
              </option>
            {/each}
          </select>
        </div>

        <div class="flex flex-col items-start">
          <label class="text-sm text-gray-500">
            วิทยาเขต
          </label>

          <select
            class="border border-gray-300 rounded-md px-3 py-2 pr-10"
            bind:value={selectedCampus}
            on:change={() => {
              window.location.search =
                `?campus=${selectedCampus}&year=${selectedYear}&semester=${selectedSemester}`;
            }}
          >
            <option value="BANGKHEN">บางเขน</option>
            <option value="KAMPHANGSAEN">กำแพงแสน</option>
            <option value="SRIRACHA">ศรีราชา</option>
            <option value="SAKONNAKHON">สกลนคร</option>
            <option value="SUPHANBURI">สุพรรณบุรี</option>
          </select>
        </div>
        <div class="flex flex-col items-start">
          <label class="text-sm text-transparent">.</label>

          {#if pdfPath}
          <a
      href={downloadUrl}
      target="_blank"
      class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition font-medium"
      download="รายชื่อนิสิตได้รับรางวัล.pdf"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
      </svg>

      ดาวน์โหลดรายชื่อ
    </a>
          {/if}

        </div>

        </div>
</div>


    <div class="w-2/3 grid gap-6">

  {#if categories.length > 0}

    {#each categories as category}

      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        <h2 class="text-lg font-semibold mb-4 text-gray-800">
          {category.name}
        </h2>

        <div>

          {#each category.students as student, i}

            <div class="py-4 border-t border-gray-200 first:border-t-0 hover:bg-gray-50 transition">

              <p class="font-medium text-gray-900">
                {i + 1}. {student.name}
              </p>

              <p class="text-sm text-gray-500 mt-1">
                {student.faculty}
              </p>

            </div>

          {/each}

        </div>

      </div>

    {/each}

  {:else}

    <div class="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
      ไม่พบรายการรางวัลสำหรับปีการศึกษานี้
    </div>

  {/if}

</div>

  </div>

</div>