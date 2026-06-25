console.log("Pàjó Organizer v0.3 carregado.");

const links = document.querySelectorAll(".sidebar a");
const sections = document.querySelectorAll(".section");
const pageTitle = document.getElementById("page-title");

const titles = {
    dashboard:"Dashboard",
    agenda:"Agenda",
    tarefas:"Tarefas",
    notas:"Notas",
    contactos:"Contactos",
    projetos:"Projetos",
    financas:"Finanças",
    viagens:"Viagens",
    mundo:"Mundo",
    definicoes:"Definições"
};

links.forEach(link=>{
    link.addEventListener("click",()=>{
        const target = link.dataset.section;

        links.forEach(l=>l.classList.remove("active"));
        link.classList.add("active");

        sections.forEach(sec=>sec.classList.remove("active-section"));
        document.getElementById(target).classList.add("active-section");

        pageTitle.textContent = titles[target] || "Pàjó Organizer";
        localStorage.setItem("activeSection", target);
    });
});

const savedSection = localStorage.getItem("activeSection");
if(savedSection && document.querySelector(`[data-section="${savedSection}"]`)){
    document.querySelector(`[data-section="${savedSection}"]`).click();
}

const today = document.getElementById("today");
if(today){
    today.textContent = new Date().toLocaleDateString("pt-PT", {
        weekday:"long",
        day:"2-digit",
        month:"long",
        year:"numeric"
    });
}

const quickNote = document.getElementById("quick-note");
if(quickNote){
    quickNote.value = localStorage.getItem("quickNote") || "";
    quickNote.addEventListener("input",()=>{
        localStorage.setItem("quickNote", quickNote.value);
    });
}

const mainNotes = document.getElementById("main-notes");
if(mainNotes){
    mainNotes.value = localStorage.getItem("mainNotes") || "";
    mainNotes.addEventListener("input",()=>{
        localStorage.setItem("mainNotes", mainNotes.value);
    });
}

const taskText = document.getElementById("task-text");
const addTask = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const dashboardTasks = document.getElementById("dashboard-tasks");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(){
    if(taskList){
        taskList.innerHTML = "";
        tasks.forEach((task,index)=>{
            const li = document.createElement("li");
            li.innerHTML = `<input type="checkbox" ${task.done ? "checked" : ""}> <span>${task.text}</span> <button data-index="${index}">x</button>`;

            li.querySelector("input").addEventListener("change",e=>{
                tasks[index].done = e.target.checked;
                saveTasks();
                renderTasks();
            });

            li.querySelector("button").addEventListener("click",()=>{
                tasks.splice(index,1);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);
        });
    }

    if(dashboardTasks){
        dashboardTasks.innerHTML = "";
        tasks.slice(0,5).forEach(task=>{
            const li = document.createElement("li");
            li.textContent = task.done ? "✅ " + task.text : "⬜ " + task.text;
            dashboardTasks.appendChild(li);
        });

        if(tasks.length === 0){
            dashboardTasks.innerHTML = "<li>Sem tarefas guardadas.</li>";
        }
    }
}

if(addTask){
    addTask.addEventListener("click",()=>{
        const text = taskText.value.trim();
        if(!text) return;
        tasks.push({text, done:false});
        taskText.value = "";
        saveTasks();
        renderTasks();
    });
}

if(taskText){
    taskText.addEventListener("keydown",e=>{
        if(e.key === "Enter") addTask.click();
    });
}

const clearData = document.getElementById("clear-data");
if(clearData){
    clearData.addEventListener("click",()=>{
        if(confirm("Queres mesmo limpar os dados guardados neste browser?")){
            localStorage.clear();
            location.reload();
        }
    });
}

renderTasks();
