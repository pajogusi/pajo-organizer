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

// ===== Agenda v0.4 =====

let agendaDate = new Date();
let agendaView = localStorage.getItem("agendaView") || "day";
let events = JSON.parse(localStorage.getItem("events") || "[]");

const agendaTitle = document.getElementById("agenda-title");
const agendaViewBox = document.getElementById("agenda-view");
const eventList = document.getElementById("event-list");

function saveEvents(){
    localStorage.setItem("events", JSON.stringify(events));
}

function dateKey(date){
    return date.toISOString().split("T")[0];
}

function formatDate(date){
    return date.toLocaleDateString("pt-PT", {
        weekday:"long",
        day:"2-digit",
        month:"long",
        year:"numeric"
    });
}

function renderAgenda(){
    if(!agendaViewBox || !agendaTitle) return;

    document.querySelectorAll(".agenda-tab").forEach(btn=>{
        btn.classList.toggle("active", btn.dataset.view === agendaView);
    });

    localStorage.setItem("agendaView", agendaView);

    if(agendaView === "day"){
        renderDay();
    }

    if(agendaView === "week"){
        renderWeek();
    }

    if(agendaView === "month"){
        renderMonth();
    }

    if(agendaView === "year"){
        renderYear();
    }

    renderEvents();
}

function renderDay(){
    agendaTitle.textContent = formatDate(agendaDate);
    agendaViewBox.innerHTML = '<div class="agenda-day"></div>';

    const container = agendaViewBox.querySelector(".agenda-day");

    for(let h=6; h<=22; h++){
        const block = document.createElement("div");
        block.className = "hour-block";
        block.innerHTML = `<strong>${String(h).padStart(2,"0")}:00</strong>`;

        const dayEvents = events.filter(e=>{
            return e.date === dateKey(agendaDate) && e.time && Number(e.time.split(":")[0]) === h;
        });

        dayEvents.forEach(e=>{
            block.innerHTML += `<p>📌 ${e.time} — ${e.title}</p>`;
        });

        container.appendChild(block);
    }
}

function renderWeek(){
    agendaTitle.textContent = "Semana de " + formatDate(agendaDate);
    agendaViewBox.innerHTML = '<div class="agenda-week"></div>';

    const container = agendaViewBox.querySelector(".agenda-week");
    const start = new Date(agendaDate);
    start.setDate(start.getDate() - ((start.getDay()+6)%7));

    for(let i=0; i<7; i++){
        const d = new Date(start);
        d.setDate(start.getDate()+i);

        const box = document.createElement("div");
        box.className = "week-day";
        box.innerHTML = `<strong>${d.toLocaleDateString("pt-PT",{weekday:"short", day:"2-digit", month:"2-digit"})}</strong>`;

        events.filter(e=>e.date === dateKey(d)).forEach(e=>{
            box.innerHTML += `<p>📌 ${e.time || ""} ${e.title}</p>`;
        });

        container.appendChild(box);
    }
}

function renderMonth(){
    agendaTitle.textContent = agendaDate.toLocaleDateString("pt-PT", {month:"long", year:"numeric"});
    agendaViewBox.innerHTML = '<div class="agenda-month"></div>';

    const container = agendaViewBox.querySelector(".agenda-month");
    const year = agendaDate.getFullYear();
    const month = agendaDate.getMonth();
    const days = new Date(year, month+1, 0).getDate();

    for(let d=1; d<=days; d++){
        const date = new Date(year, month, d);
        const box = document.createElement("div");
        box.className = "month-day";
        box.innerHTML = `<strong>${d}</strong>`;

        events.filter(e=>e.date === dateKey(date)).forEach(e=>{
            box.innerHTML += `<p>📌 ${e.title}</p>`;
        });

        container.appendChild(box);
    }
}

function renderYear(){
    agendaTitle.textContent = agendaDate.getFullYear();
    agendaViewBox.innerHTML = '<div class="agenda-year"></div>';

    const container = agendaViewBox.querySelector(".agenda-year");

    for(let m=0; m<12; m++){
        const box = document.createElement("div");
        box.className = "year-month";
        box.innerHTML = `<strong>${new Date(agendaDate.getFullYear(),m,1).toLocaleDateString("pt-PT",{month:"long"})}</strong>`;

        const count = events.filter(e=>{
            const d = new Date(e.date);
            return d.getFullYear() === agendaDate.getFullYear() && d.getMonth() === m;
        }).length;

        box.innerHTML += `<p>${count} compromisso(s)</p>`;
        container.appendChild(box);
    }
}

function renderEvents(){
    if(!eventList) return;

    eventList.innerHTML = "";

    if(events.length === 0){
        eventList.innerHTML = "<li>Sem compromissos guardados.</li>";
        return;
    }

    events
        .slice()
        .sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))
        .forEach((event,index)=>{
            const li = document.createElement("li");
            li.className = "event-item";
            li.innerHTML = `
                <span><strong>${event.date}</strong> ${event.time || ""} — ${event.title}<br><small>${event.notes || ""}</small></span>
                <button data-index="${index}">x</button>
            `;

            li.querySelector("button").addEventListener("click",()=>{
                events.splice(index,1);
                saveEvents();
                renderAgenda();
            });

            eventList.appendChild(li);
        });
}

document.querySelectorAll(".agenda-tab").forEach(btn=>{
    btn.addEventListener("click",()=>{
        agendaView = btn.dataset.view;
        renderAgenda();
    });
});

const prevBtn = document.getElementById("agenda-prev");
const nextBtn = document.getElementById("agenda-next");
const todayBtn = document.getElementById("agenda-today");

if(prevBtn){
    prevBtn.addEventListener("click",()=>{
        if(agendaView === "day") agendaDate.setDate(agendaDate.getDate()-1);
        if(agendaView === "week") agendaDate.setDate(agendaDate.getDate()-7);
        if(agendaView === "month") agendaDate.setMonth(agendaDate.getMonth()-1);
        if(agendaView === "year") agendaDate.setFullYear(agendaDate.getFullYear()-1);
        renderAgenda();
    });
}

if(nextBtn){
    nextBtn.addEventListener("click",()=>{
        if(agendaView === "day") agendaDate.setDate(agendaDate.getDate()+1);
        if(agendaView === "week") agendaDate.setDate(agendaDate.getDate()+7);
        if(agendaView === "month") agendaDate.setMonth(agendaDate.getMonth()+1);
        if(agendaView === "year") agendaDate.setFullYear(agendaDate.getFullYear()+1);
        renderAgenda();
    });
}

if(todayBtn){
    todayBtn.addEventListener("click",()=>{
        agendaDate = new Date();
        renderAgenda();
    });
}

const addEventBtn = document.getElementById("add-event");

if(addEventBtn){
    addEventBtn.addEventListener("click",()=>{
        const title = document.getElementById("event-title").value.trim();
        const date = document.getElementById("event-date").value;
        const time = document.getElementById("event-time").value;
        const notes = document.getElementById("event-notes").value.trim();

        if(!title || !date){
            alert("Preenche pelo menos o título e a data.");
            return;
        }

        events.push({title, date, time, notes});

        document.getElementById("event-title").value = "";
        document.getElementById("event-date").value = "";
        document.getElementById("event-time").value = "";
        document.getElementById("event-notes").value = "";

        saveEvents();
        renderAgenda();
    });
}

renderAgenda();
