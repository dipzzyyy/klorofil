<script lang="ts">
    import * as Card from "$lib/components/ui/card"
    import { Button } from "$lib/components/ui/button"
    import { Badge } from "$lib/components/ui/badge"
    import { ScrollArea } from "$lib/components/ui/scroll-area"
    import NextIcon from "@lucide/svelte/icons/chevron-right";
</script>

<Card.Root class="w-full max-w-sm p-4">
    <Card.Header class="pt-4"> 
        <Card.Title>Informasi Terkini</Card.Title>
        <Card.Description>Pengumuman terbaru di BPS Kabupaten Rokan Hilir</Card.Description>
        <Card.Action>
            <Button>Lihat semua</Button>
        </Card.Action>
    </Card.Header>
    <ScrollArea class="h-72 w-full rounded-md border p-4">
        <!-- add perulangan disini -->
        <!-- contoh -->
        <Card.Root>
            <Card.Header>
                <Card.Title class="truncate py-2">
                    Mengisikan form potensi pegawai
                </Card.Title>
                <Card.Description class="truncate">
                    Bapak/Ibu harap mengisikan form potensi pegawai
                </Card.Description>
                <Card.Action>
                    <!-- add if else disini utk yg important2 -->
                    <Badge
                        class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                        variant="destructive"
                    ></Badge>
                    <!-- add conditioning in here -->
                    <Button href="#" variant="ghost">
                        <NextIcon />
                    </Button>
                </Card.Action>
            </Card.Header>
        </Card.Root>
        <Card.Root>
            <Card.Header>
                <Card.Title class="truncate py-2">
                    Mengisikan form potensi pegawai
                </Card.Title>
                <Card.Description class="truncate">
                    Bapak/Ibu harap mengisikan form potensi pegawai
                </Card.Description>
                <Card.Action>
                    <!-- add if else disini utk yg important2 -->
                    <Badge
                        class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                        variant="destructive"
                    ></Badge>
                    <!-- add conditioning in here -->
                    <Button href="#" variant="ghost">
                        <NextIcon />
                    </Button>
                </Card.Action>
            </Card.Header>
        </Card.Root>
        <Card.Root>
            <Card.Header>
                <Card.Title class="truncate py-2">
                    Mengisikan form potensi pegawai
                </Card.Title>
                <Card.Description class="truncate">
                    Bapak/Ibu harap mengisikan form potensi pegawai
                </Card.Description>
                <Card.Action>
                    <!-- add if else disini utk yg important2 -->
                    <Badge
                        class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                        variant="destructive"
                    ></Badge>
                    <!-- add conditioning in here -->
                    <Button href="#" variant="ghost">
                        <NextIcon />
                    </Button>
                </Card.Action>
            </Card.Header>
        </Card.Root>
    </ScrollArea>
</Card.Root>
