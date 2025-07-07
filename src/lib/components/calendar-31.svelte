<script lang="ts">
	import { formatDateRange } from "little-date";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import InfoIcon from "@lucide/svelte/icons/info";
	import EditIcon from "@lucide/svelte/icons/pencil-line";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Calendar } from "bits-ui";
	import * as Card from "$lib/components/ui/card/index.js";
	import { MediaQuery } from "svelte/reactivity";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import AddEventForm from "$lib/components/ui/calendar-event/add-event.svelte"
	import EditEventForm from "$lib/components/ui/calendar-event/edit-event.svelte"
	import ViewEventDetails from "$lib/components/ui/calendar-event/view-event.svelte"
	import { CalendarDate, getLocalTimeZone, type DateValue, now, today } from "@internationalized/date";
    import type { Infer, SuperValidated } from "sveltekit-superforms";
    import type { EventSchema } from "$lib/schemas/event-schema";
	import type { EventItem } from "$lib/components/ui/calendar-event/event-item-type.js"
    import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Tooltip } from "bits-ui";
    import { toast } from "svelte-sonner";
    import { invalidateAll } from "$app/navigation";
    import { TooltipProvider } from "./ui/tooltip";

	let { eventForm, eventEditForm, eventData, teamList } : {
		eventForm: SuperValidated<Infer<EventSchema>>;
		eventEditForm: SuperValidated<Infer<EventSchema>>;
		eventData: EventItem[];
		teamList: {id:number, tim:string}[];
	} = $props()

	// tampilin modal. create is for create form, edit is for edit form, and view is for viewing
	let showForm = $state(false);
	let isCreate = $state(false);
	let isEdit = $state(false);
	let isView = $state(false);

	// var to store what items wanna be edited
	let editItem = $state<EventItem>({
		id:0,
		name:'',
		description: '',
		start: '',
		end: '',
		team:0
	});

	// for popup
	const isDesktop = new MediaQuery("(min-width: 768px)");
	// intial date = today
	let value = $state<DateValue | undefined>(new CalendarDate(now(getLocalTimeZone()).year, now(getLocalTimeZone()).month, now(getLocalTimeZone()).day));
		
	// function to filter date
	let filteredEvents = $state<EventItem[]>([]);
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

	// function to delete event
	async function deleteEvent(id:number) {
        if (!confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) return;

		const formData = new FormData();
        formData.append("id", id.toString());

		try {
			const res = await fetch("?/deleteEvent", {
				method: "POST",
				body: formData
			});

			const result = await res.json();

			if (result.status == 200 && result.type == "success") {
				toast.success("Berhasil dihapus");
				await invalidateAll();
			} 
		} catch (e) {
            toast.error("Gagal menghapus");
        }
    }

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

	// settings for displaying date and dots to indicate event
	// Build a Set of event dates in YYYY-MM-DD format
	let dateEventsMap = $state(new Map<string, EventItem[]>());

	$effect(() => {
		const map = new Map<string, EventItem[]>();
		for (const event of eventData) {
			const start = new Date(event.start);
			const end = new Date(event.end);

			for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
				const y = d.getFullYear();
				const m = String(d.getMonth() + 1).padStart(2, "0");
				const day = String(d.getDate()).padStart(2, "0");
				const key = `${y}-${m}-${day}`;
				if (!map.has(key)) {
					map.set(key, []);
				}
				map.get(key)?.push(event);
			}
		}
		dateEventsMap = map;
	});

	// formatting date
	function formatCalendarDate(date: DateValue): string {
		const calDate = date.toDate(getLocalTimeZone());
		const y = calDate.getFullYear();
		const m = String(calDate.getMonth() + 1).padStart(2, "0");
		const d = String(calDate.getDate()).padStart(2, "0");
		return `${y}-${m}-${d}`;
	}

	// coloring the event dots according to team	
	function getEventColor(ev: EventItem): string {
		const colors = [
			"#3b82f6", // blue
			"#ef4444", // red
			"#f59e0b", // amber
			"#10b981", // emerald
			"#8b5cf6", // violet
			"#ec4899", // pink
			"#22c55e", // green
			"#eab308", // yellow
			"#06b6d4", // cyan
			"#d946ef", // fuchsia
			"#fb923c", // orange
			"#0ea5e9", // sky
			"#a3e635", // lime
		];

		const teamIndex = teamList.findIndex(t => t.id === ev.team);
		return colors[teamIndex % colors.length] || "#6b7280"; // fallback gray
	}
</script>

