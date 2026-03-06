<script lang="ts">
    import googleLogo from '$lib/assets/images/google.png';
    import { enhance } from '$app/forms';
    import type { ActionData, SubmitFunction } from '@sveltejs/kit';
    import { onMount } from 'svelte';
	import { toastStack } from '$lib/stores/toast.svelte';

    let { form }: { form: ActionData } = $props();

    let isLoading = $state(false);

    const handleLogin: SubmitFunction = () => {
        isLoading = true;
        
        return async ({ update }) => {
            await update(); 
            isLoading = false; 
        };
    };

    onMount(() => {

		if (window.location.hash === '#notFound') {
			toastStack.add("ไม่พบผู้ใช้ กรุณาติดต่อผู้ดูแลระบบ", 'error', 3000);
		}
	});
</script>

<div class="flex flex-col gap-5 right-0 left-0 top-0 bottom-0 bg-gray-50 justify-center items-center w-full h-screen">
    <div class="text-2xl flex flex-col justify-center items-center">
        <p class="text-2xl">ยินดีตอนรับเข้าสู่<span class="text-green-600">ระบบนิสิตดีเด่น!</span></p>
        <p class="text-lg">โปรดเข้าสู่ระบบก่อนใช้งาน</p>
    </div>
    <div class="rounded-2xl shadow-lg bg-white px-20 py-10 flex flex-col gap-3 justify-center items-center">
        <!-- <p class="text-2xl mb-5">เข้าสู่ระบบ</p> -->
        <!-- <p>Login</p> -->

        <div>
            <button on:click={() => {window.location.href = "http://localhost/auth/google/redirect?from=svelte";}} class="flex items-center gap-2 rounded-4xl border shadow-mg p-3 px-6 hover:cursor-pointer hover:scale-105"
            >
            <img src={googleLogo} alt="google" class="size-4">
            ดำเนินการต่อด้วย Google
            </button>
        </div>

        <p class="mt-5">หรือ</p>

        <form action="?/login" method="POST" use:enhance={handleLogin} class="space-y-4">
            <div>
                <label for="credential" class="block mb-2">
                    ชื่อผู้ใช้ หรืออีเมล
                </label>
                <input 
                    type="text" 
                    class="rounded-4xl w-80" 
                    name="credential"
                    id="credential"
                    placeholder="name.lastName@ku.th"
                    disabled={isLoading}
                    required
                >
            </div>

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
                {#if form?.errors?.credential}
                    <p class="text-red-500 text-sm mt-1">
                        {form.errors.credential[0]}
                    </p>
                {/if}
                {#if form?.errors?.password}
                    <p class="text-red-500 text-sm mt-1">
                        {form.errors.password[0]}
                    </p>
                {/if}
                
            </div>
            
            <div class="w-full flex justify-center">
                <button class="mt-5 rounded-2xl border py-2 text-white hover:cursor-pointer hover:scale-110 bg-blue-400 w-40"
                    disabled={isLoading}
                >
                    เข้าสู่ระบบ
                </button>
            </div>

            <div class="w-full flex justify-end">
                <a href="">
                    <p class="text-gray-600 underline hover:cursor-pointer">ลืมรหัสผ่าน?</p>
                </a>
            </div>
        </form>
    </div>
</div>