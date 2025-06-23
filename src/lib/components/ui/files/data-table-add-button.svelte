<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { MediaQuery } from "svelte/reactivity";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { format } from "date-fns";
	import { id as idLocale } from "date-fns/locale";
    import PlusIcon from "@lucide/svelte/icons/plus"

    // form
    import FileForm from "$lib/components/ui/files/file-form.svelte"
    import type { SuperValidated, Infer } from "sveltekit-superforms";
    import type { FileSchema } from "$lib/schemas/files-schema.js"
    let { form }: { form: SuperValidated<Infer<FileSchema>> } = $props();

    // modal
	let open = $state(false);
    function handleClose() {
        open = false;
    }
	const isDesktop = new MediaQuery("(min-width: 768px)");
</script>

<Button	onclick={() => (open = true)}>
    <PlusIcon />
    <span class="hidden sm:inline">Tambah</span>
</Button>

{#if isDesktop.current}
	<Dialog.Root bind:open>
		<Dialog.Content class="p-5">
			<Dialog.Header>
				<Dialog.Title>Tambahkan fail baru</Dialog.Title>
			</Dialog.Header>
			<div class="space-y-3 p-1">
                <!-- select type -->
                <div>
                    <Badge variant="outline">Fail</Badge>
                    <Badge variant="outline">Pengumuman</Badge>
                </div>
                <!-- form -->
                <FileForm dataForm={form} onSuccess={handleClose} />
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>sq</Drawer.Title>
			</Drawer.Header>
			<div class="mt-4 px-4 space-y-2">
				<!-- havent done -->
				<div class="flex justify-end gap-2 pt-4 pb-6">
					<Button variant="outline" onclick={() => (open = false)}>Tutup</Button>
					<Button variant="default">Sunting</Button>
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
