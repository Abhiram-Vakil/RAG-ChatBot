import React from 'react'
import PdfInput from '../components/PdfInput'

const PdfExtract = () => {
  return (
    <div>
      <PdfInput onFileSelect={(file) => console.log(file)} />
    </div>
  )
}

export default PdfExtract
