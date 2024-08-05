import { z } from "zod";

export const solicitudSchema = z.object({
  // fecha: z.date(),
  // suministro: z.string(),
  // pc: z.string(),
  // items: z.array(
  //   z.object({
  //     cantidad: z.number().int().nonnegative(),
  //     unidad: z.string(),
  //     descripcion: z.string(),
  //   })
  // ),
  // proyecto: z.string(),
  // selectedActividad: z.array(
  //   z.object({
  //     id: z.string(),
  //     nombre: z.string(),
  //   })
  // ),
  // justificacion: z.string(),
  // user: z.string().optional(),
});
