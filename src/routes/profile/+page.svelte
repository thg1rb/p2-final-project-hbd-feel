<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';
	import { page } from '$app/stores';
	import { toastStack } from '$lib/stores/toast.svelte';

    let { form }: { form: ActionData } = $props();

    let isLoading = $state(false);

    let profile = $derived({
        firstName: $page.data.user?.firstName,
        lastName: $page.data.user?.lastName,
        username: $page.data.user?.username,
        email: $page.data.user?.email,
    })

    const handleSave: SubmitFunction = () => {
        isLoading = true;
        
        return async ({ update, result }) => {
            await update(); 
            isLoading = false; 

            if (result.type === "success") {
                toastStack.add(
                    "แก้ไขข้อมูลสำเร็จ!"
                );
            }

            if (result.type === "failure") {
                toastStack.add(
                    "เกิดข้อผิดพลาด กรุณาลองใหม่",
                    "error"
                );
            }
        };
    };


</script>

<div class="fixed inset-x-0 top-22 bottom-0 bg-gray-50 flex flex-col gap-5 justify-center items-center">
    <div class="text-2xl flex flex-col justify-center items-center">
        <p class="text-2xl text-green-600">โปรไฟล์</p>
        <p class="text-lg">ท่านสามารถเปลี่ยนแปลง แก้ไขข้อมูลของท่านได้ด้านล่าง</p>
    </div>
    <div class="rounded-2xl shadow-lg bg-white px-20 py-10 flex flex-col gap-5 justify-center items-center">
        <form action="?/update_profile" method="POST" use:enhance={handleSave} class="space-y-4">

            <div>
                <label for="firstName" class="block mb-2">
                    ชื่อ
                </label>
                <input 
                    bind:value={profile.firstName}
                    type="text" 
                    class="rounded-4xl w-80" 
                    name="firstName"
                    id="firstName"
                    disabled={isLoading}
                    required
                >
                {#if form?.errors?.firstName}
                    <p class="text-red-500 text-sm mt-1">
                        {form.errors.firstName[0]}
                    </p>
                {/if}
            </div>

            <div>
                <label for="lastName" class="block mb-2 mt-8">
                    นามสกุล
                </label>
                <input 
                    bind:value={profile.lastName}
                    type="text" 
                    class="rounded-4xl w-80" 
                    name="lastName"
                    id="lastName"
                    disabled={isLoading}
                    required
                >
                {#if form?.errors?.lastName}
                    <p class="text-red-500 text-sm mt-1">
                        {form.errors.lastName[0]}
                    </p>
                {/if}
            </div>

            <div>
                <label for="username" class="block mb-2 mt-8">
                    ชื่อผู้ใช้
                </label>
                <input 
                    bind:value={profile.username}
                    type="text" 
                    class="rounded-4xl w-80" 
                    name="username"
                    id="username"
                    disabled={isLoading}
                    required
                >
                {#if form?.errors?.username}
                    <p class="text-red-500 text-sm mt-1">
                        {form.errors.username[0]}
                    </p>
                {/if}
            </div>

            <div>
                <label for="email" class="block mb-2 mt-8 ">
                    อีเมล
                </label>
                <input 
                    bind:value={profile.email}
                    type="text" 
                    class="rounded-4xl w-80 bg-[#707070]/10 hover:cursor-not-allowed" 
                    name="email"
                    id="email"
                    readonly
                    disabled={isLoading}
                    required
                >
            </div>
            
            <div class="w-full flex justify-center">
                <button class="mt-5 rounded-2xl border py-2 text-white hover:cursor-pointer hover:scale-110 bg-green-600 w-40"
                    disabled={isLoading}
                >
                    บันทึกข้อมูล
                </button>
            </div>

        </form>
    </div>
</div>