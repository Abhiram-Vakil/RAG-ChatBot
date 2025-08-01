# backend/scripts/main.py
from fastapi import FastAPI, UploadFile, File
import pytesseract
from pdf2image import convert_from_bytes
import os

# --- Set paths from environment variables ---
# This makes the code work everywhere.
tesseract_path = os.environ.get("TESSERACT_CMD")
if tesseract_path:
    pytesseract.pytesseract.tesseract_cmd = tesseract_path

poppler_path_env = os.environ.get("POPPLER_PATH")
# -------------------------------------------

app = FastAPI()

@app.post("/extract")
async def extract_text_from_pdf(file: UploadFile = File(...)):
    pdf_bytes = await file.read()

    # Use the local Poppler path if set, otherwise it will work in Docker
    images = convert_from_bytes(pdf_bytes, poppler_path=poppler_path_env)

    full_text = ""
    for image in images:
        text = pytesseract.image_to_string(image)
        full_text += text + "\n\n"

    return {"text": full_text}