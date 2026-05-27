const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const posts = Array.from({ length: 30 }, (_, index) => {
  const id = index + 1;

  return {
    id: id,
    titulo: `Publicação ${id}`,
    descricao: `Esta é a descrição da publicação número ${id}.`,
    autor: `Autor ${id}`,
    dataPublicacao: "2026-04-28",
    fotoAutor: `https://i.pravatar.cc/150?img=${id}`
  };
});

app.get("/", (req, res) => {
  res.send("API de publicações funcionando!");
});

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});