const express = require("express");
console.log("SERVER CERTO RODANDO");

const cors = require("cors");
const { conectarDB, sql } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

// =========================
// GET - LISTAR TAREFAS
// =========================
app.get("/tarefas", async (req, res) => {

    try {

        const result = await sql.query(
            "SELECT * FROM tarefas"
        );

        res.json(result.recordset);

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

// =========================
// POST - ADICIONAR TAREFA
// =========================
app.post("/tarefas", async (req, res) => {

    try {

        const { titulo } = req.body;

        await sql.query(`
            INSERT INTO tarefas (titulo, concluida)
            VALUES ('${titulo}', 0)
        `);

        res.json({
            mensagem: "Tarefa salva!"
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});

// =========================
// PUT - CONCLUIR TAREFA
// =========================
app.put("/tarefas/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await sql.query(`
            UPDATE tarefas
            SET concluida =
                CASE
                    WHEN concluida = 0 THEN 1
                    ELSE 0
                END
            WHERE id = ${id}
        `);

        res.json({
            mensagem: "Tarefa atualizada!"
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});

// =========================
// PUT - EDITAR TAREFA
// =========================
app.put("/tarefas/editar/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { titulo } = req.body;

        console.log("EDITAR RECEBIDO");
        console.log("ID:", id);
        console.log("NOVO TÍTULO:", titulo);

        await sql.query(`
            UPDATE tarefas
            SET titulo = '${titulo}'
            WHERE id = ${id}
        `);

        res.json({
            mensagem: "Tarefa editada!"
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});

// =========================
// DELETE - EXCLUIR TAREFA
// =========================
app.delete("/tarefas/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await sql.query(`
            DELETE FROM tarefas
            WHERE id = ${id}
        `);

        res.json({
            mensagem: "Tarefa excluída!"
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: erro.message
        });

    }

});

const PORT = 3000;

// =========================
// INICIAR SERVIDOR
// =========================
async function iniciarServidor() {

    await conectarDB();

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });

}

iniciarServidor();

setInterval(() => {
    console.log("Servidor vivo...");
}, 5000);