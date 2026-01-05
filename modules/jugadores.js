import { groupBy } from '../utils/utils.js'; 

export class Jugador {
  
  constructor(nombre, ataque, defensa, vida) {
    this.nombre = nombre;
    this.ataqueBase = ataque;   
    this.defensaBase = defensa; 
    this.vidaMax = vida;        
    this.vida = vida;
    this.puntos = 0;
    this.dinero = 500; 
    this.inventario = [];
  }

  añadirItem(item) {
    this.inventario.push(structuredClone(item));
    if (item.tipo === 'consumible' && item.bonus.curacion) {
        this.vida += item.bonus.curacion;
  }
  }

  ganarPuntos(cantidad) {
    this.puntos += cantidad;
  }

  
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

  inventarioPorTipo() {
    return groupBy(this.inventario, item => item.tipo);
  }
}