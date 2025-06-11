const fs = require("fs");
const { createWorker } = require("tesseract.js");
const pdfParse = require("pdf-parse");
const { fromPath } = require("pdf2pic");

async function extrairTextoDoPDF(caminho) {
  const buffer = fs.readFileSync(caminho);

  // Tenta extrair texto direto
  try {
    const { text } = await pdfParse(buffer);
    if (text && text.trim().length > 50) {
      console.log("✅ Texto extraído diretamente do PDF.");
      return text.trim();
    }
  } catch (e) {
    console.warn("⚠️ Erro no pdf-parse:", e.message);
  }

  // Converter 1ª página do PDF em imagem para OCR
  console.log("⚠️ Usando OCR com pdf2pic + Tesseract...");

  const convert = fromPath(caminho, {
    density: 150,
    saveFilename: "temp_ocr",
    savePath: "./temp",
    format: "png",
    width: 1200,
    height: 1600
  });

  const page = await convert(1); // primeira página
  const worker = await createWorker("por");

  const {
    data: { text: textoOCR }
  } = await worker.recognize(page.path);

  await worker.terminate();
  return textoOCR.trim();
}

module.exports = { extrairTextoDoPDF };
