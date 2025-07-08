<script lang="ts">
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import CalendarEvent from "$lib/components/calendar-31.svelte"
  import InformationBoard from "$lib/components/information.svelte"
  import FileBoard from "$lib/components/file-board.svelte"
  import DataTable from "$lib/components/ui/files/data-table.svelte";
  import { columns } from "$lib/components/ui/files/columns.js";
  import type { File } from "$lib/components/ui/files/columns.ts";
  
  let props = $props();
  let informationRef: HTMLDivElement;
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header class="flex h-16 shrink-0 items-center gap-2">
      <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Page>Sakip</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>
    </header>
    <div class="flex flex-col gap-4 p-4 pt-0">
      <div class="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
        <!-- calendar -->
        <div class="w-full min-w-0">
          <div class="rounded-xl w-full h-full sm:p-2 md:p-8 bg-muted/50 shadow">
            <CalendarEvent eventForm={props.data.formEvent} eventEditForm={props.data.formEditEvent} eventData={props.data.dataEvent} teamList={props.data.teamList}/>
          </div>
        </div>
    
        <!-- info board -->
        <div class="w-full min-w-0">
          <div class="rounded-xl w-full h-full p-4 sm:p-6 md:p-8 bg-white shadow min-w-2xs">
            <InformationBoard 
              informations={props.data.data}
              onSeeAll={() => {
                informationRef.scrollIntoView({ behavior: "smooth" });
                // Delay slightly to ensure scroll has started before applying filter
                setTimeout(() => {
                  // You can expose applyFilter via context or event, or trigger a custom event
                  const evt = new CustomEvent("applyPengumuman");
                  window.dispatchEvent(evt);
                }, 300);
              }}
              />
          </div>
        </div>
      </div>
    
      <!-- file board always below -->
      <div class="w-full max-w-screen-xl mx-auto">
        <div class="bg-muted/50 rounded-xl p-4 sm:p-6 md:p-8" bind:this ={informationRef}>
          <DataTable allData={props.data} columns={columns} />
        </div>
      </div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>