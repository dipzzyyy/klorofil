<script lang="ts">
    import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    
    let { id }: { id: string } = $props();
   </script>
    
   <DropdownMenu.Root>
    <DropdownMenu.Trigger>
     {#snippet child({ props })}
      <Button
       {...props}
       variant="ghost"
       size="icon"
       class="relative size-8 p-0"
      >
       <span class="sr-only">Open menu</span>
       <EllipsisIcon />
      </Button>
     {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
    <!-- bisa add group juga, i deleted that thou -->
     <DropdownMenu.Item>Sunting</DropdownMenu.Item>
     <DropdownMenu.Item>Hapus</DropdownMenu.Item>
    </DropdownMenu.Content>
   </DropdownMenu.Root>