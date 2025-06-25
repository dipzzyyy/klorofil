<script lang="ts">
    import {Button} from "$lib/components/ui/button"
    import DataTable from "$lib/components/ui/files/data-table.svelte"
    import { columns } from "$lib/components/ui/files/columns.js";
    import type { File } from "$lib/components/ui/files/columns.ts";

    
    let { data } = $props();
    
    // const data = dataFetched.file.map((f: File) => ({
    //     ...f,
    //     id: f.id.toString(),
    //     importance: f.importance.replace(/"/g, "")
    // }));

    // const form = dataFetched.form;

    // const alls = {data, form}
    // console.log(alls);
</script>

<h1>no</h1>
<Button href="/dashboard">Helo</Button>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Button>
  Click me
</Button>

<DataTable allData={data} columns={columns} />