console.log("SCRIPT CARREGOU");

// ELEMENTOS
const input = document.getElementById("inputTarefa");
const botao = document.getElementById("btnAdicionar");
const lista = document.getElementById("listaTarefas");
const prioridade = document.getElementById("selectPrioridade");

const total = document.getElementById("total");
const pendentes = document.getElementById("pendentes");
const concluidas = document.getElementById("concluidas");

// FILTRO ATUAL
let filtroAtual = "todas";
let dataFiltro = "";
let pesquisa = "";

function mudarFiltro(filtro) {
    filtroAtual = filtro;
    buscarTarefas();
}
function filtrarPorData() {

    dataFiltro =
        document.getElementById("filtroData").value;

    buscarTarefas();

}

function limparFiltroData() {

    dataFiltro = "";

    document.getElementById("filtroData").value = "";

    buscarTarefas();

}
document
    .getElementById("pesquisaTarefa")
    .addEventListener("input", function () {

        pesquisa = this.value.toLowerCase();

        buscarTarefas();

    });

// =========================
// ADICIONAR TAREFA
// =========================
async function adicionarTarefa() {
    const dataTarefa =
    document.getElementById("dataTarefa").value;
     console.log("DATA ESCOLHIDA:", dataTarefa);
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
                prioridade: prioridade.value,
                dataTarefa
            })
        });

        input.value = "";
        prioridade.value = "Media";
        document.getElementById("dataTarefa").value = "";

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
        total.textContent = tarefas.length;

pendentes.textContent =
    tarefas.filter(t => !t.concluida).length;

concluidas.textContent =
    tarefas.filter(t => t.concluida).length;

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
    if (dataFiltro !== "") {

    tarefasFiltradas =
        tarefasFiltradas.filter(tarefa => {

            if (!tarefa.dataTarefa) {
                return false;
            }

            return tarefa.dataTarefa
                .split("T")[0] === dataFiltro;

        });

}

// FILTRO DE PESQUISA
if (pesquisa !== "") {

    tarefasFiltradas =
        tarefasFiltradas.filter(tarefa =>

            tarefa.titulo
                .toLowerCase()
                .includes(pesquisa)

        );

}

    tarefasFiltradas.sort((a, b) => {

    const prioridades = {
        Alta: 1,
        Media: 2,
        Baixa: 3
    };

    return prioridades[a.prioridade] -
           prioridades[b.prioridade];

});

    tarefasFiltradas.forEach((tarefa) => {

        const li = document.createElement("li");
        li.style.display = "flex";
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

        const dataCompromisso = document.createElement("small");

if (tarefa.dataTarefa) {

    dataCompromisso.textContent =
    " 📅 Para: " +
    tarefa.dataTarefa.split("T")[0]
        .split("-")
        .reverse()
        .join("/");

} else {

    dataCompromisso.textContent =
        " 📅 Sem data definida";

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
                prioridade: prioridade.value,

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
li.appendChild(dataCompromisso);

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