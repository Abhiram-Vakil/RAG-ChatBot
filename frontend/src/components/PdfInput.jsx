import React, { useState } from 'react';

/**
 * A PDF file input component styled with DaisyUI.
 * @param {object} props - The component props.
 * @param {(file: File | null) => void} props.onFileSelect - Callback function that gets called when a file is selected or cleared.
 */
const PdfInput = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setError('');
      onFileSelect?.(null);
      return;
    }

    if (file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
      onFileSelect?.(file);
    } else {
      setSelectedFile(null);
      setError('Error: Please select a valid PDF file.');
      onFileSelect?.(null);
      event.target.value = null; // Clear the input
    }
  };

  return (
    <div className=" flex flex-col items-center  p-4 bg-base-200">
      <div className="form-control w-full max-w-md bg-base-100 p-10 rounded-lg shadow-md flex flex-col items-center gap-5 mt-10">
      <label className="label">
        <span className="label-text">Upload your document</span>
        <span className="label-text-alt">PDF only</span>
      </label>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className={`file-input file-input-bordered w-full max-w-md ${error ? 'file-input-error' : 'file-input-primary'}`}
      />
      {selectedFile && !error && <span className="label-text-alt text-success mt-2">Selected: {selectedFile.name}</span>}
      {error && <span className="label-text-alt text-error mt-2">{error}</span>}
    </div>
    </div>
    
  );
};

export default PdfInput;
