import Api_key from "../models/Api_key.modal.js";

export const obtenerApi_key = async (req, res) => {
  try {
    const myApi_key = await Api_key.find();
    res.json(myApi_key);
  } catch (error) {
    console.error("Error al obtener las api_key:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const crearApi_key = async (req, res) => {
  try {
    const { api_key } = req.body;

    const nuevaApi_key = new Api_key({ api_key });
    await nuevaApi_key.save();

    res.status(201).json(nuevaApi_key);
    console.log("API key creada exitosamente");
  } catch (error) {
    console.error("Error al crear la API key:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const editarApi_key = async (req, res) => {
  try {
    const { id } = req.params;
    const { api_key } = req.body;
    console.log(api_key);
    const myApi_key = await Api_key.findById(id);

    if (!myApi_key) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    myApi_key.api_key = api_key;

    await myApi_key.save();

    res.status(200).json(myApi_key);
    console.log("api_key actualizada exitosamente");
  } catch (error) {
    console.error("Error al actualizar el api_key:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
