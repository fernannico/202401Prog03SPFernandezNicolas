class Persona
{
    constructor(id, nombre, apellido, fechaNacimiento)
    {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }

    toString()
    {
        return `Id: ${this.id}, Nombre: ${this.nombre}, Apellido: ${this.apellido}, FechaNacimiento: ${this.fechaNacimiento}`;
    }

    toJson()
    {
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            fechaNacimiento: this.fechaNacimiento
        });
    }
}

class Ciudadano extends Persona
{
    constructor(id, nombre, apellido, fechaNacimiento, dni)
    {
        super(id, nombre, apellido, fechaNacimiento);
        this.dni = dni;
    }

    toString()
    {
        return `${super.toString()}, Dni: ${this.dni}`;
    }

    toJson()
    {
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            fechaNacimiento: this.fechaNacimiento,
            dni: this.dni,
        });
    }
}

class Extranjero extends Persona
{
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen)
    {
        super(id, nombre, apellido, fechaNacimiento);
        this.paisOrigen = paisOrigen;
    }

    toString()
    {
        return `${super.toString()}, PaisOrigen: ${this.paisOrigen}`;
    }

    toJson()
    {
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            fechaNacimiento: this.fechaNacimiento,
            paisOrigen: this.paisOrigen
        });
    }
}
// fin clases

function ocultarFila(idFila)
{
    var tabla = document.getElementById("tablaPersonas");
    var filas = tabla.rows;

    for (var i = 0; i < filas.length; i++) {
    var celda = filas[i].cells[idFila];
        if (celda) {
            celda.style.display = celda.style.display === 'none' ? 'table-cell' : 'none';
        }
    }
}

function activarSpinner()
{
    $("spinner").parentNode.style.display = "flex";
}

function ocultarSpinner()
{
    $("spinner").parentNode.style.display = "none";
}

// servidor
const ENDPOINT = "https://examenesutn.vercel.app/api/PersonaCiudadanoExtranjero";

// toma un id y devuelve el elemento del DOM correspondiente a ese id 
function $(id){
    return document.getElementById(id)
}

let ListaPersonas = [];

function mostrarListaPersonas() {
    activarSpinner();

    // Configuración de XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("GET", ENDPOINT);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            ocultarSpinner();
            if (xhr.status == 200) {
                //Parseo y manejo de la respuesta
                try {
                    ListaPersonas = JSON.parse(xhr.responseText);
                    if (Array.isArray(ListaPersonas)) {
                        //actualizamos la tabla
                        actualizarTabla();
                    } else {
                        alert("La respuesta de la API no es una lista de personas.");
                    }
                } catch (error) {
                    alert("Error al parsear la respuesta de la API.");
                }
            } else {
                alert("Error: No se pudo obtener la lista de personas. Código de estado: " + xhr.status);
            }
        }
    };
    xhr.send();
}

//Evento cuando el HTML esta cargado y parseado. Asegura que la función mostrarListaPersonas se ejecute una vez que el DOM esté completamente cargado.
document.addEventListener("DOMContentLoaded", function (){
    mostrarListaPersonas();
});

function actualizarTabla()
{
    let tabla = document.querySelector("#tablaPersonas tbody");

    borrarTd();

    ListaPersonas.forEach(function(persona) {
        let fila = document.createElement("tr");
        
        let columnaId = document.createElement("td");
        let columnaNombre = document.createElement("td");
        let columnaApellido = document.createElement("td");
        let columnaFechaNacimiento = document.createElement("td");
        let columnaDni = document.createElement("td");
        let columnaPaisOrigen = document.createElement("td");
        
        columnaId.textContent = persona.id; 
        fila.appendChild(columnaId);
        
        columnaNombre.textContent = persona.nombre;
        fila.appendChild(columnaNombre);
        
        columnaApellido.textContent = persona.apellido;
        fila.appendChild(columnaApellido);

        columnaFechaNacimiento.textContent = persona.fechaNacimiento;
        fila.appendChild(columnaFechaNacimiento);
        
        // //segun corresponda
        columnaDni.textContent = persona.dni  || "N/A";
        fila.appendChild(columnaDni);

        columnaPaisOrigen.textContent = persona.paisOrigen  || "N/A";
        fila.appendChild(columnaPaisOrigen);

        //botonModificar y btnEliminar
        let columnaBotones = document.createElement("td");
        columnaBotones.appendChild(botonModificar(persona));
        columnaBotones.appendChild(botonEliminar(persona));

        
        fila.appendChild(columnaBotones);
        tabla.appendChild(fila);
    });
}

