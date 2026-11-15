const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PASTA_SITE = path.join(__dirname, "..", "/");
const PAGINA_INICIAL = path.join(PASTA_SITE, "lillium.html");

app.disable("x-powered-by");

app.get("/api/saude", (req, res) => {
  res.json({ status: "ok", projeto: "Lillium" });
});

// Página principal do site (lillium.html)
app.get("/", (req, res) => {
  res.sendFile(PAGINA_INICIAL);
});

app.use(express.static(PASTA_SITE));

// Qualquer rota desconhecida volta para a página principal
app.use((req, res) => {
  res.status(404).sendFile(PAGINA_INICIAL);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
