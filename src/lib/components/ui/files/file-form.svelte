<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { fileSchema, type FileSchema } from "$lib/schemas/files-schema.js";
    import {
     type SuperValidated,
     type Infer,
     superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { toast } from "svelte-sonner";
    
    let { dataForm, onSuccess }: { 
        dataForm: SuperValidated<Infer<FileSchema>>;
        onSuccess?: () => void;
    } = $props();


    const form = superForm(dataForm, {
        validators: zodClient(fileSchema),
        SPA: true,
        onUpdate: ({ form: f }) => {
        if (f.valid) {
            toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
            onSuccess?.();
        } else {
            toast.error("Please fix the errors in the form.");
        }
        },
    });
    
    const { form: formData, enhance } = form;
</script>
    
<form method="POST" use:enhance>
    <Form.Field {form} name="name">
        <Form.Control>
            {#snippet children({ props })}
            <Form.Label>Judul</Form.Label>
            <Input {...props} bind:value={$formData.name} />
            {/snippet}
        </Form.Control>
        <Form.Description>Masukkan Judul</Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button>Submit</Form.Button>
</form>