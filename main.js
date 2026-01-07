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

function cargarDatosPrueba() {
    const rankingExistente = localStorage.getItem('ranking_final');

    if (!rankingExistente || JSON.parse(rankingExistente).length === 0) {
        const datosPrueba = [
            { idNombre: "sdafsdf", idPuntos: 950, idDinero: 450, idFecha: "01/01/2026" },
            { idNombre: "dfgsdf", idPuntos: 840, idDinero: 120, idFecha: "01/01/2026" },
            { idNombre: "fdgdfsg", idPuntos: 120, idDinero: 40, idFecha: "02/01/2026" },
            { idNombre: "dfgsdfg", idPuntos: 1100, idDinero: 600, idFecha: "02/01/2026" },
            { idNombre: "sdfdsf", idPuntos: 750, idDinero: 300, idFecha: "02/01/2026" },
            { idNombre: "asdasd", idPuntos: 640, idDinero: 160, idFecha: "02/01/2026" },
            { idNombre: "asdfdsaf", idPuntos: 500, idDinero: 100, idFecha: "02/01/2026" },
            { idNombre: "sdfsdf", idPuntos: 990, idDinero: 200, idFecha: "02/01/2026" },
            { idNombre: "sdfsadf", idPuntos: 430, idDinero: 90, idFecha: "02/01/2026" },
            { idNombre: "dsfsdaf", idPuntos: 880, idDinero: 350, idFecha: "02/01/2026" },
            { idNombre: "sdfdsf", idPuntos: 320, idDinero: 50, idFecha: "02/01/2026" },
            { idNombre: "sadfsdfdsf", idPuntos: 1050, idDinero: 500, idFecha: "02/01/2026" }
        ];
        
        localStorage.setItem('ranking_final', JSON.stringify(datosPrueba));
        console.log("Datos de prueba cargados en el Ranking");
    }
}


cargarDatosPrueba();
    
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

    
    if (vida !== 100) {
        alert("La vida inicial debe ser exactamente 100. Los puntos extra solo son para Ataque y Defensa.");
        return;
    }

    if ((ataque + defensa) > 10) {
        alert("No puedes repartir más de 10 puntos extra entre ataque y defensa.");
        return;
    }

    if (ataque < 0 || defensa < 0) {
        alert("El ataque y la defensa no pueden ser valores negativos.");
        return;
    }

    
    jugador = new Jugador(nombre, ataque, defensa, vida);

    actualizarMonederoVisual();
    
    cargarEscenaResumenJugador();
}

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


function refrescarInventarioTemporal(laCesta) {
    refrescarInventarioVisual(laCesta);
}


function cargarEscenaMercado() {
    const escaparate = document.getElementById('contenedor-productos');
    if (!escaparate) return;
    
   
    escaparate.innerHTML = ""; 

   
    const rarezaEnOferta = obtenerRarezaAleatoria();
    
    
    const productosEnVenta = aplicarDescuentoPorRareza(rarezaEnOferta, 10);

    console.log("Oferta del día aplicada a la rareza: " + rarezaEnOferta);

    for (var i = 0; i < productosEnVenta.length; i++) {
        var objeto = productosEnVenta[i];
        
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';

        if (objeto.rareza === rarezaEnOferta) {
            
            objeto = objeto.aplicarDescuento(10); 
            
            tarjeta.style.backgroundColor = "#fff3cd"; 
            tarjeta.style.border = "2px solid gold";
        }

        
        const rutaImagen = objeto.imagen;

        const precioFormateado = (objeto.precio / 100).toFixed(2).replace('.', ',') + "€";

        tarjeta.innerHTML = 
            '<img src="' + rutaImagen + '" alt="' + objeto.nombre + '" class="img-producto">' +
            '<div class="info-producto">' +
                '<p><strong>' + objeto.nombre + '</strong></p>' +
                '<p>Precio: ' + precioFormateado + '</p>' + 
                '<p>' + objeto.mostrarProducto() + '</p>' + 
                '<p><small>Rareza: ' + objeto.rareza + '</small></p>' +
            '</div>' +
            '<button class="btn-primario boton-accion">Añadir</button>';

        const boton = tarjeta.querySelector('.boton-accion');
        
        (function(prod, tarj, btn) {
            btn.onclick = function() {
                gestionarCesta(prod, tarj, btn);
            };
        })(objeto, tarjeta, boton);

        escaparate.appendChild(tarjeta);
    }

    showScene('escena-mercado');
    document.getElementById('btn-confirmar-compra').onclick = confirmarCompra;
}

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

 
    document.getElementById('oro-disponible').innerText = (jugador.dinero / 100).toFixed(2);

    actualizarMonederoVisual();
  
    refrescarInventarioTemporal(cesta);
}


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


