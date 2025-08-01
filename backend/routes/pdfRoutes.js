import express from "express";
import multer from "multer";
import { handlePdfUpload } from "../controllers/pdfController.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/pdf-upload", upload.single("pdf"), handlePdfUpload);

export default router;
