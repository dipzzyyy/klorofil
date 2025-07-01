<script lang="ts">
    // ini buat type toggle
    import { onMount } from "svelte";
    onMount(() => {
        updateType(); // initialize formData.type on first load
    });

    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";
    import { Toggle } from "$lib/components/ui/toggle";
    import { fileSchema, type FileSchema } from "$lib/schemas/files-schema.js";
    import {
     type SuperValidated,
     type Infer,
     superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { toast } from "svelte-sonner";
    import { invalidate, invalidateAll } from '$app/navigation';
    
    let { dataForm, onSuccess }: { 
        dataForm: SuperValidated<Infer<FileSchema>>;
        onSuccess?: () => void;
    } = $props();


    const form = superForm(dataForm, {
        validators: zodClient(fileSchema),
        onResult: async ({ result: f }) => {
        if (f.status == 200) {
            toast.success(`Berhasil menambahkan.`);
            // refresh page
            await invalidateAll();
            onSuccess?.();
        } else {
            toast.error("Gagal menambahkan. Tolong perbaiki isian anda");
        }
        },
    });
    
    const { form: formData, enhance } = form;

    // for type toggle
	let filePressed = $state(true);
	let announcementPressed = $state(false);

	function updateType() {
        if (!filePressed && !announcementPressed) {
            filePressed = true;
            $formData.type = "fail";
        } else {
            $formData.type =
                filePressed && announcementPressed
                    ? "both"
                    : filePressed
                    ? "fail"
                    : "pengumuman";
        }
    }
</script>
    
<form method="POST" use:enhance class="space-y-6" action="?/create">
    <!-- Type Toggle -->
	<Form.Field {form} name="type">
        <Form.Control>
            {#snippet children({ props })}
            <div class="w-full inline-flex gap-2 content-between">
                <div>
                    <Form.Label>Jenis Fail*</Form.Label>
                    <Form.Description>Pilih setidaknya satu jenis fail</Form.Description>
                </div>
                <div>
                    <input type="hidden" name="type" value={$formData.type ?? ''}/>
                    <Toggle
                        {...props}
                        pressed={filePressed}
                        onPressedChange={(v) => {
                            filePressed = v;
                            updateType();
                        }}
                        variant="outline"
                    >
                        File
                    </Toggle>
                    <Toggle
                        {...props}
                        pressed={announcementPressed}
                        onPressedChange={(v) => {
                            announcementPressed = v;
                            updateType();
                        }}
                        variant="outline"
                    >
                        Pengumuman
                    </Toggle>
                </div>
                </div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
    <!-- judul -->
    <Form.Field {form} name="name">
        <Form.Control>
            {#snippet children({ props })}
            <Form.Label>Judul*</Form.Label>
            <Input {...props} bind:value={$formData.name} placeholder="Masukkan judul fail" />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <!-- description -->
    <Form.Field {form} name="description">
        <Form.Control>
            {#snippet children({ props })}
            <Form.Label>Deskripsi</Form.Label>
            <Input {...props} bind:value={$formData.description} placeholder="Deskripsi fail" />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <!-- link -->
    <Form.Field {form} name="link">
        <Form.Control>
            {#snippet children({ props })}
            <Form.Label>Tautan*</Form.Label>
            <Input {...props} bind:value={$formData.link} placeholder="Masukkan tautan URL dari fail" />
            {/snippet}
        </Form.Control>
        <Form.Description>Dapat berupa tautan Google Drive atau lainnya</Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <!-- importance -->
    <Form.Field {form} name="importance">
        <Form.Control>
            {#snippet children({ props })}
            <div class="inline-flex items-center space-x-2">
                <input type="hidden" name="importance" value={$formData.importance ?? 'false'}>
                <Form.Label>Penting?</Form.Label>
                <Switch
                    checked={$formData.importance === "true"}
                    onCheckedChange={(value) => {
                        $formData.importance = value ? "true" : "false";
                    }} 
                />
            </div>
            {/snippet}
        </Form.Control>
        <Form.Description>Tandai jika penting</Form.Description>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Button>Tambahkan</Form.Button>
</form>