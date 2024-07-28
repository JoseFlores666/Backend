import { z } from "zod";

const itemSchema = z.object({
  cantidad: z.number(),
  unidad: z.string(),
  descripcion: z.string(),
  cantidadAcumulada: z.number().optional(),
  cantidadEntregada: z.union([z.string(), z.number()]).refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    },
    {
      message: "Cantidad entregada debe ser un número mayor o igual a 0",
    }
  ),
  NumeroDeEntregas: z.number().optional(),
  _id: z.string(),
});

export const abonarSchema = z.object({
  folio: z.string(),
  folioExterno: z.string(),
  fecha: z.string(),
  items: z.array(itemSchema).refine(
    (items) => {
      return items.some((item) => parseFloat(item.cantidadEntregada) > 0);
    },
    {
      message: "Debe haber al menos un item con cantidad entregada mayor a 0",
    }
  ),
  id: z.string(),
});
