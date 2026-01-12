/**
 * Clase base que representa a un enemigo en el juego.
 */
export class Enemigo {
    /** @type {string} El tipo de entidad (ej: 'enemigo'). */
    tipo;
    /** @type {string} El nombre del enemigo. */
    nombre;
    /** @type {number} Los puntos de ataque del enemigo. */
    ataque;
    /** @type {number} Los puntos de vida actuales del enemigo. */
    vida;

    /**
     * Crea una instancia de un Enemigo.
     * @param {string} nombre - El nombre del enemigo.
     * @param {number} ataque - Puntos de daño que realiza.
     * @param {number} vida - Puntos de salud.
     */
    constructor(nombre, ataque, vida) {
        this.tipo = 'enemigo'; 
        this.nombre = nombre;
        this.ataque = ataque;
        this.vida = vida;
    }

    /**
     * Devuelve una representación en cadena del enemigo con sus estadísticas.
     * @returns {string} Cadena formateada con icono, nombre, ataque y vida.
     */
    mostrarEnemigo() {
        return "🗡️ " + this.nombre + " (ATQ " + this.ataque + ", HP " + this.vida + ")";
    }
}


/**
 * Clase que representa a un Jefe Final, que hereda de Enemigo.
 * Incluye habilidades especiales y multiplicadores de daño.
 */
export class JefeFinal extends Enemigo {
    /** @type {string} Descripción de la habilidad especial del jefe. */
    habilidadEspecial;
    /** @type {number} Multiplicador aplicado (por defecto 1.3). */
    multiplicador;

    /**
     * Crea una instancia de un Jefe Final.
     * @param {string} nombre - El nombre del jefe.
     * @param {number} ataque - Puntos de ataque base.
     * @param {number} vida - Puntos de salud base.
     * @param {string} habilidadEspecial - Nombre o descripción de su habilidad única.
     * @param {number} [multiplicador=1.3] - Factor multiplicador de poder (opcional, por defecto 1.3).
     */
    constructor(nombre, ataque, vida, habilidadEspecial, multiplicador = 1.3) {
        super(nombre, ataque, vida);
        this.tipo = 'jefe'; 
        this.habilidadEspecial = habilidadEspecial;
        this.multiplicador = multiplicador;
    }

    /**
     * Devuelve una representación en cadena del jefe, incluyendo su habilidad especial.
     * @returns {string} Cadena formateada con icono, nombre, estadísticas y habilidad.
     */
    mostrarEnemigo() {
        return "🐲 " + this.nombre + " (ATQ " + this.ataque + ", HP " + this.vida + ") — Habilidad: " + this.habilidadEspecial;
    }
}