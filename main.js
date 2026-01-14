import { showScene } from './utils/escenas.js';
import { Jugador } from './modules/jugadores.js';
import { REGEX_NOMBRE } from './utils/regex.js';
import { aplicarDescuentoPorRareza, obtenerRarezaAleatoria } from './modules/mercado.js';
import { Enemigo, JefeFinal } from './modules/enemigos.js';
import { batalla } from './modules/ranking.js';


/** @type {Jugador} Instancia del jugador actual. */
let jugador;

/** @type {Array<Object>} Lista temporal de productos seleccionados en el mercado. */
let cesta = [];

/** @type {Array<Enemigo|JefeFinal>} Lista de enemigos a vencer en la secuencia de batalla. */
let enemigosBatalla = [];

/** @type {number} Índice del enemigo actual contra el que se está luchando. */
let indiceCombate = 0;

/**
 * Almacena la cantidad de dinero que tenía el jugador justo antes de comenzar la secuencia de combates.
 * Se utiliza para comparar y calcular el oro total ganado.
 * @type {number}
 */
let dineroAntesDeBatallas = 0;

const ERROR_NOMBRE = "Mayúscula y máx 20 letras.";
const ERROR_EXCESO = "La suma total pasa de 110.";
const ERROR_NEGATIVO = "No puede ser negativo.";


/**
 * Inicialización de la aplicación cuando la ventana carga.
 * Carga datos de prueba en localStorage si está vacío y asigna eventos iniciales.
 */
window.onload = () => {

    /**
     * Comprueba si existe un ranking en localStorage. 
     * Si no existe, inyecta un set de datos de prueba para que la tabla no esté vacía.
     */
    function cargarDatosPrueba() {
        const rankingExistente = localStorage.getItem('ranking_final');

        if (!rankingExistente || JSON.parse(rankingExistente).length === 0) {
            const datosPrueba = [
                { idNombre: "Rodas", idPuntos: 950, idDinero: 450, idFecha: "01/01/2026" },
                { idNombre: "Lucía", idPuntos: 840, idDinero: 120, idFecha: "01/01/2026" },
                { idNombre: "Gloria", idPuntos: 120, idDinero: 40, idFecha: "02/01/2026" },
                { idNombre: "Elías", idPuntos: 1100, idDinero: 600, idFecha: "02/01/2026" },
                { idNombre: "Ronic", idPuntos: 750, idDinero: 300, idFecha: "02/01/2026" },
                { idNombre: "Adri", idPuntos: 640, idDinero: 160, idFecha: "02/01/2026" },
                { idNombre: "Rebeca", idPuntos: 500, idDinero: 100, idFecha: "02/01/2026" },
                { idNombre: "Miguel", idPuntos: 990, idDinero: 200, idFecha: "02/01/2026" },
                { idNombre: "Ángel", idPuntos: 430, idDinero: 90, idFecha: "02/01/2026" },
                { idNombre: "Paco Mera", idPuntos: 880, idDinero: 350, idFecha: "02/01/2026" },
                { idNombre: "Pablo", idPuntos: 320, idDinero: 50, idFecha: "02/01/2026" },
                { idNombre: "Gabino", idPuntos: 1050, idDinero: 500, idFecha: "02/01/2026" }
            ];

            localStorage.setItem('ranking_final', JSON.stringify(datosPrueba));
            console.log("Datos de prueba cargados en el Ranking");
        }
    }


    cargarDatosPrueba();

    document.getElementById('btn-ir-jugador').onclick = validarYCrearJugador;
};

/**
 * Lee los valores del formulario de creación, valida las restricciones
 * (nombre regex, stats no negativos, suma total <= 110) e instancia al Jugador.
 * Si todo es correcto, avanza a la siguiente escena.
 */
