<script lang="ts">
    import * as Card from "$lib/components/ui/card"
    import { Button } from "$lib/components/ui/button"
    import { Badge } from "$lib/components/ui/badge"
    import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
    import { ScrollArea } from "$lib/components/ui/scroll-area"
    import NextIcon from "@lucide/svelte/icons/chevron-right";
	import { MediaQuery } from "svelte/reactivity";
    import { Description } from "formsnap";

    let {
        informations,
    }: {
        informations: {
            id: number;
            name: string;
            description: string;
            importance: string;
            link: string;
        }[];
    } = $props();

    const sortedInformation = $derived.by(() => {
        return [...informations].sort((a, b) => {
            if (a.importance === "true" && b.importance !== "true") return -1;
            if (a.importance !== "true" && b.importance === "true") return 1;
            return 0;
        });
    });

    // modal
    let selectedInfo = $state(null);
    function openInfo(item) {
        selectedInfo = item;
    }
    function closeInfo() {
        selectedInfo = null;
    }
	const isDesktop = new MediaQuery("(min-width: 768px)");

</script>

<Card.Root class="w-full p-4">
    <Card.Header class="pt-4"> 
        <Card.Title>Informasi Terkini</Card.Title>
        <Card.Description>Pengumuman terbaru di BPS Kabupaten Rokan Hilir</Card.Description>
        <Card.Action class="w-full flex justify-end">
            <Button>Lihat semua</Button>
        </Card.Action>
    </Card.Header>
    <ScrollArea class="h-72 w-full rounded-md border p-4 bg-gray-50">
        <div class="grid gap-4">
            <!-- add perulangan disini -->
            {#each sortedInformation as info (info.id)}
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="truncate py-2">
                            {info.name}
                        </Card.Title>
                        <Card.Description class="truncate">
                            {info.description}
                        </Card.Description>
                        <Card.Action>
                            <!-- kalau tidak urgent, gaada badge nya -->
                             {#if info.importance === "true"}
                                <Badge
                                    class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                                    variant="destructive"
                                ></Badge>
                            {/if}
                            <Button variant="ghost" onclick={() => openInfo(info)}>
                                <NextIcon />
                            </Button>
                        </Card.Action>
                    </Card.Header>
                </Card.Root>
            {/each}
        </div>
    </ScrollArea>

    {#if selectedInfo} 
        {#if isDesktop.current}
            <Dialog.Root bind:open={selectedInfo}>
                <Dialog.Content class="p-8 m-5">
                    <Dialog.Header>
                        <Dialog.Title>{selectedInfo?.name}</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Description>{selectedInfo?.description}</Dialog.Description>
                    <Button class="truncate" variant="link" href={selectedInfo?.link}>{selectedInfo?.link}</Button>
                </Dialog.Content>
            </Dialog.Root>
        {:else}
            <Drawer.Root bind:open={selectedInfo}>
                <Dialog.Content class="p-8 m-5">
                    <Dialog.Header>
                        <Dialog.Title>{selectedInfo?.name}</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Description>{selectedInfo?.description}</Dialog.Description>
                    <Button class="truncate" variant="link" href={selectedInfo?.link}>{selectedInfo?.link}</Button>
                </Dialog.Content>
            </Drawer.Root>
        {/if}
    {/if}
</Card.Root>
