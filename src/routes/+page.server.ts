import { supabase } from "$lib/server/supabaseClient";
// nyebe
import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { fileSchema } from "$lib/schemas/files-schema.js";
import { zod } from "sveltekit-superforms/adapters"
 


export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(fileSchema));
    const { data } = await supabase.from("files").select();
    return {
        data: data ?? [],
        form,
    };
}

export const actions: Actions = {
	default: async (event) => {
	  const form = await superValidate(event, zod(fileSchema));
	  if (!form.valid) {
		return fail(400, {
		  form,
		});
	  }
    //   insert data to database supabase
    //   const { data, error } = await supabase
    //     .from("files")
    //     .insert({
    //         ...form.data,
    //         date: new Date(),
    //         team: "general",
    //         id: 3,
    //         label: null, 
    //     });
    //   if (error) {
    //     console.log("error")
    //     // return fail(500, {
    //     //   form,
    //     //   message: error.message,
    //     // });
    //     return message(form, "Gagal menambahkan data " + error.message);
    //   }

    const { data, error } = await supabase.from("files").insert([{
        id: crypto.randomUUID(), // or let Supabase auto-increment
        name: "kecipuk",
        description: "kecipang",
        link: "https://ono.com",
        importance: "false",
        type: "fail",
        team: "general",
        date: new Date().toISOString(),
        label: null,
    }]);
    // const { error } = await supabase.from("files").insert([{
    //     id: crypto.randomUUID(), // or let Supabase auto-increment
    //     name: form.data.name,
    //     description: form.data.description,
    //     link: form.data.link,
    //     importance: form.data.importance ?? "false",
    //     type: form.data.type ?? "fail",
    //     team: "general",
    //     date: new Date().toISOString(),
    //     label: form.data.label ?? null,
    // }]);
    if (error) {
        console.log(error)
        return fail(500, {
          form,
          message: error.message,
        });
    }


      console.log(form)
        return {
            form,
            success: true,
            submitted: true,
	    };
	},
};