function validarYCrearJugador() {
    const nombreInput = document.getElementById('reg-nombre').value;
    const nombre = nombreInput.trim();

    const spanNombre = document.getElementById('error-nombre');
    const spanAtaque = document.getElementById('error-ataque');   
    const spanDefensa = document.getElementById('error-defensa'); 
    const spanVida = document.getElementById('error-vida');       

    
    spanNombre.textContent = "";
    spanAtaque.textContent = "";
    spanDefensa.textContent = "";
    spanVida.textContent = "";

    const ataque = parseInt(document.getElementById('reg-ataque').value) || 0;
    const defensa = parseInt(document.getElementById('reg-defensa').value) || 0;
    const vida = parseInt(document.getElementById('reg-vida').value) || 100;

    let hayError = false;



    if (!REGEX_NOMBRE.test(nombreInput) || nombre === "") {
        spanNombre.textContent = ERROR_NOMBRE;
        hayError = true;
    }


    if (ataque < 0) {
        spanAtaque.textContent = ERROR_NEGATIVO;
        hayError = true;
    }
    if (defensa < 0) {
        spanDefensa.textContent = ERROR_NEGATIVO;
        hayError = true;
    }


    if (vida < 100) {
        spanVida.textContent = "Mínimo 100 puntos de vida.";
        hayError = true;
    } else {

        if ((ataque + defensa + vida) > 110) {
            spanVida.textContent = ERROR_EXCESO;
            hayError = true;
        }
    }


    if (hayError) {
        return;
    }


    jugador = new Jugador(nombre, ataque, defensa, vida);

    actualizarMonederoVisual();

    cargarEscenaResumenJugador();
}

/**
 * Muestra la escena con el resumen inicial de las estadísticas del jugador.
 */
function cargarEscenaResumenJugador() {

    document.getElementById('mostrarNombre').innerText = jugador.nombre;


    const container = document.getElementById('contenedor-resumen');


    container.innerHTML =
        '<div class="estadisticas-card">Ataque: ' + jugador.ataqueBase + '</div>' +
        '<div class="estadisticas-card">Defensa: ' + jugador.defensaBase + '</div>' +
        '<div class="estadisticas-card">Vida: ' + jugador.vidaMax + '</div>' +
        '<div class="estadisticas-card">Puntos: ' + jugador.puntos + '</div>';

    showScene('escena-jugador');
    document.getElementById('btn-ir-mercado-fijo').onclick = cargarEscenaMercado;
}


/**
 * Actualiza la visualización del inventario en el DOM.
 * Rellena los huecos vacíos con las imágenes de los items pasados por parámetro.
 * @param {Array<Object>} listaAMostrar - Lista de productos a renderizar.
 */
function refrescarInventarioVisual(listaAMostrar) {
    var todosLosHuecos = document.querySelectorAll('.espacio-inventario');

    for (var i = 0; i < todosLosHuecos.length; i++) {
        todosLosHuecos[i].innerHTML = "";
    }

    if (listaAMostrar) {
        for (var j = 0; j < listaAMostrar.length && j < 6; j++) {
            var productoActual = listaAMostrar[j];
            var huecoActual = todosLosHuecos[j];

            var imagenObjeto = document.createElement('img');


            imagenObjeto.src = productoActual.imagen;

            imagenObjeto.style.width = "40px";
            imagenObjeto.style.height = "40px";
            imagenObjeto.style.objectFit = "contain";

            huecoActual.appendChild(imagenObjeto);
        }
    }
}


/**
 * Wrapper para refrescar el inventario visualmente usando la cesta temporal de compra.
 * @param {Array<Object>} laCesta - Array de productos actualmente en la cesta.
 */
function refrescarInventarioTemporal(laCesta) {
    refrescarInventarioVisual(laCesta);
}


/**
 * Prepara y muestra la escena del mercado.
 * - Genera una rareza aleatoria para ofertas.
 * - Aplica descuentos.
 * - Crea las tarjetas de productos en el DOM.
 */
function cargarEscenaMercado() {
    const escaparate = document.getElementById('contenedor-productos');
    if (!escaparate) return;


    escaparate.innerHTML = "";


    const rarezaEnOferta = obtenerRarezaAleatoria();


    const productosEnVenta = aplicarDescuentoPorRareza(rarezaEnOferta, 10);

    console.log("Oferta aplicada a la rareza: " + rarezaEnOferta);

    for (let i = 0; i < productosEnVenta.length; i++) {
        let objeto = productosEnVenta[i];

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';

        if (objeto.rareza === rarezaEnOferta) {

            objeto = objeto.aplicarDescuento(10);

            tarjeta.style.backgroundColor = "#fff3cd";
            tarjeta.style.border = "2px solid gold";
        }


        const rutaImagen = objeto.imagen;

        const precioNormal = objeto.precio;

        tarjeta.innerHTML =
            '<img src="' + rutaImagen + '" alt="' + objeto.nombre + '" class="img-producto">' +
            '<div class="info-producto">' +

            '<p>' + objeto.mostrarProducto() + '</p>' +

            '</div>' +
            '<button class="btn-primario boton-accion">Añadir</button>';

        const boton = tarjeta.querySelector('.boton-accion');

        boton.onclick = function () {
        gestionarCesta(objeto, tarjeta, boton);
    };

        escaparate.appendChild(tarjeta);
    }

    showScene('escena-mercado');
    document.getElementById('btn-confirmar-compra').onclick = confirmarCompra;
}

