import app from "./app.js";
import { PORT } from "./config.js";
import { connectDB } from "./db.js";
import FolioCounter from "./models/folioCounter.modal.js";

async function initFolioCounter() {
  try {
    const counter = await FolioCounter.findOne();
    if (!counter) {
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
      const currentMonth = monthNames[now.getMonth()];
      const currentYear = now.getFullYear();
      const newCounter = new FolioCounter({
        counter: 0,
        month: currentMonth,
        year: currentYear,
        counterInforme: 0,
        monthInforme: currentMonth,
        yearInforme: currentYear,
      });
      await newCounter.save();
      console.log("Folio counter initialized");
    }
  } catch (error) {
    console.error("Error initializing folio counter:", error);
  }
}

async function main() {
  try {
    await connectDB();
    await initFolioCounter(); // Inicializa el contador de folios
    app.listen(PORT );
    console.log(`Listening on port http://localhost:${PORT}`);
  } catch (error) {
    console.error(error);
  }
}

main();
