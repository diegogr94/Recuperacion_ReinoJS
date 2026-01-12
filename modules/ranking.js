import { groupBy } from '../utils/utils.js';

/**
 * Simula una batalla automática por turnos entre el jugador y un enemigo.
 * El jugador ataca primero. El daño recibido por el jugador se reduce según su defensa.
 * Actualiza la vida final del jugador tras el combate.
 *
 * @param {Object} jugador - El objeto del jugador (debe tener getters de vidaTotal, ataqueTotal, defensaTotal).
 * @param {Object} enemigo - El objeto del enemigo (debe tener propiedades vida y ataque).
 * @returns {boolean} Devuelve true si el jugador sobrevive (gana), false si su vida llega a 0.
 */
export function batalla(jugador, enemigo) {
    let vJugador = jugador.vidaTotal; 
    let vEnemigo = enemigo.vida;

    let atqJugador = jugador.ataqueTotal;
    let defJugador = jugador.defensaTotal;
    let atqEnemigo = enemigo.ataque;

    while (vJugador > 0 && vEnemigo > 0) {
        
        vEnemigo -= atqJugador;
        if (vEnemigo <= 0) break;

        let dañoRecibido = Math.floor(atqEnemigo - (defJugador / 2)); 
        if (dañoRecibido < 1) dañoRecibido = 1;

        vJugador -= dañoRecibido;
    }

    
    jugador.vida = vJugador < 0 ? 0 : vJugador;
    return jugador.vida > 0;
}

/**
 * Agrupa una lista de jugadores en dos categorías ('pro' o 'rookie') según su puntuación.
 *
 * @param {Array<Object>} jugadores - Lista de objetos jugador.
 * @param {number} [umbral=300] - Cantidad de puntos mínima para ser considerado 'pro' (por defecto 300).
 * @returns {Object} Objeto con las claves agrupadas (ej: { pro: [...], rookie: [...] }).
 */
export function agruparPorNivel(jugadores, umbral = 300) {
    return groupBy(jugadores, jugador => (jugador.puntos >= umbral ? 'pro' : 'rookie'));
}

/**
 * Ordena una lista de jugadores por puntos de forma descendente y muestra el ranking en consola.
 * Nota: Utiliza un algoritmo de ordenamiento de burbuja manual.
 *
 * @param {Array<Object>} jugadores - Lista de jugadores a ordenar y mostrar.
 */
export function mostrarRanking(jugadores) {
    const listaParaMostrar = [...jugadores];
    for (let i = 0; i < listaParaMostrar.length; i++) {
        for (let j = 0; j < listaParaMostrar.length - 1; j++) {
            if (listaParaMostrar[j].puntos < listaParaMostrar[j + 1].puntos) {
                let temporal = listaParaMostrar[j];
                listaParaMostrar[j] = listaParaMostrar[j + 1];
                listaParaMostrar[j + 1] = temporal;
            }
        }
    }
    console.log('🏆 RANKING FINAL 🏆');
    for (let k = 0; k < listaParaMostrar.length; k++) {
        console.log(listaParaMostrar[k].idNombre + ' - Puntos: ' + listaParaMostrar[k].idPuntos);
    }
}