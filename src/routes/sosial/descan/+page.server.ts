import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { fileSchema } from "$lib/schemas/files-schema.js";
import { eventSchema } from "$lib/schemas/event-schema.js";
import { zod } from "sveltekit-superforms/adapters"
import { supabase } from "$lib/server/supabaseConfig.js";
import type { Action } from "$lib/components/ui/card/index.js";
// val for update
import { z } from "zod";

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(fileSchema));
	const formEvent = await superValidate(zod(eventSchema));
	const formEditEvent = await superValidate(zod(eventSchema));
	// read from db
	const { data, error } = await supabase.from('files').select().eq('team', 13).order('id', { ascending: true });
	const { data: dataEvent, error:errorEvent } = await supabase.from('event').select().eq('team', 13).order('id', { ascending: true });
	const { data: teamList, error:errorTeam } = await supabase.from('team').select().order('id', { ascending: true });

	// if db error
	if (error) {
		return fail(500, { form: await superValidate(zod(fileSchema)) });
	}
	if (errorEvent) {
		return fail(500, { formEvent: await superValidate(zod(eventSchema)) });
	}
	
	return { 
		form,
		data,
		formEvent,
		formEditEvent,
		dataEvent,
		teamList
	};
};

export const actions: Actions = {
	create: async (event) => {
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
			return fail(500, {
				form,
				message: 'Gagal menyimpan ke database: ' + error.message
			});
		}

		return {
			form,
		};
	},
	update: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		// Extend your schema with ID
		const updateSchema = fileSchema.extend({
			id: z.coerce.number().min(1, "ID wajib")
		});
		const parse = updateSchema.safeParse(formData);

		if (!parse.success) {
			return fail(400, {
				message: "Data tidak valid",
				errors: parse.error.flatten()
			});
		}

		const data = parse.data;

		const { data:updated, error } = await supabase
			.from("files")
			.update({
				name: data.name,
				description: data.description,
				label: data.label,
				type: data.type,
				link: data.link,
				importance: data.importance,
				updated_at: new Date().toISOString()
			})
			.eq("id", data.id);
		
		if (error) {
			return fail(500, {
				message: "Gagal update: " + error.message
			});
		}

		return {
			success: true
		};
	},
	delete: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		const id = Number(formData.id);

		if (!id || isNaN(id)) {
			return fail(400, { message: "ID tidak valid untuk hapus." });
		}

		const { error } = await supabase
			.from("files")
			.delete()
			.eq("id", id);

		if (error) {
			return fail(500, { message: "Gagal menghapus: " + error.message });
		}

		return { success: true };
	},
	createEvent: async (event) => {
		const form = await superValidate(event, zod(eventSchema));
		//   client checking
		if (!form.valid) {
			return fail(400, {
			form,
			});
		}
		
		// inserting thru db
		const { error } = await supabase
			.from('event')
			.insert({
				name: form.data.name,
				description: form.data.description,
				start: form.data.start,
				end: form.data.end,
				team: form.data.team,
			});

		// and if it doesnt insert
		if (error) {
			return fail(500, {
				form,
				message: 'Gagal menyimpan ke database: ' + error.message
			});
		}

		return {
			form,
		};
	},
	updateEvent: async (event) => {
		const form = await superValidate(event, zod(eventSchema));
		console.log(form.data);
		//   client checking
		if (!form.valid) {
			return fail(400, {
			form,
			});
		}
		// inserting thru db
		const { error } = await supabase
			.from('event')
			.update({
				name: form.data.name,
				description: form.data.description,
				start: form.data.start,
				end: form.data.end,
				team: form.data.team,
			})
			.eq("id", form.data.id);


		// and if it doesnt insert
		if (error) {
			return fail(500, {
				form,
				message: 'Gagal update ke database: ' + error.message
			});
		}

		return {
			form,
		};
	},
	deleteEvent: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		const id = Number(formData.id);

		if (!id || isNaN(id)) {
			return fail(400, { message: "ID tidak valid untuk hapus." });
		}

		const { error } = await supabase
			.from("event")
			.delete()
			.eq("id", id);

		if (error) {
			return fail(500, { message: "Gagal menghapus: " + error.message });
		}

		return { success: true };
	},
} satisfies Actions;