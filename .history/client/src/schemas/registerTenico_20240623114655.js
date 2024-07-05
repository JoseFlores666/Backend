import { z } from "zod";

export const registerTecnicoSchema = z.object({
  fechaOrden: z.string().nonempty({ message: "La fecha es requerida" }),
  areasoli: z
    .string()
    .nonempty({ message: "El área solicitante es requerida" }),
  solicita: z
    .string()
    .nonempty({ message: "El nombre de quien solicita es requerido" }),
  edificio: z
    .string()
    .nonempty({ message: "El nombre del edificio es requerido" }),
  tipoMantenimiento: z
    .string()
    .nonempty({ message: "El tipo de mantenimiento es requerido" }),
  tipoTrabajo: z
    .string()
    .nonempty({ message: "El tipo de trabajo es requerido" }),
  tipoSolicitud: z
    .string()
    .nonempty({ message: "El tipo de solicitud es requerido" }),
  descripcion: z.string({
    required_error: "La descripción es requerida",
  }),
  fechaAtencion: z
    .string()
    .nonempty({ message: "La fecha de atención es requerida" }),
  proyecto: z.string().nonempty({ message: "El proyecto es requerido" }),

  obs: z.string().nonempty({ message: "Las observaciones son requeridas" }),
});