/**
 * Añade o quita un producto de la cesta de la compra.
 * Actualiza el dinero disponible y cambia el estado visual del botón (Añadir/Retirar).
 *
 * @param {Object} producto - El objeto del producto a gestionar.
 * @param {HTMLElement} tarjetaVisual - El elemento DOM de la tarjeta del producto.
 * @param {HTMLButtonElement} elBoton - El botón pulsado para cambiar su texto.
 */
function gestionarCesta(producto, tarjetaVisual, elBoton) {

    var yaLoTengo = false;
    for (var i = 0; i < cesta.length; i++) {
        if (cesta[i] === producto) {
            yaLoTengo = true;
            break;
        }
    }

    if (yaLoTengo === false) {
        if (jugador.dinero >= producto.precio) {
            cesta.push(producto);
            jugador.dinero -= producto.precio;

            tarjetaVisual.style.backgroundColor = "orange";
            elBoton.innerText = "Retirar";

            
const icono = document.createElement('img');


icono.src = './imagenes/cart.svg'; 

icono.alt = 'Icono compra'; 
icono.className = 'carrito-flotante'; 


elBoton.appendChild(icono);


setTimeout(() => {
    icono.remove();
}, 800);

        } else {
            alert("¡No tienes oro suficiente!");
        }
    } else {

        for (var j = 0; j < cesta.length; j++) {
            if (cesta[j] === producto) {
                cesta.splice(j, 1);
                break;
            }
        }

        jugador.dinero += producto.precio;
        tarjetaVisual.style.backgroundColor = "";
        elBoton.innerText = "Añadir";
    }


    

    actualizarMonederoVisual();

    refrescarInventarioTemporal(cesta);
}


/**
 * Confirma la compra de los objetos en la cesta.
 * Transfiere los objetos al inventario real del jugador y limpia la cesta.
 * Pasa a la escena de resumen actualizado.
 */
function confirmarCompra() {
    if (cesta.length === 0) {
        alert("No has seleccionado ningún objeto.");
        return;
    }
    for (var i = 0; i < cesta.length; i++) {
        jugador.añadirItem(cesta[i]);
    }
    cesta = [];
    refrescarInventarioVisual(jugador.inventario);


    cargarEscena4();
}


/**
 * Carga la escena posterior a la compra, mostrando las estadísticas actualizadas del jugador
 * tras adquirir items (ataque total, defensa total, etc.).
 */
function cargarEscena4() {

    document.getElementById('nombre-actualizado').innerText = jugador.nombre;

    var container = document.getElementById('contenedor-resumen-actualizado');

    container.innerHTML =
        '<div class="estadisticas-card">Ataque Total: ' + jugador.ataqueTotal + '</div>' +
        '<div class="estadisticas-card">Defensa Total: ' + jugador.defensaTotal + '</div>' +
        '<div class="estadisticas-card">Vida Total: ' + jugador.vidaTotal + '</div>' +
        '<div class="estadisticas-card">Oro Restante: ' + jugador.dinero + '</div>';

    showScene('escena-jugador-actualizada');

    document.getElementById('btn-listo-combate').onclick = function () {
        cargarEscenaEnemigos();
    };
}


/**
 * Devuelve la ruta de la imagen según el nombre del enemigo.
 * @param {string} nombre - Nombre del enemigo.
 * @returns {string} Ruta al archivo de imagen.
 */
function obtenerImagenEnemigo(nombre) {
    const mapaEnemigos = {
        'Troll': './imagenes/troll.png',
        'Minotauro': './imagenes/minotauro.png',
        'Mago': './imagenes/mago.png'
    };
    return mapaEnemigos[nombre] || './imagenes/troll.png';
}


/**
 * Prepara la escena de batalla.
 * - Instancia los enemigos (Troll, Minotauro, Mago Jefe).
 * - Renderiza las tarjetas de los enemigos.
 * - Prepara el botón para iniciar el combate secuencial.
 */
