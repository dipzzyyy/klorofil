<script lang="ts">
    let { size, children } = $props();
</script>

{#if size === "h1"}
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {@render children?.()}
    </h1>
{:else if size === "h2"}
    <h2
    class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
    {@render children?.()}
    </h2>
{:else if size === "h3"}
    <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
    {@render children?.()}
    </h3>
{/if}