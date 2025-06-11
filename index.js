require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");

const { extrairTextoDoPDF } = require("./services/ocr");
const { interpretarTextoOCR } = require("./services/gpt");

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const nome = Date.now() + "-" + file.originalname;
    cb(null, nome);
  }
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("✅ Pipefy Smart Bot Online");
});

app.post("/clientes", upload.fields([
  { name: "procuracao", maxCount: 1 },
  { name: "cnh", maxCount: 1 }
]), async (req, res) => {
  try {
    const { email, telefone } = req.body;
    const arquivoProcuracao = req.files?.procuracao?.[0];

    if (!arquivoProcuracao) {
      return res.status(400).json({ erro: "Arquivo de procuração não enviado." });
    }

    console.log("📩 E-mail:", email);
    console.log("📞 Telefone:", telefone);
    console.log("📎 PDF recebido:", arquivoProcuracao.path);

    const texto = await extrairTextoDoPDF(arquivoProcuracao.path);
    const dados = await interpretarTextoOCR(texto);

    console.log("🧠 Dados extraídos:", dados);

    res.json({
      email,
      telefone,
      dadosExtraidos: dados
    });

  } catch (err) {
    console.error("❌ Erro no fluxo /clientes:", err);
    res.status(500).json({ erro: "Falha ao processar o PDF." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Rodando na porta ${port}`);
});
