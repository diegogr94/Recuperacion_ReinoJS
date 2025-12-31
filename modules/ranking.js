import { groupBy } from '../utils/utils.js';


export function batalla(jugador, enemigo) {
    let vidaJugador = jugador.vida;
    let vidaEnemigo = enemigo.vida;

    const dmgJugador = Math.max(1, jugador.ataqueTotal); 
    const dmgEnemigo = Math.max(1, enemigo.ataque - jugador.defensaTotal);

    let rondas = 0; 
    while (vidaJugador > 0 && vidaEnemigo > 0 && rondas < 100) {
        vidaEnemigo -= dmgJugador;
        if (vidaEnemigo <= 0) break;
        vidaJugador -= dmgEnemigo;
        rondas++; 
    }

    jugador.vida = Math.max(0, vidaJugador);
    const ganoJugador = jugador.vida > 0;

   if (ganoJugador) {
    let puntosFinales = 100 + enemigo.ataque;
    
    
    if (enemigo.tipo === 'jefe' && enemigo.multiplicador) {
        puntosFinales = Math.floor(puntosFinales * enemigo.multiplicador);
    }
    
    jugador.ganarPuntos(puntosFinales);
}

    return { ganador: ganoJugador ? jugador.nombre : enemigo.nombre };
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
    listaParaMostrar.forEach(unJugador => {
        console.log(unJugador.nombre + ' - Puntos: ' + unJugador.puntos);
    });
}
