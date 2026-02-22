<script lang="ts">
    import CountBox from "$lib/components/CountBox.svelte";
	import Icon from "$lib/components/Icon.svelte";
    let mockData = {
        studentId: "6610400000", 
        studentName: "ปีใหม่ ใหม่",
        faculty: "วิทยาศาสตร์",
        semester: 2,
        academicYear: 2569,
        endDate: '2026-07-02 00:00:00',
    };

    let regs = [
        {
            awardTitle: "นิสิตดีเด่น",
            awardableType: "activity",
            createdAt: '2026-01-29 01:26:34'
        }
    ]

    let availableStatus = {
        COMPLETED: {
            bg: "bg-emerald-600",
            text: "เสร็จสมบูรณ์",
            icon: "book"
        },
        REJECTED: {
            bg: "bg-red-600",
            text: "ไม่ผ่านการพิจารณา",
            icon: "book"
        },
        PENDING: {
            bg: "bg-orange-400",
            text: "กำลังดำเนินการ",
            icon: "book"
        }
    };
</script>
<div class="bg-[#f3f4f6]">
    <div class="flex flex-col items-center justify-center p-8 h-full gap-7">
        <div class="flex flex-col gap-2 w-2/3">
            <div class="flex justify-between">
                <p class="text-3xl font-bold">สวัสดี, {mockData.studentName}</p>
                <div class="flex bg-[#226e64] text-md text-white items-center justify-center p-2 px-5 rounded-2xl gap-2">
                    <Icon name="plus" currentColor="white" size=24/> สมัครนิสิตดีเด่น
                </div>
            </div>
            <p class="text-sm text-gray-600">รหัสนิสิต: {mockData.studentId} | คณะ{mockData.faculty}</p>
        </div>
        <div class="w-2/3 flex flex-wrap gap-8 justify-evenly">
            <CountBox title="การสมัครทั้งหมด" amount=5 iconPrimary="#059669" iconSecondary="#ecfdf5" icon="book"/>
            <CountBox title="รอพิจารณา" iconPrimary="#f97316" iconSecondary="#fff7ed" icon="eye"/>
            <CountBox title="อนุมัติแล้ว" textColor="#226e64" iconPrimary="#22c55e" iconSecondary="#f0fdf4" icon="trophy"/>
            <CountBox title="ไม่ผ่านการพิจารณา" textColor="red" iconPrimary="#ef4444" iconSecondary="#fef2f2" icon="trash-2"/>
        </div>
        <div class="w-2/3">
            <div class="bg-[#2d6a4f] rounded-2xl p-6 text-white flex justify-between items-center shadow-md">
                <div class="flex items-center gap-5">
                    <div class="bg-white/20 p-4 rounded-xl">
                        <Icon name="calendar" size=35 currentColor="white"/>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold">รอบรับสมัครปัจจุบัน</h3>
                        <p class="opacity-90">ภาคเรียน { mockData.semester ?? 'ภาคเรียนปัจจุบัน' }/{ mockData.academicYear ?? 'xxx'}</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="bg-[#f39c12] text-white px-4 py-1 rounded-full text-sm font-bold">เปิดรับสมัคร</span>
                    <p class="mt-2 text-sm font-light">หมดเขต: { mockData.endDate ?? '-' }</p>
                </div>
            </div>
        </div>

        <div class="w-2/3">
            <div class="space-y-4">
                <div class="flex items-center gap-2">
                    <Icon name="home" size=28 currentColor="green"/>
                    <h2 class="text-xl font-bold text-gray-800">ประวัติการสมัคร</h2>
                </div>
                <p class="text-sm text-gray-500 -mt-2">รายการสมัครนิสิตดีเด่นทั้งหมดของคุณ</p>

                <div class="flex flex-col gap-y-4 mt-4 overflow-y-auto pr-2 custom-scrollbar">
                    <!-- @forelse($registrations as $reg) -->
                    {#if regs.length == 0}
                        <div class="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p class="text-gray-500">คุณยังไม่มีประวัติการสมัครในขณะนี้</p>
                        </div>
                    {:else}
                        {#each regs as reg}                        
                            <div 
                                class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow group cursor-pointer">
                                <div class="flex items-center gap-5">
                                    <div class="bg-gray-50 p-4 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                        <Icon name={availableStatus.COMPLETED.icon} currentColor="green" size=28/>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-800 text-lg">
                                            { reg.awardTitle ?? 'รางวัลนิสิตดีเด่น' }
                                            <span class="text-sm font-normal text-gray-500">
                                        ({ reg.awardableType === 'activity' ? 'ด้านกิจกรรมเสริมหลักสูตร' : (reg.awardableType === 'innovation' ? 'ด้านความคิดสร้างสรรค์และนวัตกรรม' : 'ด้านความประพฤติดี') })
                                    </span>
                                        </h4>
                                        <p class="text-gray-400 text-sm">
                                            { mockData.academicYear } • สมัครเมื่อ { reg.createdAt }
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="{ availableStatus.PENDING.bg } text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm">
                                        <Icon name={availableStatus.PENDING.icon} currentColor="white" size="14" />
                                        { availableStatus.PENDING.text }
                                    </span>
                                    <Icon name="arrow-right" class="text-gray-800" />
                                </div>
                            </div>
                        {/each}
                    {/if}
                    <!-- @empty -->
                        <!-- <div class="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p class="text-gray-500">คุณยังไม่มีประวัติการสมัครในขณะนี้</p>
                        </div> -->
                    <!-- @endforelse -->
                </div>

                <div class="mt-4">
                    <!-- {{ $registrations->links() }} -->
                </div>
            </div>
        </div>
    </div>
</div>