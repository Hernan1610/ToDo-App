let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let filtroActual = "todas";
let searchTerm = "";

function guardar(){
localStorage.setItem("tareas", JSON.stringify(tareas));
}

function agregarTarea(){

let input = document.getElementById("tareaInput");
let texto = input.value.trim();

if(texto === ""){
alert("Escribí una tarea");
return;
}

tareas.push({
texto: texto,
completada: false,
priority: "medium",
dueDate: ""
});

guardar();
input.value="";
showToast("Tarea agregada");
mostrarTareas();
}

function mostrarTareas(){

let lista = document.getElementById("lista");
lista.innerHTML="";

let tareasFiltradas = tareas.filter(t => {
if(filtroActual === "pendientes") return !t.completada;
if(filtroActual === "completadas") return t.completada;
return true;
});

tareasFiltradas = tareasFiltradas.filter(t => t.texto.toLowerCase().includes(searchTerm));

tareasFiltradas.forEach((tarea,index)=>{

lista.innerHTML += `
<li class="${tarea.completada ? 'completada' : ''} ${tarea.priority}">
<span>${tarea.texto}</span>
${tarea.dueDate ? `<small>Fecha límite: ${tarea.dueDate}</small>` : ''}
<button class="complete-btn" onclick="toggle(${index})">✓</button>
<button class="delete-btn" onclick="eliminar(${index})">🗑️</button>
</li>
`;

});

document.getElementById("stats").innerHTML = `Total: ${tareas.length} | Pendientes: ${tareas.filter(t => !t.completada).length} | Completadas: ${tareas.filter(t => t.completada).length}`;

let completed = tareas.filter(t => t.completada).length;
let percent = tareas.length ? (completed / tareas.length) * 100 : 0;
document.getElementById("progress").innerHTML = `<div class="progress-bar" style="width: ${percent}%;"></div>`;

}

function toggle(index){
tareas[index].completada = !tareas[index].completada;
guardar();
showToast(tareas[index].completada ? "Tarea completada" : "Tarea pendiente");
mostrarTareas();
}

function eliminar(index){
tareas.splice(index,1);
guardar();
showToast("Tarea eliminada");
mostrarTareas();
}

function filtrar(tipo){
filtroActual = tipo;
mostrarTareas();
}

function filtrarTexto(){
searchTerm = document.getElementById("search").value.toLowerCase();
mostrarTareas();
}

function exportar() {
    let dataStr = JSON.stringify(tareas, null, 2);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    let exportFileDefaultName = 'tareas.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast("Datos exportados");
}

function showToast(message) {
    let toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 2000);
}

function openModal() {
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function agregarTareaModal() {
    let texto = document.getElementById("modalTexto").value.trim();
    let priority = document.getElementById("modalPriority").value;
    let dueDate = document.getElementById("modalDueDate").value;

    if(texto === ""){
        alert("Escribí una tarea");
        return;
    }

    tareas.push({
        texto: texto,
        completada: false,
        priority: priority,
        dueDate: dueDate
    });

    guardar();
    document.getElementById("modalTexto").value = "";
    document.getElementById("modalDueDate").value = "";
    closeModal();
    showToast("Tarea agregada");
    mostrarTareas();
}

function limpiarCompletadas() {
    let count = tareas.filter(t => t.completada).length;
    tareas = tareas.filter(t => !t.completada);
    guardar();
    showToast(`${count} tareas completadas eliminadas`);
    mostrarTareas();
}

mostrarTareas();