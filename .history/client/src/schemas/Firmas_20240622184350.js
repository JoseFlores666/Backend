import { z } from "zod";

export const firmasSchema = z.object({
  solicitante: z.string(),
  jefeInmediato: z.string(),
  direccion: z.string().min(1, "Campo requerido"),
  rectoria: z.string().min(1, "Campo requerido"),
});
