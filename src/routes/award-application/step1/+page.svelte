<script lang="ts">
    import { onMount } from "svelte";

    export let step: number = 1;

    type Requirement = {
        id: string;
        name: string;
        required: boolean;
    };

    type Award = {
        id: number;
        name: string;
        form_path: string;
        requirements: Requirement[];
    };

    let awards: Award[] = [];
    let selectedAward: number | null = null;
    let loading: boolean = false;
    let errors: Record<string, string[]> = {};
    let fetching: boolean = true;

    // onMount(async () => {
    //     try {
    //         const res = await fetch("/api/awards");
    //         const data: Award[] = await res.json();
    //         awards = data;
    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //         fetching = false;
    //     }
    // });

    awards = [
        {
        id: 1,
        name: "ด้านกิจกรรมเสริมหลักสูตร",
        form_path: "forms/activity",
        requirements: [
            { id: "req_001", name: "สำเนาบัตรประชาชน", required: true },
            { id: "req_002", name: "Transcript", required: true }
        ]
    },
    {
        id: 2,
        name: "ด้านความคิดสร้างสรรค์และนวัตกรรม",
        form_path: "forms/innovation",
        requirements: [
            { id: "req_001", name: "สำเนาบัตรประชาชน", required: true },
            { id: "req_002", name: "Transcript", required: true }
        ]
    },
    {
        id: 3,
        name: "ด้านความประพฤติดี",
        form_path: "forms/good-conduct",
        requirements: [
            { id: "req_001", name: "สำเนาบัตรประชาชน", required: true },
            { id: "req_002", name: "Transcript", required: true }
        ]
    }
    ];

    async function submitForm() {
        loading = true;
        errors = {};

        try {
            const res = await fetch(`/api/award-registrations?step=${step}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    award_id: selectedAward
                })
            });

            const data = await res.json();

            if (!res.ok) {
                errors = data.errors ?? {};
                return;
            }

            window.location.href = `/award-registration/step-2`;

        } catch (err) {
            console.error(err);
        } finally {
            loading = false;
        }
    }
</script>

<div class="mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-1">
        เลือกประเภทรางวัล
    </h3>
    <p class="text-sm text-gray-500">
        เลือกประเภทรางวัลที่ตรงกับความสามารถและผลงานของคุณ (เลือกได้ 1 ประเภท)
    </p>
</div>

<!-- {#if fetching}
    <p class="text-gray-500">กำลังโหลด...</p>
{:else} -->

    <div class="space-y-4">

        {#each awards as award}
            <label
                class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">

                <input
                    type="radio"
                    bind:group={selectedAward}
                    value={award.id}
                    class="text-emerald-600" />

                <div>
                    <p class="font-medium text-gray-900">
                        {award.name}
                    </p>
                </div>

            </label>
        {/each}

        {#if errors.award_id}
            <p class="text-red-500 text-sm">
                {errors.award_id[0]}
            </p>
        {/if}
    </div>

<!-- {/if} -->

<div class="mt-10 flex justify-end">
    <button
        on:click={submitForm}
        disabled={loading}
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg">

        {loading ? "กำลังบันทึก..." : "ถัดไป >"}
    </button>
</div>