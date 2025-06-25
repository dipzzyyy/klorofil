<!-- routes/test/+page.svelte -->
<script lang="ts">
	import FileForm from "$lib/components/ui/files/file-form.svelte";
	import { superValidate } from "sveltekit-superforms";
	import { fileSchema } from "$lib/schemas/files-schema";
	
	export let data;
</script>

<h1>Test Insert Form</h1>
<FileForm dataForm={data.form} />
