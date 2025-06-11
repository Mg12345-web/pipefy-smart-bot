const fs = require("fs");
const { createWorker } = require("tesseract.js");
const pdfParse = require("pdf-parse");

async function extrairTextoDoPDF(caminho) {
  const buffer = fs.readFileSync(caminho);

  // 1. Tenta extrair texto direto do PDF (PDF digital)
  try {
    const { text } = await pdfParse(buffer);
    if (text && text.trim().length > 50) {
      console.log("✅ Texto extraído diretamente do PDF.");
      return text.trim();
    }
  } catch (e) {
    console.warn("⚠️ Erro ao tentar extrair texto com pdf-parse:", e.message);
  }

  // 2. Se falhar, tenta OCR direto com Tesseract
  console.log("⚠️ Nenhum texto encontrado, iniciando OCR com Tesseract...");

  const worker = await createWorker("por");

  const { data: { text: textoOCR } } = await worker.recognize(caminho);
  await worker.terminate();

  console.log("🧠 Texto extraído via OCR.");
  return textoOCR.trim();
}

module.exports = { extrairTextoDoPDF };
