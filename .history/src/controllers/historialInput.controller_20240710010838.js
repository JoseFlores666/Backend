import InformeTecnico from "../models/InformeTec.modal.js";

export const verTodosInformes = async (req, res) => {
  try {
    const informes = await InformeTecnico.find(
      {},
      {
        "informe.descripcionDelServicio": 1,
        "solicitud.Observacionestecnicas": 1,
        "solicitud.insumosSolicitados.descripcion": 1,
        _id: 0,
      }
    );

    // Mapear los resultados para obtener solo los campos necesarios en un solo objeto
    const formattedInformes = informes.map((informe) => ({
      descripcionDelServicio: informe?.informe?.descripcionDelServicio || "",
      Observacionestecnicas: informe?.solicitud?.Observacionestecnicas || "",
      insumosSolicitados:
        informe?.solicitud?.insumosSolicitados?.map(
          (item) => item.descripcion
        ) || [],
    }));

    res.json(formattedInformes);
  } catch (error) {
    console.error("Error al obtener informes técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