function mostrarAbm(persona = null)
{
    $("formularioAbm").style.display = "block";
    $("formularioLista").style.display = "none";

    let tipo = $("selectTipo");

    if (persona){
        $("selectTipo").disabled = true;

        $("abmId").value = persona.id;
        $("abmNombre").value = persona.nombre;
        $("abmApellido").value = persona.apellido;
        $("abmFechaNacimiento").value = persona.fechaNacimiento;
    
        if (persona.paisOrigen){
            tipo.value = "Extranjero";
        }else{
            tipo.value = "Ciudadano";
        }
        $("abmDni").value = persona.dni;
        $("abmPaisOrigen").value = persona.paisOrigen;
        
        cambiarTipoPersonaABM(tipo.value);

        $("formularioAbm").querySelector("h1").textContent = "Form Modificación";
    }else{
        $("abmId").value = "";
        $("abmNombre").value = "";
        $("abmApellido").value = "";
        $("abmFechaNacimiento").value = "";
        $("abmDni").value = "";
        $("abmPaisOrigen").value = "";

        $("selectTipo").disabled = false;

        cambiarTipoPersonaABM(tipo.value);

        $("formularioAbm").querySelector("h1").textContent = "Form Agregar";
    }
    if(BoolEliminacion){
        $("formularioAbm").querySelector("h1").textContent = "Form eliminacion";

        $("abmNombre").disabled = true;
        $("abmApellido").disabled = true;
        $("abmFechaNacimiento").disabled = true;
        $("abmDni").disabled = true;
        $("abmPaisOrigen").disabled = true;
    } else {
        $("abmNombre").disabled = false;
        $("abmApellido").disabled = false;
        $("abmFechaNacimiento").disabled = false;
        $("abmDni").disabled = false;
        $("abmPaisOrigen").disabled = false;
    }
}

function ocultarAbm()
{
    $("formularioAbm").style.display = "none";
    $("formularioLista").style.display = "block";

    actualizarTabla();
}

//btnAgregar 
$("btnAgregar").addEventListener("click", function() {
    mostrarAbm();

    $("selectTipo").addEventListener("change", function (){
        let tipo = this.value;
        cambiarTipoPersonaABM(tipo);

        $("abmDni").value = "";
        $("abmPaisOrigen").value = "";
    });
});


