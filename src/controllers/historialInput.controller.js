import InformeTecnico from "../models/InformeTec.modal.js";
import Solicitud from "../models/solicitud.modal.js";

export const verTodosInformes = async (req, res) => {
  try {
    const informes = await InformeTecnico.find(
      {},
      {
        "informe.descripcionDelServicio": 1,
        "solicitud.Observacionestecnicas": 1,
        "solicitud.insumosSolicitados.descripcion": 1,
        "informe.Solicita.nombre": 1,
        "informe.Solicita.areaSolicitante": 1,
        "informe.Solicita.edificio": 1,
        _id: 0,
      }
    );

    // Mapear los resultados para obtener solo los campos necesarios en un solo objeto
    const formattedInformes = informes.map((informe) => {
      // Concatenar los valores de solicitud.insumosSolicitados.descripcion
      const insumosSolicitados = informe?.solicitud?.insumosSolicitados
        ?.map((item) => item.descripcion)
        .filter(Boolean) // Filtrar valores falsy (undefined, null, etc.)
        .join(", "); // Unir los valores con una coma y un espacio

      return {
        descripcionDelServicio: informe?.informe?.descripcionDelServicio || "",
        Observacionestecnicas: informe?.solicitud?.Observacionestecnicas || "",
        soliInsumosDescripcion: insumosSolicitados || "", // Devolver como una cadena vacía si no hay valores
        nombre: informe?.informe?.Solicita?.nombre || "", // Agregar nombre
        areaSolicitante: informe?.informe?.Solicita?.areaSolicitante || "", // Agregar área solicitante
        edificio: informe?.informe?.Solicita?.edificio || "", // Agregar edificio
      };
    });

    res.json(formattedInformes);
  } catch (error) {
    console.error("Error al obtener informes técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const verTodasSoli = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find(
      {},
      {
        areaSolicitante: 1,
        "suministros.descripcion": 1,
        justificacionAdquisicion: 1,
        _id: 0,
      }
    );

    // Mapear los resultados para obtener solo los campos necesarios en un solo objeto
    const formattedSolicitudes = solicitudes.map((soli) => {
      // Concatenar los valores de solicitud.suministros.descripcion
      const insumosSolicitados = soli.suministros
        .map((item) => item.descripcion)
        .filter(Boolean) // Filtrar valores falsy (undefined, null, etc.)
        .join(", "); // Unir los valores con una coma y un espacio

      return {
        areaSolicitante: soli.areaSolicitante || "",
        soliInsumosDescripcion: insumosSolicitados || "", // Devolver como una cadena vacía si no hay valores
        justificacionAdquisicion: soli.justificacionAdquisicion || "", // Agregar justificación
      };
    });

    res.json(formattedSolicitudes);
  } catch (error) {
    console.error("Error al obtener informes técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
