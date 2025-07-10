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
        
    let { initForm, onSuccess, teamList }: { 
        initForm: SuperValidated<Infer<EventSchema>>;
        onSuccess?: () => void;
        teamList: {id:number, tim:string}[];
    } = $props();
    
    const df = new DateFormatter("en-US", {
        dateStyle: "medium"
    });

    const today = now(getLocalTimeZone());
    
    let value: DateRange = $state({
        start: undefined,
        end: undefined
    });
    
    let startValue: DateValue | undefined = $state(undefined);

    function updateDate() {
        if(value.start) {
            $formEvent.start = value.start.toDate(getLocalTimeZone());
        }
        if(value.end) {
            $formEvent.end = value.end.toDate(getLocalTimeZone());
        }
    }

    // form config

    const form = superForm(initForm, {
        validators: zodClient(eventSchema),
        onResult: async ({ result: f }) => {
        if (f.status == 200) {
            toast.success(`Berhasil menambahkan.`);
            // refresh page
            await invalidateAll();
            onSuccess?.();
        } else {
            toast.error("Gagal menambahkan. Tolong perbaiki isian anda");
        }
        },
    });

    const { form: formEvent, enhance: enhanceEvent } = form;
</script>
    
<form method="POST" use:enhanceEvent class="space-y-6" action="?/createEvent">
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
    <!-- date start -->
    <Form.Field {form} name="start">
        <Form.Control>
            {#snippet children({ props })}
            <Form.Label>Tanggal Kegiatan*</Form.Label>
            <div class="grid gap-2">
                <Popover.Root>
                    <Popover.Trigger
                        class={cn(
                            buttonVariants({ variant: "outline" }),
                            !value && "text-muted-foreground"
                        )}
                    >
                    <CalendarIcon class="mr-2 size-4" />
                    {#if value && value.start}
                        {#if value.end}
                            {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
                                value.end.toDate(getLocalTimeZone())
                            )}
                        {:else}
                            {df.format(value.start.toDate(getLocalTimeZone()))}
                        {/if}
                    {:else if startValue}
                        {df.format(startValue.toDate(getLocalTimeZone()))}
                    {:else}
                        Pilih rentang tanggal kegiatan
                    {/if}
                    </Popover.Trigger>
                    <Popover.Content class="w-auto p-0" align="start">
                    <RangeCalendar
                        bind:value={value}
                        onValueChange={() => updateDate()}
                        numberOfMonths={2}
                    />
                    </Popover.Content>
                </Popover.Root>
            </div>
            <input type="hidden" name="start" value={value.start ? value.start.toDate(getLocalTimeZone()).toISOString() : ""} />
            <input type="hidden" name="end" value={value.end ? value.end.toDate(getLocalTimeZone()).toISOString() : ""} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <!-- team -->
    <Form.Field {form} name="team">
    <Form.Control>
        <Form.Label>Pilih Tim*</Form.Label>
        <Select.Root
        type="single"
        bind:value={$formEvent.team}
        class="w-full"
        >
        <Select.Trigger class="w-full">
            {#if $formEvent.team}
                {teamList.find(t => t.id === +$formEvent.team)?.tim || "Pilih tim"}
            {:else}
                Pilih tim
            {/if}
        </Select.Trigger>
        <Select.Content>
            {#each teamList as team}
                <Select.Item value={team.id.toString()}>
                {team.tim}
            </Select.Item>
            {/each}
        </Select.Content>
    </Select.Root>
    <input type="hidden" name="team" value={$formEvent.team} />
    </Form.Control>
    <Form.Description>Pilih tim yang terlibat.</Form.Description>
    <Form.FieldErrors />
    </Form.Field>
    <Form.Button>Tambahkan</Form.Button>
</form>