function agregarPersona(nuevaPersona) {
    return new Promise(async (resolve, reject) => {
        activarSpinner();

        try {
            if (nuevaPersona.nombre === "" || nuevaPersona.apellido === "" || nuevaPersona.fechaNacimiento === "") {
                throw new Error("Complete Nombre, Apellido y Fecha de Nacimiento correctamente.");
            }

            if (nuevaPersona.tipo === "Ciudadano" && (nuevaPersona.dni === "" || nuevaPersona.dni < 0)) {
                throw new Error("Complete el campo DNI correctamente.");
            }

            if (nuevaPersona.tipo === "Extranjero" && nuevaPersona.paisOrigen === "") {
                throw new Error("Complete el campo País de Origen correctamente.");
            }

            const response = await fetch(ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({
                    nombre: nuevaPersona.nombre,
                    apellido: nuevaPersona.apellido,
                    fechaNacimiento: nuevaPersona.fechaNacimiento,
                    dni: nuevaPersona.dni,
                    paisOrigen: nuevaPersona.paisOrigen,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            nuevaPersona.id = data.id;
            ListaPersonas.push(nuevaPersona);

            ocultarSpinner(); 
            ocultarAbm();

            actualizarTabla();

            resolve(); // Resolvemos la promesa sin ningún valor adicional
        } catch (error) {
            console.error("Error al agregar persona:", error);
            alert("Error al agregar persona."+ error.message);
            reject(error); // Rechazamos la promesa con el error
            ocultarSpinner(); 
            ocultarAbm();

        } finally {
            ocultarAbm();

            ocultarSpinner();
        }
    });
}

//btnModificar
function botonModificar(persona) {
    let botonModificar = document.createElement("button");
    botonModificar.textContent = "Modificar";
    botonModificar.classList.add("botonModificar");
    botonModificar.addEventListener("click", function() {
        mostrarAbm(persona);
    });
    return botonModificar;
}

function modificarPersona(nuevaPersona)
{
    activarSpinner();

    fetch(ENDPOINT, {
        method: "PUT",
        headers: {"Content-Type": "application/json;charset=UTF-8"},
        body: JSON.stringify(nuevaPersona)
    })
    .then(response => {
        if (response.ok)
        {
            let index = ListaPersonas.findIndex(persona => persona.id == nuevaPersona.id);
            if (index !== -1){
                ListaPersonas[index].nombre = nuevaPersona.nombre;
                ListaPersonas[index].apellido = nuevaPersona.apellido;
                ListaPersonas[index].fechaNacimiento = nuevaPersona.fechaNacimiento;
                if (nuevaPersona.tipo === "Ciudadano")
                {
                    ListaPersonas[index].dni = nuevaPersona.dni;
                }
                if (nuevaPersona.tipo === "Extranjero")
                {
                    ListaPersonas[index].paisOrigen = nuevaPersona.paisOrigen;
                }
            }

            ocultarAbm();
        }
        else
        {
            alert("Error en la modificacion de la persona");
        }

    })
    .catch(error => {
        console.error(error.message);
        alert("Error en la modificacion de la persona");

        ocultarAbm();
    })
    .finally(() => {
        ocultarSpinner();
    });
}


function cambiarTipoPersonaABM(tipo)
{
    let divCiudadano = $("ciudadano");
    let divExtranjero = $("extranjero");

    if (tipo === "Ciudadano")
    {
        divCiudadano.style.display = "block";
        divExtranjero.style.display = "none";
    }else{
        divCiudadano.style.display = "none";
        divExtranjero.style.display = "block";
    }
}

//btnEliminar
let BoolEliminacion = false;

function botonEliminar(persona) {
    let botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("botonEliminar");
    botonEliminar.addEventListener("click", function() {
        BoolEliminacion = true;
        mostrarAbm(persona);
    });
    return botonEliminar;
}


//btnAceptar (ABM)
$("btnAceptar").addEventListener("click", function(){
    activarSpinner();
    if (BoolEliminacion) {
        console.log("bool true");
        
        const xhr = new XMLHttpRequest();
        xhr.open("DELETE", ENDPOINT);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("200");
                    const idToDelete = parseInt($("abmId").value, 10);

                    ListaPersonas = ListaPersonas.filter(p => p.id !== idToDelete);
                    console.log(ListaPersonas);
                    actualizarTabla();
                    ocultarSpinner();
                } else {
                    alert("no se pudo realizar la operacion.");
                    ocultarSpinner();
                }
            }
        };
        xhr.send(JSON.stringify({ id: $("abmId").value }));
        
        BoolEliminacion = false;
        // actualizarTabla();
        ocultarSpinner(); 
            ocultarAbm();

    } else {
        let nuevaPersona = {
            id: $("abmId").value,
            nombre: $("abmNombre").value,
            apellido: $("abmApellido").value,
            fechaNacimiento: $("abmFechaNacimiento").value,
            // tipo: $("selectTipo").value,
            dni: $("abmDni").value,
            paisOrigen: $("abmPaisOrigen").value
        };

        if (nuevaPersona.nombre == "" || nuevaPersona.apellido == "" || nuevaPersona.fechaNacimiento < 0)
        {
            alert("Complete Nombre, Apellido o FechaNacimiento correctamente");
            ocultarSpinner(); 
            ocultarAbm();

            return;
        }

        if (nuevaPersona.tipo === "Ciudadano") 
        {
            if (nuevaPersona.dni == "" || nuevaPersona.dni < 0)
            {
                alert("Complete los datos Dni correctamente");
                return;
            }
        }

        if (nuevaPersona.tipo === "Extranjero")
        {
            if (nuevaPersona.paisOrigen == "")
            {
                alert("Complete los datos PaisOrigen correctamente");
                return;
            }
        }

        if (nuevaPersona.id)
        {
            modificarPersona(nuevaPersona);

            actualizarTabla();
            ocultarAbm();
        }else{
            agregarPersona(nuevaPersona);

            actualizarTabla();
            ocultarAbm();
        }
    }
});

//btnCancelar (ABM) 
$("btnCancelar").addEventListener("click", function() {
    BoolEliminacion = false;
    ocultarAbm();
    borrarTd();
    actualizarTabla();
});



function borrarTd() {
    document.querySelectorAll("#tablaPersonas tbody tr").forEach(row => {
        row.remove();
    });
}
