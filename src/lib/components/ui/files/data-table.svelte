<script lang="ts" generics="TData, TValue">
    // buat see all di information board
    import { onMount } from "svelte"; 
    onMount(() => {
        const handler = () => applyFilter({ type: "pengumuman" });
        window.addEventListener("applyPengumuman", handler);
        return () => window.removeEventListener("applyPengumuman", handler);
    });

    import {
        type ColumnDef,
        type PaginationState,
        type SortingState,
        type ColumnFiltersState,
        getCoreRowModel,
        getPaginationRowModel,
        getSortedRowModel,
        getFilteredRowModel,
    } from "@tanstack/table-core";
    import { Input } from "$lib/components/ui/input/index.js";
    import {
     createSvelteTable,
     FlexRender,
    } from "$lib/components/ui/data-table/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { File } from "$lib/components/ui/files/columns.js";
    import FileBoard from "$lib/components/file-board.svelte";
    import * as Card from "$lib/components/ui/card"
    import FilterIcon from "@lucide/svelte/icons/folders"
    import UrgencyIcon from "@lucide/svelte/icons/octagon-alert"
    // modal
    import { MediaQuery } from "svelte/reactivity";
    import DataTableFacetedFilter from "$lib/components/ui/files/data-table-faceted-filter.svelte";
    // form
    import type { SuperValidated, Infer } from "sveltekit-superforms";
    import { type FileSchema } from "$lib/schemas/files-schema.js";
    import AddButton from "$lib/components/ui/files/data-table-add-button.svelte";
    import DataTableActions from "$lib/components/ui/files/data-table-actions.svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

    type DataTableProps<TData, TValue> = {
        allData: {
            data: TData[];
            form: SuperValidated<Infer<FileSchema>>;
        }
        columns: ColumnDef<TData, TValue>[];
    };
    
    let { allData, columns }: DataTableProps<TData, TValue> = $props();
    
    let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
    let sorting = $state<SortingState>([]);
    let columnFilters = $state<ColumnFiltersState>([]);
    
    // filtering category (get label)
    const uniqueLabels = $derived.by(() => {
        const labels = new Set<string>();
        for (const item of allData.data) {
            if (item.label) labels.add(item.label);
        }
        return Array.from(labels);
    });
    
    const table = createSvelteTable({
        get data() {
            return allData.data;
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: (updater) => {
        if (typeof updater === "function") {
            pagination = updater(pagination);
        } else {
            pagination = updater;
        }
        },
        onSortingChange: (updater) => {
        if (typeof updater === "function") {
            sorting = updater(sorting);
        } else {
            sorting = updater;
        }
        },
        onColumnFiltersChange: (updater) => {
        if (typeof updater === "function") {
            columnFilters = updater(columnFilters);
        } else {
            columnFilters = updater;
        }
        },
        state: {
        get pagination() {
            // only 10 items per page
            return pagination;
        },
        get sorting() {
            return sorting;
        },
        get columnFilters() {
            return columnFilters;
        },
        },
    });

    // more function to filter category
    function applyFilter({
        label = undefined,
        type = undefined
    }: {
        label?: string | undefined;
        type?: string | undefined;
    }) {
        table.getColumn("label")?.setFilterValue(label);
        table.getColumn("type")?.setFilterValue(type);
    }

    const isDesktop = new MediaQuery("(min-width: 768px)");

</script>

<div>
    <Card.Root> 
        <Card.Header>
            <Card.Title>Kumpulan Fail General</Card.Title>
            <Card.Description>Fail-fail general untuk seluruh pegawai BPS Kabupaten Rokan Hilir</Card.Description>
        </Card.Header>
        <Card.Content>
            <!-- folder bar -->
            <div class="grid gap-4 md:grid-cols-4 max-w-full">
                <div class="rounded-sm md:col-span-1">
                    {#if isDesktop.current}
                        <div class="rounded-sm bg-gray-50 p-2 h-full border-1 border-gray-200">
                            <Button
                                class="w-full justify-start text-gray-900 hover:bg-gray-100 truncate"
                                variant={
                                    !table.getColumn("label")?.getFilterValue() &&
                                    !table.getColumn("type")?.getFilterValue()
                                    ? "secondary"
                                    : "ghost"
                                }
                                onclick={() => applyFilter({})}
                            >
                                Semua Fail
                            </Button>
                            {#each uniqueLabels as label}
                                <Button
                                    class="w-full justify-start text-gray-900 hover:bg-gray-100 truncate"
                                    variant={table.getColumn("label")?.getFilterValue() === label ? "secondary" : "ghost"}
                                    onclick={() => applyFilter({ label })}
                                >
                                    {label}
                                </Button>
                            {/each}

                            {#if !uniqueLabels.includes("Administrasi")}
                                <Button
                                    class="w-full justify-start text-gray-900 hover:bg-gray-100 truncate"
                                    variant={
                                        table.getColumn("label")?.getFilterValue() === "administrasi"
                                        ? "secondary"
                                        : "ghost"
                                    }
                                    onclick={() => applyFilter({ label:"administrasi" })}
                                >
                                    Administrasi
                                </Button>
                            {/if}

                            <Button
                                class="w-full justify-start text-gray-900 hover:bg-gray-100 truncate"
                                variant={
                                    table.getColumn("type")?.getFilterValue() === "pengumuman"
                                    ? "secondary"
                                    : "ghost"
                                }
                                onclick={() => applyFilter({ type: "pengumuman" })}
                            >
                                Pengumuman
                            </Button>

                        </div>
                    {:else}
                        <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <span class="inline-flex bg-primary rounded-sm text-white p-2 text-sm gap-2"><FilterIcon /> Kategori</span>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content class="w-48">
                            <DropdownMenu.Item onSelect={() => applyFilter({})}>
                                Semua Fail
                            </DropdownMenu.Item>

                            {#each uniqueLabels as label}
                                <DropdownMenu.Item onSelect={() => applyFilter({ label })}>
                                    {label}
                                </DropdownMenu.Item>
                            {/each}

                            {#if !uniqueLabels.includes("Administrasi")}
                                <DropdownMenu.Item onSelect={() => applyFilter({ label: "administrasi" })}>
                                    Administrasi
                                </DropdownMenu.Item>
                            {/if}

                            <DropdownMenu.Item onSelect={() => applyFilter({ type: "pengumuman" })}>
                                Pengumuman
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                {/if}
                </div>
                <!-- tabel dan lainnya -->
                <div class="md:col-span-3 flex flex-col gap-4 overflow-x-auto">
                    <!-- header buttons and filter -->
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <!-- filter -->
                        <div class="flex-grow py-4">
                            <Input
                                placeholder="Cari fail..."
                                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                onchange={(e) => {
                                    table.getColumn("name")?.setFilterValue(e.currentTarget.value);
                                }}
                                oninput={(e) => {
                                    table.getColumn("name")?.setFilterValue(e.currentTarget.value);
                                }}
                                class="w-full max-w-sm"
                            />
                        </div>
                        <!-- buttons -->
                         <div class="inline-flex m-3 gap-2 align-center">
                            <!-- urgency filter -->
                            <div class="">
                                <DataTableFacetedFilter
                                column={table.getColumn("importance")!}
                                title="Urgensi"
                                options={[
                                    { label: "Urgent", value: "true" },
                                    { label: "Biasa", value: "false" }
                                ]}
                                icon={UrgencyIcon}
                                />                
                            </div>
                            <!-- add button -->
                            <div class="col-span-1">
                                <AddButton form={allData.form} labels={uniqueLabels} />
                            </div>
                         </div>
                    </div>
                    <!-- table -->
                    <div class="rounded-md border overflow-x-auto">
                        <Table.Root>
                            <Table.Header>
                                {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                                    <Table.Row>
                                        {#each headerGroup.headers as header (header.id)}
                                            <Table.Head class="pl-3">
                                            {#if !header.isPlaceholder}
                                                <FlexRender
                                                    content={header.column.columnDef.header}
                                                    context={header.getContext()}
                                                />
                                            {/if}
                                            </Table.Head>
                                        {/each}
                                    </Table.Row>
                                {/each}
                            </Table.Header>
                            <Table.Body>
                                {#each table.getRowModel().rows as row (row.id)}
                                    <Table.Row data-state={row.getIsSelected() && "selected"}>
                                        {#each row.getVisibleCells().filter(cell => cell.column.id !== "label" && cell.column.id !== "type") as cell (cell.id)}
                                            <Table.Cell>
                                                <FlexRender
                                                content={cell.column.columnDef.cell}
                                                context={cell.getContext()}
                                                />
                                            </Table.Cell>
                                            <!-- action -->
                                            {/each}
                                            <Table.Cell>
                                                <DataTableActions file={row.original} labels={uniqueLabels} />
                                            </Table.Cell>
                                    </Table.Row>
                                    {:else}
                                    <Table.Row>
                                        <Table.Cell colspan={columns.length} class="h-24 text-center">
                                        No results.
                                        </Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    </div>
                    <!-- pagination -->
                    <div class="flex items-center justify-end space-x-2 py-4">
                        <Button
                        variant="outline"
                        size="sm"
                        onclick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        >
                        Sebelumnya
                        </Button>
                        <Button
                        variant="outline"
                        size="sm"
                        onclick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        >
                        Selanjutnya
                        </Button>
                    </div>
                </div>
            </div>
        </Card.Content>
    </Card.Root>
</div>