function cargarEscenaEnemigos() {

    dineroAntesDeBatallas = jugador.dinero;

  

    const contenedor = document.getElementById('contenedor-enemigos');

    contenedor.innerHTML = "";

    enemigosBatalla = [
        new Enemigo("Troll", 10, 50),
        new Enemigo("Minotauro", 15, 80),
        new JefeFinal("Mago", 30, 200, "Trueno", 1.5)
    ];


    enemigosBatalla.forEach(enemigo => {
        const div = document.createElement('div');

        div.className = "tarjeta-enemigo " + enemigo.tipo;

        const rutaImg = obtenerImagenEnemigo(enemigo.nombre);

        div.innerHTML =
            '<img src="' + rutaImg + '" alt="' + enemigo.nombre + '" class="img-enemigo">' +
            '<div class="info-enemigo">' +
            '<p>' + enemigo.nombre + '</p>' +
            '<p>' + "Ataque" + " +" + enemigo.ataque + '</p>' + 
            '</div>';

        contenedor.appendChild(div);
    });

    showScene('escena-enemigos');

    document.getElementById('btn-comenzar-combate').onclick = () => {
        indiceCombate = 0;
        ejecutarDueloSecuencial();
    };
}


/**
 * Crea un efecto visual de monedas cayendo en la pantalla.
 * Elimina los elementos DOM creados después de 1.5 segundos.
 */
function activarCascadaMonedas() {

    const monedasViejas = document.querySelectorAll('.moneda_animacion');
    monedasViejas.forEach(m => m.remove());

    const posiciones = ['25%', '50%', '75%'];



    for (let pos of posiciones) {


        let nuevaMoneda = document.createElement('img');


        nuevaMoneda.src = './imagenes/moneda.png';
        nuevaMoneda.className = 'moneda_animacion';
        nuevaMoneda.style.left = pos;


        document.body.appendChild(nuevaMoneda);
    }
    setTimeout(() => {
        const monedasActuales = document.querySelectorAll('.moneda_animacion');
        monedasActuales.forEach(m => m.remove());
    }, 1500);
}

/**
 * Ejecuta la lógica de un combate individual contra el enemigo actual (según `indiceCombate`).
 * - Llama a la función lógica de `batalla`.
 * - Actualiza el DOM con el resultado y la vida restante.
 * - Gestiona el loot (monedas y puntos) si se gana.
 * - Controla el flujo hacia el siguiente enemigo o la pantalla final.
 */
function ejecutarDueloSecuencial() {

    console.log("ATAQUE TOTAL:", jugador.ataqueTotal);
    console.log("DEFENSA TOTAL:", jugador.defensaTotal);
    console.log("VIDA TOTAL:", jugador.vidaTotal);

    const rivalActual = enemigosBatalla[indiceCombate];

    batalla(jugador, rivalActual);
    const combateFinalizadoOk = jugador.vida > 0;

    var lados = document.querySelectorAll('.luchador-lado');
    var ladoJugador = lados[0];
    var ladoEnemigo = lados[1];

    ladoJugador.classList.add('jugador-anim');
    ladoEnemigo.classList.add('enemigo-anim');
    ladoJugador.classList.remove('entrar');
    ladoEnemigo.classList.remove('entrar');

    setTimeout(function () {
        ladoJugador.classList.add('entrar');
        ladoEnemigo.classList.add('entrar');
    }, 50);


    document.getElementById('tarjeta-jugador-batalla').innerHTML =
        '<img src="./imagenes/caballero.jpg" class="img-duelo">' +
        '<h3>' + jugador.nombre + '</h3>' +
        '<p>❤️ Vida: ' + jugador.vida + '</p>';

    const imgEnemigo = obtenerImagenEnemigo(rivalActual.nombre);
    document.getElementById('tarjeta-enemigo-batalla').innerHTML =
        '<img src="' + imgEnemigo + '" class="img-duelo">' +
        '<h3>' + rivalActual.nombre + '</h3>' +
        '<p>❤️ Vida: ' + (rivalActual.vida <= 0 ? 0 : rivalActual.vida) + '</p>';

    const areaTexto = document.getElementById('registro-batalla');
    const botonProximo = document.getElementById('btn-siguiente-batalla');

    if (combateFinalizadoOk) {
        activarCascadaMonedas();

        let botinMonedas = 5;
        if (rivalActual instanceof JefeFinal) {
            botinMonedas = 10;
        }
        jugador.dinero += botinMonedas;
        


        let puntosGanados = 100 + rivalActual.ataque;

        if (rivalActual instanceof JefeFinal && rivalActual.multiplicador) {
            puntosGanados = Math.round(puntosGanados * rivalActual.multiplicador);
        }

        jugador.ganarPuntos(puntosGanados);

        areaTexto.innerHTML = '<h3>¡Ganador: ' + jugador.nombre + '!</h3>' +
            '<p>El ' + rivalActual.nombre + ' ha sido derrotado.</p>' +
            '<p><strong>+ ' + botinMonedas + ' monedas.</strong></p>' +
            '<p><strong>+ ' + puntosGanados + ' puntos.</strong></p>';

        if (indiceCombate < enemigosBatalla.length - 1) {
            botonProximo.innerText = "Próximo Rival";
        } else {

            botonProximo.innerText = "Ver Clasificación Final";
        }
    } else {
        areaTexto.innerHTML = '<h3> GAME OVER </h3>';
        botonProximo.innerText = "Ver Clasificación Final";
    }

    showScene('escena-batalla');
    botonProximo.classList.remove('oculto');

    botonProximo.onclick = () => {
        if (!combateFinalizadoOk) {
            mostrarCalificacion();
        } else if (indiceCombate < enemigosBatalla.length - 1) {
            indiceCombate++;
            botonProximo.classList.add('oculto');
            ejecutarDueloSecuencial();
        } else {

            mostrarCalificacion();
        }
    };
}

