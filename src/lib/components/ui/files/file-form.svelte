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
    
    // on success untuk nutup dialog
    let { dataForm, onSuccess }: { 
        dataForm: SuperValidated<Infer<FileSchema>>;
        onSuccess?: () => void;
    } = $props();

    
    const form = superForm(dataForm, {
        validators: zodClient(fileSchema),
        SPA: true,
        onResult: ({ result }) => {
            console.log("server result ", result);
            if (result?.type === "success" && result?.status === 200) {
                const submittedData = result?.data?.form?.data;
                // const submittedData = result.submitted;
                if (submittedData) {
                    console.log("✅ submitted to supa", submittedData);
                    toast.success("Data berhasil ditambahkan!");
                    onSuccess?.();
                } else {
                    toast.error("Gagal menambahkan data.");
                }
            } else {
                toast.error("Gagal menambahkan data.");
            }

            // if (submittedData) {
            //     console.log("submitted to supa ", submittedData)
            //     // toast.success(`Berhasil menambahkan. ${JSON.stringify(f.data, null, 2)}`);
            //     // onSuccess?.();
            // } else {
            //     toast.error("Gagal menambahkan. Tolong perbaiki isian anda");
            // }
            },
    });
    
    const { form: formData, enhance, message } = form;
    // for type toggle
	let filePressed = $state(true);
	let announcementPressed = $state(false);

	function updateType() {
		if (filePressed && announcementPressed) {
			$formData.type = "both";
		} else if (filePressed) {
			$formData.type = "fail";
		} else if (announcementPressed) {
			$formData.type = "pengumuman";
		} else {
			$formData.type = undefined;
		}
	}

</script>
    
<form 
    method="POST" 
    use:enhance
    class="space-y-6">
    <!-- Type Toggle -->
	<Form.Field {form} name="type">
		<Form.Control>
			{#snippet children({ props })}
            <div class="w-full inline-flex gap-2 content-between">
                <div>
                    <Form.Label>Jenis Fail*</Form.Label>
                    <Form.Description>Pilih setidaknya satu jenis fail</Form.Description>
                </div>
                <div class="">
                    <Toggle
                        {...props}
                        pressed={filePressed}
                        onPressedChange={(v) => {
                            filePressed = v;
                            updateType();
                        }}
                        variant="outline"
                    >
                        Fail
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
                    <!-- debug -->
                    <!-- <pre class="text-xs text-muted-foreground">
                        Form type: {$formData.type}
                    </pre> -->
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
            <Form.Label>Deskripsi*</Form.Label>
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
                <Form.Label>Penting?</Form.Label>
                <Switch {...props} 
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

    <Form.Button type="submit">Submit</Form.Button>
</form>