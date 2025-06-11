const fs = require("fs");
const { createWorker } = require("tesseract.js");
const pdfParse = require("pdf-parse");
const { fromPath } = require("pdf2pic"); // necessário para converter páginas em imagem

async function extrairTextoDoPDF(caminho) {
  const buffer = fs.readFileSync(caminho);

  // 1. Tenta extrair texto direto (PDF digital)
  try {
    const { text } = await pdfParse(buffer);
    if (text && text.trim().length > 50) {
      console.log("✅ Texto extraído diretamente do PDF.");
      return text.trim();
    }
  } catch (e) {
    console.warn("⚠️ Erro ao tentar extrair texto direto:", e);
  }

  // 2. OCR se não houver texto suficiente
  console.log("⚠️ Nenhum texto encontrado, iniciando OCR com Tesseract...");

  const converter = fromPath(caminho, {
    density: 200,
    saveFilename: "ocr_temp",
    savePath: "./temp",
    format: "png",
    width: 1200,
    height: 1600
  });

  const page = await converter(1); // apenas primeira página

  const worker = await createWorker("por");
  const {
    data: { text: textoOCR }
  } = await worker.recognize(page.path);

  await worker.terminate();

  return textoOCR.trim();
}

module.exports = { extrairTextoDoPDF };
