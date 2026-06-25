console.log("Agenda 01 carregada.");

const buttons = document.querySelectorAll(".agenda-menu-btn");
const tabs = document.querySelectorAll(".agenda-tab-content");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const target = button.dataset.tab;

        buttons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        tabs.forEach(tab => tab.classList.remove("active-tab"));
        document.getElementById(target).classList.add("active-tab");

        localStorage.setItem("agendaActiveTab", target);
    });
});

const savedTab = localStorage.getItem("agendaActiveTab");
if(savedTab && document.querySelector(`[data-tab="${savedTab}"]`)){
    document.querySelector(`[data-tab="${savedTab}"]`).click();
}

function formatDatePlus(days){
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("pt-PT", {
        weekday:"long",
        day:"2-digit",
        month:"long",
        year:"numeric"
    });
}

const today = document.getElementById("agenda-today-date");
const tomorrow = document.getElementById("agenda-tomorrow-date");

if(today) today.textContent = formatDatePlus(0);
if(tomorrow) tomorrow.textContent = formatDatePlus(1);

document.querySelectorAll("textarea").forEach(area => {
    const key = "agenda_" + area.id;
    if(area.id){
        area.value = localStorage.getItem(key) || "";
        area.addEventListener("input", () => {
            localStorage.setItem(key, area.value);
        });
    }
});

let eventos = JSON.parse(localStorage.getItem("agendaEventos") || "[]");
let aniversarios = JSON.parse(localStorage.getItem("agendaAniversarios") || "[]");

function renderEventos(){
    const lista = document.getElementById("lista-eventos");
    if(!lista) return;

    lista.innerHTML = "";

    if(eventos.length === 0){
        lista.innerHTML = "<li>Sem eventos guardados.</li>";
        return;
    }

    eventos.forEach((ev, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${ev.data}</strong> ${ev.hora || ""} — ${ev.titulo} <button data-i="${i}">x</button>`;
        li.querySelector("button").addEventListener("click", () => {
            eventos.splice(i, 1);
            localStorage.setItem("agendaEventos", JSON.stringify(eventos));
            renderEventos();
        });
        lista.appendChild(li);
    });
}

function renderAniversarios(){
    const lista = document.getElementById("lista-aniversarios");
    if(!lista) return;

    lista.innerHTML = "";

    if(aniversarios.length === 0){
        lista.innerHTML = "<li>Sem aniversários guardados.</li>";
        return;
    }

    aniversarios.forEach((aniv, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${aniv.data}</strong> — ${aniv.nome} <button data-i="${i}">x</button>`;
        li.querySelector("button").addEventListener("click", () => {
            aniversarios.splice(i, 1);
            localStorage.setItem("agendaAniversarios", JSON.stringify(aniversarios));
            renderAniversarios();
        });
        lista.appendChild(li);
    });
}

const guardarEvento = document.getElementById("guardar-evento");
if(guardarEvento){
    guardarEvento.addEventListener("click", () => {
        const titulo = document.getElementById("evento-titulo").value.trim();
        const data = document.getElementById("evento-data").value;
        const hora = document.getElementById("evento-hora").value;

        if(!titulo || !data){
            alert("Preenche o título e a data.");
            return;
        }

        eventos.push({titulo, data, hora});
        localStorage.setItem("agendaEventos", JSON.stringify(eventos));

        document.getElementById("evento-titulo").value = "";
        document.getElementById("evento-data").value = "";
        document.getElementById("evento-hora").value = "";

        renderEventos();
    });
}

const guardarAniv = document.getElementById("guardar-aniv");
if(guardarAniv){
    guardarAniv.addEventListener("click", () => {
        const nome = document.getElementById("aniv-nome").value.trim();
        const data = document.getElementById("aniv-data").value;

        if(!nome || !data){
            alert("Preenche o nome e a data.");
            return;
        }

        aniversarios.push({nome, data});
        localStorage.setItem("agendaAniversarios", JSON.stringify(aniversarios));

        document.getElementById("aniv-nome").value = "";
        document.getElementById("aniv-data").value = "";

        renderAniversarios();
    });
}

renderEventos();
renderAniversarios();
