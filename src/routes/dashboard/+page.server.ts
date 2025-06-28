import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { fileSchema } from "$lib/schemas/files-schema.js";
import { zod } from "sveltekit-superforms/adapters"
import { supabase } from "$lib/server/supabaseConfig.js";

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(fileSchema));
	// read from db
	const { data, error } = await supabase.from('files').select().order('id', { ascending: true });;

	// if db error
	if (error) {
		console.error("Supabase error", error);
		return fail(500, { form: await superValidate(zod(fileSchema)) });
	}
	
	return { 
		form,
		data
	};
};

export const actions: Actions = {
	default: async (event) => {
	  	const form = await superValidate(event, zod(fileSchema));
	//   client checking
		if (!form.valid) {
			return fail(400, {
			form,
			});
		}
	// inserting thru db
		const { error } = await supabase
			.from('files')
			.insert({
				name: form.data.name,
				description: form.data.description,
				label: form.data.label,
				type: form.data.type,
				link: form.data.link,
				importance: form.data.importance
			})
			.select();

	// and if it doesnt insert
	    if (error) {
			console.error('Supabase insert error', error);
			return fail(500, {
				form,
				message: 'Gagal menyimpan ke database: ' + error.message
			});
    	}

		return {
			form,
		};
	},
  };