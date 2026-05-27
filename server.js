const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let posts = Array.from({ length: 30 }, (_, index) => {
  const id = index + 1;

  return {
    id: id,
    titulo: `Publicação ${id}`,
    conteudo: `Conteúdo completo da publicação número ${id}.`,
    descricao: `Esta é a descrição da publicação número ${id}.`,
    autor: `Autor ${id}`,
    criadoEm: "2026-05-20T14:30:00Z",
    atualizadoEm: "2026-05-20T15:00:00Z",
    dataPublicacao: "2026-04-28",
    fotoAutor: `https://i.pravatar.cc/150?img=${id}`
  };
});

app.get("/", (req, res) => {
  res.send("API de publicações funcionando!");
});

app.get("/posts", (req, res) => {
  if (posts.length === 0) {
    return res.status(204).send();
  }

  res.status(200).json(posts);
});

app.post("/posts", (req, res) => {
  const { titulo, conteudo, autor } = req.body;

  if (!titulo || !conteudo || !autor) {
    return res.status(400).json({
      status: 400,
      error: "Bad Request",
      message: "Os campos titulo, conteudo e autor são obrigatórios.",
      timestamp: new Date().toISOString()
    });
  }

  if (titulo.length < 3 || conteudo.length < 10) {
    return res.status(422).json({
      status: 422,
      error: "Validation Error",
      message: "O título deve ter pelo menos 3 caracteres e o conteúdo pelo menos 10 caracteres.",
      timestamp: new Date().toISOString()
    });
  }

  const novoPost = {
    id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
    titulo,
    conteudo,
    descricao: conteudo,
    autor,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    dataPublicacao: new Date().toISOString().split("T")[0],
    fotoAutor: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
  };

  posts.push(novoPost);

  res.status(201).json(novoPost);
});

app.get("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return res.status(404).json({
      status: 404,
      error: "Not Found",
      message: "Postagem não encontrada",
      timestamp: new Date().toISOString()
    });
  }

  res.status(200).json(post);
});

app.put("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const { titulo, conteudo, autor } = req.body;

  const index = posts.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 404,
      error: "Not Found",
      message: "Postagem não encontrada",
      timestamp: new Date().toISOString()
    });
  }

  if (!titulo || !conteudo || !autor) {
    return res.status(400).json({
      status: 400,
      error: "Bad Request",
      message: "Os campos titulo, conteudo e autor são obrigatórios.",
      timestamp: new Date().toISOString()
    });
  }

  if (titulo.length < 3 || conteudo.length < 10) {
    return res.status(422).json({
      status: 422,
      error: "Validation Error",
      message: "O título deve ter pelo menos 3 caracteres e o conteúdo pelo menos 10 caracteres.",
      timestamp: new Date().toISOString()
    });
  }

  posts[index] = {
    ...posts[index],
    titulo,
    conteudo,
    descricao: conteudo,
    autor,
    atualizadoEm: new Date().toISOString()
  };

  res.status(200).json(posts[index]);
});

app.delete("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 404,
      error: "Not Found",
      message: "Postagem não encontrada",
      timestamp: new Date().toISOString()
    });
  }

  posts.splice(index, 1);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
