require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  }
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("✅ Pipefy Smart Bot Online"));

app.post("/clientes", upload.fields([
  { name: "procuracao", maxCount: 1 },
  { name: "cnh", maxCount: 1 }
]), async (req, res) => {
  const { email, telefone } = req.body;
  const arquivos = req.files;
  console.log("📥 Recebido:", { email, telefone, arquivos });

  // Aqui vamos integrar OCR, GPT e Playwright

  res.json({ status: "ok" });
});

app.listen(port, () => console.log(`🚀 Rodando na porta ${port}`));
