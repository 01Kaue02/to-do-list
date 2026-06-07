console.log("SCRIPT CARREGOU");

// ELEMENTOS
const input = document.getElementById("inputTarefa");
const botao = document.getElementById("btnAdicionar");
const lista = document.getElementById("listaTarefas");
const prioridade = document.getElementById("selectPrioridade");

// FILTRO ATUAL
let filtroAtual = "todas";

function mudarFiltro(filtro) {
    filtroAtual = filtro;
    buscarTarefas();
}

// =========================
// ADICIONAR TAREFA
// =========================
async function adicionarTarefa() {

    const titulo = input.value;

    if (!titulo || titulo.trim() === "") {
        alert("Digite uma tarefa!");
        return;
    }

    try {

        await fetch("http://localhost:3000/tarefas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo,
                prioridade: prioridade.value
            })
        });

        input.value = "";
        prioridade.value = "Media";

        buscarTarefas();

    } catch (erro) {

        console.log("ERRO AO ADICIONAR:");
        console.log(erro);

    }

}

// =========================
// BUSCAR TAREFAS
// =========================
async function buscarTarefas() {

    try {

        const resposta = await fetch("http://localhost:3000/tarefas");

        const tarefas = await resposta.json();

        renderizar(tarefas);

    } catch (erro) {

        console.log("ERRO AO BUSCAR:");
        console.log(erro);

    }

}

// =========================
// RENDERIZAR
// =========================
function renderizar(tarefas) {

    lista.innerHTML = "";

    let tarefasFiltradas;

    if (filtroAtual === "pendentes") {

        tarefasFiltradas = tarefas.filter(t => !t.concluida);

    } else if (filtroAtual === "concluidas") {

        tarefasFiltradas = tarefas.filter(t => t.concluida);

    } else {

        tarefasFiltradas = tarefas;

    }

    tarefasFiltradas.forEach((tarefa) => {

        const li = document.createElement("li");
        if (tarefa.prioridade === "Alta") {
    li.classList.add("prioridade-alta");
}
else if (tarefa.prioridade === "Media") {
    li.classList.add("prioridade-media");
}
else if (tarefa.prioridade === "Baixa") {
    li.classList.add("prioridade-baixa");
}

        const span = document.createElement("span");
        span.textContent = tarefa.titulo;

        if (tarefa.concluida) {
            span.style.textDecoration = "line-through";
        }

        const data = document.createElement("small");

        if (tarefa.dataCriacao) {
            data.textContent =
                "Criada em: " +
                new Date(tarefa.dataCriacao)
                    .toLocaleString("pt-BR");
        } else {
            data.textContent = "Sem data";
        }
        const prioridadeTexto = document.createElement("small");

prioridadeTexto.textContent =
    " Prioridade: " + tarefa.prioridade;
    if (tarefa.prioridade === "Alta") {
    prioridadeTexto.classList.add("alta");
}
else if (tarefa.prioridade === "Media") {
    prioridadeTexto.classList.add("media");
}
else if (tarefa.prioridade === "Baixa") {
    prioridadeTexto.classList.add("baixa");
}

        // BOTÃO CONCLUIR
        const btnCheck = document.createElement("button");
        btnCheck.textContent = tarefa.concluida ? "✅" : "✔";

        btnCheck.addEventListener("click", async () => {

    await fetch(
        `http://localhost:3000/tarefas/${tarefa.id}`,
        {
            method: "PUT"
        }
    );

    buscarTarefas();

});

// BOTÃO EDITAR
const btnEditar = document.createElement("button");
btnEditar.textContent = "✏️";

btnEditar.addEventListener("click", async () => {

    const novoTitulo = prompt(
        "Digite o novo nome da tarefa:",
        tarefa.titulo
    );

    if (!novoTitulo) return;

    await fetch(
        `http://localhost:3000/tarefas/editar/${tarefa.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: novoTitulo,
                prioridade: prioridade.value
            })
        }
    );

    buscarTarefas();

});

// BOTÃO EXCLUIR
const btnExcluir = document.createElement("button");
btnExcluir.textContent = "❌";
btnExcluir.addEventListener("click", async () => {

    await fetch(
        `http://localhost:3000/tarefas/${tarefa.id}`,
        {
            method: "DELETE"
        }
    );

    buscarTarefas();

});

        li.appendChild(btnCheck);
        li.appendChild(btnEditar);
        li.appendChild(span);
        li.appendChild(prioridadeTexto);
        li.appendChild(document.createElement("br"));
        li.appendChild(data);
        li.appendChild(btnExcluir);

        lista.appendChild(li);

    });

}

// =========================
// EVENTO BOTÃO
// =========================
botao.addEventListener("click", adicionarTarefa);

// =========================
// ENTER
// =========================
input.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {
        adicionarTarefa();
    }

});

// =========================
// INICIAR
// =========================
buscarTarefas();