<script lang="ts">
    import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
    import LinkIcon from "@lucide/svelte/icons/link";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    
    let { id, link }: {
         id: string,
         link : string, 
        } 
    = $props();

    function handleLinkClick() {
        // navigator.clipboard.writeText(link);
        window.open(link, "_blank");
        // alert("Link copied to clipboard!");
    }
   </script>

<div>
    <!-- link button -->
     <Button
        variant ="ghost"
        size="icon"
        class="relative size-8 p-0"
        onclick = {handleLinkClick}
     >
        <LinkIcon />
     </Button>
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
</div>