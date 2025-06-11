require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { extrairTextoDoPDF } = require("./services/ocr");

const app = express();

// Configuração do multer para salvar arquivos
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const nome = Date.now() + "-" + file.originalname;
    cb(null, nome);
  }
});
const upload = multer({ storage });

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Teste rápido
app.get("/", (req, res) => {
  res.send("✅ Pipefy Smart Bot Online");
});

// Rota /clientes com upload + OCR
app.post("/clientes", upload.fields([
  { name: "cnh", maxCount: 1 },
  { name: "procuracao", maxCount: 1 },
  { name: "contrato", maxCount: 1 }
]), async (req, res) => {
  try {
    const { email, telefone } = req.body;
    const arquivoProcuracao = req.files?.procuracao?.[0];

    if (!arquivoProcuracao) {
      return res.status(400).send("❌ Arquivo de procuração não enviado.");
    }

    console.log("📧 E-mail:", email);
    console.log("📞 Telefone:", telefone);
    console.log("📎 Arquivo:", arquivoProcuracao.originalname);

    const texto = await extrairTextoDoPDF(arquivoProcuracao.path);

    res.send(`
      <h2>✅ Texto extraído da procuração:</h2>
      <pre>${texto}</pre>
      <hr>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${telefone}</p>
    `);

  } catch (err) {
    console.error("❌ Erro ao processar OCR:", err);
    res.status(500).send("Erro ao processar o arquivo.");
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Rodando na porta ${port}`);
});

// 🚨 Adicione isto para manter o container ativo:
setInterval(() => {
  console.log("⏳ Keep-alive executado");
}, 1000 * 60 * 5); // a cada 5 minutos
