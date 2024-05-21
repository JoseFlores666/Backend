import { z } from "zod";

export const taskSchema = z.object({
  title: z.string({
    required_error: "El titulo es requerido",
  }),
  description: z.string({
    required_error: "La descripc",
  }),
});