/**
 * Calcula la calificación final (Pro/Rookie) y guarda el resultado en localStorage.
 * Muestra la escena con el diploma final.
 */
function mostrarCalificacion() {

var puntosFinalesTotales = 0;

    if (jugador.vida > 0) {
     
        puntosFinalesTotales = jugador.puntos + jugador.dinero;
      
        if (puntosFinalesTotales >= 300) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    } 
    else {
        
        let soloBotin = Math.max(0, jugador.dinero - dineroAntesDeBatallas);
       
        puntosFinalesTotales = jugador.puntos + soloBotin;
        
    }

    
    var esPro = puntosFinalesTotales >= 300;
    var calificacion = esPro ? 'PRO' : 'ROOKIE';

    if (esPro) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    var datosPartida = {
        idNombre: jugador.nombre,
        idPuntos: puntosFinalesTotales,
        idDinero: jugador.dinero,
        idFecha: new Date().toLocaleDateString()
    };

    var almacen = JSON.parse(localStorage.getItem('ranking_final')) || [];
    almacen.push(datosPartida);
    localStorage.setItem('ranking_final', JSON.stringify(almacen));

    var zonaRango = document.getElementById('contenedorProRookie');
    zonaRango.innerHTML = '<h2>Resultado Final</h2>' +
        '<div class="caja-diploma">' +
        '<h3>Nivel obtenido: ' + calificacion + '</h3>' +
        '<p>Puntuación Total: ' + puntosFinalesTotales + '</p>' +
        '</div>' +
        '<button id="btn-ir-ranking" class="btn-primario">Ver Clasificación</button>';

    showScene('escena-ProRookie');
    document.getElementById('btn-ir-ranking').onclick = mostrarRankingHistorico;
}


/**
 * Carga el historial de partidas desde localStorage, lo ordena por puntuación
 * y renderiza una tabla HTML con los resultados.
 */
function mostrarRankingHistorico() {
    var almacen = JSON.parse(localStorage.getItem('ranking_final')) || [];

    almacen.sort(function (a, b) {
        return b.idPuntos - a.idPuntos;
    });

    var zonaTabla = document.getElementById('contenedor-TablaFinal');

    var tablaHtml = '<h2 class="titulo-historial">Historial de Partidas</h2>' +
        '<table class="tabla-ranking">' +
        '<thead><tr><th>Héroe</th><th>Puntos</th><th>Dinero</th></tr></thead>' +
        '<tbody>';

    for (var i = 0; i < almacen.length; i++) {
        var reg = almacen[i];
        tablaHtml = tablaHtml + '<tr>' +
            '<td>' + reg.idNombre + '</td>' +
            '<td>' + reg.idPuntos + '</td>' +
            '<td>' + reg.idDinero + '</td>' +

            '</tr>';
    }
    tablaHtml = tablaHtml + '</tbody></table>';
    zonaTabla.innerHTML = tablaHtml;

    document.getElementById('btn-mostrar-consola').onclick = function () {
        console.log("--- RANKING DE JUGADORES ---");
        console.table(almacen);
    };

    document.getElementById('btn-reiniciar').onclick = function () {
        location.reload();
    };

    showScene('escena-ranking');


}


/**
 * Actualiza el contador de dinero en el header de la interfaz.
 */
function actualizarMonederoVisual() {
    const dineroAMostrar = jugador.dinero
    document.getElementById("dineroSaco").textContent = dineroAMostrar;
}