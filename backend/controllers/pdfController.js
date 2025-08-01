// backend/controllers/pdfController.js
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// This uses the Render URL if available, otherwise defaults to localhost for local testing.
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:10000/extract';

export const handlePdfUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const pdfPath = req.file.path;

    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(pdfPath));

        const response = await axios.post(PYTHON_SERVICE_URL, form, {
            headers: form.getHeaders(),
        });

        res.json({ text: response.data.text });
    } catch (error) {
        console.error('Error calling Python service:', error.message);
        res.status(500).json({ error: 'Failed to process PDF.' });
    } finally {
        fs.unlinkSync(pdfPath);
    }
};