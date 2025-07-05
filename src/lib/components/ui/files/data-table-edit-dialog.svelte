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
    import * as Select from "$lib/components/ui/select/index.js";

    let { fileData, open = $bindable(), labels } = $props();

    const isDesktop = new MediaQuery("(min-width: 768px)");

    let name = $state(fileData.name);
    let description = $state(fileData.description);
    let link = $state(fileData.link);
    let type = $state(fileData.type);
    let label = $state(fileData.label);
    let importance = $state(fileData.importance === "true");

    // for type toggle
	let filePressed = $state(fileData.type === "fail" || fileData.type === "both");
	let announcementPressed = $state(fileData.type === "pengumuman" || fileData.type === "both");

    function updateType() {
        if (filePressed && announcementPressed) {
            type = "both";
        } else if (filePressed) {
            type = "fail";
        } else if (announcementPressed) {
            type = "pengumuman";
        } else {
            // Assign empty string (or any invalid value) so Zod catches it
            type = "" as any;  // Zod will fail this as it's not in the enum
        }
    }

    let fieldErrors:Record<string, string[]> = $state({});

    let isAddingCustomLabel = $state(false);
    let customLabelInput = $state("");

    const extendLabels: string[] = $derived.by(() => {
        const set = new Set<string>(labels);
        set.add("Administrasi");
        return Array.from(set);
    });

    function handleLabelChange(value: string) {
        if (value === "__custom__") {
            isAddingCustomLabel = true;
            customLabelInput = "";
            label = "";
        } else {
            isAddingCustomLabel = false;
            label = value;
        }
    }
</script>

{#if isDesktop.current}
<Dialog.Root bind:open>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Sunting Fail</Dialog.Title>
        </Dialog.Header>

        <form method="POST" use:enhance={() => {
            return async ({ result, update, }) => {
                if (result.type === 'success') {
                    await update();
                    toast.success(`Berhasil memperbarui.`);
                    open = false;
                    await invalidateAll();
                } else if (result.type === "failure") {
                    toast.error("Gagal memperbarui");
                    const errors = result.data?.errors as { fieldErrors?: Record<string, string[]> } | undefined;
                    fieldErrors = errors?.fieldErrors || {};
                }
            }
            }} 
            class="space-y-4" action="?/update"
        >
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

            <div>
            <label for="label" class="font-semibold">Kategori</label>
            {#if !isAddingCustomLabel}
                <Select.Root
                    type="single"
                    value={label}
                    name="label"
                    onValueChange={handleLabelChange}
                >
                    <Select.Trigger class="w-full">
                        {label || "Pilih atau masukkan label"}
                    </Select.Trigger>
                    <Select.Content class="w-full">
                        {#each extendLabels as l}
                            <Select.Item value={l} label={l} />
                        {/each}
                        <Select.Item value="__custom__" label="Tambah label baru..." />
                    </Select.Content>
                </Select.Root>
            {:else}
                <div class="space-y-1">
                    <Input
                        name="label"
                        bind:value={customLabelInput}
                        placeholder="Masukkan label baru"
                        class="w-full mt-2"
                    />
                    <button
                        type="button"
                        class="text-sm text-blue-500 hover:underline"
                        onclick={() => {
                            isAddingCustomLabel = false;
                            label = ""; // Optional: reset label or keep value
                        }}
                    >
                        Kembali ke pilihan kategori
                    </button>
                </div>
            {/if}
            {#if fieldErrors?.label?.length}
                <p class="text-red-500 text-sm">{fieldErrors.label}</p>
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
            <Drawer.Title>Sunting Fail</Drawer.Title>
        </Drawer.Header>
        <div class="gap-2 p-5 overflow-y-auto">
            <form method="POST" use:enhance={() => {
                return async ({ result, update, }) => {
                    if (result.type === 'success') {
                        await update();
                        toast.success(`Berhasil menambahkan.`);
                        open = false;
                        await invalidateAll();
                    } else if (result.type === "failure") {
                        toast.error("Gagal memperbarui");
                        const errors = result.data?.errors as { fieldErrors?: Record<string, string[]> } | undefined;
                        fieldErrors = errors?.fieldErrors || {};
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

                <div>
                    <label for="label" class="font-semibold">Kategori</label>
                    {#if !isAddingCustomLabel}
                        <Select.Root
                            type="single"
                            value={label}
                            name="label"
                            onValueChange={handleLabelChange}
                        >
                            <Select.Trigger class="w-full">
                                {label || "Pilih atau masukkan label"}
                            </Select.Trigger>
                            <Select.Content class="w-full">
                                {#each extendLabels as l}
                                    <Select.Item value={l} label={l} />
                                {/each}
                                <Select.Item value="__custom__" label="Tambah label baru..." />
                            </Select.Content>
                        </Select.Root>
                    {:else}
                        <div class="space-y-1">
                            <Input
                                name="label"
                                bind:value={customLabelInput}
                                placeholder="Masukkan label baru"
                                class="w-full mt-2"
                            />
                            <button
                                type="button"
                                class="text-sm text-blue-500 hover:underline"
                                onclick={() => {
                                    isAddingCustomLabel = false;
                                    label = ""; // Optional: reset label or keep value
                                }}
                            >
                                Kembali ke pilihan kategori
                            </button>
                        </div>
                    {/if}
                    {#if fieldErrors?.label?.length}
                        <p class="text-red-500 text-sm">{fieldErrors.label}</p>
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
        </div>

    </Drawer.Content>
</Drawer.Root>
{/if}
