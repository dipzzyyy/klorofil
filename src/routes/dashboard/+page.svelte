<script lang="ts">
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import CalendarEvent from "$lib/components/calendar-31.svelte"
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
              <Breadcrumb.Page>Dashboard</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="grid auto-rows-min gap-4 lg:grid-cols-2">
        <div class="aspect-video rounded-xl w-full max-w-min p-4 sm:p-6 md:p-8">
          <CalendarEvent />
        </div>
        <div class="bg-muted/50 aspect-video rounded-xl">
          cs
        </div>
      </div>
      <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>