function cargarEscena4() {
    
    document.getElementById('nombre-actualizado').innerText = jugador.nombre;

    var container = document.getElementById('contenedor-resumen-actualizado');
  
    container.innerHTML = 
        '<div class="estadisticas-card">Ataque Total: ' + jugador.ataqueTotal + '</div>' +
        '<div class="estadisticas-card">Defensa Total: ' + jugador.defensaTotal + '</div>' +
        '<div class="estadisticas-card">Vida Total: ' + jugador.vidaTotal + '</div>' +
        '<div class="estadisticas-card">Oro Restante: ' + (jugador.dinero / 100).toFixed(2) + '€</div>';

    showScene('escena-jugador-actualizada');
    
    document.getElementById('btn-listo-combate').onclick = function() {
        cargarEscenaEnemigos();
    };
}


function obtenerImagenEnemigo(nombre) {
    const mapaEnemigos = {
        'Troll': './imagenes/troll.png',
        'Minotauro': './imagenes/minotauro.png',
        'Mago': './imagenes/mago.png'
    };
    return mapaEnemigos[nombre] || './imagenes/enemigo_generico.jpg';
}


function cargarEscenaEnemigos() {
    
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
                '<p>' + enemigo.ataque + ' puntos de ataque</p>' +
            '</div>';
        
        contenedor.appendChild(div);
    });

    showScene('escena-enemigos');

    document.getElementById('btn-comenzar-combate').onclick = () => {
        alert("¡El combate va a empezar!");
        indiceCombate = 0; 
        ejecutarDueloSecuencial();
    };
}


function activarCascadaMonedas() {
   
    const monedasViejas = document.querySelectorAll('.moneda_animacion');
    monedasViejas.forEach(m => m.remove());

    const posiciones = ['25%', '50%', '75%'];
    

    let html = '';
    posiciones.forEach(pos => {
        html += `<img src="./imagenes/moneda.png" class="moneda_animacion" style="left: ${pos};">`;
    });

    document.body.insertAdjacentHTML('beforeend', html);

    setTimeout(() => {
        const monedasActuales = document.querySelectorAll('.moneda_animacion');
        monedasActuales.forEach(m => m.remove());
    }, 1500);
}

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

    setTimeout(function() {
        ladoJugador.classList.add('entrar');
        ladoEnemigo.classList.add('entrar');
    }, 50);
    

    document.getElementById('tarjeta-jugador-batalla').innerHTML = 
        '<img src="./imagenes/caballero.png" class="img-duelo">' +
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
        actualizarMonederoVisual();

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

            mostrarCalificacion(); 
        }
    };
}

function mostrarCalificacion() {
    var puntosFinalesTotales = jugador.puntos + jugador.dinero;
    var esPro = puntosFinalesTotales >= 300;
    var calificacion = esPro ? '🥇 PRO' : '🥉 ROOKIE';
    
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
                          '<div class="caja-registro">' +
                          '<h3>Nivel obtenido: ' + calificacion + '</h3>' +
                          '<p>Puntuación Total (Batallas + Oro): ' + puntosFinalesTotales + '</p>' +
                          '</div>' +
                          '<button id="btn-ir-ranking" class="btn-primario">Ver Clasificación</button>';

    showScene('escena-ProRookie');
    document.getElementById('btn-ir-ranking').onclick = mostrarRankingHistorico;
}


function mostrarRankingHistorico() {
    var almacen = JSON.parse(localStorage.getItem('ranking_final')) || [];
    var zonaTabla = document.getElementById('contenedor-TablaFinal');

    var tablaHtml = '<h2>Historial de Partidas</h2>' +
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

    document.getElementById('btn-mostrar-consola').onclick = function() {
        console.log("--- RANKING DE JUGADORES ---");
        console.table(almacen);
    };

    document.getElementById('btn-reiniciar').onclick = function() {
        location.reload();
    };

    showScene('escena-ranking');

    actualizarMonederoVisual();
}


function actualizarMonederoVisual() {
    const dineroAMostrar = (jugador.dinero / 100).toFixed(2);
    document.getElementById("dineroSaco").textContent = dineroAMostrar;
}