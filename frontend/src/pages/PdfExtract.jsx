import React from 'react'
import PdfInput from '../components/PdfInput'
import axios from 'axios';
import { useState } from 'react';

const PdfExtract = () => {
   const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    setLoading(true);
    setExtractedText('');
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/pdf-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setExtractedText(response.data.text);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Something went wrong while uploading the PDF');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center bg-base-200">
      <PdfInput onFileSelect={handleFileUpload} />

      <div className="max-w-4xl mx-auto mt-8 p-4 bg-base-100 rounded-lg shadow">
        {loading && <p className="text-primary font-semibold">🔄 Extracting text from PDF...</p>}
        {error && <p className="text-error">❌ {error}</p>}
        {extractedText && (
          <div>
            <h2 className="text-lg font-bold mb-2">📄 Extracted Text:</h2>
            <p className="whitespace-pre-line">{extractedText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PdfExtract
