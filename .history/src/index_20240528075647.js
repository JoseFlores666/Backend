import app from "./app.js";
import { PORT } from "./config.js";
import { connectDB } from "./db.js";
import FolioCounter from './models/folioCounter.modal


async function initFolioCounter() {
  try {
    const counter = await FolioCounter.findOne();
    if (!counter) {
      const newCounter = new FolioCounter({ seq: 0 });
      await newCounter.save();
      console.log('Folio counter initialized');
    }
  } catch (error) {
    console.error('Error initializing folio counter:', error);
  }
}


async function main() {
  try {
    await connectDB();
    await initFolioCounter(); // Inicializa el contador de folios
    app.listen(PORT);
    console.log(`Listening on port http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`)
  } catch (error) {
    console.error(error);
  }
}

main();
