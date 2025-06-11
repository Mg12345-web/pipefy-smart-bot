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

// Nova rota /clientes com upload + OCR
app.post("/clientes", upload.single("arquivo"), async (req, res) => {
  try {
    const arquivo = req.file;
    if (!arquivo) return res.status(400).send("Nenhum arquivo enviado.");

    console.log("📎 Arquivo recebido:", arquivo.originalname);

    const texto = await extrairTextoDoPDF(arquivo.path);
    res.send(`<pre>${texto}</pre>`);

  } catch (err) {
    console.error("❌ Erro ao processar OCR:", err);
    res.status(500).send("Erro interno ao processar o arquivo.");
  }
});
