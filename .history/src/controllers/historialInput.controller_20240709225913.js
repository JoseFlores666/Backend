import InformeTecnico from "../models/InformeTec.modal.js";

export const verTodosInformes = async (req, res) => {
    try {
        const informes = await InformeTecnico.find(
            {},
            {
                _id: 1,
                descripcionDelServicio: 1,
                Observacionestecnicas: 1,
            }
        );

        // Crear un objeto combinado con los campos requeridos
        const combinedObject = {
            descripcionDelServicio: informes.map((informe) => informe.descripcionDelServicio),
            Observacionestecnicas: informes.map((informe) => informe.Observacionestecnicas),
        };

        res.json(combinedObject);
    } catch (error) {
        console.error("Error al obtener informes técnicos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
