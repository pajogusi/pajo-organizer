console.log("Pàjó Organizer v0.2 carregado.");

const textarea = document.querySelector("textarea");

if(textarea){
    textarea.value = localStorage.getItem("notaRapida") || "";

    textarea.addEventListener("input",()=>{
        localStorage.setItem("notaRapida", textarea.value);
    });
}
