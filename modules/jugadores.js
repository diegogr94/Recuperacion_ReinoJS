import { groupBy } from '../utils/utils.js'; 

/**
 * Clase que representa al jugador principal del juego.
 * Gestiona sus estadísticas, inventario, dinero y puntuación.
 */
export class Jugador {
  
  /**
   * Crea una instancia del Jugador.
   * @param {string} nombre - El nombre del personaje.
   * @param {number} ataque - Puntos de ataque base iniciales.
   * @param {number} defensa - Puntos de defensa base iniciales.
   * @param {number} vida - Puntos de vida máxima iniciales.
   */
  constructor(nombre, ataque, defensa, vida) {
    /** @type {string} */
    this.nombre = nombre;
    /** @type {number} */
    this.ataqueBase = ataque;   
    /** @type {number} */
    this.defensaBase = defensa; 
    /** @type {number} */
    this.vidaMax = vida;        
    /** @type {number} */
    this.vida = vida;
    /** @type {number} */
    this.puntos = 0;
    /** @type {number} */
    this.dinero = 500; 
    /** @type {Array<Object>} Lista de items poseídos. */
    this.inventario = [];
  }

  /**
   * Añade un item al inventario y aplica efectos inmediatos si es necesario.
   * @param {Object} item - El objeto a añadir.
   * @param {string} item.tipo - El tipo de objeto ('arma', 'armadura', 'consumible').
   * @param {Object} item.bonus - Objeto con los bonificadores (ataque, defensa, curacion).
   */
  añadirItem(item) {
    this.inventario.push(structuredClone(item));
    if (item.tipo === 'consumible' && item.bonus.curacion) {
        this.vida += item.bonus.curacion;
  }
  }

  /**
   * Suma puntos a la puntuación actual del jugador.
   * @param {number} cantidad - La cantidad de puntos a añadir.
   */
  ganarPuntos(cantidad) {
    this.puntos += cantidad;
  }

  /**
   * Obtiene el ataque total sumando la base y los bonus de las armas en el inventario.
   * @returns {number} El valor total de ataque.
   */
  get ataqueTotal() {
    let totalBonus = 0;
    for (let i = 0; i < this.inventario.length; i++) {
      let item = this.inventario[i];
      if (item.tipo === 'arma' && item.bonus.ataque) {
        totalBonus += item.bonus.ataque;
      }
    }
    return this.ataqueBase + totalBonus; 
  }

  /**
   * Obtiene la defensa total sumando la base y los bonus de las armaduras en el inventario.
   * @returns {number} El valor total de defensa.
   */
  get defensaTotal() {
    let totalBonus = 0;
    for (let i = 0; i < this.inventario.length; i++) {
      let item = this.inventario[i];
      if (item.tipo === 'armadura' && item.bonus.defensa) {
        totalBonus += item.bonus.defensa;
      }
    }
    return this.defensaBase + totalBonus; 
  }

  /**
   * Obtiene la vida total calculada (base + consumibles de curación en inventario).
   * @returns {number} El valor total de vida calculada.
   */
  get vidaTotal() {
    let totalBonus = 0;
    for (let i = 0; i < this.inventario.length; i++) {
      let item = this.inventario[i];
      if (item.tipo === 'consumible' && item.bonus.curacion) {
        totalBonus += item.bonus.curacion;
      }
    }
    return this.vidaMax + totalBonus; 
  }

  /**
   * Agrupa los elementos del inventario según su tipo.
   * @returns {Object} Un objeto donde las claves son los tipos y los valores son arrays de items.
   */
  inventarioPorTipo() {
    return groupBy(this.inventario, item => item.tipo);
  }
}