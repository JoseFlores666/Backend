import { z } from "zod";

export const registerTecnicoSchema = z.object({
  fechaOrden: z.string().nonempty({ message: "La fecha es requerida" }),
  areasoli: z.string().nonempty({ message: "El área solicitante es requerida" }),
  solicita: z.string().nonempty({ message: "El nombre de quien solicita es requerido" }),
  edificio: z.string().nonempty({ message: "El nombre del edificio es requerido" }),
  tipoMantenimiento: z.string().nonempty({ message: "El tipo de mantenimiento es requerido" }),
  tipoTrabajo: z.string().nonempty({ message: "El tipo de trabajo es requerido" }),
  tipoSolicitud: z.string().nonempty({ message: "El tipo de solicitud es requerido" }),
  descripcion: z.string().nonempty({ message: "La descripción es requerida" }),
  proyecto: z.string().nonempty({ message: "El proyecto es requerido" }),
  fechaAtencion: z.string().nonempty({ message: "La fecha de atención es requerida" }),
  insumos: z
  .array(
    z.object({
      cantidad: z.string().nonempty({ message: "La cantidad es requerida" }),
      descripcion: z.string().nonempty({ message: "La descripción del insumo es requerida" }),
    })
  )
  .min(1, { message: "Debes agregar al menos un insumo" }), 

  obs: z.string().nonempty({ message: "Las observaciones son requeridas" }),
});
