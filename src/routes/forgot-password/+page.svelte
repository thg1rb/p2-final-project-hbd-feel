<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from './$types';
	import { toastStack } from '$lib/stores/toast.svelte';

    let { form }: { form: ActionData } = $props();

    let isLoading = $state(false);

    const handleSubmit: SubmitFunction = () => {
        isLoading = true;
        
        return async ({ update, result }) => {
            await update(); 
            isLoading = false; 

            if (result.type === "success") {
                toastStack.add("ส่งลิงก์สำเร็จ โปรดเช็กอีเมลของท่าน")
            } else if (result.type === 'failure') {
                toastStack.add("เกิดข้อผิดพลาด กรุณาตรวจสอบและลองใหม่อีกครั้ง", "error")
            }
            
        };
    };




</script>

<div class="flex flex-col h-screen w-full bg-gray-50 flex flex-col gap-5 justify-center items-center">
    <div class="text-2xl flex flex-col justify-center items-center">
            <p class="text-2xl">ลืม<span class="text-green-600">รหัสผ่าน</span></p>
            <p class="text-lg">โปรดกรอกอีเมลที่ผูกกับรหัสของท่าน</p>
    </div>
    <div class="rounded-2xl shadow-lg bg-white px-20 py-10 flex flex-col gap-3 justify-center items-center">
        <!-- <p class="text-2xl mb-5">เข้าสู่ระบบ</p> -->
        <!-- <p>Login</p> -->

        <form action="?/forgot_password" method="POST" use:enhance={handleSubmit} class="space-y-4">
            <div>
                <label for="email" class="block mb-2">
                    อีเมล
                </label>
                <input 
                    type="text" 
                    class="rounded-4xl w-80" 
                    name="email"
                    id="email"
                    disabled={isLoading}
                    placeholder="abcd.ef@ku.th"
                    required
                >
                {#if form?.errors?.email}
                    <p class="text-red-500 text-sm mt-1">
                        {form.errors.email[0]}
                    </p>
                {/if}
                {#if form?.message}
                    <p class="text-red-500 text-sm mt-1">
                        {form.message}
                    </p>
                {/if}
            </div>
            
            <div class="w-full flex justify-center">
                <button class="mt-5 rounded-2xl border py-2 text-white hover:cursor-pointer hover:scale-110 bg-blue-400 w-40"
                    disabled={isLoading}
                >
                    ส่งลิงก์รีเซ็ตรหัสผ่าน
                </button>
            </div>

        </form>
    </div>
</div>