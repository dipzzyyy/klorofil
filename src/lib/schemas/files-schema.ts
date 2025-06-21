import { z } from "zod"

export const fileSchema = z.object({
    name: z.string().min(3, "Judul minimal 3 karakter."),
});

export type FileSchema = typeof fileSchema;