const fs = require("fs");
const { createWorker } = require("tesseract.js");
const pdfParse = require("pdf-parse");

async function extrairTextoDoPDF(caminho) {
  const buffer = fs.readFileSync(caminho);

  // 1. Tentativa com pdf-parse (texto digital)
  try {
    const { text } = await pdfParse(buffer);
    if (text && text.trim().length > 50) {
      console.log("✅ Texto extraído diretamente do PDF.");
      return text.trim();
    }
  } catch (e) {
    console.warn("⚠️ Erro no pdf-parse:", e.message);
  }

  // 2. Tentativa com Tesseract (imagem escaneada)
  console.log("⚠️ Usando OCR com Tesseract para imagem escaneada...");

  const worker = await createWorker("por");
  const {
    data: { text: textoOCR }
  } = await worker.recognize(caminho);

  await worker.terminate();
  return textoOCR.trim();
}

module.exports = { extrairTextoDoPDF };
