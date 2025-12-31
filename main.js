import { showScene } from './utils/escenas.js';
import { Jugador } from './modules/jugadores.js';
import { REGEX_NOMBRE } from './utils/regex.js';
import { aplicarDescuentoPorRareza, obtenerRarezaAleatoria } from './modules/mercado.js';
import { Enemigo, JefeFinal } from './modules/enemigos.js';
import { batalla } from './modules/ranking.js';


let jugador;
let cesta = [];
let enemigosBatalla = []; 
let indiceCombate = 0;


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
    
    cargarEscenaResumenJugador();
}

function cargarEscenaResumenJugador() {
    const container = document.getElementById('contenedor-resumen');
    
    container.innerHTML = `
        <div class="tarjeta-datos">
            <h3>Héroe: ${jugador.nombre}</h3>
            <p>❤️ Vida Base: ${jugador.vidaMax}</p>
            <p>⚔️ Ataque Base: ${jugador.ataqueBase}</p>
            <p>🛡️ Defensa Base: ${jugador.defensaBase}</p>
            <p>💰 Oro inicial: ${(jugador.dinero / 100).toFixed(2)}€</p>
        </div>
    `;

   
    showScene('escena-jugador');

    document.getElementById('btn-ir-mercado-fijo').onclick = cargarEscenaMercado;
}


function cargarEscenaMercado() {
    const escaparate = document.getElementById('contenedor-productos');
    escaparate.innerHTML = ""; 

    const productosEnVenta = aplicarDescuentoPorRareza(obtenerRarezaAleatoria(), 10);

    productosEnVenta.forEach(objeto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';

        
        tarjeta.innerHTML = `
            <p>${objeto.mostrarProducto()}</p>
            <button class="boton-accion">Añadir</button>
        `;

        
        const boton = tarjeta.querySelector('.boton-accion');
        
        boton.onclick = () => gestionarCesta(objeto, tarjeta, boton);

        escaparate.appendChild(tarjeta);
    });

    showScene('escena-mercado');

    document.getElementById('btn-confirmar-compra').onclick = () => confirmarCompra();
}


function gestionarCesta(producto, tarjetaVisual, elBoton) {
    
    const yaLoTengo = cesta.includes(producto);

    if (yaLoTengo === false) {
        
        if (jugador.dinero >= producto.precio) {
            cesta.push(producto);               
            jugador.dinero -= producto.precio;  
            
            tarjetaVisual.style.backgroundColor = "orange"; 
            elBoton.innerText = "Retirar";      
        } else {
            alert("¡No tienes oro suficiente!");
        }
    } 
    else {
       
        cesta = cesta.filter(item => item !== producto);
        
        jugador.dinero += producto.precio;    
        tarjetaVisual.style.backgroundColor = ""; 
        elBoton.innerText = "Añadir";         
    }

    
    document.getElementById('oro-disponible').innerText = (jugador.dinero / 100).toFixed(2);
}


function confirmarCompra() {
    if (cesta.length === 0) {
        alert("No has seleccionado ningún objeto.");
    }
    
    for (let i = 0; i < cesta.length; i++) {
        jugador.añadirItem(cesta[i]);
    }
    
    cesta = []; 
    alert("¡Compra confirmada! Tu inventario ha sido actualizado.");
    
    cargarEscenaEnemigos();
}


function cargarEscenaEnemigos() {
    
    const contenedor = document.getElementById('contenedor-enemigos');
    
    contenedor.innerHTML = ""; 

    enemigosBatalla = [
        new Enemigo("Troll", 1, 5),
        new Enemigo("Minotauro", 1, 6),
        new JefeFinal("Brujo", 2, 1, "Fuego de Eventos", 1.5)
    ];

    
    enemigosBatalla.forEach(enemigo => {
        const div = document.createElement('div');
        
        div.className = "tarjeta-enemigo " + enemigo.tipo; 
        
        div.innerHTML = "<p>" + enemigo.mostrarEnemigo() + "</p>";
        
        contenedor.appendChild(div);
    });

    showScene('escena-enemigos');

    document.getElementById('btn-comenzar-combate').onclick = () => {
        alert("¡El combate va a empezar!");
        indiceCombate = 0; 
        ejecutarDueloSecuencial();
    };
}

    function ejecutarDueloSecuencial() {
    const rivalActual = enemigosBatalla[indiceCombate];
    batalla(jugador, rivalActual);
    const combateFinalizadoOk = jugador.vida > 0;

    document.getElementById('tarjeta-jugador-batalla').innerHTML = 
        '<h3>' + jugador.nombre + '</h3>' +
        '<p>❤️ Vida: ' + jugador.vida + '</p>' +
        '<p>⚔️ Daño: ' + jugador.ataqueTotal + '</p>';

    document.getElementById('tarjeta-enemigo-batalla').innerHTML = 
        '<h3>' + rivalActual.nombre + '</h3>' +
        '<p>❤️ Vida: ' + (rivalActual.vida <= 0 ? 0 : rivalActual.vida) + '</p>';

    const areaTexto = document.getElementById('registro-batalla');
    const botonProximo = document.getElementById('btn-siguiente-batalla');

    if (combateFinalizadoOk) {
        areaTexto.innerHTML = '<h3>¡Has vencido!</h3><p>El ' + rivalActual.nombre + ' ha sido derrotado.</p>';
        if (indiceCombate < enemigosBatalla.length - 1) {
            botonProximo.innerText = "Próximo Rival";
        } else {
            botonProximo.innerText = "Ver Clasificación Final";
        }
    } else {
        areaTexto.innerHTML = '<h3>GAME OVER</h3>';
        botonProximo.innerText = "Reintentar";
    }

    showScene('escena-batalla');
    botonProximo.classList.remove('oculto');

    botonProximo.onclick = () => {
        if (!combateFinalizadoOk) {
            location.reload();
        } else if (indiceCombate < enemigosBatalla.length - 1) {
            indiceCombate++;
            botonProximo.classList.add('oculto');
            ejecutarDueloSecuencial();
        } else {
            
            mostrarRankingFinal();
        }
    };
}