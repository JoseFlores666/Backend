import mongoose from "mongoose";
import FolioCounter from "./folioCounter.modal.js";

const informeTecnicSchema = new mongoose.Schema({
  folio: String,
  folioExterno: String,
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
    imagen: {
      public_id: String,
      secure_url: String,
    },
  },
  solicitud: {
    insumosSolicitados: {
      fechaAtencion: String,
      cantidad: Number,
      descripcion: String,
      Observacionestecnicas: String,
    },
  },
  firmas: {
    type: mongoose.Types.ObjectId,
    ref: "Firmas",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  estado: {
    type: String,
    required: true,
    enum: [ "Asignada", "Diagnosticada", "Atendida", "Rechaza","Sin asignar"],
    default: "Sin asignar",
  },
});
informeTecnicSchema.pre("save", async function (next) {
  try {
    if (!this.folio) {
      const now = new Date();
      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const currentMonth = monthNames[now.getMonth()]; // Nombre del mes actual
      const currentYear = now.getFullYear(); // Año actual

      let folioCounter = await FolioCounter.findOne({});
      if (!folioCounter) {
        // Si no existe, crear uno nuevo
        folioCounter = new FolioCounter({
          counterInforme: 0,
          monthInforme: currentMonth,
          yearInforme: currentYear,
        });
      }

      // Si el mes ha cambiado, reiniciar el contador de informes a 0
      if (
        folioCounter.monthInforme !== currentMonth ||
        folioCounter.yearInforme !== currentYear
      ) {
        folioCounter.counterInforme = 0;
        folioCounter.monthInforme = currentMonth;
        folioCounter.yearInforme = currentYear;
      }

      // Incrementar el contador de informes
      folioCounter.counterInforme += 1;
      await folioCounter.save();

      // Generar el folio para informes
      this.folio = `${currentYear}/${currentMonth}/${folioCounter.counterInforme
        .toString()
        .padStart(5, "0")}`;
    }
  } catch (err) {
    console.error("Error in save middleware:", err);
    // Handle error here, throw or log as needed
    throw err; // Rethrow the error to prevent saving the document
  }
  next();
});

export default mongoose.model("InformeTecnico", informeTecnicSchema);
