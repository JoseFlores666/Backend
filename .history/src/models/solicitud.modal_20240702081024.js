import mongoose from "mongoose";
import FolioCounter from "./folioCounter.modal.js";

const solicitudSchema = new mongoose.Schema({
  folio: String,
  folioExterno: String,
  areaSolicitante: {
    type: String,
    required: true,
    enum: [
      "Administración y Finanzas Mantenimiento y Servicios Generales",
      "Otro Departamento",
    ],
    default: "Administración y Finanzas Mantenimiento y Servicios Generales",
  },
  fecha: Date,
  tipoSuministro: String,
  procesoClave: String,
  suministros: [
    {
      cantidad: Number,
      unidad: String,
      descripcion: String,
      cantidadAcumulada: { type: Number, default: 0 },
      cantidadEntregada: { type: Number, default: 0 },
      NumeroDeEntregas: { type: Number, default: 0 },
    },
  ],
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyecto",
  },
  actividades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actividad",
    },
  ],
  justificacionAdquisicion: String,
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
    enum: ["Pendiente", "Asignada", "Diagnosticada", "Atendida", "Rechazada"],
    default: "Pendiente",
  },
});

solicitudSchema.pre("save", async function (next) {
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
        counter: 0,
        month: currentMonth,
        year: currentYear,
      });
    }

    // Si el mes ha cambiado, reiniciar el contador a 0
    if (
      folioCounter.month !== currentMonth ||
      folioCounter.year !== currentYear
    ) {
      folioCounter.counter = 0;
      folioCounter.month = currentMonth;
      folioCounter.year = currentYear;
    }

    // Incrementar el contador
    folioCounter.counter += 1;
    await folioCounter.save();

    // Generar el folio
    this.folio = `${currentYear}/${currentMonth}/${folioCounter.counter
      .toString()
      .padStart(3, "0")}`;
  }
  next();
});

export default mongoose.model("Solicitud", solicitudSchema);
