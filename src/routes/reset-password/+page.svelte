<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from './$types';
	import { toastStack } from '$lib/stores/toast.svelte';
    import { page } from '$app/stores';
	import { goto } from '$app/navigation';

    let { form }: { form: ActionData } = $props();

    let isLoading = $state(false);

    const handleSubmit: SubmitFunction = () => {
        isLoading = true;
        
        return async ({ update, result }) => {
            await update(); 
            isLoading = false; 

            if (result.type === "success") {
                toastStack.add("รีเซ็ตรหัสผ่านสำเร็จ!")
                goto("/login");
            }
        };
    };

</script>

<div class="flex flex-col h-screen w-full bg-gray-50 flex flex-col gap-5 justify-center items-center">
    <div class="text-2xl flex flex-col justify-center items-center">
 
            <p class="text-2xl">รีเซ็ต<span class="text-green-600">รหัสผ่าน</span></p>
            <p class="text-lg">โปรดกรอกรหัสผ่านใหม่ของท่านด้านล่าง</p>

    </div>
    <div class="rounded-2xl shadow-lg bg-white px-20 py-10 flex flex-col gap-3 justify-center items-center">
        <!-- <p class="text-2xl mb-5">เข้าสู่ระบบ</p> -->
        <!-- <p>Login</p> -->

        <form action="?/reset_password" method="POST" use:enhance={handleSubmit} class="space-y-4">

            <input type="hidden" name="token" value={$page.url.searchParams.get('token')} />
            <input type="hidden" name="email" value={$page.url.searchParams.get('email')} />

            <div>
                <label for="password" class="block mb-2">
                    รหัสผ่าน
                </label>
                <input 
                    type="password" 
                    class="rounded-4xl w-80" 
                    name="password"
                    id="password"
                    disabled={isLoading}
                    required
                >
                {#if form?.errors?.password}
                    <p class="text-red-500 text-sm mt-1">
                        {form.errors.password[0]}
                    </p>
                {/if}
            </div>

            <div>
                <label for="password_confirmation" class="block mb-2">
                    ยืนยันรหัสผ่าน
                </label>
                <input 
                    type="password" 
                    class="rounded-4xl w-80" 
                    name="password_confirmation"
                    id="password_confirmation"
                    disabled={isLoading}
                    required
                >
                {#if form?.errors?.password_confirmation}
                    <p class="text-red-500 text-sm mt-1">
                        {form.errors.password_confirmation[0]}
                    </p>
                {/if}
            </div>
            
            {#if form?.message}
                <div class="text-red-500">
                    {form.message}
                </div>
            {/if}
            
            <div class="w-full flex justify-center">
                <button class="mt-5 rounded-2xl border py-2 text-white hover:cursor-pointer hover:scale-110 bg-blue-400 w-40"
                    disabled={isLoading}
                >
                    รีเซ็ตรหัสผ่าน
                </button>
            </div>

        </form>
    </div>
</div>