import { z } from "zod";

export const firmasSchema = z.object({
  solicitante: z.string().min(1, "Campo requerido"),
  jefeInmediato: z.string().min(1, "Campo requerido"),
  direccion: z.string().min(1, "Campo requerido"),
  rectoria: z.string().min(1, "Campo requerido"),
});
