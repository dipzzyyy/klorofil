<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { eventSchema, type EventSchema } from "$lib/schemas/event-schema.js";
    import {
     type SuperValidated,
     type Infer,
     superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { toast } from "svelte-sonner";
    import { invalidate, invalidateAll } from '$app/navigation';

    import CalendarIcon from "@lucide/svelte/icons/calendar";
    import type { DateRange } from "bits-ui";
    import {
        CalendarDate,
        DateFormatter,
        type DateValue,
        getLocalTimeZone,
        now
    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import type { EventItem } from "$lib/components/ui/calendar-event/event-item-type"
        
    let { initForm, onSuccess, teamList, editItem }: { 
        initForm: SuperValidated<Infer<EventSchema>>;
        onSuccess?: () => void;
        teamList: {id:number, tim:string}[];
        editItem: EventItem;
    } = $props();
    
    const df = new DateFormatter("id-ID", {
        dateStyle: "medium"
    });
    
    let value: DateRange = $state({
        start: undefined,
        end: undefined
    });
    

    // form config

    const form = superForm(initForm, {
        validators: zodClient(eventSchema),
        onResult: async ({ result: f }) => {
        if (f.status == 200) {
            toast.success(`Berhasil memperbarui.`);
            // refresh page
            await invalidateAll();
            onSuccess?.();
        } else {
            console.log($formEvent);
            toast.error("Gagal memperbarui. Tolong perbaiki isian anda");
        }
        },
    });

    const { form: formEvent, enhance: enhanceEvent } = form;

    // Prefill form data dari editItem
    $formEvent.id = editItem.id;
    $formEvent.name = editItem.name;
    $formEvent.description = editItem.description;
    $formEvent.team = editItem.team;

    const startDate = new Date(editItem.start);
    const endDate = new Date(editItem.end);

    let localDates = $state({
    start: new CalendarDate(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate()
    ),
    end: new CalendarDate(
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate()
    )
    });

    function calendarDateToISO(date: CalendarDate | undefined): string {
        if (!date) return "";
        return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}T00:00:00.000Z`;
    }

    $effect(() => {
        $formEvent.start = localDates.start.toDate(getLocalTimeZone())
        $formEvent.end = localDates.end.toDate(getLocalTimeZone())
    });

</script>
    
<form method="POST" use:enhanceEvent class="space-y-6" action="?/updateEvent">
    <!-- judul -->
    <Form.Field {form} name="name">
        <Form.Control>
            {#snippet children({ props })}
            <Form.Label>Nama Kegiatan*</Form.Label>
            <Input {...props} bind:value={$formEvent.name} placeholder="Masukkan judul kegiatan" />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <!-- description -->
    <Form.Field {form} name="description">
        <Form.Control>
            {#snippet children({ props })}
            <Form.Label>Deskripsi</Form.Label>
            <Input {...props} bind:value={$formEvent.description} placeholder="Deskripsi kegiatan" />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <!-- Date -->
    <Form.Field {form} name="start">
    <Form.Control>
        {#snippet children({ props })}
        <Form.Label>Tanggal Kegiatan*</Form.Label>
        <Popover.Root>
            <Popover.Trigger class={cn(buttonVariants({ variant: "outline" }))}>
            <CalendarIcon class="mr-2 size-4" />
            {#if localDates.start}
                {df.format(localDates.start.toDate(getLocalTimeZone()))}
                {#if localDates.end}
                - {df.format(localDates.end.toDate(getLocalTimeZone()))}
                {/if}
            {:else}
                Pilih tanggal
            {/if}
            </Popover.Trigger>
            <Popover.Content class="w-auto p-0" align="start">
            <RangeCalendar bind:value={localDates} numberOfMonths={2} />
            </Popover.Content>
        </Popover.Root>
        {/snippet}
    </Form.Control>

    <!-- 🚀 These will ensure start/end go to the server -->
    <input
        type="hidden"
        name="start"
        value={localDates.start
        ? localDates.start.toDate(getLocalTimeZone()).toISOString()
        : ""}
    />
    <input
        type="hidden"
        name="end"
        value={localDates.end
        ? localDates.end.toDate(getLocalTimeZone()).toISOString()
        : ""}
    />

    <Form.FieldErrors />
    </Form.Field>



      <!-- Team -->
    <Form.Field {form} name="team">
        <Form.Control>
        <Form.Label>Pilih Tim*</Form.Label>
        <Select.Root type="single" bind:value={$formEvent.team} class="w-full">
            <Select.Trigger class="w-full">
            {#if $formEvent.team}
                {teamList.find(t => t.id === +$formEvent.team)?.tim || "Pilih tim"}
            {:else}
                Pilih tim
            {/if}
            </Select.Trigger>
            <Select.Content>
            {#each teamList as team}
                <Select.Item value={team.id.toString()}>{team.tim}</Select.Item>
            {/each}
            </Select.Content>
        </Select.Root>
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <input type="hidden" name="team" value={$formEvent.team} />
    <input type="hidden" name="id" value={editItem.id} />
    <Form.Button>Perbarui</Form.Button>
</form>