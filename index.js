const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { extrairTextoDoPDF } = require("./services/ocr");

// Configuração do multer para salvar arquivos na pasta uploads/
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const nome = Date.now() + "-" + file.originalname;
    cb(null, nome);
  }
});
const upload = multer({ storage });

// Garante que a pasta uploads existe
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

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
