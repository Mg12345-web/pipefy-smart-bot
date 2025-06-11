const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Teste simples para garantir que o servidor está rodando
app.get("/", (req, res) => {
  res.send("✅ Pipefy Smart Bot Online");
});

// Keep-alive para evitar SIGTERM no Railway
setInterval(() => {
  console.log("⏳ Keep-alive executado para manter o servidor online");
}, 1000 * 60 * 5); // a cada 5 minutos

app.listen(port, () => {
  console.log(`🚀 Rodando na porta ${port}`);
});
