import mongoose from "mongoose";
import FolioCounter from "./folioCounter.modal.js";

const informeTecnicSchema = new mongoose.Schema({
  folio: String,
  informe: {
    Solicita: {
      nombre: String,
      areaSolicitante: String,
      edificio: String,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    tipoDeMantenimiento: String,
    tipoDeTrabajo: String,
    tipoDeSolicitud: String,
    descripcionDelServicio: String,
    imagenes: [
      {
        public_id: String,
        secure_url: String,
      },
    ],
  },
  solicitud: {
    fechaAtencion: String,

    insumosSolicitados: [
      {
        cantidad: Number,
        descripcion: String,
      },
    ],
    Observacionestecnicas: String,
  },
  firmas: {
    type: mongoose.Types.ObjectId,
    ref: "Firmas",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  tecnicos: {
    type: mongoose.Types.ObjectId,
    ref: "Tecnicos",
  },
  estado: {
    type: String,
    required: true,
    enum: ["Recibida", "Asignada", "Diagnosticada", "Completada", "Declinada"],
    default: "Recibida",
  },
});

informeTecnicSchema.pre("save", async function (next) {
  try {
    if (!this.folio) {
      const now = new Date();
      const currentYear = now.getFullYear(); // Año actual

      let folioCounter = await FolioCounter.findOne({});
      if (!folioCounter) {
        // Si no existe, crear uno nuevo
        folioCounter = new FolioCounter({
          counterInforme: 0,
          yearInforme: currentYear,
        });
      }

      // Si el año ha cambiado, reiniciar el contador de informes a 0
      if (folioCounter.yearInforme !== currentYear) {
        folioCounter.counterInforme = 0;
        folioCounter.yearInforme = currentYear;
      }

      // Incrementar el contador de informes
      folioCounter.counterInforme += 1;
      await folioCounter.save();

      // Generar el folio para informes
      this.folio = `${folioCounter.counterInforme.toString().padStart(4, "0")}`;
    }
  } catch (err) {
    console.error("Error in save middleware:", err);
    // Manejar el error aquí, lanzar o registrar según sea necesario
    throw err; // Volver a lanzar el error para evitar guardar el documento
  }
  next();
});
export default mongoose.model("InformeTecnico", informeTecnicSchema);
