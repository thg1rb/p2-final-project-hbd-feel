<script lang="ts">
    import CountBox from "$lib/components/CountBox.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import { formatThaiDate } from "$lib/utils/dateFormatter";
    import type { PageProps } from "./$types";
    const { data }: PageProps = $props();

    interface AvailableStatus {
        [key: string]: {
            color: string
            bg: string;
            text: string;
            icon: string;
        }
    };

    const { regs, stats, curr, student } = data;

    let availableStatus : AvailableStatus = {
        APPROVED: {
            bg: "bg-emerald-600",
            color: "bg-emerald-200",
            text: "เสร็จสมบูรณ์",
            icon: "award"
        },
        REJECTED: {
            bg: "bg-red-600",
            color: "bg-red-200",
            text: "ไม่ผ่านการพิจารณา",
            icon: "X"
        },
        SUBMITTED: {
            bg: "bg-orange-400",
            color: "bg-orange-200",
            text: "กำลังดำเนินการ",
            icon: "clock"
        }
    };

    function checkApprovedStatus(status: string, level:number): "APPROVED" | "SUBMITTED" | "REJECTED" {
        if (status === "REJECTED") return status;

        return status === "APPROVED" && level === 5
            ? "APPROVED"
            : "SUBMITTED";
    }
</script>

<div class="bg-[#f3f4f6] h-screen">
    <div class="flex flex-col items-center justify-center p-8 gap-7">
        <div class="flex flex-col gap-2 w-2/3">
            <div class="flex justify-between">
                <p class="text-3xl font-bold">สวัสดี, {student?.firstName} {student?.lastName}</p>
                <a href="/award-application/step1">
                    <div class="flex bg-[#226e64] text-md text-white items-center justify-center p-2 px-5 rounded-2xl gap-2 cursor-pointer">
                        <Icon name="plus" currentColor="white" size={24}/> สมัครนิสิตดีเด่น
                    </div>
                </a>
            </div>
            <p class="text-sm text-gray-600">
                รหัสนิสิต: {student?.student_id} | คณะ{student?.faculty?.name} | ภาควิชา{student?.department?.name}
            </p>
        </div>

        <div class="w-2/3 flex flex-wrap gap-8 justify-evenly">
            <CountBox title="การสมัครทั้งหมด" amount={stats?.all} iconPrimary="#059669" iconSecondary="#ecfdf5" icon="book"/>
            <CountBox title="รอพิจารณา" amount={stats?.pending} iconPrimary="#f97316" iconSecondary="#fff7ed" icon="eye"/>
            <CountBox title="อนุมัติแล้ว" amount={stats?.approved} textColor="#226e64" iconPrimary="#22c55e" iconSecondary="#f0fdf4" icon="trophy"/>
            <CountBox title="ไม่ผ่านการพิจารณา" amount={stats?.rejected} textColor="red" iconPrimary="#ef4444" iconSecondary="#fef2f2" icon="trash-2"/>
        </div>

        <div class="w-2/3">
            <div class="bg-[#2d6a4f] rounded-2xl p-6 text-white flex justify-between items-center shadow-md">
                <div class="flex items-center gap-5">
                    <div class="bg-white/20 p-4 rounded-xl">
                        <Icon name="calendar" size={35} currentColor="white"/>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold">รอบรับสมัครปัจจุบัน</h3>
                        <p class="opacity-90">
                            ภาคเรียน { curr?.semester ?? 'ภาคเรียนปัจจุบัน' }/{ curr?.academic_year ?? 'xxx'}
                        </p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="bg-[#f39c12] text-white px-4 py-1 rounded-full text-sm font-bold">เปิดรับสมัคร</span>
                    <p class="mt-2 text-sm font-light">
                        หมดเขต: { curr?.end_date ? formatThaiDate(curr.end_date) : '-' }
                    </p>
                </div>
            </div>
        </div>

        <div class="w-2/3">
            <div class="space-y-4">
                <div class="flex items-center gap-2">
                    <Icon name="home" size={28} currentColor="green"/>
                    <h2 class="text-xl font-bold text-gray-800">
                        ประวัติการสมัคร {availableStatus.APPROVED.text}
                    </h2>
                </div>
                <p class="text-sm text-gray-500 -mt-2">
                    รายการสมัครนิสิตดีเด่นทั้งหมดของคุณ
                </p>

                <div class="flex flex-col gap-y-2 mt-4 overflow-y-auto pr-2 custom-scrollbar">
                    {#if !regs || regs.length === 0}
                        <div class="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p class="text-gray-500">คุณยังไม่มีประวัติการสมัครในขณะนี้</p>
                        </div>
                    {:else}
                        {#each regs as reg}               
                        
                            <a href="/application-list/{reg.application_id}">
                                <div class="bg-white  p-5 rounded-2xl mb-2 mx-2 shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow group cursor-pointer transition duration-300 hover:shadow-lg hover:shadow-emerald-500/50 ">
                                    <div class="flex items-center gap-5">
                                        <div class="{availableStatus[checkApprovedStatus(reg.status, reg.level)]?.color} p-4 rounded-xl transition-colors">
                                            <Icon name={availableStatus[checkApprovedStatus(reg.status, reg.level)]?.icon} currentColor="white" size={28}/>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-800 text-lg">
                                                รางวัลนิสิตดีเด่น
                                                <span class="text-sm font-normal text-gray-500">
                                                    ({reg.award_name})
                                                </span>
                                            </h4>
                                            <p class="text-gray-400 text-sm">
                                                {reg.semester}/{reg.academic_year} • สมัครเมื่อ {reg.created_at ? formatThaiDate(reg.created_at) : "XXXX" } • แก้ไขล่าสุด {reg.updated_at ? formatThaiDate(reg.created_at) : "XXXX" }
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <span class="{availableStatus[checkApprovedStatus(reg.status, reg.level)]?.bg} text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm">
                                            <Icon name={availableStatus[checkApprovedStatus(reg.status, reg.level)]?.icon} currentColor="white" size={14} />
                                            {availableStatus[checkApprovedStatus(reg.status, reg.level)]?.text}
                                        </span>
                                        <Icon name="arrow-right" class="text-gray-800" />
                                    </div>
                                </div>
                            </a>
                        {/each}
                    {/if}
                </div>

                <div class="mt-4 mb-2"></div>
            </div>
        </div>
    </div>
</div>