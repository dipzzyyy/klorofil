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
                <!-- form -->
                <FileForm dataForm={form} onSuccess={handleClose} />
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Overlay class="fixed inset-0 bg-black/40" />
		<Drawer.Content class="fixed bottom-0 left-0 right-0 flex max-h-[96%] flex-col rounded-t-[10px] bg-white">
			<Drawer.Header class="shrink-0">
				<Drawer.Title>Tambahkan fail baru</Drawer.Title>
			</Drawer.Header>
			<div class="px-4 space-y-2 overflow-y-auto flex-1 mb-5">
                <!-- form -->
                <FileForm dataForm={form} onSuccess={handleClose} />
				<div></div>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
