<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Drawer from "$lib/components/ui/drawer";
    import { MediaQuery } from "svelte/reactivity";
    import { Input } from "$lib/components/ui/input";
    import { Switch } from "$lib/components/ui/switch";
    import { Toggle } from "$lib/components/ui/toggle";
    import { Button } from "$lib/components/ui/button";
    import { toast } from "svelte-sonner";
    import { invalidateAll } from "$app/navigation";
    import { enhance } from "$app/forms";

    let { fileData, open = $bindable() } = $props();

    const isDesktop = new MediaQuery("(min-width: 768px)");

    let name = $state(fileData.name);
    let description = $state(fileData.description);
    let link = $state(fileData.link);
    let type = $state(fileData.type);
    let importance = $state(fileData.importance === "true");

    // for type toggle
	let filePressed = $state(type === "fail" || type === "both");
	let announcementPressed = $state(type === "pengumuman" || type === "both");

    function updateType() {
        if (!filePressed && !announcementPressed) {
            filePressed = true;
            type = "fail";
        } else {
            type = filePressed && announcementPressed
                ? "both"
                : filePressed
                ? "fail"
                : "pengumuman";
        }
    }

    let fieldErrors = $state([]);
</script>

{#if isDesktop.current}
<Dialog.Root bind:open>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Edit Fail</Dialog.Title>
        </Dialog.Header>

        <form method="POST" use:enhance={() => {
            return async ({ result, update, }) => {
                if (result.type === 'success') {
                    await update();
                    toast.success(`Berhasil menambahkan.`);
                    open = false;
                    await invalidateAll();
                } else if (result.type === "failure") {
                    toast.error("Gagal memperbarui");
                    if (result.data?.errors) {
                        fieldErrors = result.data.errors.fieldErrors || {};
                    } else {
                        fieldErrors = {};
                    }
                }
            }
        }} 
        class="space-y-4" action="?/update">
            <input type="hidden" name="id" value={fileData.id}/>
            <div class="flex flex-col">
                <div class="flex items-center justify-between">
                    <label for="type" class="font-semibold">Tipe fail</label>
                    <div class="flex gap-2">
                        <input type="hidden" name="type" value={type}/>
                        <Toggle pressed={filePressed} onPressedChange={(v) => { filePressed = v; updateType(); }}>File</Toggle>
                        <Toggle pressed={announcementPressed} onPressedChange={(v) => { announcementPressed = v; updateType(); }}>Pengumuman</Toggle>
                    </div>
                </div>
                <label for="type" class="text-sm text-gray-600">Pilih salah satu</label>
                    {#if fieldErrors?.type?.length}
                        <p class="text-red-500 text-sm">{fieldErrors.type}</p>
                    {/if}
            </div>

            <div>
                <label for="name" class="font-semibold">Judul*</label>
                <Input name="name" bind:value={name} placeholder="Masukkan judul" />
                {#if fieldErrors?.name?.length}
                    <p class="text-red-500 text-sm">{fieldErrors.name}</p>
                {/if}
            </div>

            <div>
                <label for="description" class="font-semibold">Deskripsi</label>
                <Input name="description" bind:value={description} placeholder="Masukkan deskripsi" />
            </div>

            <div>
                <label for="link" class="font-semibold">Tautan*</label>
                <Input name="link" bind:value={link} placeholder="Masukkan tautan URL" />
                {#if fieldErrors?.link?.length}
                    <p class="text-red-500 text-sm">{fieldErrors.link}</p>
                {/if}
            </div>

            <div class="flex items-center space-x-2">
                <label for="importance" class="font-semibold">Penting?</label>
                <input type="hidden" name="importance" value={importance ? 'true' : 'false'} />
                <Switch checked={importance} onCheckedChange={(v) => importance = v} />
            </div>

            <div class="flex justify-end gap-2">
                <Button variant="default" type="submit">Perbarui</Button>
            </div>
        </form>
    </Dialog.Content>
</Dialog.Root>
{:else}
<Drawer.Root bind:open>
    <Drawer.Content>
        <Drawer.Header>
            <Drawer.Title>Edit Fail</Drawer.Title>
        </Drawer.Header>

        <form method="POST" use:enhance={() => {
            return async ({ result, update, }) => {
                if (result.type === 'success') {
                    await update();
                    toast.success(`Berhasil menambahkan.`);
                    open = false;
                    await invalidateAll();
                } else if (result.type === "failure") {
                    toast.error("Gagal memperbarui");
                    if (result.data?.errors) {
                        fieldErrors = result.data.errors.fieldErrors || {};
                    } else {
                        fieldErrors = {};
                    }
                }
            }
        }} 
        class="space-y-4" action="?/update">
            <input type="hidden" name="id" value={fileData.id}/>
            <div class="flex flex-col">
                <div class="flex items-center justify-between">
                    <label for="type" class="font-semibold">Tipe fail</label>
                    <div class="flex gap-2">
                        <input type="hidden" name="type" value={type}/>
                        <Toggle pressed={filePressed} onPressedChange={(v) => { filePressed = v; updateType(); }}>File</Toggle>
                        <Toggle pressed={announcementPressed} onPressedChange={(v) => { announcementPressed = v; updateType(); }}>Pengumuman</Toggle>
                    </div>
                </div>
                <label for="type" class="text-sm text-gray-600">Pilih salah satu</label>
                    {#if fieldErrors?.type?.length}
                        <p class="text-red-500 text-sm">{fieldErrors.type}</p>
                    {/if}
            </div>

            <div>
                <label for="name" class="font-semibold">Judul*</label>
                <Input name="name" bind:value={name} placeholder="Masukkan judul" />
                {#if fieldErrors?.name?.length}
                    <p class="text-red-500 text-sm">{fieldErrors.name}</p>
                {/if}
            </div>

            <div>
                <label for="description" class="font-semibold">Deskripsi</label>
                <Input name="description" bind:value={description} placeholder="Masukkan deskripsi" />
            </div>

            <div>
                <label for="link" class="font-semibold">Tautan*</label>
                <Input name="link" bind:value={link} placeholder="Masukkan tautan URL" />
                {#if fieldErrors?.link?.length}
                    <p class="text-red-500 text-sm">{fieldErrors.link}</p>
                {/if}
            </div>

            <div class="flex items-center space-x-2">
                <label for="importance" class="font-semibold">Penting?</label>
                <input type="hidden" name="importance" value={importance ? 'true' : 'false'} />
                <Switch checked={importance} onCheckedChange={(v) => importance = v} />
            </div>

            <div class="flex justify-end gap-2">
                <Button variant="default" type="submit">Perbarui</Button>
            </div>
        </form>
    </Drawer.Content>
</Drawer.Root>
{/if}
