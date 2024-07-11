import { Router } from "express";
import { getPresignedUrl, uploadFile, convertDocToPdf } from "../controllers/document.controller.js";

const router = Router();

router.post('/convert', async (req, res) => {
  const { sourceFile, destinationFile } = req.body;

  try {
    const [uploadUrl, uploadedFileUrl] = await getPresignedUrl(sourceFile);
    await uploadFile(sourceFile, uploadUrl);
    await convertDocToPdf(uploadedFileUrl, destinationFile);
    res.download(destinationFile);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
