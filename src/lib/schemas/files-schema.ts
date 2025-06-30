import { z } from "zod"

export const fileSchema = z.object({
    id: z.number().min(1).optional(),
    name: z.string().min(3, "Judul minimal 3 karakter."),
    description: z.string(),
    type: z.enum(["fail", "pengumuman", "both"], {
        errorMap: () => ({ message: "Pilih setidaknya satu jenis fail." })
      }),
    label: z.string().optional(),
    link: z.string().url("Link harus berupa URL. (mengandung https://...)"),
    importance: z.string().default("false"),
});

export type FileSchema = typeof fileSchema;