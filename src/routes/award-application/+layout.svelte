<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    const steps = [
        { id: 1, label: "เลือกประเภท", path: "/application/step-1" },
        { id: 2, label: "กรอกข้อมูล", path: "/application/step-2" },
        { id: 3, label: "ยืนยัน", path: "/application/step-3" }
    ];

    $: currentPath = $page.url.pathname;

    function getCurrentStep() {
        if (currentPath.includes("step1")) return 1;
        if (currentPath.includes("step2")) return 2;
        if (currentPath.includes("step3")) return 3;
        return 1;
    }

    $: step = getCurrentStep();

    function goDashboard() {
        goto("/application");
    }
</script>

<div class="max-w-5xl mx-auto px-6 pt-12 pb-8">
    <div class="bg-white rounded-xl shadow border border-gray-100 p-8">
        <button
            on:click={goDashboard}
            class="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-6"
        >
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                />
            </svg>
            กลับไปแดชบอร์ด
        </button>
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">
                สมัครนิสิตดีเด่น
            </h1>
            <p class="text-gray-500">
                ภาคเรียนที่ 2/2567
            </p>
        </div>
        <div class="flex items-center gap-6 mb-10">
            {#each steps as item, index}
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                        {step === item.id
                            ? 'bg-emerald-600 text-white'
                            : step > item.id
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-400'}"
                    >
                        {item.id}
                    </div>

                    <span
                        class="text-sm
                        {step === item.id
                            ? 'text-emerald-700 font-medium'
                            : 'text-gray-400'}"
                    >
                        {item.label}
                    </span>
                </div>

                {#if index < steps.length - 1}
                    <div class="flex-1 h-px bg-gray-200"></div>
                {/if}
            {/each}
        </div>

        <hr class="mb-8" />
        <slot />
    </div>
</div>