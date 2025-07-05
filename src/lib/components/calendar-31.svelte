<script lang="ts">
	import { formatDateRange } from "little-date";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import EditIcon from "@lucide/svelte/icons/pencil-line";
	import { Button } from "$lib/components/ui/button/index.js";
	import Calendar from "$lib/components/ui/calendar/calendar.svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import { MediaQuery } from "svelte/reactivity";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import AddEventForm from "$lib/components/ui/calendar-event/add-event.svelte"
	import EditEventForm from "$lib/components/ui/calendar-event/edit-event.svelte"
	import { CalendarDate, getLocalTimeZone, type DateValue, now, today } from "@internationalized/date";
    import type { Infer, SuperValidated } from "sveltekit-superforms";
    import type { EventSchema } from "$lib/schemas/event-schema";
	import type { EventItem } from "$lib/components/ui/calendar-event/event-item-type.js"

	let { eventForm, eventEditForm, eventData, teamList } : {
		eventForm: SuperValidated<Infer<EventSchema>>;
		eventEditForm: SuperValidated<Infer<EventSchema>>;
		eventData: EventItem[];
		teamList: {id:number, tim:string}[];
	} = $props()

	let showForm = $state(false);
	let isCreate = $state(false);
	let isEdit = $state(false);

	let editItem = $state<EventItem>({
		id:0,
		name:'',
		description: '',
		start: '',
		end: '',
		team:0
	});

	const isDesktop = new MediaQuery("(min-width: 768px)");
	let value = $state<DateValue | undefined>(new CalendarDate(now(getLocalTimeZone()).year, now(getLocalTimeZone()).month, now(getLocalTimeZone()).day));
	let filteredEvents = $state<EventItem[]>([]);

	// function to filter date
	$effect(() => {
		if (!value) {
			filteredEvents = [];
			return;
		}

		const selectedDate = value.toDate(getLocalTimeZone());
		selectedDate.setHours(0, 0, 0, 0); // hilangkan jam

		filteredEvents = eventData.filter((event) => {
			const start = new Date(event.start);
			const end = new Date(event.end);

			// samakan timezone
			start.setHours(0, 0, 0, 0);
			end.setHours(23, 59, 59, 999); 

			return selectedDate >= start && selectedDate <= end;
		});
	});

	// formatting date
	function formatTanggalRange(startStr: string, endStr: string): string {
		const start = new Date(startStr);
		const end = new Date(endStr);

		const options: Intl.DateTimeFormatOptions = {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		};

		const locale = 'id-ID';

		const startFormatted = start.toLocaleDateString(locale, options);
		const endFormatted = end.toLocaleDateString(locale, options);

		// Kalau start dan end sama, tampil satu tanggal
		if (startFormatted === endFormatted) {
			return startFormatted;
		}

		return `${start.getDate()} - ${endFormatted}`;
	}	
	console.log(eventData);
</script>

<Card.Root class="w-full">
	<Card.Content class="w-full">
		<div class="">
			<Calendar 
				type="single" 
				bind:value 
				class="w-full bg-transparent px-10 flex justify-between rounded-lg border shadow-sm [--cell-size:--spacing(10)] md:[--cell-size:--spacing(13)]" 
				preventDeselect
				weekdayFormat="long"
				fixedWeeks={true}
				initialFocus={true} />
		</div>
	</Card.Content>
	<Card.Footer class="flex flex-col items-start gap-3 border-t px-4 !pt-4">
		<div class="flex w-full items-center justify-between px-1">
			<div class="text-sm font-medium">
				{value?.toDate(getLocalTimeZone()).toLocaleDateString("en-US", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})}
			</div>
			<Button 
				variant="ghost" 
				size="icon" 
				class="size-6" 
				title="Add Event"
				onclick={() => {
					showForm=true; 
					isCreate=true;
					isEdit=false;
				}}
			>
				<PlusIcon />
				<span class="sr-only">Add Event</span>
			</Button>
		</div>
		{#if filteredEvents.length > 0}
			{#each filteredEvents as event (event.id)}
				<div class="w-full flex items-center justify-between bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full">
					<div class="pl-4">
						<div class="font-medium">{event.name}</div>
						<div class="text-xs text-muted-foreground w-full">
							{formatTanggalRange(event.start, event.end)} - {teamList.find(t => t.id === event.team)?.tim || 'Tim tidak ditemukan'}
						</div>
					</div>
					<Button variant="outline" onclick={() => {
						showForm = true;
						isCreate = false;
						isEdit = true;
						editItem = event;
						}}>
						<EditIcon />
					</Button>
				</div>
			{/each}
		{:else}
			<div class="italic text-muted-foreground text-sm">Tidak ada kegiatan pada hari ini.</div>
		{/if}
	</Card.Footer>
</Card.Root>

<!-- add event -->
{#if isDesktop} 
	<Dialog.Root open={showForm} onOpenChange={(v) => showForm = v}>
		<Dialog.Content>
			<Dialog.Header>
				{#if isCreate}
				<Dialog.Title>Tambah Kegiatan</Dialog.Title>
				{:else if isEdit}
				<Dialog.Title>Perbarui Kegiatan</Dialog.Title>
				{/if}
			</Dialog.Header>
			{#if isCreate}
			<AddEventForm initForm={eventForm} onSuccess={() => showForm = false} teamList={teamList} />
			{:else if isEdit}
			<EditEventForm initForm={eventEditForm} onSuccess={() => showForm = false} teamList={teamList} editItem={editItem} />
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{:else} 
	<Drawer.Root open={showForm} onOpenChange={(v) => showForm = v}>
		<Drawer.Content>
			<Drawer.Header>
				{#if isCreate}
				<Drawer.Title>Tambah Kegiatan</Drawer.Title>
				{:else if isEdit}
				<Drawer.Title>Perbarui Kegiatan</Drawer.Title>
				{/if}
			</Drawer.Header>
			{#if isCreate}
			<AddEventForm initForm={eventForm} onSuccess={() => showForm = false} teamList={teamList} />
			{:else if isEdit}
			<EditEventForm initForm={eventEditForm} onSuccess={() => showForm = false} teamList={teamList} editItem={editItem} />
			{/if}
		</Drawer.Content>
	</Drawer.Root>
{/if}
