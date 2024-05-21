import { z } from "zod";

export const taskSchema = z.object({
  title: z.string({
    required_error: "El titulo es d",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
});
