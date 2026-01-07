import { groupBy } from '../utils/utils.js';

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