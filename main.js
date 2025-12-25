import { Jugador } from './modules/jugadores.js';
import { REGEX_NOMBRE } from './utils/regex.js';


let jugador;


window.onload = () => {
    
    document.getElementById('btn-ir-jugador').onclick = validarYCrearJugador;
};

function validarYCrearJugador() {
    const nombreInput = document.getElementById('reg-nombre').value;
    const nombre = nombreInput.trim(); 

    const ataque = parseInt(document.getElementById('reg-ataque').value) || 0;
    const defensa = parseInt(document.getElementById('reg-defensa').value) || 0;
    const vida = parseInt(document.getElementById('reg-vida').value) || 100;

   
    if (!REGEX_NOMBRE.test(nombreInput) || nombre === "") {
        alert("El nombre debe empezar por Mayúscula y tener máximo 20 caracteres.");
        return;
    }

    
    if ((ataque + defensa + vida) > 110) {
        alert("No puedes repartir más de 10 puntos extra.");
        return;
    }

    if (ataque < 0 || defensa < 0 || vida < 100) {
        alert("Valores mínimos: Ataque 0, Defensa 0, Vida 100.");
        return;
    }

    
    jugador = new Jugador(nombre, ataque, defensa, vida);
    
    
}

