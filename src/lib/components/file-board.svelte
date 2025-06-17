<script lang="ts">
    import * as Card from "$lib/components/ui/card"
    import { Button } from "$lib/components/ui/button"

</script>

<Card.Root> 
    <Card.Header>
        <Card.Title>Kumpulan Fail General</Card.Title>
        <Card.Description>Fail-fail general untuk seluruh pegawai BPS Kabupaten Rokan Hilir</Card.Description>
    </Card.Header>
    <Card.Content>
        <div class="grid grid-cols-3 gap-4">
            <div class="rounded-sm">
                <div>
                    <Card.Root class="w-full p-4">
                        <Card.Header>
                            <Card.Title>Kumpulan Fail General</Card.Title>
                            <Card.Description>Fail-fail general untuk seluruh pegawai BPS Kabupaten Rokan Hilir</Card.Description>
                        </Card.Header>
                        <Card.Action>
                            <Button>Lihat semua</Button>
                        </Card.Action>
                    </Card.Root>
                </div>
            </div>
            <div class="col-span-2">
                <Card.Root class="w-full p-4">
                    <Card.Header>
                        <Card.Title>Kumpulan Fail General</Card.Title>
                        <Card.Description>Fail-fail general untuk seluruh pegawai BPS Kabupaten Rokan Hilir</Card.Description>
                    </Card.Header>
                    <Card.Action>
                        <Button>Lihat semua</Button>
                    </Card.Action>
                </Card.Root>
            </div>
        </div>
    </Card.Content>
</Card.Root>
