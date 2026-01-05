import { groupBy } from '../utils/utils.js';

export function batalla(jugador, enemigo) {
    var vJugador = jugador.vidaActual;
    var vEnemigo = enemigo.vida;

    var atqJugador = jugador.ataqueTotal;
    var defJugador = jugador.defensaTotal;
    var atqEnemigo = enemigo.ataque;

    while (vJugador > 0 && vEnemigo > 0) {
       
        vEnemigo = vEnemigo - atqJugador;
        
        if (vEnemigo <= 0) break;

       
        vJugador = (vJugador + defJugador) - atqEnemigo;
    }

    jugador.vidaActual = vJugador < 0 ? 0 : vJugador;
    return jugador.vidaActual > 0;
}

export function agruparPorNivel(jugadores, umbral = 300) {
    return groupBy(jugadores, jugador => (jugador.puntos >= umbral ? 'pro' : 'rookie'));
}

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