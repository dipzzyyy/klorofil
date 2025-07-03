import { z } from "zod"

export const eventSchema = z.object({
    id: z.number().min(1).optional(),
    name: z.string().min(3, "Nama kegiatan minimal 3 karakter."),
    description: z.string(),
    start: z.date(),
    end: z.date(),
    team: z.string(),
});

export type EventSchema = typeof eventSchema;