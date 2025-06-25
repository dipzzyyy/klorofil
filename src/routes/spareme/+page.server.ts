// routes/test/+page.server.ts
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { fileSchema } from "$lib/schemas/files-schema";
import { supabase } from "$lib/server/supabaseClient.js"

export const load = async () => {
	const form = await superValidate(zod(fileSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(fileSchema));
		if (!form.valid) {
			return { form };
		}

        const { error } = await supabase.from("files").insert([{
			...form.data,
			id: crypto.randomUUID(),
			date: new Date().toISOString(),
			team: "general",
			label: null,
		}]);

		if (error) return message(form, "Gagal menyimpan: " + error.message);

		// ✅ Instead of inserting into Supabase, just return form data
		return {
			form,
			submitted: true,
			debug: form.data, // 👈 Expose inserted data
		};
	},
};
