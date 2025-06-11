const fs = require("fs");
const { createWorker } = require("tesseract.js");
const pdf = require("pdf-parse");

async function extrairTextoDoPDF(caminho) {
  const buffer = fs.readFileSync(caminho);

  // 1. Tenta extrair texto direto (PDF digital)
  const textoExtraido = await pdf(buffer).then(data => data.text.trim());

  if (textoExtraido.length > 50) {
    console.log("✅ Texto extraído diretamente do PDF.");
    return textoExtraido;
  }

  // 2. Se falhar, faz OCR (PDF imagem)
  console.log("⚠️ Nenhum texto encontrado, usando OCR com Tesseract...");

  const worker = await createWorker("por");
  const imagem = await pdf(buffer, { max: 1 }).then(data => data.metadata ? data.data : null);

  if (!imagem) {
    return "❌ Erro: não foi possível converter PDF em imagem.";
  }

  const { data: { text } } = await worker.recognize(caminho);
  await worker.terminate();
  return text;
}

module.exports = { extrairTextoDoPDF };
