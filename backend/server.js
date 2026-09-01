import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ALUNOS
app.get("/api/alunos", async (req, res) => {
    const alunos = await prisma.aluno.findMany({ include: { treinos: true } });
    res.json(alunos);
});

app.post("/api/alunos", async (req, res) => {
    const aluno = await prisma.aluno.create({ data: req.body });
    res.status(201).json(aluno);
});

app.put("/api/alunos/:id", async (req, res) => {
    const { id } = req.params;
    const aluno = await prisma.aluno.update({
        where: { id: Number(id) },
        data: req.body
    });
    res.json(aluno);
});

app.delete("/api/alunos/:id", async (req, res) => {
    const { id } = req.params;
    await prisma.aluno.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

// TREINOS
app.get("/api/treinos", async (req, res) => {
    const treinos = await prisma.treino.findMany({ include: { aluno: true } });
    res.json(treinos);
});

app.post("/api/treinos", async (req, res) => {
    const treino = await prisma.treino.create({ data: req.body });
    res.status(201).json(treino);
});

app.put("/api/treinos/:id", async (req, res) => {
    const { id } = req.params;
    const treino = await prisma.treino.update({
        where: { id: Number(id) },
        data: req.body
    });
    res.json(treino);
});

app.delete("/api/treinos/:id", async (req, res) => {
    const { id } = req.params;
    await prisma.treino.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

// MENSALIDADES
app.get("/api/mensalidades", async (req, res) => {
    const mensalidades = await prisma.mensalidade.findMany({
        include: { aluno: true },
        orderBy: { dataVenc: 'desc' }
    });
    res.json(mensalidades);
});

app.get("/api/alunos/:alunoId/mensalidades", async (req, res) => {
    const { alunoId } = req.params;
    const mensalidades = await prisma.mensalidade.findMany({
        where: { alunoId: Number(alunoId) },
        orderBy: { dataVenc: 'desc' }
    });
    res.json(mensalidades);
});

app.post("/api/mensalidades", async (req, res) => {
    const mensalidade = await prisma.mensalidade.create({ data: req.body });
    res.status(201).json(mensalidade);
});

app.put("/api/mensalidades/:id", async (req, res) => {
    const { id } = req.params;
    const mensalidade = await prisma.mensalidade.update({
        where: { id: Number(id) },
        data: req.body
    });
    res.json(mensalidade);
});

app.delete("/api/mensalidades/:id", async (req, res) => {
    const { id } = req.params;
    await prisma.mensalidade.delete({ where: { id: Number(id) } });
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));