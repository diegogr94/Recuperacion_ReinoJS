import { EUR } from '../utils/utils.js';

/**
 * Clase que representa un producto o ítem del juego.
 */
export class Producto {
    /**
     * Crea una instancia de un Producto.
     * @param {string} nombre - El nombre del objeto.
     * @param {number} precio - El precio base del objeto.
     * @param {string} rareza - La rareza del objeto ('común', 'raro', 'épico').
     * @param {string} tipo - El tipo de objeto ('arma', 'armadura', 'consumible').
     * @param {Object} bonus - Estadísticas que aporta.
     * @param {number} [bonus.ataque] - Puntos de ataque extra.
     * @param {number} [bonus.defensa] - Puntos de defensa extra.
     * @param {number} [bonus.vida] - Puntos de vida extra.
     * @param {number} [bonus.curacion] - Puntos de curación (para consumibles).
     * @param {string} imagen - Ruta relativa a la imagen del objeto.
     */
    constructor(nombre, precio, rareza, tipo, bonus, imagen) {
        this.nombre = nombre;   
        this.precio = precio;   
        this.rareza = rareza;   
        this.tipo = tipo;       
        this.bonus = bonus;    
        this.imagen = imagen;   
    }

    /**
     * Formatea el precio numérico a formato moneda (EUR).
     * Asume que el precio está almacenado en céntimos o similar si se divide por 100.
     * @returns {string} El precio formateado (ej: "10,00 €").
     */
    formatearPrecio() {
        return EUR.format(this.precio / 100);
    }

    /**
     * Genera una descripción textual del producto con sus estadísticas.
     * @returns {string} Cadena con nombre, rareza, precio y bonus aplicables.
     */
    mostrarProducto() {

    let bonusTexto = "";

    if (this.bonus.ataque)  bonusTexto += "Ataque +" + this.bonus.ataque + " ";
    if (this.bonus.defensa) bonusTexto += "Defensa +" + this.bonus.defensa + " ";
    if (this.bonus.vida)    bonusTexto += "Vida +" + this.bonus.vida + " ";

    if (this.bonus.curacion) bonusTexto += "Curación +" + this.bonus.curacion + " ";

    return this.nombre + " [" + this.rareza + "] — " + "Precio: " + this.precio + " — " + bonusTexto;
}

    /**
     * Crea una copia del producto con un precio reducido según el porcentaje.
     * @param {number} porcentaje - El porcentaje de descuento a aplicar (0-100).
     * @returns {Producto} Una nueva instancia de Producto con el precio actualizado.
     */
    aplicarDescuento(porcentaje) {
        if (porcentaje < 0) porcentaje = 0;
        if (porcentaje > 100) porcentaje = 100;

        const nuevoPrecio = Math.round(this.precio * (1 - porcentaje / 100));

        return new Producto(this.nombre, nuevoPrecio, this.rareza, this.tipo, this.bonus, this.imagen);
    }
}