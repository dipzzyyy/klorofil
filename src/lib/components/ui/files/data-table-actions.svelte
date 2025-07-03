<script lang="ts">
    import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
    import LinkIcon from "@lucide/svelte/icons/link";
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Tooltip } from "bits-ui";
    import { toast } from "svelte-sonner";
    import FileEditDialog from "$lib/components/ui/files/data-table-edit-dialog.svelte";
    import { invalidateAll } from "$app/navigation";

    let { file, labels } = $props();

    let editOpen = $state(false);
    let selectedFile = $state();

    function openEdit(f: File) {
        selectedFile = f;
        editOpen = true;
    }

    async function deleteRow() {
        if (!confirm("Yakin ingin menghapus file ini?")) return;

        const formData = new FormData();
        formData.append("id", file.id);

        const res = await fetch("?/delete", {
            method: "POST",
            body: formData
        });

        const result = await res.json();

        if (result.status == 200 && result.type == "success") {
            toast.success("Berhasil dihapus");
            await invalidateAll();
        } else {
            toast.error(result.message || "Gagal menghapus");
        }
    }

    function handleLinkClick() {
        navigator.clipboard.writeText(file.link);
        toast.success("URL berhasil disalin");
    }
</script>

<div>
    <Tooltip.Provider>
        <Tooltip.Root>
            <Tooltip.Trigger>
                <Button
                    variant="ghost"
                    size="icon"
                    class="relative size-8 p-0"
                    onclick={handleLinkClick}
                >
                    <LinkIcon />
                    <span class="sr-only">Salin URL</span>
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content
                side="top"
                align="center"
                class="z-50 rounded-md bg-black px-3 py-1.5 text-sm text-white shadow-md"
            >
                <p>Salin URL</p>
            </Tooltip.Content>
        </Tooltip.Root>
    </Tooltip.Provider>

    <Tooltip.Provider>
        <Tooltip.Root>
            <Tooltip.Trigger>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            class="relative size-8 p-0"
                        >
                            <span class="sr-only">Aksi Lain</span>
                            <EllipsisIcon />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onSelect={() => openEdit(file)}>
                            Sunting
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onSelect={deleteRow}>
                            Hapus
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Tooltip.Trigger>
            <Tooltip.Content
                side="top"
                align="center"
                class="z-50 rounded-md bg-black px-3 py-1.5 text-sm text-white shadow-md"
            >
                <p>Aksi Lain</p>
            </Tooltip.Content>
        </Tooltip.Root>
    </Tooltip.Provider>

    {#if editOpen}
        <FileEditDialog fileData={selectedFile} bind:open={editOpen} labels={labels}/>
    {/if}
</div>