<Card.Root class="w-full">
	<Card.Content class="w-full p-4 sm:p-0">
		<div class="">
			<Calendar.Root 
				type="single" 
				bind:value 
				class="w-full bg-transparent md:px-10 border-dark-10 shadow-card rounded-[15px] border p-4"
				preventDeselect
				weekdayFormat="long"
				fixedWeeks={true}
				initialFocus={true}>
					{#snippet children({ months, weekdays })}
					<!-- Header -->
					<Calendar.Header class="flex items-center justify-between mb-2">
						<Calendar.PrevButton class="rounded bg-muted p-2 hover:bg-primary/10">
							&lt;
						</Calendar.PrevButton>
						<Calendar.Heading class="text-sm font-medium" />
						<Calendar.NextButton class="rounded bg-muted p-2 hover:bg-primary/10">
							&gt;
						</Calendar.NextButton>
					</Calendar.Header>

					<div class="flex flex-col space-y-4 pt-2 sm:flex-row sm:space-x-4 sm:space-y-0">
						{#each months as month, i (i)}
							<Calendar.Grid class="w-full border-collapse select-none space-y-1">
								<Calendar.GridHead>
									<Calendar.GridRow class="mb-1 flex w-full justify-between">
										{#each weekdays as day, i (i)}
											<Calendar.HeadCell class="text-muted-foreground w-10 rounded-md text-xs">
												{day.slice(0, 2)}
											</Calendar.HeadCell>
										{/each}
									</Calendar.GridRow>
								</Calendar.GridHead>
								<Calendar.GridBody>
									{#each month.weeks as weekDates, i (i)}
										<Calendar.GridRow class="w-full flex items-center justify-between mb-2">
											{#each weekDates as date, i (i)}
												<Calendar.Cell
													{date}
													month={month.value}
													class="p-0! relative md:size-10 aspect-square text-center text-sm w-full"
												>
													<Calendar.Day
														class="rounded text-foreground hover:border-foreground data-selected:bg-primary data-disabled:text-foreground/30 data-outside-month:pointer-events-none data-selected:text-background group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm"
													>
														{date.day}

														{#if dateEventsMap.has(formatCalendarDate(date))}
															<div class="absolute bottom-[2px] left-1/2 grid -translate-x-1/2 grid-cols-3 gap-[1px]">
																{#each (dateEventsMap.get(formatCalendarDate(date)) ?? []).slice(0, 4) as ev (ev.id)}
																	<div
																		class="w-1 h-1 rounded-full"
																		style="background-color: {getEventColor(ev)}"
																	></div>
																{/each}
															</div>
														{/if}
													</Calendar.Day>
												</Calendar.Cell>
											{/each}
										</Calendar.GridRow>
									{/each}
								</Calendar.GridBody>
							</Calendar.Grid>
						{/each}
					</div>
				{/snippet}
			</Calendar.Root>
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
				title="Tambahkan Kegiatan"
				onclick={() => {
					showForm=true; 
					isCreate=true;
					isEdit=false;
					isView = false;
				}}
			>
				<PlusIcon />
				<span class="sr-only">Tambahkan Kegiatan</span>
			</Button>
		</div>
		<div class="w-full max-h-48 overflow-y-auto pr-2 flex flex-col gap-3">
			{#if filteredEvents.length > 0}
				{#each filteredEvents as event (event.id)}
					<div 
						class="event-item w-full flex items-center justify-between bg-muted relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
						style="--tw-content: ''; --tw-team-color: {getEventColor(event)};"
						>
						<style>
							.event-item::after {
							background-color: color-mix(in oklab, var(--tw-team-color) 70%, transparent);
							content: var(--tw-content);
							}
						</style>
						<div class="pl-4">
							<div class="font-medium">{event.name}</div>
							<div class="text-xs text-muted-foreground w-full">
								{formatTanggalRange(event.start, event.end)} - {teamList.find(t => t.id === event.team)?.tim || 'Tim tidak ditemukan'}
							</div>
						</div>
						<div>
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<Button 
											size="icon"
											variant="ghost"
											onclick={() => {
												showForm = true;
												isCreate = false;
												isEdit = false;
												isView = true;
												editItem = event;
										}}>
											<InfoIcon/>
										</Button>
									</Tooltip.Trigger>
									<Tooltip.Content
										side="top"
										align="center"
										class="z-50 rounded-md bg-black px-3 py-1.5 text-sm text-white shadow-md"
									>
										<p>Detail Kegiatan</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider> 
							<!-- action dropdown -->
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
												<DropdownMenu.Item onSelect={() => {
													showForm = true;
													isCreate = false;
													isView = false;
													isEdit = true;
													editItem = event;
												}}>
													Sunting
												</DropdownMenu.Item>
												<DropdownMenu.Item class="hover:bg-red-400 text-red-800" onSelect={() => deleteEvent(event.id)}>
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
						</div>
					</div>
				{/each}
			{:else}
				<div class="italic text-muted-foreground text-sm">Tidak ada kegiatan pada hari ini.</div>
			{/if}
		</div>
	</Card.Footer>
</Card.Root>

<!-- popup for add event and update -->
{#if isDesktop.current} 
	<Dialog.Root open={showForm} onOpenChange={(v) => showForm = v}>
		<Dialog.Content>
			<Dialog.Header>
				{#if isCreate}
				<Dialog.Title>Tambah Kegiatan</Dialog.Title>
				{:else if isEdit}
				<Dialog.Title>Perbarui Kegiatan</Dialog.Title>
				{:else if isView}
				<Dialog.Title>Detail Kegiatan</Dialog.Title>
				{/if}
			</Dialog.Header>
			{#if isCreate}
				<AddEventForm initForm={eventForm} onSuccess={() => showForm = false} teamList={teamList} />
			{:else if isEdit}
				<EditEventForm initForm={eventEditForm} onSuccess={() => showForm = false} teamList={teamList} editItem={editItem} />
			{:else if isView}
				<ViewEventDetails viewItem={editItem} onSuccess={() => showForm = false } teamList={teamList}/>
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
				{:else if isView}
				<Drawer.Title>Detail Kegiatan</Drawer.Title>
				{/if}
			</Drawer.Header>
			<div class="gap-2 p-5 overflow-y-auto">
				{#if isCreate}
				<AddEventForm initForm={eventForm} onSuccess={() => showForm = false} teamList={teamList} />
				{:else if isEdit}
				<EditEventForm initForm={eventEditForm} onSuccess={() => showForm = false} teamList={teamList} editItem={editItem} />
				{:else if isView}
				<ViewEventDetails viewItem={editItem} onSuccess={() => showForm = false } teamList={teamList}/>
				{/if}
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
