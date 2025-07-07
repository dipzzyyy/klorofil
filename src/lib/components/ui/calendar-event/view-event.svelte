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
        
    let { onSuccess, viewItem, teamList }: { 
        onSuccess?: () => void;
        viewItem: EventItem;
        teamList: {id:number, tim:string}[];
    } = $props();
    
    const df = new DateFormatter("id-ID", {
        dateStyle: "medium"
    });
    
    let value: DateRange = $state({
        start: undefined,
        end: undefined
    });

    function formatDate(dateStr?: string) {
        if (!dateStr) return "-";
        try {
        const date = new Date(dateStr);
        return df.format(date);
        } catch {
        return dateStr;
        }
    }

    function getTeamName(teamId?: number | string) {
        if (!teamId) return "-";
        const team = teamList.find(t => String(t.id) === String(teamId));
        return team ? team.tim : "-";
    }

</script>

<div class="space-y-2">
  <h2 class="text-lg font-bold">{viewItem.name}</h2>

  <p class="text-sm text-gray-600">{viewItem.description || "-"}</p>

  <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm">
    <div>
      <span class="font-medium">Mulai:</span> {formatDate(viewItem.start)}
    </div>
    <div>
      <span class="font-medium">Selesai:</span> {formatDate(viewItem.end)}
    </div>
  </div>

  <div class="text-sm">
    <span class="font-medium">Tim terlibat:</span> {getTeamName(viewItem.team)}
  </div>
</div>
    
