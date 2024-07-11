import InformeTecnico from "../models/InformeTec.modal.js";

export const verTodosInformes = async (req, res) => {
  try {
    const informes = await InformeTecnico.find(
      {},
      {
        "informe.Solicita.nombre": 1,
        "informe.Solicita.areaSolicitante": 1,
        "informe.Solicita.edificio": 1,
        "informe.descripcionDelServicio": 1,
        "solicitud.Observacionestecnicas": 1,
        "solicitud.insumosSolicitados.descripcion": 1,
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
      };
    });

    res.json(formattedInformes);
  } catch (error) {
    console.error("Error al obtener informes técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
